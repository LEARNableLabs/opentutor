const search = document.querySelector('#catalog-search'),
  list = document.querySelector('#catalog-list'),
  status = document.querySelector('#catalog-status'),
  more = document.querySelector('#show-more');
let topics = [],
  limit = 24;
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
    meta.textContent = `${topic.total} lessons · Preview +`;
    summary.append(title, meta);
    card.append(summary);
    const lessons = document.createElement('ol');
    for (const name of topic.preview) {
      const li = document.createElement('li');
      li.textContent = name;
      lessons.append(li);
    }
    const link = document.createElement('a');
    link.className = 'text-link';
    link.href = `/login.html?mode=signup&topic=${encodeURIComponent(topic.slug)}`;
    link.textContent = 'Learn this topic ↗';
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
      const link = document.querySelector('#account-link');
      link.href = '/learn.html';
      link.textContent = 'Continue learning ↗';
      document.querySelector('#login-link').hidden = true;
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
