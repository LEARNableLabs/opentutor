const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ── Auth ───────────────────────────────────────────────────
// One shared password (OPENTUTOR_PASSWORD on the server), remembered per browser.
// Wrapping fetch once covers every /api call rather than threading a header
// through each of them.

const PASSWORD_KEY = 'opentutor-password';
const store = {
  get() { try { return localStorage.getItem(PASSWORD_KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(PASSWORD_KEY, v); } catch { /* private mode */ } },
  clear() { try { localStorage.removeItem(PASSWORD_KEY); } catch { /* private mode */ } },
};

const nativeFetch = window.fetch.bind(window);

function withPassword(init, password) {
  const headers = new Headers(init.headers || {});
  if (password) headers.set('Authorization', `Bearer ${password}`);
  return { ...init, headers };
}

window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  if (!url.startsWith('/api/')) return nativeFetch(input, init);

  let res = await nativeFetch(input, withPassword(init, store.get()));

  if (res.status === 401) {
    store.clear();
    const entered = window.prompt('Password for this OpenTutor instance:');
    if (!entered) return res;
    store.set(entered);
    res = await nativeFetch(input, withPassword(init, entered));
    if (res.status === 401) store.clear();
  }

  if (res.status === 503) {
    // The server is deployed without a password configured, and refuses to serve.
    const { error } = await res.clone().json().catch(() => ({}));
    alert(error || 'This deployment is not configured yet.');
  }

  return res;
};

// ── Streaming ──────────────────────────────────────────────
// POST + SSE (EventSource cannot POST). `onToken` fires per chunk; the promise
// resolves with the final payload, so callers keep the shape they already had.

async function streamLesson(body, onToken) {
  const res = await fetch('/api/lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `Request failed (${res.status})`);
  if (!res.headers.get('content-type')?.includes('text/event-stream')) return res.json();

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = null;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let cut;
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);

      const event = frame.match(/^event: (.+)$/m)?.[1];
      const raw = frame.match(/^data: ([\s\S]*)$/m)?.[1];
      if (!event || raw === undefined) continue;

      const data = JSON.parse(raw);
      if (event === 'token') onToken(data);
      else if (event === 'done') result = data;
      else if (event === 'error') throw new Error(data.error || 'Lesson failed');
    }
  }

  if (!result) throw new Error('Connection ended before the reply finished');
  return result;
}

// Append streamed text to a bubble, re-rendering markdown as it grows.
function appendToBubble(bubble, chunk) {
  const body = bubble.querySelector('div') || bubble;
  body.dataset.raw = (body.dataset.raw || '') + chunk;
  body.innerHTML = md(body.dataset.raw);
  const conv = $('#lesson-conversation');
  conv.scrollTop = conv.scrollHeight;
}

// ── Theme toggle ───────────────────────────────────────────

const themeToggle = $('#theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});

// ── Markdown rendering (minimal, no dependencies) ──────────

function md(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ── Navigation ──────────────────────────────────────────────

let allTopics = [];

$$('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.nav-btn').forEach((b) => b.classList.remove('active'));
    $$('.view').forEach((v) => { v.classList.remove('active'); v.style.display = 'none'; });
    btn.classList.add('active');
    const view = $(`#view-${btn.dataset.view}`);
    view.classList.add('active');
    view.style.display = 'block';

    if (btn.dataset.view === 'topics') loadTopics();
    if (btn.dataset.view === 'learn') loadActiveTopics();
  });
});

// ── Learn view (Socratic multi-turn) ────────────────────────

let activeTopicSlug = null;
let lessonActive = false;

$('#btn-next').addEventListener('click', startLesson);
$('#btn-lesson-answer').addEventListener('click', sendLessonAnswer);

const lessonInput = $('#lesson-input');
if (lessonInput) {
  lessonInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendLessonAnswer();
    }
  });
}

async function loadActiveTopics() {
  const res = await fetch('/api/progress');
  const data = await res.json();
  const select = $('#active-topic');
  const prev = select.value;
  select.innerHTML = '<option value="">Select a topic...</option>';
  for (const slug of data.active_topics || []) {
    const opt = document.createElement('option');
    opt.value = slug;
    opt.textContent = formatSlug(slug);
    select.appendChild(opt);
  }
  if (prev && data.active_topics?.includes(prev)) select.value = prev;
}

async function startLesson() {
  const slug = $('#active-topic').value;
  if (!slug) return;

  activeTopicSlug = slug;
  $('#btn-next').disabled = true;
  $('#lesson-loading').classList.remove('hidden');
  $('#lesson-area').classList.add('hidden');
  $('#empty-state').classList.add('hidden');
  $('#lesson-complete').classList.add('hidden');

  try {
    let bubble = null;
    const data = await streamLesson({ topicSlug: slug }, (chunk) => {
      if (!bubble) {
        $('#lesson-loading').classList.add('hidden');
        $('#lesson-area').classList.remove('hidden');
        $('#lesson-conversation').innerHTML = '';
        bubble = appendLessonMsg('tutor', '');
      }
      appendToBubble(bubble, chunk);
    });

    if (data.done) {
      showCompletion(data.message);
    } else if (bubble) {
      finishLessonStart(data, bubble);
    } else {
      showLessonStart(data);
    }
  } catch (err) {
    showError(err.message);
  } finally {
    $('#btn-next').disabled = false;
    $('#lesson-loading').classList.add('hidden');
  }
}

// The stream already painted the reply; just set the surrounding chrome.
function finishLessonStart(data, bubble) {
  lessonActive = true;
  $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}: ${data.lesson.title}`;
  $('#lesson-complete').classList.add('hidden');
  if (!bubble.textContent.trim()) bubble.remove();
  showLessonInput();
}

function showLessonStart(data) {
  lessonActive = true;
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}: ${data.lesson.title}`;
  $('#lesson-conversation').innerHTML = '';
  $('#lesson-complete').classList.add('hidden');

  appendLessonMsg('tutor', data.reply);
  showLessonInput();
}

async function sendLessonAnswer() {
  const input = $('#lesson-input');
  const answer = input.value.trim();
  if (!answer || !activeTopicSlug || !lessonActive) return;

  appendLessonMsg('student', answer);
  input.value = '';
  input.disabled = true;
  $('#btn-lesson-answer').disabled = true;

  const typing = appendLessonMsg('tutor typing', 'Thinking...');

  try {
    let bubble = null;
    const data = await streamLesson({ topicSlug: activeTopicSlug, answer }, (chunk) => {
      if (!bubble) { typing.remove(); bubble = appendLessonMsg('tutor', ''); }
      appendToBubble(bubble, chunk);
    });
    if (!bubble) { typing.remove(); appendLessonMsg('tutor', data.reply); }

    if (data.done) {
      lessonActive = false;
      $('#lesson-input-area').classList.add('hidden');
      showCelebration();
    } else {
      const progress = `Step ${data.step + 1}/${data.totalSteps}`;
      $('#lesson-meta').textContent = $('#lesson-meta').textContent.replace(/ — Step.*/, '') + ` — ${progress}`;
    }
  } catch (err) {
    typing.remove();
    appendLessonMsg('tutor', `Error: ${err.message}`);
  } finally {
    input.disabled = false;
    $('#btn-lesson-answer').disabled = false;
    input.focus();
  }
}

function showLessonInput() {
  $('#lesson-input-area').classList.remove('hidden');
  $('#lesson-input').focus();
}

function appendLessonMsg(classes, text) {
  const div = document.createElement('div');
  div.className = `lesson-msg ${classes}`;
  if (classes.includes('tutor') && !classes.includes('typing')) {
    div.innerHTML = '<span class="tutor-avatar">🎓</span><div>' + md(text) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#lesson-conversation').appendChild(div);
  $('#lesson-conversation').scrollTop = $('#lesson-conversation').scrollHeight;
  return div;
}

function showCompletion(msg) {
  lessonActive = false;
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = 'Complete';
  $('#lesson-conversation').innerHTML = '';
  appendLessonMsg('tutor', msg);
  $('#lesson-input-area').classList.add('hidden');
  showCelebration();
}

function showCelebration() {
  const container = $('#lesson-conversation') || $('#lesson-area');
  const celebrationDiv = document.createElement('div');
  celebrationDiv.className = 'lesson-celebration';
  celebrationDiv.innerHTML = `
    <div class="celebration-icon">🌟</div>
    <div class="celebration-text">
      <strong>Lesson complete!</strong><br>
      <span class="dim">You're making progress. See you next time.</span>
    </div>
  `;
  container.appendChild(celebrationDiv);
  container.scrollTop = container.scrollHeight;
}

function showError(msg) {
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = 'Error';
  $('#lesson-conversation').innerHTML = '';
  appendLessonMsg('tutor', msg);
  $('#lesson-input-area').classList.add('hidden');
}

// ── Topics view ─────────────────────────────────────────────

$('#btn-add').addEventListener('click', addTopic);
$('#search-topics').addEventListener('input', filterTopics);

async function loadTopics() {
  const res = await fetch('/api/topics');
  allTopics = await res.json();
  renderTopics(allTopics);
}

function filterTopics() {
  const q = $('#search-topics').value.toLowerCase();
  if (!q) return renderTopics(allTopics);
  renderTopics(allTopics.filter((t) =>
    t.topic?.toLowerCase().includes(q) || t.slug?.toLowerCase().includes(q)
  ));
}

function renderTopics(topics) {
  const list = $('#topic-list');
  const progress = topics.filter((t) => t.completed > 0);
  const available = topics.filter((t) => t.completed === 0);

  let html = '';

  if (progress.length) {
    html += `<div class="dim" style="font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;font-weight:600">In Progress (${progress.length})</div>`;
    html += progress.map(topicCard).join('');
    html += '<div style="height:16px"></div>';
  }

  html += `<div class="dim" style="font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px;font-weight:600">Available (${available.length})</div>`;
  html += available.slice(0, 50).map(topicCard).join('');

  if (available.length > 50) {
    html += `<div class="dim" style="text-align:center;padding:12px;font-size:13px">Showing 50 of ${available.length} — use search to find more</div>`;
  }

  list.innerHTML = html || '<div class="dim" style="padding:20px;text-align:center">No topics found</div>';

  list.querySelectorAll('.topic-card').forEach((card) => {
    card.addEventListener('click', () => selectTopic(card.dataset.slug));
  });
}

function topicCard(t) {
  return `<div class="topic-card" data-slug="${t.slug}">
    <div>
      <div class="topic-name">${t.topic || formatSlug(t.slug)}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${t.percent}%"></div></div>
    </div>
    <div class="topic-progress">${t.completed}/${t.total}<br>${t.percent}%</div>
  </div>`;
}

async function requestTopic(topic, level = 'intermediate') {
  const res = await fetch('/api/add-topic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, level }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Could not add topic (${res.status}).`);
  return data;
}

async function selectTopic(slug) {
  try {
    $('#topic-error').textContent = '';
    await requestTopic(slug);
    await loadActiveTopics();
    $('#active-topic').value = slug;
    $$('.nav-btn')[0].click();
  } catch (err) {
    $('#topic-error').textContent = err.message;
  }
}

async function addTopic() {
  const topic = $('#new-topic').value.trim();
  if (!topic) return;

  const level = $('#new-level').value;
  $('#btn-add').disabled = true;

  try {
    $('#topic-error').textContent = '';
    await requestTopic(topic, level);
    $('#new-topic').value = '';
    loadTopics();
    loadActiveTopics();
  } catch (err) {
    $('#topic-error').textContent = err.message;
  } finally {
    $('#btn-add').disabled = false;
  }
}

// ── Chat view ───────────────────────────────────────────────

$('#btn-send').addEventListener('click', sendChat);
$('#chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

async function sendChat() {
  const input = $('#chat-input');
  const message = input.value.trim();
  if (!message) return;

  appendChat('user', message);
  input.value = '';
  $('#btn-send').disabled = true;

  const typing = appendChat('assistant typing', 'Thinking...');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    typing.remove();
    appendChat('assistant', data.reply);
  } catch (err) {
    typing.remove();
    appendChat('assistant', `Error: ${err.message}`);
  } finally {
    $('#btn-send').disabled = false;
    input.focus();
  }
}

function appendChat(classes, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${classes}`;
  if (classes.includes('assistant') && !classes.includes('typing')) {
    div.innerHTML = '<span class="tutor-avatar">🎓</span><div>' + md(text) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#chat-messages').appendChild(div);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
  return div;
}

// ── Helpers ─────────────────────────────────────────────────

function formatSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Onboarding ─────────────────────────────────────────────

let onboardingHistory = [];

$('#btn-onboard-send').addEventListener('click', sendOnboard);
$('#btn-onboard-browse').addEventListener('click', () => {
  $('#onboarding-overlay').classList.add('hidden');
  $('.nav-btn[data-view="topics"]').click();
  $('#search-topics').focus();
});
$('#onboarding-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendOnboard();
  }
});

async function checkOnboarding() {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    if (!data.hasProfile) {
      showOnboarding();
    }
  } catch { /* server might not support it yet */ }
}

function showOnboarding() {
  const overlay = $('#onboarding-overlay');
  overlay.classList.remove('hidden');
  appendOnboardMsg('assistant', "Hey! I'm your study buddy. What's your name? And are you here for school, work, or the noble art of internet rabbit holes?");
  $('#onboarding-input').focus();
}

async function sendOnboard() {
  const input = $('#onboarding-input');
  const message = input.value.trim();
  if (!message) return;

  appendOnboardMsg('user', message);
  input.value = '';
  $('#btn-onboard-send').disabled = true;

  onboardingHistory.push({ role: 'user', content: message });
  const typing = appendOnboardMsg('assistant typing', 'Thinking...');

  try {
    const res = await fetch('/api/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: onboardingHistory.slice(0, -1) }),
    });
    const data = await res.json();
    typing.remove();
    appendOnboardMsg('assistant', data.reply);
    onboardingHistory.push({ role: 'assistant', content: data.reply });

    if (data.confirmedTopic) {
      await requestTopic(data.confirmedTopic);

      setTimeout(() => {
        $('#onboarding-overlay').classList.add('hidden');
        loadActiveTopics();
        loadTopics();
      }, 2000);
    }
  } catch (err) {
    typing.remove();
    appendOnboardMsg('assistant', `Error: ${err.message}`);
  } finally {
    $('#btn-onboard-send').disabled = false;
    input.focus();
  }
}

function appendOnboardMsg(classes, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${classes}`;
  if (classes.includes('assistant') && !classes.includes('typing')) {
    div.innerHTML = '<span class="tutor-avatar">🎓</span><div>' + md(text) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#onboarding-chat').appendChild(div);
  $('#onboarding-chat').scrollTop = $('#onboarding-chat').scrollHeight;
  return div;
}

// ── Init ────────────────────────────────────────────────────

loadActiveTopics();
checkOnboarding();
