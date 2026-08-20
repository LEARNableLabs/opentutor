export const meta = {
  name: 'schedule',
  description: 'Analyze curriculum difficulty and generate optimal lesson schedule with review day placement',
  whenToUse: 'After building a curriculum. Usage: run with args {topic: "optimal transport", timezone: "America/New_York"}',
  phases: [
    { title: 'Analyze', detail: 'Assess curriculum difficulty curve and student profile' },
    { title: 'Design', detail: 'Generate pacing strategy and review day placement' },
    { title: 'Gate', detail: 'Verify schedule makes pedagogical sense' },
    { title: 'Apply', detail: 'Write schedule to progress.json' },
  ],
}

const topic = args?.topic
if (!topic) throw new Error('Missing args.topic — pass {topic: "optimal transport"}')

const timezone = args?.timezone || 'America/New_York'
const timesPerDay = args?.timesPerDay || 3
const feedback = args?.feedback || null
const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const domainDir = `skills/tutor/domains/${slug}`

// ── Phase 1: Analyze ──────────────────────────────────────────

phase('Analyze')
log(`Analyzing curriculum for "${topic}"`)

const analysis = await agent(
  `Read these files and analyze the curriculum difficulty:

1. ${domainDir}/curriculum.json — the lesson sequence
2. ${domainDir}/concept-map.md — concept dependencies
3. ${domainDir}/teaching-notes.md — pedagogical guidance
4. workspace/USER.md — student profile
5. workspace/tutor/progress.json — current progress and schedule

For each lesson, estimate:
- Cognitive load (1-5): how much new material
- Prerequisite depth: how many prior concepts are needed
- Difficulty spikes: where the hardest transitions are

Report as JSON:
{
  "lessonCount": number,
  "moduleCount": number,
  "currentProgress": {"completed": number, "total": number},
  "currentSchedule": {"times": [...], "timezone": "...", "paused": boolean} or null,
  "difficultyProfile": [{"day": 1, "title": "...", "load": 3, "spike": false}],
  "spikeDays": [day numbers where difficulty spikes],
  "studentLevel": "beginner|intermediate|advanced",
  "estimatedWeeks": number
}`,
  {
    label: 'analyze',
    phase: 'Analyze',
    schema: {
      type: 'object',
      properties: {
        lessonCount: { type: 'number' },
        moduleCount: { type: 'number' },
        currentProgress: { type: 'object' },
        currentSchedule: { type: ['object', 'null'] },
        difficultyProfile: { type: 'array' },
        spikeDays: { type: 'array', items: { type: 'number' } },
        studentLevel: { type: 'string' },
        estimatedWeeks: { type: 'number' },
      },
      required: ['lessonCount', 'difficultyProfile', 'spikeDays'],
    },
  }
)

log(`Curriculum: ${analysis?.lessonCount || '?'} lessons, ${analysis?.spikeDays?.length || 0} difficulty spikes`)

// ── Phase 2: Design — generate schedule ───────────────────────

phase('Design')

const schedule = await agent(
  `You are a learning schedule optimizer. Design an optimal lesson delivery schedule for "${topic}".
${feedback ? `\n## Previous Attempt Feedback\nThe previous schedule had these issues — address them in your design:\n${feedback}\n` : ''}

## Curriculum Analysis
${JSON.stringify(analysis, null, 2)}

## Constraints
- Timezone: ${timezone}
- Delivery slots per day: ${timesPerDay}
- Spaced repetition reviews should happen at the last slot of each day
- Review days should be placed after difficulty spikes (days: ${analysis?.spikeDays?.join(', ') || 'none detected'})

## Design the schedule:

1. **Daily timing** — Choose ${timesPerDay} delivery times that make pedagogical sense:
   - Morning: new concepts (freshest mind)
   - Afternoon: practice/application
   - Evening: review/flashcards (spaced repetition)

2. **Pacing strategy**:
   - For easy lessons (load 1-2): can deliver 2 per day
   - For medium lessons (load 3): 1 per day
   - For hard lessons (load 4-5): 1 per day + extra review day after
   - After difficulty spikes: always insert a review day

3. **Review day placement** — Insert review days:
   - Every 5-7 lessons
   - After each difficulty spike
   - At module transitions

4. **Rest days** — Optional rest days on weekends or after particularly dense modules

Report as JSON:
{
  "times": ["09:00", "13:00", "19:00"],
  "timezone": "${timezone}",
  "paused": false,
  "pacing": "standard|intensive|relaxed",
  "lessonsPerDay": 1,
  "reviewDays": [day numbers that are review days],
  "restDays": ["sat", "sun"] or [],
  "estimatedCompletionDays": number,
  "rationale": "brief explanation of schedule choices"
}`,
  {
    label: 'design-schedule',
    phase: 'Design',
    schema: {
      type: 'object',
      properties: {
        times: { type: 'array', items: { type: 'string' } },
        timezone: { type: 'string' },
        paused: { type: 'boolean' },
        pacing: { type: 'string' },
        lessonsPerDay: { type: 'number' },
        reviewDays: { type: 'array', items: { type: 'number' } },
        restDays: { type: 'array', items: { type: 'string' } },
        estimatedCompletionDays: { type: 'number' },
        rationale: { type: 'string' },
      },
      required: ['times', 'timezone', 'pacing', 'rationale'],
    },
  }
)

log(`Schedule: ${schedule?.times?.join(', ') || '?'} ${schedule?.timezone || ''}, pacing: ${schedule?.pacing || '?'}`)

// ── Phase 3: Gate — verify schedule ───────────────────────────

phase('Gate')

const gate = await agent(
  `You are a schedule quality gate. Verify this lesson schedule for "${topic}".

## Schedule
${JSON.stringify(schedule, null, 2)}

## Curriculum Analysis
${JSON.stringify(analysis, null, 2)}

Check:
1. Are delivery times reasonable for the timezone? (not 3am)
2. Is pacing appropriate for the student's level (${analysis?.studentLevel || 'unknown'})?
3. Are review days placed after all difficulty spikes?
4. Is the estimated completion time realistic?
5. Are there enough review days relative to lesson count?

Report as JSON:
{
  "verdict": "PROCEED" or "ISSUES",
  "issues": ["list of problems"],
  "adjustments": ["suggested fixes"]
}`,
  {
    label: 'schedule-gate',
    phase: 'Gate',
    schema: {
      type: 'object',
      properties: {
        verdict: { type: 'string', enum: ['PROCEED', 'ISSUES'] },
        issues: { type: 'array', items: { type: 'string' } },
        adjustments: { type: 'array', items: { type: 'string' } },
      },
      required: ['verdict'],
    },
  }
)

log(`Gate: ${gate?.verdict || 'unknown'}, issues: ${gate?.issues?.length || 0}`)

// ── Phase 4: Apply — write to progress.json ───────────────────

phase('Apply')

await agent(
  `Read workspace/tutor/progress.json and update ONLY the schedule section. Keep all other fields (active_topics, history, onboarding, spaced_repetition) unchanged.

Set the schedule to:
${JSON.stringify(schedule, null, 2)}

${gate?.issues?.length ? 'Apply these adjustments: ' + gate.adjustments?.join(', ') : ''}

Also make sure "${slug}" is in the active_topics array.

Write the updated progress.json back to workspace/tutor/progress.json.`,
  { label: 'apply-schedule', phase: 'Apply' }
)

log(`Schedule applied to workspace/tutor/progress.json`)
return { topic, slug, schedule, gate: gate?.verdict }
