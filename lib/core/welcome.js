// #278: what a returning student sees first — who they are to us, and where each course stands.
// Read from state the store already keeps; no model call.

/** What to call the student: their own words in the profile, then the name on their account. */
export function nameOf(profile, account) {
  const field = (label) => new RegExp(`\\*\\*${label}:\\*\\*[ \\t]*(\\S[^\\n]*)`).exec(profile || '')?.[1].trim();
  // Never an email address, wherever it came from: an account without a name is named by its email.
  const name = [field('What to call them'), field('Name'), account?.name].find((n) => n && !n.includes('@'));
  return name ? name.slice(0, 60) : null;
}

// A damaged lesson record costs the student its line here, never the whole welcome (or onboarding).
function parsed(raw) {
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
}

// The question a saved lesson stopped on, if the record says so plainly; otherwise no line.
function inFlightOf(flight) {
  const lesson = flight?.plan && flight.lesson; // a record without a plan only counts reviews
  const { step, steps } = flight || {};
  if (!lesson || !Number.isSafeInteger(lesson.day) || lesson.day < 1 || typeof lesson.title !== 'string' || !lesson.title.trim()) return null;
  if (!Array.isArray(steps) || !Number.isInteger(step) || step < 0 || step >= steps.length) return null;
  if (!['retrieval', 'diagnostic', 'scaffolding', 'followUp', 'teachBack', 'application'].includes(steps[step])) return null;
  // Continue must resume, not plan a new lesson: lastShown() in api/lesson.js needs one of these.
  const text = (value) => typeof value === 'string' && value.trim().length > 0;
  if (!Array.isArray(flight.history)) return null;
  if (flight.history.some((m) => !['user', 'assistant'].includes(m?.role) || typeof m.content !== 'string')) return null;
  const last = flight.history?.findLast((m) => m.role === 'assistant');
  // Match lastShown's precedence: a malformed saved reply or last assistant turn cannot
  // be rescued here by an earlier valid turn that the lesson route would never use.
  const shown = flight.reply != null ? flight.reply : last ? last.content
    : step === 0 ? (flight.plan.retrieval || flight.plan.diagnostic) : null;
  if (!text(shown)) return null;
  return { day: lesson.day, title: lesson.title, step, steps: steps.length };
}

/** One line for every active course, the one touched last first: how far along, and any lesson in flight. */
export async function whereYouAre(state, progress) {
  const active = progress?.active_topics || [];
  if (!active.length) return [];
  const last = [...(progress?.history || [])].reverse().find((h) => active.includes(h.topic))?.topic;
  // Supabase's batch reader uses one paginated query per table, however many courses
  // are active. Local stores read their course files without database round trips.
  const [topics, lessons] = await Promise.all([
    typeof state.listTopicProgress === 'function' ? state.listTopicProgress()
      : Promise.all(active.map(async (slug) => ({ slug, ...await state.getTopicProgress(slug) }))),
    state.listKV('web_lesson:'),
  ]);
  const bySlug = new Map(topics.map((course) => [course.slug, course]));
  const byKey = new Map(lessons.map(({ key, value }) => [key, value]));
  const courses = active.map((slug) => {
    const course = bySlug.get(slug);
    const raw = byKey.get(`web_lesson:${slug}`);
    if (!course?.topic) return null; // a course whose content is gone has nothing to say
    return {
      slug,
      topic: course.topic,
      completed: course.completed,
      total: course.total,
      next: course.current ? { day: course.current.day ?? course.current.lesson, title: course.current.title } : null,
      inFlight: inFlightOf(parsed(raw)),
    };
  }).filter(Boolean);
  // Unfinished business leads: a lesson in flight (the one in the course touched latest, if several),
  // then the course in the latest history entry. In-flight records carry no time to compare with it.
  const touched = (slug) => (progress?.history || []).findLastIndex((h) => h.topic === slug);
  const lead = courses.filter((c) => c.inFlight).sort((a, b) => touched(b.slug) - touched(a.slug))[0]
    || courses.find((c) => c.slug === last) || courses[0];
  return lead ? [lead, ...courses.filter((c) => c !== lead)] : [];
}

/** GET /api/user, as the Vercel route and the local server both answer it. */
export async function userView(state, account) {
  const profile = await state.readUser();
  const progress = await state.readProgress();
  return {
    profile,
    hasProfile: profile.includes('**Name:**') && !/\*\*Name:\*\*\s*$/m.test(profile),
    onboarded: progress.active_topics?.length > 0,
    welcome: { name: nameOf(profile, account), courses: await whereYouAre(state, progress) },
  };
}
