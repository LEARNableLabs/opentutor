// #278: what a returning student sees first — who they are to us, and where each course stands.
// Read from state the store already keeps; no model call.

const MAX_COURSES = 5;

/** What to call the student: their own words in the profile, then the name on their account. */
export function nameOf(profile, account) {
  const field = (label) => new RegExp(`\\*\\*${label}:\\*\\*[ \\t]*(\\S[^\\n]*)`).exec(profile || '')?.[1].trim();
  const own = field('What to call them') || field('Name');
  const signedUpAs = /@/.test(account?.name || '') ? '' : account?.name; // an account without a name is named by its email
  return (own || signedUpAs || '').slice(0, 60) || null;
}

// A damaged lesson record costs the student its line here, never the whole welcome (or onboarding).
function parsed(raw) {
  try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { return null; }
}

/** One line per active course, the one touched last first: how far along, and any lesson in flight. */
export async function whereYouAre(state, progress) {
  const active = (progress?.active_topics || []).slice(0, MAX_COURSES);
  const last = [...(progress?.history || [])].reverse().find((h) => active.includes(h.topic))?.topic;
  // In parallel: on Supabase each course is a few round trips.
  const courses = (await Promise.all(active.map(async (slug) => {
    const [course, raw] = await Promise.all([state.getTopicProgress(slug), state.readKV(`web_lesson:${slug}`)]);
    if (!course?.topic) return null; // a course whose content is gone has nothing to say
    const flight = parsed(raw);
    const lesson = flight?.plan && flight.lesson; // a record without a plan only counts reviews
    return {
      slug,
      topic: course.topic,
      completed: course.completed,
      total: course.total,
      next: course.current ? { day: course.current.day ?? course.current.lesson, title: course.current.title } : null,
      inFlight: lesson ? { day: lesson.day, title: lesson.title, step: flight.step, steps: flight.steps?.length ?? 3 } : null,
    };
  }))).filter(Boolean);
  const first = courses.findIndex((c) => c.slug === last);
  const lead = first >= 0 ? first : Math.max(0, courses.findIndex((c) => c.inFlight));
  return courses.length ? [courses[lead], ...courses.filter((_, i) => i !== lead)] : [];
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
