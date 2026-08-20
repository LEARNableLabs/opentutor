export const meta = {
  name: 'new-topic',
  description: 'End-to-end pipeline: research → curriculum build → schedule → QA for a new topic',
  whenToUse: 'When adding a completely new topic. Chains research, curriculum-build, schedule, and curriculum-qa workflows. Usage: run with args {topic: "category theory", level: "intermediate"}',
  phases: [
    { title: 'Research', detail: 'Multi-source academic research' },
    { title: 'Build', detail: 'Design curriculum, concept map, teaching notes' },
    { title: 'Schedule', detail: 'Generate optimal delivery schedule' },
    { title: 'QA', detail: 'Adversarial quality checks' },
    { title: 'Register', detail: 'Register topic in progress.json' },
  ],
}

const topic = args?.topic
if (!topic) throw new Error('Missing args.topic — pass {topic: "category theory", level: "intermediate"}')

const level = args?.level || 'intermediate'
const timezone = args?.timezone || 'America/New_York'
const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const domainDir = `skills/tutor/domains/${slug}`

// ── Step 1: Research ──────────────────────────────────────────

phase('Research')
log(`Starting full pipeline for "${topic}" (${level})`)

const researchResult = await workflow('research', { topic })
log(`Research done: ${researchResult?.coverage || '?'}/10 coverage`)

// ── Step 2: Build Curriculum ──────────────────────────────────

phase('Build')

const buildResult = await workflow('curriculum-build', { topic, level })
log(`Build done: ${buildResult?.gate || 'unknown'} gate verdict`)

// ── Step 3: Schedule ──────────────────────────────────────────

phase('Schedule')

const scheduleResult = await workflow('schedule', { topic, timezone })
log(`Schedule done: ${scheduleResult?.schedule?.pacing || '?'} pacing`)

// ── Step 4: QA ────────────────────────────────────────────────

phase('QA')

const qaResult = await workflow('curriculum-qa', { topic })
log(`QA done: ${qaResult?.verdict || 'UNKNOWN'} (${qaResult?.score || '?'}/10)`)

// ── Step 5: Register ──────────────────────────────────────────

phase('Register')

if (qaResult?.verdict === 'FAIL') {
  log(`WARNING: QA failed with ${qaResult?.criticalIssues || '?'} critical issues. Topic registered but curriculum needs fixes.`)
}

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

log(`Pipeline complete for "${topic}"`)

return {
  topic,
  slug,
  level,
  research: { coverage: researchResult?.coverage },
  build: { gate: buildResult?.gate },
  schedule: { pacing: scheduleResult?.schedule?.pacing },
  qa: { verdict: qaResult?.verdict, score: qaResult?.score },
}
