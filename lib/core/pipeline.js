/**
 * Platform-agnostic curriculum pipeline.
 * Orchestrates: Researcher → Planner → Builder → Critic loop
 *
 * Takes an LLM adapter and a TutorState instance as dependencies.
 * No Telegram, no CLI, no platform assumptions.
 */

import { buildPlanPrompt, buildCurriculumBuilderPrompt, buildDomainFilesPrompt, buildCriticPrompt, buildOrchestratorPrompt } from './prompts.js';
import { researchTopic, formatResearchContext } from './research.js';

const MAX_ITERATIONS = 3;

// Agentic bounds. Enforced here rather than in the prompt: a model asked to be
// frugal is a suggestion, a loop counter is not.
const MAX_AGENTIC_STEPS = 8;
const ACTIONS = new Set(['research', 'plan', 'build', 'build_module', 'critique', 'finish']);

const defaultResearch = async (topic, level) =>
  formatResearchContext(await researchTopic(topic, { level }));

export class CurriculumPipeline {
  /**
   * @param {Function} [research] - async (topic, level) => markdown. Injectable
   *   so tests don't hit eight live APIs; defaults to the real thing.
   */
  constructor({ adapter, state, skills, onProgress, research, mode }) {
    this.adapter = adapter;
    this.state = state;
    this.skills = skills;
    this.onProgress = onProgress || (() => {});
    this.research = research || defaultResearch;
    // Deterministic unless asked otherwise: it is what CI exercises and what
    // runs when nobody opted in. Agentic costs are not characterised yet.
    this.mode = mode === 'agentic' ? 'agentic' : 'deterministic';
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
   * @param {string} [researchContext] - Contents of research.md. Omit it and the
   *   pipeline researches the topic itself; the bot passes its own because it
   *   already fetched sources for the quick-start phase.
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

    // No sources handed in means nobody fetched any — do it here rather than
    // build the curriculum out of thin air. research.md is written too: the
    // Teacher reads that file for every later lesson, not just this build.
    if (!researchContext) {
      this.onProgress({ phase: 'research', iteration: 0, topic });
      researchContext = await this.research(topic, studentLevel).catch(() => '');
      if (researchContext) this.state.writeDomainFile(slug, 'research.md', researchContext);
    }

    if (this.mode === 'agentic') {
      return this._runAgentic(topic, slug, studentLevel, researchContext, options);
    }

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

  // ── Steps, shared by both modes ──────────────────────────
  //
  // Extracted so agentic mode composes exactly the same work the deterministic
  // loop does, rather than a second implementation that can drift from it.

  async _plan(ctx) {
    const prompt = buildPlanPrompt(this.skills, ctx.topic, ctx.studentLevel, ctx.researchContext, ctx.critique);
    const response = await this.generate(prompt.system, [
      { role: 'user', content: ctx.critique
        ? `Revise the curriculum plan for "${ctx.topic}" based on the Critic feedback.`
        : `Create a curriculum plan for "${ctx.topic}" at the ${ctx.studentLevel} level.` },
    ], { model: prompt.model, outputMode: prompt.outputMode });

    let planText;
    try {
      planText = JSON.parse(response.text.match(/\{[\s\S]*\}/)?.[0] || '{}').plan || response.text;
    } catch {
      planText = response.text;
    }
    this.state.writeDomainFile(ctx.slug, 'plan.md', planText);
    return planText;
  }

  async _build(ctx) {
    const builderPrompt = buildCurriculumBuilderPrompt(this.skills, ctx.topic, ctx.slug, ctx.studentLevel, ctx.researchContext, ctx.plan);
    const domainPrompt = buildDomainFilesPrompt(this.skills, ctx.topic, ctx.studentLevel, ctx.researchContext, ctx.plan);

    const [builderResponse, domainResponse] = await Promise.all([
      this.generate(builderPrompt.system, [
        { role: 'user', content: `Build the curriculum for "${ctx.topic}" following the plan.` },
      ], { model: builderPrompt.model, outputMode: builderPrompt.outputMode }),
      this.generate(domainPrompt.system, [
        { role: 'user', content: `Generate resources and teacher config for "${ctx.topic}" following the plan.` },
      ], { model: domainPrompt.model, outputMode: domainPrompt.outputMode }),
    ]);

    const parsed = this._parsePipelineOutput(builderResponse.text, ctx.topic, ctx.slug);
    try {
      const domainData = JSON.parse(domainResponse.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
      parsed.resources = domainData.resources || parsed.resources;
      parsed.teacher = domainData.teacher || parsed.teacher;
    } catch { /* use builder fallback */ }

    parsed.plan = ctx.plan;
    this.state.writeCurriculum(ctx.slug, parsed.curriculum);
    if (parsed.conceptMap) this.state.writeDomainFile(ctx.slug, 'concept-map.md', parsed.conceptMap);
    if (parsed.teachingNotes) this.state.writeDomainFile(ctx.slug, 'teaching-notes.md', parsed.teachingNotes);
    if (parsed.resources) this.state.writeDomainFile(ctx.slug, 'resources.md', parsed.resources);
    if (parsed.teacher) this.state.writeDomainFile(ctx.slug, 'teacher.md', parsed.teacher);
    return parsed;
  }

  async _critique(ctx, options = {}) {
    const prompt = buildCriticPrompt(
      ctx.plan || '',
      JSON.stringify(ctx.parsed.curriculum, null, 2),
      ctx.parsed.conceptMap || '',
      ctx.parsed.teachingNotes || '',
      ctx.parsed.resources || '',
      {
        syllabi: options.syllabi || null,
        deadUrls: options.deadUrls?.length ? options.deadUrls : null,
        wikiConcepts: options.wikiConcepts || null,
      },
    );
    const response = await this.generate(prompt.system, [
      { role: 'user', content: `Review this curriculum for "${ctx.topic}".` },
    ], { model: prompt.model, outputMode: prompt.outputMode });

    const result = this._parseCriticOutput(response.text);
    if (result.critique) this.state.writeDomainFile(ctx.slug, 'critique.md', result.critique);
    return result;
  }

  // ── Agentic mode (#122) ──────────────────────────────────
  //
  // The deterministic loop can only respond to a critique one way: start over.
  // Here an orchestrator call picks the next action from a closed set, so a
  // local complaint can get a local fix and a narrow topic can finish early.
  //
  // Everything below the decision is a bound. An orchestrator that can loop is
  // one that can loop forever on someone's API key, so the caps are enforced in
  // code — never by asking the model to be careful.

  async _runAgentic(topic, slug, studentLevel, researchContext, options = {}) {
    const ctx = {
      topic, slug, studentLevel, researchContext,
      plan: null, parsed: null, critique: null, status: null,
      // Bumped by anything that changes what a later step would read.
      version: 0,
    };
    const tried = [];
    let steps = 0;
    let garbage = 0;

    for (; steps < MAX_AGENTIC_STEPS; steps++) {
      const decision = await this._decide(ctx, tried);

      if (!decision) {
        // Two unparseable decisions in a row means the orchestrator is not
        // working. Finish the job the way we know works rather than burning
        // the remaining budget finding out again.
        if (++garbage >= 2) {
          const fallback = await this._runDeterministicTail(ctx, options);
          return { ...fallback, mode: 'agentic', steps, stoppedBy: 'fell-back' };
        }
        continue;
      }
      garbage = 0;

      // Repeating an action when nothing has changed since last time cannot
      // produce a different result, and each attempt costs a model call.
      //
      // The key is what the action *consumes*, not what it produces: keying on
      // the critique let a second critique through, because the first one had
      // changed the critique — while the curriculum it reviews was identical.
      const signature = `${decision.action}:${ctx.version}`;
      if (tried.includes(signature) && decision.action !== 'finish') {
        tried.push(signature);
        continue;
      }
      tried.push(signature);

      this.onProgress({ phase: decision.action, iteration: steps + 1, topic, why: decision.why });

      if (decision.action === 'finish') break;
      await this._act(decision.action, ctx, options);
    }

    // Always ship something. Spending the budget and returning nothing is worse
    // than returning a curriculum the Critic had notes about.
    if (!ctx.parsed) {
      // Report what ended the loop, not what the loop failed to produce — an
      // orchestrator that burned every step is a different problem from one
      // that said finish too early, and the caller needs to tell them apart.
      const fallback = await this._runDeterministicTail(ctx, options);
      const stoppedBy = steps >= MAX_AGENTIC_STEPS ? 'step-cap' : 'no-output';
      return { ...fallback, mode: 'agentic', steps, stoppedBy };
    }

    ctx.parsed.curriculum.preliminary = false;
    this.state.writeCurriculum(slug, ctx.parsed.curriculum);

    return {
      curriculum: ctx.parsed.curriculum,
      iterations: steps,
      approved: ctx.status === 'APPROVED',
      mode: 'agentic',
      steps,
      stoppedBy: steps >= MAX_AGENTIC_STEPS ? 'step-cap' : 'finished',
    };
  }

  /** One orchestrator turn. Returns null when the answer is unusable. */
  async _decide(ctx, tried) {
    const prompt = buildOrchestratorPrompt(ctx, tried, MAX_AGENTIC_STEPS);
    const response = await this.generate(prompt.system, [
      { role: 'user', content: `What should happen next for "${ctx.topic}"?` },
    ], { model: prompt.model, outputMode: 'json' });

    let decision;
    try {
      decision = JSON.parse(response.text.match(/\{[\s\S]*\}/)?.[0] || '');
    } catch {
      return null;
    }

    // A closed set, checked here. The orchestrator proposes; it does not get to
    // name an action nobody implemented.
    return ACTIONS.has(decision?.action) ? decision : null;
  }

  async _act(action, ctx, options) {
    if (action === 'research') {
      ctx.researchContext = await this.research(ctx.topic, ctx.studentLevel).catch(() => ctx.researchContext);
      ctx.version++;
      if (ctx.researchContext) this.state.writeDomainFile(ctx.slug, 'research.md', ctx.researchContext);
      return;
    }

    if (action === 'plan') {
      ctx.plan = await this._plan(ctx);
      ctx.version++;
      return;
    }

    if (action === 'build' || action === 'build_module') {
      if (!ctx.plan) ctx.plan = await this._plan(ctx);
      ctx.parsed = await this._build(ctx);
      ctx.version++;
      return;
    }

    if (action === 'critique') {
      if (!ctx.parsed) return;
      const result = await this._critique(ctx, options);
      ctx.critique = result.critique;
      ctx.status = result.status;
    }
  }

  /** Finish with the deterministic loop — the escape hatch, not a step. */
  async _runDeterministicTail(ctx, options) {
    const saved = this.mode;
    this.mode = 'deterministic';
    try {
      return await this.run(ctx.topic, ctx.slug, ctx.studentLevel, ctx.researchContext || ' ', options);
    } finally {
      this.mode = saved;
    }
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
