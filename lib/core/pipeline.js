/**
 * Platform-agnostic curriculum pipeline.
 * Orchestrates: Researcher → Planner → Builder → Critic loop
 *
 * Takes an LLM adapter and a TutorState instance as dependencies.
 * No Telegram, no CLI, no platform assumptions.
 */

import { buildPlanPrompt, buildCurriculumBuilderPrompt, buildDomainFilesPrompt, buildCriticPrompt } from './prompts.js';

const MAX_ITERATIONS = 3;

export class CurriculumPipeline {
  constructor({ adapter, state, skills, onProgress }) {
    this.adapter = adapter;
    this.state = state;
    this.skills = skills;
    this.onProgress = onProgress || (() => {});
  }

  async generate(system, messages, options = {}) {
    const safetyBoundary = options.outputMode === 'json'
      ? '\n\nReturn exactly one valid JSON value. No markdown fences, no prose.'
      : '\n\nReturn only polished text. No commentary about what you are doing.';

    return this.adapter.generate(system + safetyBoundary, messages, options);
  }

  /**
   * Run the full Builder/Critic pipeline for a topic.
   * @param {string} topic - Human-readable topic name
   * @param {string} slug - URL-safe slug
   * @param {string} studentLevel - beginner/intermediate/advanced
   * @param {string} researchContext - Contents of research.md
   * @returns {Promise<{curriculum: object, iterations: number, approved: boolean}>}
   */
  /**
   * @param {object} [options]
   * @param {string} [options.syllabi] - Formatted syllabus references for Critic comparison
   * @param {string[]} [options.deadUrls] - URLs that failed verification
   * @param {string} [options.wikiConcepts] - Wikipedia concept links for coverage check
   * @param {Function} [options.verifyUrls] - async (urls) => [{url, ok}] for URL verification
   */
  async run(topic, slug, studentLevel, researchContext, options = {}) {
    let critiqueText = null;
    let planText = null;
    let lastParsed = null;
    let approved = false;
    let iterations = 0;

    for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
      iterations = iteration;
      this.onProgress({ phase: 'plan', iteration, topic });

      // Step 1: Plan
      const planPrompt = buildPlanPrompt(this.skills, topic, studentLevel, researchContext, critiqueText);
      const planResponse = await this.generate(planPrompt.system, [
        { role: 'user', content: critiqueText
          ? `Revise the curriculum plan for "${topic}" based on the Critic feedback.`
          : `Create a curriculum plan for "${topic}" at the ${studentLevel} level.` },
      ], { model: planPrompt.model, outputMode: planPrompt.outputMode });

      try {
        const planData = JSON.parse(planResponse.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
        planText = planData.plan || planResponse.text;
      } catch {
        planText = planResponse.text;
      }
      this.state.writeDomainFile(slug, 'plan.md', planText);

      // Step 2: Build curriculum + domain files in parallel
      this.onProgress({ phase: 'build', iteration, topic });

      const builderPrompt = buildCurriculumBuilderPrompt(this.skills, topic, slug, studentLevel, researchContext, planText);
      const domainPrompt = buildDomainFilesPrompt(this.skills, topic, studentLevel, researchContext, planText);

      const [builderResponse, domainResponse] = await Promise.all([
        this.generate(builderPrompt.system, [
          { role: 'user', content: `Build the curriculum for "${topic}" following the plan.` },
        ], { model: builderPrompt.model, outputMode: builderPrompt.outputMode }),
        this.generate(domainPrompt.system, [
          { role: 'user', content: `Generate resources and teacher config for "${topic}" following the plan.` },
        ], { model: domainPrompt.model, outputMode: domainPrompt.outputMode }),
      ]);

      lastParsed = this._parsePipelineOutput(builderResponse.text, topic, slug);

      try {
        const domainData = JSON.parse(domainResponse.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
        lastParsed.resources = domainData.resources || lastParsed.resources;
        lastParsed.teacher = domainData.teacher || lastParsed.teacher;
      } catch { /* use builder fallback */ }

      lastParsed.plan = planText;

      // Write files
      this.state.writeCurriculum(slug, lastParsed.curriculum);
      if (lastParsed.conceptMap) this.state.writeDomainFile(slug, 'concept-map.md', lastParsed.conceptMap);
      if (lastParsed.teachingNotes) this.state.writeDomainFile(slug, 'teaching-notes.md', lastParsed.teachingNotes);
      if (lastParsed.resources) this.state.writeDomainFile(slug, 'resources.md', lastParsed.resources);
      if (lastParsed.teacher) this.state.writeDomainFile(slug, 'teacher.md', lastParsed.teacher);

      // Step 2b: URL verification (first iteration only — expensive)
      let deadUrls = options.deadUrls || [];
      if (iteration === 1 && options.verifyUrls && lastParsed.resources) {
        this.onProgress({ phase: 'verify', iteration, topic });
        const urlPattern = /https?:\/\/[^\s)>"]+/g;
        const allUrls = (lastParsed.resources.match(urlPattern) || []);
        if (allUrls.length > 0) {
          const results = await options.verifyUrls(allUrls);
          deadUrls = results.filter((r) => !r.ok).map((r) => r.url);
        }
      }

      // Step 3: Critic (with syllabi comparison and URL verification)
      this.onProgress({ phase: 'critique', iteration, topic });

      const criticPrompt = buildCriticPrompt(
        planText,
        JSON.stringify(lastParsed.curriculum, null, 2),
        lastParsed.conceptMap || '',
        lastParsed.teachingNotes || '',
        lastParsed.resources || '',
        {
          syllabi: options.syllabi || null,
          deadUrls: deadUrls.length > 0 ? deadUrls : null,
          wikiConcepts: options.wikiConcepts || null,
        },
      );
      const criticResponse = await this.generate(criticPrompt.system, [
        { role: 'user', content: `Review this curriculum for "${topic}" (iteration ${iteration}/${MAX_ITERATIONS}).` },
      ], { model: criticPrompt.model, outputMode: criticPrompt.outputMode });

      const critique = this._parseCriticOutput(criticResponse.text);
      if (critique.critique) this.state.writeDomainFile(slug, 'critique.md', critique.critique);

      this.onProgress({ phase: 'verdict', iteration, topic, status: critique.status });

      if (critique.status === 'APPROVED') {
        approved = true;
        break;
      }

      if (iteration < MAX_ITERATIONS) {
        critiqueText = critique.critique;
      }
    }

    if (!lastParsed) {
      throw new Error(`Pipeline produced no output for ${topic}`);
    }

    lastParsed.curriculum.preliminary = false;
    this.state.writeCurriculum(slug, lastParsed.curriculum);

    return { curriculum: lastParsed.curriculum, iterations, approved };
  }

  _parsePipelineOutput(text, topic, slug) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('CurriculumBuilder returned no JSON');

    const data = JSON.parse(jsonMatch[0]);
    const curriculum = data.curriculum || {};
    if (!curriculum.topic) curriculum.topic = topic;
    if (!curriculum.slug) curriculum.slug = slug;
    if (!curriculum.created) curriculum.created = new Date().toISOString().split('T')[0];

    if (curriculum.lessons) {
      for (const lesson of curriculum.lessons) {
        if (!lesson.status) lesson.status = 'pending';
      }
    }

    if (!Array.isArray(curriculum.lessons) || curriculum.lessons.length === 0) {
      throw new Error('CurriculumBuilder produced no lessons');
    }

    return {
      plan: null,
      curriculum,
      conceptMap: data.conceptMap || data.concept_map || null,
      teachingNotes: data.teachingNotes || data.teaching_notes || null,
      resources: data.resources || null,
      teacher: data.teacher || null,
    };
  }

  _parseCriticOutput(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          critique: data.critique || text,
          status: data.status === 'APPROVED' ? 'APPROVED' : 'REVISE',
          severity: data.severity || 'minor',
        };
      }
    } catch { /* fall through */ }
    return { critique: text, status: 'REVISE', severity: 'minor' };
  }
}
