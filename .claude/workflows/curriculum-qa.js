export const meta = {
  name: 'curriculum-qa',
  description: 'Adversarial QA for curriculum correctness — sequencing, resources, coverage, pedagogy, schema',
  whenToUse: 'After building or modifying a curriculum. Usage: run with args {topic: "optimal transport"}',
  phases: [
    { title: 'QA', detail: 'Fork 5 specialist QA agents checking different dimensions' },
    { title: 'Verify', detail: 'Adversarially verify each finding — reject plausible-but-wrong' },
    { title: 'Verdict', detail: 'Synthesize findings into pass/fail report with fix recommendations' },
  ],
}

const topic = args?.topic
if (!topic) throw new Error('Missing args.topic — pass {topic: "optimal transport"}')

const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const domainDir = `skills/tutor/domains/${slug}`

const FINDING_SCHEMA = {
  type: 'object',
  properties: {
    dimension: { type: 'string' },
    status: { type: 'string', enum: ['pass', 'warn', 'fail'] },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['critical', 'warning', 'info'] },
          description: { type: 'string' },
          location: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'description'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['dimension', 'status', 'findings', 'summary'],
}

const FILE_CONTEXT = `Read these files for context:
- ${domainDir}/curriculum.json
- ${domainDir}/concept-map.md
- ${domainDir}/teaching-notes.md
- ${domainDir}/resources.md`

// ── Phase 1: QA — parallel specialist agents ──────────────────
// Inspired by remote-factory's deep-QA fork: health_checker, code_reviewer, adversarial_tester

phase('QA')
log(`QA checking curriculum for "${topic}"`)

const QA_AGENTS = [
  {
    id: 'sequencing',
    prompt: `You are a curriculum sequencing checker. Verify that lesson prerequisites are properly ordered.

${FILE_CONTEXT}

Check:
1. **Prerequisite ordering** — For each lesson, verify that all concepts it depends on (from the concept map) have been taught in earlier lessons
2. **Module coherence** — Do lessons within a module actually relate to each other?
3. **Circular dependencies** — Are there any concepts that reference each other as prerequisites?
4. **Review day placement** — Are review days placed after every 5-7 lessons? After module transitions?
5. **Progressive difficulty** — Does each module build naturally on the previous one?

For each issue found, report:
- severity: "critical" (prerequisite taught after dependent), "warning" (suboptimal order), "info" (suggestion)
- description: what's wrong
- location: which lesson day(s)
- fix: how to fix it`,
  },
  {
    id: 'resources',
    prompt: `You are a resource verification agent. Check that curriculum resources are real and accessible.

${FILE_CONTEXT}

Check:
1. **URL validity** — For each resource URL in lessons and resources.md, verify it looks like a real URL (correct domain, reasonable path). Flag obviously fake or hallucinated URLs.
2. **Resource existence** — Search the web to verify that key resources actually exist (textbooks, courses, video series)
3. **Level appropriateness** — Are resources appropriate for the stated student level?
4. **Coverage** — Does each lesson have at least one resource? Are there lessons with no resources?
5. **Diversity** — Is there a mix of resource types (text, video, interactive)?

For each issue found, report:
- severity: "critical" (broken/fake URL), "warning" (resource may not exist), "info" (improvement suggestion)
- description: what's wrong
- location: which lesson day(s) or resource
- fix: suggested replacement resource`,
  },
  {
    id: 'coverage',
    prompt: `You are a concept coverage analyst. Verify the curriculum covers all key aspects of "${topic}".

${FILE_CONTEXT}

Check:
1. **Concept completeness** — Are all concepts from the concept map covered by at least one lesson?
2. **Orphan concepts** — Are there concepts in lessons that aren't in the concept map?
3. **Depth balance** — Are some subtopics over-covered while others are thin?
4. **Exit criteria alignment** — Can a student actually achieve each exit criterion by completing the curriculum?
5. **Gap analysis** — What important aspects of "${topic}" are missing entirely?

For each issue found, report severity, description, location, and fix.`,
  },
  {
    id: 'pedagogy',
    prompt: `You are a pedagogical reviewer. Check the curriculum for teaching quality issues.

${FILE_CONTEXT}

Check:
1. **Lesson titles** — Are they engaging questions/provocations? Flag any that are dry topic labels.
2. **Concept density** — Are there lessons with too many concepts (>4) or too few (<1)?
3. **Difficulty spikes** — Are there sudden jumps in difficulty without preparation?
4. **Engagement pacing** — Are "mind-blowing" moments spread throughout, not clumped?
5. **Misconception coverage** — Do lessons address known misconceptions from the teaching notes?
6. **Exercise opportunities** — Can each lesson generate a meaningful exercise? Flag abstract lessons with no testable content.

For each issue found, report severity, description, location, and fix.`,
  },
  {
    id: 'schema',
    prompt: `You are a data integrity checker. Verify the curriculum.json follows the required schema.

${FILE_CONTEXT}

Check curriculum.json for:
1. **Required fields** — Every lesson must have: day, module, title, concepts (array), resources (array), status
2. **Day sequence** — Days must be sequential (1, 2, 3...) with no gaps or duplicates
3. **Status values** — Every status must be "pending" or "completed" (not null, undefined, or other)
4. **Non-empty arrays** — concepts and resources arrays must not be empty
5. **Top-level fields** — Must have: topic, slug, created, lessons
6. **String quality** — No empty strings, no placeholder text, no "TBD"
7. **JSON validity** — Check it actually parses as valid JSON

For each issue found, report severity (critical for schema violations), description, location, and fix.`,
  },
]

const qaResults = await parallel(
  QA_AGENTS.map(qa => () =>
    agent(qa.prompt, {
      label: `qa:${qa.id}`,
      phase: 'QA',
      schema: FINDING_SCHEMA,
    })
  )
)

const allFindings = []
for (let i = 0; i < QA_AGENTS.length; i++) {
  const result = qaResults[i]
  if (result) {
    allFindings.push(result)
    const criticals = result.findings?.filter(f => f.severity === 'critical').length || 0
    const warnings = result.findings?.filter(f => f.severity === 'warning').length || 0
    log(`${QA_AGENTS[i].id}: ${result.status} (${criticals} critical, ${warnings} warnings)`)
  }
}

// ── Phase 2: Verify — adversarially verify critical findings ──

phase('Verify')

const criticalFindings = allFindings.flatMap(r =>
  (r.findings || [])
    .filter(f => f.severity === 'critical')
    .map(f => ({ ...f, dimension: r.dimension }))
)

log(`${criticalFindings.length} critical findings to verify`)

let verified = []
if (criticalFindings.length > 0) {
  const verificationResults = await parallel(
    criticalFindings.map((finding, i) => () =>
      agent(
        `You are an adversarial verifier. Your job is to REFUTE this finding if it's wrong. Default to confirming if you're uncertain.

${FILE_CONTEXT}

## Finding to verify
Dimension: ${finding.dimension}
Description: ${finding.description}
Location: ${finding.location || 'not specified'}
Suggested fix: ${finding.fix || 'not specified'}

Try hard to refute this. Check:
- Is the claim actually true? Read the files and verify.
- Could there be a valid reason for what the finder flagged?
- Is the location correct?

Report as JSON:
{
  "confirmed": true or false,
  "reason": "why you confirmed or refuted",
  "adjusted_severity": "critical" or "warning" or "info"
}`,
        {
          label: `verify:${i}`,
          phase: 'Verify',
          schema: {
            type: 'object',
            properties: {
              confirmed: { type: 'boolean' },
              reason: { type: 'string' },
              adjusted_severity: { type: 'string', enum: ['critical', 'warning', 'info'] },
            },
            required: ['confirmed', 'reason'],
          },
        }
      ).then(v => ({
        ...finding,
        verified: v?.confirmed ?? true,
        verify_reason: v?.reason,
        final_severity: v?.adjusted_severity || finding.severity,
      }))
    )
  )

  verified = verificationResults.filter(Boolean).filter(f => f.verified)
  const refuted = verificationResults.filter(Boolean).filter(f => !f.verified)
  log(`Verified: ${verified.length} confirmed, ${refuted.length} refuted`)
} else {
  log('No critical findings to verify')
}

// ── Phase 3: Verdict — synthesize report ──────────────────────

phase('Verdict')

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PASS', 'PASS_WITH_WARNINGS', 'FAIL'] },
    overall_score: { type: 'number' },
    dimensions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          status: { type: 'string' },
          score: { type: 'number' },
        },
      },
    },
    critical_issues: { type: 'array', items: { type: 'string' } },
    warnings: { type: 'array', items: { type: 'string' } },
    fix_plan: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
  required: ['verdict', 'overall_score', 'critical_issues', 'summary'],
}

const verdict = await agent(
  `You are the final verdict synthesizer for a curriculum QA pipeline. Produce the overall assessment.

## QA Results by Dimension
${allFindings.map(r => `### ${r.dimension}\nStatus: ${r.status}\n${r.summary}\nFindings: ${r.findings?.length || 0} (${r.findings?.filter(f => f.severity === 'critical').length || 0} critical)`).join('\n\n')}

## Verified Critical Findings (survived adversarial check)
${verified.length > 0 ? verified.map(f => `- [${f.final_severity}] ${f.description} (${f.dimension}): ${f.verify_reason}`).join('\n') : 'None — all critical findings were refuted or none existed.'}

## All Findings Detail
${JSON.stringify(allFindings, null, 2)}

---

Produce the final verdict:
- **PASS** — No critical issues, minor warnings only
- **PASS_WITH_WARNINGS** — No critical issues, but warnings that should be addressed
- **FAIL** — Confirmed critical issues that must be fixed before use

Score each dimension 0-10 and compute an overall weighted average.
List all confirmed critical issues and all warnings.
Provide a prioritized fix plan (what to fix first, what can wait).`,
  { label: 'verdict', phase: 'Verdict', schema: VERDICT_SCHEMA }
)

// Write QA report
const reportPrompt = `Write a QA report to ${domainDir}/qa-report.md with the following content:

# QA Report: ${topic}
Generated: (today's date)

## Verdict: ${verdict?.verdict || 'UNKNOWN'}
Overall Score: ${verdict?.overall_score || '?'}/10

## Dimensions
${verdict?.dimensions?.map(d => `- **${d.name}**: ${d.status} (${d.score}/10)`).join('\n') || 'No dimension scores available'}

## Critical Issues (verified)
${verdict?.critical_issues?.length ? verdict.critical_issues.map(i => `- ${i}`).join('\n') : 'None'}

## Warnings
${verdict?.warnings?.length ? verdict.warnings.map(w => `- ${w}`).join('\n') : 'None'}

## Fix Plan
${verdict?.fix_plan?.length ? verdict.fix_plan.map((f, i) => `${i + 1}. ${f}`).join('\n') : 'No fixes needed'}

## Summary
${verdict?.summary || 'No summary available'}`

await agent(reportPrompt, { label: 'write-report', phase: 'Verdict' })

log(`QA complete: ${verdict?.verdict || 'UNKNOWN'} (${verdict?.overall_score || '?'}/10)`)
return {
  topic,
  slug,
  verdict: verdict?.verdict,
  score: verdict?.overall_score,
  criticalIssues: verdict?.critical_issues?.length || 0,
  warnings: verdict?.warnings?.length || 0,
}
