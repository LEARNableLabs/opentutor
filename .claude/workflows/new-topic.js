export const meta = {
  name: 'new-topic',
  description: 'Tutor-controlled pipeline: survey → audience → build → QA → schedule. The tutor judges each step and decides where more work is needed.',
  whenToUse: 'When adding a completely new topic. Usage: run with args {topic: "category theory", level: "intermediate"}. For preview only: {topic: "...", dryRun: true}. To resume after escalation: {topic: "...", humanGuidance: "your answer"}',
  phases: [
    { title: 'Survey', detail: 'Broad multi-source research to map the field' },
    { title: 'Audience', detail: 'Tutor assesses target audience and tailors approach' },
    { title: 'Build', detail: 'Design curriculum, concept map, teaching notes' },
    { title: 'QA', detail: 'Adversarial quality checks' },
    { title: 'Schedule', detail: 'Generate optimal delivery schedule' },
    { title: 'Register', detail: 'Register topic in progress.json' },
  ],
}

const topic = args?.topic
if (!topic) throw new Error('Missing args.topic — pass {topic: "category theory", level: "intermediate"}')

const level = args?.level || 'intermediate'
const timezone = args?.timezone || 'America/New_York'
const humanGuidance = args?.humanGuidance || null
const dryRun = args?.dryRun || false
const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const domainDir = `skills/tutor/domains/${slug}`

// ── Iteration caps ────────────────────────────────────────────

const CAPS = {
  targetedResearch: 3,
  buildRedos: 2,
  scheduleRedos: 1,
  qaCycles: 2,
}

// ── Tutor state ───────────────────────────────────────────────

const tutorMemory = []
const executionLog = []
let researchRounds = 0

function logStep(entry) {
  executionLog.push({ ...entry, timestamp: executionLog.length + 1 })
}

if (humanGuidance) {
  tutorMemory.push(`[human-guidance] The human provided this guidance to resume: ${humanGuidance}`)
}

// ── Tutor decision schema ─────────────────────────────────────

const TUTOR_DECISION_SCHEMA = {
  type: 'object',
  properties: {
    decision: { type: 'string', enum: ['ADVANCE', 'RESEARCH', 'REDO', 'ESCALATE'] },
    confidence: { type: 'number' },
    reasoning: { type: 'string' },
    research_query: { type: 'string' },
    redo_feedback: { type: 'string' },
    redo_targets: { type: 'array', items: { type: 'string' } },
    escalation_question: { type: 'string' },
    context_update: { type: 'string' },
    quality_snapshot: { type: 'string' },
  },
  required: ['decision', 'confidence', 'reasoning', 'context_update', 'quality_snapshot'],
}

// ── Step-specific evaluation criteria ─────────────────────────

const STEP_CRITERIA = {
  survey: `## Evaluation Criteria: Research Survey
Read the research document at ${domainDir}/research.md to form your judgment.

- Does the research cover the major branches and subtopics of "${topic}"?
- Are there enough papers (10+) to support a full curriculum?
- Are educational resources diverse (courses, videos, interactive tools, code)?
- Are there any critical subtopics with zero coverage that would leave lessons unsupported?
- Is the field landscape clear enough to structure a course?
- What are the 4-6 major pillars/branches of this field?`,

  'survey-enriched': `## Evaluation Criteria: Enriched Research
Read the research document at ${domainDir}/research.md — check especially the "Targeted Research" sections at the end.

- Did the targeted research fill the gaps you identified?
- Is coverage now sufficient to build a full curriculum?
- Are there still critical blind spots that would leave lessons unsupported?`,

  build: `## Evaluation Criteria: Curriculum Build
Read the domain files to evaluate the actual output:
- ${domainDir}/curriculum.json
- ${domainDir}/concept-map.md
- ${domainDir}/teaching-notes.md
- ${domainDir}/resources.md

Check:
- Does the lesson sequence respect concept dependencies from the concept map?
- Are lesson titles engaging questions or provocations (not dry topic labels)?
- Is the difficulty progression gradual and appropriate for ${level}?
- Does the lesson count fit the material (not padded or truncated to a round number)?
- Are there review lessons (type: "review") every 5-7 lessons?
- Does every lesson have difficulty (1-5) and type fields?
- Are there "thin" lessons with only 1 concept and no resources?
- Does the concept map match the lesson sequence (no orphan concepts)?
- Are teaching notes specific enough to guide delivery?
- Are resources real, diverse, and linked to specific lessons?`,

  qa: `## Evaluation Criteria: QA Results
Read the QA report at ${domainDir}/qa-report.md for full details.

- Are the critical findings legitimate? QA agents sometimes over-flag.
- If critical findings were verified by the adversarial check, they are real.
- If overall score is 7+/10 with no verified critical issues, ADVANCE.
- If there are verified critical issues (wrong prereq order, fake URLs, missing foundational concepts), REDO is mandatory.
- Your REDO feedback should translate QA findings into specific build instructions, not just repeat the QA agent's words.`,

  schedule: `## Evaluation Criteria: Schedule
Read workspace/tutor/progress.json to see the applied schedule.

- Are delivery times reasonable for ${timezone}? (not 3am)
- Is pacing appropriate for ${level} level?
- Are review days placed after difficulty spikes?
- Is estimated completion realistic for the lesson count?`,
}

// ── Tutor judge helper ────────────────────────────────────────

async function tutorJudge(step, stepOutput, extra) {
  const iteration = extra?.iteration || null
  const maxIterations = extra?.max || null
  const isLastIteration = iteration && maxIterations && iteration >= maxIterations

  const prompt = `You are the Tutor — the quality controller for OpenTutor's curriculum generation pipeline for a course on "${topic}" at ${level} level.

You carry accumulated knowledge across every judgment you make. Your context below represents everything you have decided so far. Use it to make sharper decisions — you know what gaps existed, what was enriched, where things were thin.

## Decision Options
- ADVANCE — Quality is sufficient for this student's learning. Move forward.
- RESEARCH — You need more depth on a specific subtopic before this step's output can be adequate. Be precise: "Sinkhorn convergence rate analysis" not "more research." This triggers a targeted search for papers and resources on that exact subtopic.
- REDO — This step's output has fixable problems. Provide specific, actionable feedback that a rebuild agent can act on without guessing. Cite specific lessons, sections, or files.
- ESCALATE — You genuinely cannot proceed without human judgment. This is rare — use it for fundamental questions about scope, level, or approach.

## Decision Principles
1. Perfect is the enemy of good. A curriculum that ships is better than one endlessly refined.
2. Focus on pedagogical impact. Would this issue actually harm the student's learning? If not, ADVANCE.
3. RESEARCH is for genuine knowledge gaps that make lessons thin or inaccurate, not stylistic preferences.
4. REDO feedback must name specific items: "Lessons 12-15 need X" not "some lessons need improvement."
${isLastIteration ? '5. THIS IS THE FINAL ALLOWED ITERATION. You MUST choose ADVANCE unless there are critical pedagogical errors (wrong prerequisite ordering, missing foundational concepts, dangerously incorrect content). Cosmetic issues and minor gaps are acceptable.' : ''}

## Your Accumulated Context
${tutorMemory.length > 0
    ? tutorMemory.map((m, i) => `${i + 1}. ${m}`).join('\n')
    : '(This is your first judgment. No prior context.)'}

${STEP_CRITERIA[step] || ''}

## Step Output Summary
${typeof stepOutput === 'string' ? stepOutput : JSON.stringify(stepOutput, null, 2)}

${iteration ? `\nThis is attempt ${iteration} of ${maxIterations}.` : ''}
${researchRounds > 0 ? `\nTargeted research rounds used: ${researchRounds}/${CAPS.targetedResearch}` : ''}`

  const decision = await agent(prompt, {
    label: `tutor:${step}${iteration ? ':' + iteration : ''}`,
    phase: step === 'survey' || step === 'survey-enriched' ? 'Survey' : step === 'build' ? 'Build' : step === 'qa' ? 'QA' : step === 'schedule' ? 'Schedule' : 'Survey',
    schema: TUTOR_DECISION_SCHEMA,
  })

  if (decision?.context_update) {
    tutorMemory.push(`[${step}] ${decision.context_update}`)
  }

  logStep({
    type: 'tutor-decision',
    step,
    iteration: iteration || 1,
    decision: decision?.decision,
    confidence: decision?.confidence,
    reasoning: decision?.reasoning,
    research_query: decision?.research_query,
    redo_feedback: decision?.redo_feedback,
    quality_snapshot: decision?.quality_snapshot,
  })

  log(`Tutor (${step}): ${decision?.decision || 'unknown'} (confidence: ${decision?.confidence || '?'}/10) — ${decision?.quality_snapshot || ''}`)

  return decision || { decision: 'ADVANCE', confidence: 5, reasoning: 'No response from tutor', context_update: 'Tutor did not respond, defaulting to ADVANCE', quality_snapshot: 'unknown' }
}

// ── ESCALATE handler ──────────────────────────────────────────

async function handleEscalate(decision) {
  if (decision?.decision !== 'ESCALATE') return

  await agent(
    `Write a file to ${domainDir}/escalation.md with the following content:

# Escalation: ${topic}

## Question for Human
${decision.escalation_question || 'The tutor needs human guidance to proceed.'}

## Tutor Reasoning
${decision.reasoning || 'No reasoning provided.'}

## Context So Far
${tutorMemory.map((m, i) => (i + 1) + '. ' + m).join('\n')}

## How to Resume
Re-run the pipeline with:
args: {topic: "${topic}", level: "${level}", humanGuidance: "your answer here"}`,
    { label: 'escalate:write', phase: 'Survey' }
  )

  throw new Error(`ESCALATE: ${decision.escalation_question || 'Tutor needs human guidance'}. See ${domainDir}/escalation.md`)
}

// ══════════════════════════════════════════════════════════════
// PIPELINE
// ══════════════════════════════════════════════════════════════

// ── Phase 1: Survey Research ──────────────────────────────────

phase('Survey')
log(`Starting tutor-controlled pipeline for "${topic}" (${level})`)

const surveyResult = await workflow({scriptPath: '.claude/workflows/research.js'}, { topic, mode: 'survey' })
logStep({ type: 'workflow', name: 'research', mode: 'survey', result: { coverage: surveyResult?.coverage, gaps: surveyResult?.gaps } })
log(`Survey done: coverage ${surveyResult?.coverage || '?'}/10`)

let decision = await tutorJudge('survey', surveyResult)

while (decision.decision === 'RESEARCH' && researchRounds < CAPS.targetedResearch) {
  log(`Tutor requests targeted research: "${decision.research_query}"`)
  const targetedResult = await workflow({scriptPath: '.claude/workflows/research.js'}, { topic, mode: 'targeted', query: decision.research_query })
  logStep({ type: 'workflow', name: 'research', mode: 'targeted', query: decision.research_query, result: targetedResult })
  researchRounds++
  decision = await tutorJudge('survey-enriched', { enrichedWith: decision.research_query, roundsUsed: researchRounds, roundsMax: CAPS.targetedResearch })
}

if (decision.decision === 'RESEARCH' && researchRounds >= CAPS.targetedResearch) {
  tutorMemory.push(`[cap-hit] Research cap reached (${CAPS.targetedResearch} rounds). Proceeding with available research.`)
  log(`Research cap reached (${CAPS.targetedResearch} rounds). Advancing.`)
}

await handleEscalate(decision)

// ── Phase 2: Audience Assessment ──────────────────────────────

phase('Audience')
log('Tutor assessing target audience')

const AUDIENCE_SCHEMA = {
  type: 'object',
  properties: {
    audience_type: { type: 'string' },
    goal: { type: 'string' },
    background: { type: 'string' },
    tone: { type: 'string' },
    depth: { type: 'string' },
    time_commitment: { type: 'string' },
    summary: { type: 'string' },
  },
  required: ['audience_type', 'goal', 'depth', 'summary'],
}

const audience = await agent(
  `You are the Tutor for OpenTutor. Based on the research and context available, define the target audience profile for a course on "${topic}" at ${level} level.

Read:
- ${domainDir}/research.md — to understand the field's scope and available resources
- workspace/USER.md — for any existing student profile
- skills/tutor/references/teaching-method.md — for the teaching methodology

## Your Accumulated Context
${tutorMemory.map((m, i) => (i + 1) + '. ' + m).join('\n')}

${humanGuidance ? '## Human Guidance\n' + humanGuidance : ''}

Determine:

1. **audience_type** — Who is this for? (e.g., "graduate students in applied math", "software engineers exploring ML theory", "curious adults with calculus background")
2. **goal** — What is the learning goal? (e.g., "preparation for research", "practical application in ML pipelines", "intellectual enrichment", "exam prep")
3. **background** — What prerequisites can we assume? Be specific about math/CS/domain knowledge.
4. **tone** — What teaching tone fits this audience? (e.g., "rigorous but accessible", "hands-on and example-driven", "conversational with formal foundations")
5. **depth** — How deep should the course go? (e.g., "intuition + key proofs", "full formal treatment", "applied recipes with theoretical grounding")
6. **time_commitment** — How much time per lesson? (e.g., "3-5 min read + 10 min exercises", "15-20 min deep study")
7. **summary** — A 2-3 sentence profile that the curriculum builder can use as a north star.

Report as JSON.`,
  { label: 'audience', phase: 'Audience', schema: AUDIENCE_SCHEMA }
)

logStep({ type: 'agent', name: 'audience', result: audience })
tutorMemory.push(`[audience] ${audience?.summary || 'Audience assessment completed.'}`)
log(`Audience: ${audience?.audience_type || 'unknown'} — ${audience?.goal || 'unknown goal'}`)

// ── Dry-run exit point ────────────────────────────────────────

if (dryRun) {
  await agent(
    `Write a preview report to ${domainDir}/preview.md.

Read ${domainDir}/research.md to summarize what was found.

Write the report with this structure:

# Preview: ${topic}
Generated: (today's date)
Mode: DRY RUN — no curriculum built yet

## Field Map
Summarize the major branches/pillars of "${topic}" based on the research.
List the top 5-8 subtopics that a curriculum would cover.

## Audience Profile
- **Type**: ${audience?.audience_type || 'unknown'}
- **Goal**: ${audience?.goal || 'unknown'}
- **Background**: ${audience?.background || 'unknown'}
- **Tone**: ${audience?.tone || 'unknown'}
- **Depth**: ${audience?.depth || 'unknown'}
- **Time per lesson**: ${audience?.time_commitment || 'unknown'}

## Research Coverage
Summarize: how many papers found, how many educational resources, any major gaps.

## Tutor Notes
${tutorMemory.map((m, i) => (i + 1) + '. ' + m).join('\n')}

## Next Step
To proceed with the full pipeline, run:
args: {topic: "${topic}", level: "${level}"}`,
    { label: 'preview', phase: 'Audience' }
  )

  log(`Dry run complete. Preview written to ${domainDir}/preview.md`)
  return {
    topic,
    slug,
    level,
    dryRun: true,
    audience,
    researchRounds,
    tutorMemory,
  }
}

// ── Phase 3: Build Curriculum ─────────────────────────────────

phase('Build')

let buildFeedback = null
for (let attempt = 1; attempt <= CAPS.buildRedos + 1; attempt++) {
  const buildMode = buildFeedback ? 'patch' : 'full'
  const buildResult = await workflow({scriptPath: '.claude/workflows/curriculum-build.js'}, {
    topic,
    level,
    mode: buildMode,
    feedback: buildFeedback,
    audience: audience?.summary,
  })
  logStep({ type: 'workflow', name: 'curriculum-build', mode: buildMode, attempt, result: { gate: buildResult?.gate, issues: buildResult?.issues } })

  log(`Build attempt ${attempt}: gate=${buildResult?.gate || '?'}, mode=${buildMode}`)

  decision = await tutorJudge('build', buildResult, { iteration: attempt, max: CAPS.buildRedos + 1 })

  if (decision.decision === 'ADVANCE') break

  await handleEscalate(decision)

  if (decision.decision === 'RESEARCH' && researchRounds < CAPS.targetedResearch) {
    log(`Tutor requests targeted research before rebuild: "${decision.research_query}"`)
    const targetedResult = await workflow({scriptPath: '.claude/workflows/research.js'}, { topic, mode: 'targeted', query: decision.research_query })
    logStep({ type: 'workflow', name: 'research', mode: 'targeted', query: decision.research_query, result: targetedResult })
    researchRounds++
  }

  buildFeedback = decision.redo_feedback || 'Improve overall quality based on tutor feedback.'
}

// ── Phase 4: QA ───────────────────────────────────────────────

phase('QA')

for (let cycle = 1; cycle <= CAPS.qaCycles + 1; cycle++) {
  const qaResult = await workflow({scriptPath: '.claude/workflows/curriculum-qa.js'}, { topic })
  logStep({ type: 'workflow', name: 'curriculum-qa', cycle, result: { verdict: qaResult?.verdict, score: qaResult?.score, criticalIssues: qaResult?.criticalIssues, warnings: qaResult?.warnings } })

  log(`QA cycle ${cycle}: verdict=${qaResult?.verdict || '?'}, score=${qaResult?.score || '?'}/10`)

  decision = await tutorJudge('qa', qaResult, { iteration: cycle, max: CAPS.qaCycles + 1 })

  if (decision.decision === 'ADVANCE') break

  await handleEscalate(decision)

  if (decision.decision === 'RESEARCH' && researchRounds < CAPS.targetedResearch) {
    log(`Tutor requests targeted research to fix QA issues: "${decision.research_query}"`)
    const targetedResult = await workflow({scriptPath: '.claude/workflows/research.js'}, { topic, mode: 'targeted', query: decision.research_query })
    logStep({ type: 'workflow', name: 'research', mode: 'targeted', query: decision.research_query, result: targetedResult })
    researchRounds++
  }

  if (decision.decision === 'REDO' || decision.decision === 'RESEARCH') {
    log(`Rebuilding (patch) with QA feedback before re-running QA`)
    const patchResult = await workflow({scriptPath: '.claude/workflows/curriculum-build.js'}, {
      topic,
      level,
      mode: 'patch',
      feedback: decision.redo_feedback || 'Address QA findings.',
      audience: audience?.summary,
    })
    logStep({ type: 'workflow', name: 'curriculum-build', mode: 'patch', cycle, result: { gate: patchResult?.gate, issues: patchResult?.issues } })
  }
}

// ── Phase 5: Schedule ─────────────────────────────────────────

phase('Schedule')

let schedFeedback = null
for (let attempt = 1; attempt <= CAPS.scheduleRedos + 1; attempt++) {
  const schedResult = await workflow({scriptPath: '.claude/workflows/schedule.js'}, { topic, timezone, feedback: schedFeedback })
  logStep({ type: 'workflow', name: 'schedule', attempt, result: { pacing: schedResult?.schedule?.pacing, gate: schedResult?.gate } })

  log(`Schedule attempt ${attempt}: pacing=${schedResult?.schedule?.pacing || '?'}`)

  decision = await tutorJudge('schedule', schedResult, { iteration: attempt, max: CAPS.scheduleRedos + 1 })

  if (decision.decision === 'ADVANCE') break

  await handleEscalate(decision)
  schedFeedback = decision.redo_feedback
}

// ── Phase 6: Register ─────────────────────────────────────────

phase('Register')

await agent(
  `Read workspace/tutor/progress.json and ensure:
1. "${slug}" is in the active_topics array
2. The schedule section is set (should already be from schedule workflow)

If "${slug}" is not in active_topics, add it. Write the updated file back.

Then read ${domainDir}/curriculum.json and report:
- Total lesson count
- Module count
- First lesson title`,
  { label: 'register', phase: 'Register' }
)

// ── Pipeline Report ───────────────────────────────────────────

await agent(
  `Write a pipeline run report to ${domainDir}/pipeline-report.md.

Read these files to gather final stats:
- ${domainDir}/curriculum.json — lesson count, module count
- ${domainDir}/qa-report.md — QA verdict and score (if exists)
- workspace/tutor/progress.json — schedule details

Write the report with this structure:

# Pipeline Report: ${topic}
Generated: (today's date)

## Summary
- **Topic**: ${topic}
- **Level**: ${level}
- **Audience**: ${audience?.summary || 'Not assessed'}
- **Tutor Judgments**: ${tutorMemory.length}
- **Targeted Research Rounds**: ${researchRounds}/${CAPS.targetedResearch}

## Tutor Decision Log
${tutorMemory.map((m, i) => (i + 1) + '. ' + m).join('\n')}

## Pipeline Stats
(Fill in from the files you read)
- Total lessons:
- Total modules:
- QA verdict:
- QA score:
- Schedule pacing:
- Estimated completion:

## Files Generated
List all files in ${domainDir}/ with their sizes.

## Execution Log
${executionLog.map(e => {
    if (e.type === 'tutor-decision') return '### Step ' + e.timestamp + ': Tutor → ' + e.step + ' (attempt ' + e.iteration + ')\n- **Decision**: ' + e.decision + ' (confidence: ' + e.confidence + '/10)\n- **Reasoning**: ' + e.reasoning + (e.research_query ? '\n- **Research query**: ' + e.research_query : '') + (e.redo_feedback ? '\n- **Redo feedback**: ' + e.redo_feedback : '') + '\n- **Quality**: ' + e.quality_snapshot
    if (e.type === 'workflow') return '### Step ' + e.timestamp + ': Workflow → ' + e.name + ' (' + (e.mode || 'default') + ')' + (e.query ? '\n- **Query**: ' + e.query : '') + (e.attempt ? '\n- **Attempt**: ' + e.attempt : '') + (e.cycle ? '\n- **Cycle**: ' + e.cycle : '') + '\n- **Result**: ' + JSON.stringify(e.result)
    if (e.type === 'agent') return '### Step ' + e.timestamp + ': Agent → ' + e.name + '\n- **Result**: ' + JSON.stringify(e.result)
    return '### Step ' + e.timestamp + ': ' + e.type + '\n' + JSON.stringify(e)
  }).join('\n\n')}`,
  { label: 'report', phase: 'Register' }
)

// ── Write execution log as JSON ──────────────────────────────

await agent(
  'Write the following JSON to ' + domainDir + '/execution-log.json:\n\n' + JSON.stringify({ topic, slug, level, audience: audience?.summary, tutorMemory, executionLog, researchRounds, caps: CAPS }, null, 2),
  { label: 'write-log', phase: 'Register' }
)

// ── Write HTML pipeline report ───────────────────────────────

const reportData = JSON.stringify({
  topic,
  slug,
  level,
  audience,
  tutorMemory,
  executionLog,
  researchRounds,
  caps: CAPS,
}, null, 2)

await agent(
  'Generate a self-contained HTML pipeline report and write it to ' + domainDir + '/pipeline-report.html.\n\n' +
  '## Data\n```json\n' + reportData + '\n```\n\n' +
  '## Requirements\n\n' +
  'Build a single HTML file with ALL CSS inline (no external dependencies). The page should visualize the full pipeline execution.\n\n' +
  '### 1. Header\n' +
  '- Title: "Pipeline Report: ' + topic + '"\n' +
  '- Subtitle: generated date, level, audience summary\n' +
  '- 4 stat cards in a row: Tutor Judgments (count), Research Rounds (used/max), Total Steps (count), Final Verdict (from last QA tutor decision)\n\n' +
  '### 2. Pipeline Flow Diagram\n' +
  'A horizontal or vertical flow showing the pipeline steps as connected nodes:\n' +
  '- Each step is a rounded box with the step name (Survey, Audience, Build, QA, Schedule, Register)\n' +
  '- Color-code by what happened: green = ADVANCE on first try, yellow = ADVANCE after iteration, blue = included RESEARCH, gray = not reached\n' +
  '- Show arrows between steps. If a step looped (REDO/RESEARCH), show a curved arrow back to itself with the iteration count\n' +
  '- Use CSS flexbox/grid, not SVG — keep it simple\n\n' +
  '### 3. Tutor Decision Timeline\n' +
  'A vertical timeline of every tutor decision, in order. For each:\n' +
  '- Step name and attempt number as header\n' +
  '- Decision badge: ADVANCE (green), RESEARCH (blue), REDO (yellow), ESCALATE (red)\n' +
  '- Confidence as a small horizontal bar (1-10 scale)\n' +
  '- Reasoning text (collapsible via <details> tag)\n' +
  '- If RESEARCH: show the query in a highlighted box\n' +
  '- If REDO: show the feedback in a highlighted box\n' +
  '- Quality snapshot as a subtle italic line\n\n' +
  '### 4. Workflow Calls Table\n' +
  'A table of all workflow/agent calls (non-tutor entries in executionLog):\n' +
  '- Columns: Step #, Workflow Name, Mode, Attempt/Cycle, Key Results\n' +
  '- Highlight targeted research rows in light blue\n' +
  '- Highlight patch rebuilds in light yellow\n\n' +
  '### 5. Audience Profile Card\n' +
  'If audience data exists, show a card with: audience_type, goal, background, tone, depth, time_commitment, summary.\n' +
  'Use a 2-column layout with labels on the left and values on the right.\n\n' +
  '### 6. Tutor Memory (accumulated context)\n' +
  'Show the full tutorMemory array as a numbered list. Each entry is one judgment summary.\n' +
  'Use a monospace font for this section — it is the tutor\'s internal narrative.\n\n' +
  '### Style Rules\n' +
  '- Font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif\n' +
  '- Background: #f8fafc, text: #1e293b\n' +
  '- Primary: #2563eb, Success: #16a34a, Warning: #eab308, Error: #dc2626, Info: #0ea5e9\n' +
  '- Cards: white background, box-shadow: 0 1px 3px rgba(0,0,0,0.12), border-radius: 8px, padding: 24px\n' +
  '- Decision badges: small rounded pills with white text on colored background\n' +
  '- Max content width: 960px, centered\n' +
  '- Responsive: cards wrap on narrow screens\n' +
  '- Page title: "Pipeline Report: ' + topic + '"\n\n' +
  'Write the complete HTML file. It must render correctly when opened in a browser.',
  { label: 'html-report', phase: 'Register' }
)

log('Pipeline complete for "' + topic + '" — ' + tutorMemory.length + ' tutor judgments, ' + researchRounds + ' targeted research rounds')

return {
  topic,
  slug,
  level,
  audience: audience?.summary,
  tutorJudgments: tutorMemory.length,
  researchRounds,
  finalMemory: tutorMemory,
}
