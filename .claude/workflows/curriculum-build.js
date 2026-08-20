export const meta = {
  name: 'curriculum-build',
  description: 'Build a full curriculum from research — modules, lessons, concept map, teaching notes',
  whenToUse: 'After running the research workflow. Usage: run with args {topic: "optimal transport", level: "intermediate"}',
  phases: [
    { title: 'Read', detail: 'Load research document and existing domain data' },
    { title: 'Design', detail: 'Parallel agents design curriculum structure, concept map, and teaching notes' },
    { title: 'Gate', detail: 'Quality gate checks pedagogical soundness and completeness' },
    { title: 'Assemble', detail: 'Merge designs into final curriculum.json and supporting files' },
  ],
}

const topic = args?.topic
if (!topic) throw new Error('Missing args.topic — pass {topic: "optimal transport", level: "intermediate"}')
const level = args?.level || 'intermediate'

const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const domainDir = `skills/tutor/domains/${slug}`
const researchPath = `${domainDir}/research.md`

// ── Phase 1: Read — load research and templates ───────────────

phase('Read')
log(`Building curriculum for "${topic}" (level: ${level})`)

const reader = await agent(
  `Read the following files and return their contents as a JSON object with keys matching the filenames. If a file doesn't exist, set its value to null.

Files to read:
1. ${researchPath}
2. skills/tutor/references/curriculum-format.md
3. skills/tutor/templates/domain-template.md
4. skills/tutor/references/teaching-method.md
5. workspace/USER.md

Return JSON: {"research": "...", "curriculumFormat": "...", "domainTemplate": "...", "teachingMethod": "...", "userProfile": "..."}`,
  {
    label: 'read-inputs',
    phase: 'Read',
    schema: {
      type: 'object',
      properties: {
        research: { type: ['string', 'null'] },
        curriculumFormat: { type: ['string', 'null'] },
        domainTemplate: { type: ['string', 'null'] },
        teachingMethod: { type: ['string', 'null'] },
        userProfile: { type: ['string', 'null'] },
      },
      required: ['research'],
    },
  }
)

if (!reader?.research) {
  log(`WARNING: No research found at ${researchPath}. Run the research workflow first.`)
}

const ctx = `Topic: "${topic}"
Student level: ${level}
${reader?.research ? `\n## Research\n${reader.research}` : '(no research available — generate from knowledge)'}
${reader?.userProfile ? `\n## Student Profile\n${reader.userProfile}` : ''}
${reader?.curriculumFormat ? `\n## Curriculum Format Reference\n${reader.curriculumFormat}` : ''}
${reader?.teachingMethod ? `\n## Teaching Method Reference\n${reader.teachingMethod}` : ''}`

// ── Phase 2: Design — parallel curriculum design agents ───────

phase('Design')

const DESIGNERS = [
  {
    id: 'structure',
    prompt: `You are a curriculum architect. Design the module structure and lesson sequence for a course on "${topic}" for a ${level} student.

${ctx}

Design requirements:
- 20-30 lessons organized into 4-6 modules
- Each module covers a coherent subtopic
- Each lesson: day number, module name, title (as a question or provocation, NOT a topic label), concepts (2-4 per lesson), resources (real URLs from the research)
- Include review days every 5-7 lessons
- Sequence must respect concept dependencies (prerequisites before dependents)
- Lesson titles should be engaging questions like "Why does moving dirt cost money?" not labels like "Introduction to optimal transport"
- First lessons should be accessible and motivating
- Last lessons should connect to cutting-edge applications

Output as JSON:
{
  "modules": [
    {
      "name": "Module Name",
      "lessons": [
        {
          "day": 1,
          "title": "Why does X happen?",
          "concepts": ["concept1", "concept2"],
          "resources": ["url1", "url2"],
          "status": "pending"
        }
      ]
    }
  ],
  "prerequisites": ["list of external prerequisites"],
  "exit_criteria": ["list of 6-8 things the student should be able to do after completing"]
}`,
  },
  {
    id: 'concept-map',
    prompt: `You are a concept mapping specialist. Create a detailed concept dependency map for a course on "${topic}" for a ${level} student.

${ctx}

Create a concept map covering:
1. **Core concepts** in learning order (numbered, with one-line descriptions and dependencies)
2. **Dependency graph** (ASCII art showing which concepts depend on which)
3. **Bottleneck concepts** — the "gates" where if the student doesn't get it, everything after is shaky
4. **Mind-blowing concepts** — the "aha!" moments that drive engagement (with suggested lesson day)
5. **Common misconceptions** — table of concept, misconception, and reality
6. **Prerequisite topics** — external topics needed and which concepts they enable

Output as markdown following this structure. Be thorough — this map guides the entire course.`,
  },
  {
    id: 'teaching-notes',
    prompt: `You are a pedagogical specialist. Write detailed teaching notes for a course on "${topic}" for a ${level} student.

${ctx}

Write teaching notes covering:
1. **Approach** — How to teach this topic at the ${level} level. What makes it unique pedagogically? Is it visual, algebraic, proof-heavy, experiment-driven?
2. **Common misconceptions** — At least 5 specific misconceptions students have, why they get them wrong, and how to correct them
3. **Level adjustments** — How delivery differs at ${level} vs other levels. What to emphasize, skip, or adjust depth on
4. **Rabbit holes** — 4-6 fascinating tangential connections to drop in during lessons (with suggested timing)
5. **Difficulty progression** — Where the difficulty spikes are and how to manage them
6. **Assessment strategies** — What kinds of exercises work best for each module (multiple choice, open-ended, computation, proof, application)

Output as markdown. Be specific and practical — a tutor bot will use these notes to adapt its delivery.`,
  },
  {
    id: 'resources',
    prompt: `You are a resource curator. Compile a comprehensive resource guide for a course on "${topic}" for a ${level} student.

${ctx}

Organize resources into:
1. **Primary sources** — Main textbooks/courses for lesson content (with URLs, availability, level suitability)
2. **Videos** — Specific channels, series, or episodes (with URLs)
3. **Interactive tools** — Desmos, GeoGebra, simulators, playgrounds (with URLs)
4. **Code** — Repos, notebooks, libraries for hands-on work (with URLs)
5. **People** — Researchers, educators, practitioners to follow
6. **Unexpected connections** — Cross-discipline links for engagement

Rules:
- Only include resources with real, verifiable URLs
- Note which resources are best for which modules/concepts
- Mark free vs paid resources
- Prioritize resources appropriate for ${level} level

Output as markdown.`,
  },
]

const designs = await parallel(
  DESIGNERS.map(d => () =>
    agent(d.prompt, { label: `design:${d.id}`, phase: 'Design' })
  )
)

const [structure, conceptMap, teachingNotes, resources] = designs

// ── Phase 3: Gate — pedagogical quality check ─────────────────

phase('Gate')

const GATE_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string', enum: ['PROCEED', 'ISSUES'] },
    sequencing_ok: { type: 'boolean' },
    coverage_ok: { type: 'boolean' },
    difficulty_curve_ok: { type: 'boolean' },
    issues: { type: 'array', items: { type: 'string' } },
    suggestions: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'issues'],
}

const gate = await agent(
  `You are a pedagogical quality gate. Review a curriculum design for "${topic}" (${level} level).

## Curriculum Structure
${structure || '(missing)'}

## Concept Map
${conceptMap || '(missing)'}

## Teaching Notes
${teachingNotes || '(missing)'}

## Resources
${resources || '(missing)'}

---

Check these dimensions:

1. **Sequencing** — Do prerequisites come before dependents? Are there circular dependencies? Does the concept map match the lesson order?
2. **Coverage** — Does the curriculum cover all key aspects of "${topic}"? Any major gaps?
3. **Difficulty curve** — Is the progression gradual? Any sudden spikes? Are early lessons accessible?
4. **Review placement** — Are review days placed every 5-7 lessons? Are they after difficulty spikes?
5. **Engagement** — Are lesson titles engaging questions/provocations? Do they drive curiosity?
6. **Resource quality** — Are resources real and appropriate for ${level} level?
7. **Exit criteria** — Do exit criteria match what the curriculum actually teaches?

Report as JSON. PROCEED if all major checks pass. ISSUES if there are problems that need fixing.`,
  { label: 'pedagogy-gate', phase: 'Gate', schema: GATE_SCHEMA }
)

log(`Gate: ${gate?.verdict || 'unknown'}, issues: ${gate?.issues?.length || 0}`)

// ── Phase 4: Assemble — write final files ─────────────────────

phase('Assemble')

const assemblePrompt = `You are a curriculum assembler for OpenTutor. Take the following curriculum designs and write them as files.

## Curriculum Structure (from structure agent)
${structure || '(missing)'}

## Quality Gate Assessment
${JSON.stringify(gate, null, 2)}

---

TASK: Create the directory ${domainDir} if it doesn't exist, then write the curriculum to ${domainDir}/curriculum.json

The curriculum.json must follow this exact schema:
{
  "topic": "${topic}",
  "slug": "${slug}",
  "created": "(today's date YYYY-MM-DD)",
  "student_level": "${level}",
  "prerequisites": [...],
  "exit_criteria": [...],
  "lessons": [
    {
      "day": 1,
      "module": "Module Name",
      "title": "Why does X happen?",
      "concepts": ["concept1", "concept2"],
      "resources": ["url1"],
      "status": "pending"
    }
  ]
}

Requirements:
- Flatten the module structure into a flat lessons array, but keep the "module" field on each lesson
- Every lesson must have status: "pending"
- 20-30 lessons total
- Include review days (title like "Review: What have we learned about X?")
${gate?.issues?.length ? '\nFix these issues identified by the quality gate:\n' + gate.issues.map(i => '- ' + i).join('\n') : ''}

Write ONLY the curriculum.json file.`

const writeFiles = await parallel([
  () => agent(assemblePrompt, { label: 'write:curriculum', phase: 'Assemble' }),
  () => agent(
    `Write the following concept map to ${domainDir}/concept-map.md\n\nCreate the directory if needed.\n\n${conceptMap || '(generate a basic concept map for ' + topic + ')'}`,
    { label: 'write:concept-map', phase: 'Assemble' }
  ),
  () => agent(
    `Write the following teaching notes to ${domainDir}/teaching-notes.md\n\nCreate the directory if needed.\n\n${teachingNotes || '(generate basic teaching notes for ' + topic + ')'}`,
    { label: 'write:teaching-notes', phase: 'Assemble' }
  ),
  () => agent(
    `Write the following resources guide to ${domainDir}/resources.md\n\nCreate the directory if needed.\n\n${resources || '(generate a basic resource guide for ' + topic + ')'}`,
    { label: 'write:resources', phase: 'Assemble' }
  ),
])

log(`Curriculum written to ${domainDir}/ (4 files)`)
return { topic, slug, level, domainDir, gate: gate?.verdict, issues: gate?.issues }
