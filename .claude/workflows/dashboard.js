export const meta = {
  name: 'dashboard',
  description: 'Generate an HTML progress dashboard from curriculum data',
  whenToUse: 'To visualize learning progress across all topics. Usage: run with no args, or {outputPath: "custom/path.html"}',
  phases: [
    { title: 'Gather', detail: 'Read progress, curriculum, and QA data' },
    { title: 'Render', detail: 'Generate self-contained HTML dashboard' },
  ],
}

const outputPath = args?.outputPath || 'workspace/tutor/dashboard.html'

// ── Phase 1: Gather ──────────────────────────────────────────

phase('Gather')
log('Gathering progress and curriculum data')

const DATA_SCHEMA = {
  type: 'object',
  properties: {
    schedule: {
      type: 'object',
      properties: {
        times: { type: 'array', items: { type: 'string' } },
        timezone: { type: 'string' },
        pacing: { type: 'string' },
      },
    },
    topics: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          name: { type: 'string' },
          level: { type: 'string' },
          created: { type: 'string' },
          totalLessons: { type: 'number' },
          completedLessons: { type: 'number' },
          modules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                total: { type: 'number' },
                completed: { type: 'number' },
              },
              required: ['name', 'total', 'completed'],
            },
          },
          concepts: { type: 'array', items: { type: 'string' } },
          completedConcepts: { type: 'array', items: { type: 'string' } },
          qaVerdict: { type: 'string' },
          qaScore: { type: 'number' },
          exitCriteria: { type: 'array', items: { type: 'string' } },
        },
        required: ['slug', 'name', 'totalLessons', 'completedLessons', 'modules'],
      },
    },
    history: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          date: { type: 'string' },
          topic: { type: 'string' },
          lesson: { type: 'number' },
          engagement: { type: 'string' },
        },
      },
    },
    streak: { type: 'number' },
  },
  required: ['topics', 'history', 'schedule', 'streak'],
}

const data = await agent(
  `Read and synthesize all learning data from the OpenTutor workspace.

1. Read workspace/tutor/progress.json for active_topics, schedule, and history.

2. List the directories under skills/tutor/domains/ — each directory is a topic.

3. For EACH topic directory found:
   a. Read curriculum.json — extract: topic name, slug, student_level, created date, lessons array (count total, count where status === "completed"), group lessons by module field (count total and completed per module), collect all unique concepts across all lessons, collect concepts from completed lessons only, exit_criteria
   b. Read qa-report.md if it exists — extract the verdict (PASS/PASS_WITH_WARNINGS/FAIL) and overall score

4. From history in progress.json, compute current streak: count consecutive days (ending today or yesterday) that have at least one history entry. If no history, streak is 0.

Return the full data as JSON matching the schema. Include ALL topics found in domains/, not just those in active_topics.`,
  { label: 'gather', phase: 'Gather', schema: DATA_SCHEMA }
)

const topicCount = data?.topics?.length || 0
const totalLessons = (data?.topics || []).reduce((s, t) => s + t.totalLessons, 0)
const completedLessons = (data?.topics || []).reduce((s, t) => s + t.completedLessons, 0)
log('Found ' + topicCount + ' topics, ' + totalLessons + ' lessons (' + completedLessons + ' completed)')

// ── Phase 2: Render ──────────────────────────────────────────

phase('Render')

const dataJson = JSON.stringify(data, null, 2)

await agent(
  'Generate a self-contained HTML dashboard file and write it to ' + outputPath + '.\n\n' +
  '## Data\n```json\n' + dataJson + '\n```\n\n' +
  '## Requirements\n\n' +
  'Build a single HTML file with ALL CSS inline (no external dependencies). The page should include:\n\n' +
  '### 1. Overview Cards Row\n' +
  '4 stat cards in a row: Total Topics, Total Lessons, Completion %, Current Streak (days).\n' +
  'Each card: white background, subtle box-shadow (0 1px 3px rgba(0,0,0,0.12)), rounded corners (8px), padding 24px.\n' +
  'The number should be large (36px, bold, color #2563eb), label below in small gray text.\n\n' +
  '### 2. Per-Topic Progress Section\n' +
  'For each topic: a card with the topic name as header, level badge, created date.\n' +
  'A full-width progress bar showing completed/total lessons (gradient from #2563eb to #7c3aed).\n' +
  'Below it: a row of mini progress bars, one per module, with module name labels.\n' +
  'Show QA verdict badge if available (PASS=#16a34a, PASS_WITH_WARNINGS=#eab308, FAIL=#dc2626).\n' +
  'List exit criteria as a checklist.\n\n' +
  '### 3. Concept Mastery Grid\n' +
  'For each topic: a grid of small pills/tags, one per concept.\n' +
  'Color: #e2e8f0 (not started), #93c5fd (in completed lesson = learned), #2563eb (mastered if topic 100%).\n' +
  'Group by topic with topic name as subheader.\n\n' +
  '### 4. Lesson History Timeline\n' +
  'Show the most recent 20 history entries as a vertical timeline.\n' +
  'Each entry: date on the left, topic + lesson number + engagement on the right.\n' +
  'Use a vertical line with dots. If no history, show "No lessons delivered yet."\n\n' +
  '### 5. Schedule Info Card\n' +
  'Show delivery times, timezone, pacing. Clean card format.\n\n' +
  '### Style Rules\n' +
  '- Font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif\n' +
  '- Background: #f8fafc, text: #1e293b\n' +
  '- Primary: #2563eb, Success: #16a34a, Warning: #eab308, Error: #dc2626\n' +
  '- Max content width: 960px, centered\n' +
  '- Responsive: cards wrap on narrow screens (use CSS grid or flexbox with wrap)\n' +
  '- Page title: "OpenTutor Dashboard"\n' +
  '- Add a header with the OpenTutor name and a "Generated: (today date)" subtitle\n\n' +
  'Write the complete HTML file. It must render correctly when opened in a browser.',
  { label: 'render', phase: 'Render' }
)

log('Dashboard written to ' + outputPath)
return { outputPath, topics: topicCount, lessons: totalLessons, completed: completedLessons }
