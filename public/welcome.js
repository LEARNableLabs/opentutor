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
