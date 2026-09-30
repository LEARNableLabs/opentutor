// #160: where the learn page sends a student who deleted their account. First, so it needs
// nothing else on the page; the flag leaves the address so a reload doesn't repeat it.
const query = new URLSearchParams(location.search);
if (query.get('deleted') === '1') {
  document.querySelector('#deleted-notice').textContent =
    'Your account and learning data have been deleted.';
  query.delete('deleted');
  const rest = query.toString();
  history.replaceState(null, '', location.pathname + (rest ? `?${rest}` : '') + location.hash);
}
const search = document.querySelector('#catalog-search'),
  list = document.querySelector('#catalog-list'),
  status = document.querySelector('#catalog-status'),
  more = document.querySelector('#show-more');
let topics = [],
  limit = 24,
  signedIn = false; // a signed-in visitor goes to their lessons, not to signup
const learnLink = (topic) => '/learn.html' + (topic ? `?topic=${encodeURIComponent(topic)}` : '');
function render() {
  const term = search.value.trim().toLowerCase(),
    matches = topics.filter((t) => `${t.topic} ${t.slug}`.toLowerCase().includes(term));
  list.replaceChildren();
  for (const topic of matches.slice(0, limit)) {
    const card = document.createElement('details');
    card.className = 'catalog-card';
    const summary = document.createElement('summary'),
      title = document.createElement('h3'),
      meta = document.createElement('span');
    title.textContent = topic.topic;
    meta.className = 'catalog-meta';
    const count = document.createElement('span');
    count.textContent = `${topic.total} lessons`;
    meta.append(count);
    // #251: how hard it is, and what to know first.
    if (topic.level) {
      const level = document.createElement('span');
      level.textContent = topic.level[0].toUpperCase() + topic.level.slice(1);
      meta.append(level);
    }
    summary.append(title, meta);
    card.append(summary);
    if (topic.prerequisites?.length) {
      const before = document.createElement('p');
      before.className = 'catalog-before';
      before.textContent = `Before you start: ${topic.prerequisites.join(', ')}. Rusty on any of these? Ask the tutor as you go.`; // it prepares, never gates (#260)
      card.append(before);
    }
    const lessons = document.createElement('ol');
    for (const name of topic.preview) {
      const li = document.createElement('li');
      li.textContent = name;
      lessons.append(li);
    }
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = signedIn ? learnLink(topic.slug) : `/login.html?mode=signup&topic=${encodeURIComponent(topic.slug)}`;
    link.textContent = 'Start this topic';
    card.append(lessons, link);
    list.append(card);
  }
  status.textContent = matches.length
    ? `${Math.min(limit, matches.length)} of ${matches.length} topics`
    : 'No matches yet. Try a broader search.';
  more.hidden = limit >= matches.length;
}
search.addEventListener('input', () => {
  limit = 24;
  render();
});
more.addEventListener('click', () => {
  limit += 24;
  render();
});
fetch('/api/catalog')
  .then((r) => {
    if (!r.ok) throw Error();
    return r.json();
  })
  .then((data) => {
    topics = data;
    document.querySelector('#topic-count').textContent = data.length;
    render();
  })
  .catch(() => {
    status.textContent = 'The library could not load. Please refresh to try again.';
  });
fetch('/api/account')
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (data?.user) {
      signedIn = true;
      for (const id of ['#account-link', '#hero-signup', '#closing-signup']) {
        const link = document.querySelector(id);
        link.href = learnLink();
        link.textContent = 'Continue learning';
      }
      const demo = document.querySelector('#demo-signup'); // continues the example's topic
      demo.href = learnLink(new URLSearchParams(demo.href.split('?')[1]).get('topic'));
      demo.textContent = 'Continue this lesson';
      document.querySelector('#login-link').hidden = true;
      if (topics.length) render();
    }
  })
  .catch(() => {});

// The example lesson (#153): one real reply per browser, then signup to continue it.
// Without JavaScript the card keeps its static sample exchange.
const demoForm = document.querySelector('#demo-form'),
  demoAnswer = document.querySelector('#demo-answer'),
  demoThread = document.querySelector('#demo-thread'),
  demoNext = document.querySelector('#demo-next'),
  DEMO_USED = 'opentutor-demo-used';
function demoUsed() {
  try {
    return !!localStorage.getItem(DEMO_USED);
  } catch {
    return false;
  }
}
// Text only, never HTML: the reply is model output (#150).
function tutorSays(text) {
  const row = document.createElement('div'),
    dot = document.createElement('span'),
    line = document.createElement('p');
  row.className = 'conversation';
  dot.className = 'tutor-dot';
  dot.setAttribute('aria-hidden', 'true');
  dot.textContent = '✦';
  line.textContent = text;
  row.append(dot, line);
  demoThread.append(row);
  return line;
}
document.querySelector('#demo-sample').hidden = true;
if (demoUsed()) demoNext.hidden = false;
else demoForm.hidden = false;
demoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const answer = demoAnswer.value.trim();
  if (!answer) return;
  demoForm.hidden = true;
  const mine = document.createElement('div');
  mine.className = 'sample-answer';
  mine.textContent = answer;
  demoThread.append(mine);
  const reply = tutorSays('…');
  let text = 'The tutor could not reply just now.';
  try {
    const res = await fetch('/api/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
    if (res.status === 429)
      text = 'The demo is busy right now. Create a free account to try a full lesson.';
    else {
      const data = await res.json();
      if (res.ok && typeof data.reply === 'string') {
        text = data.reply;
        try {
          localStorage.setItem(DEMO_USED, '1');
        } catch {
          /* storage refused: the server's per-address cap still applies */
        }
      }
    }
  } catch {
    /* unreachable or not JSON: keep the generic message */
  }
  reply.textContent = text;
  demoNext.hidden = false;
});
