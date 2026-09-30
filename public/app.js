const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Sessions live in HttpOnly cookies. A single refresh request prevents rotating
// the same refresh token concurrently when multiple API calls return 401.
const nativeFetch = window.fetch.bind(window);
let refreshing;
const refreshSession = () => (refreshing ||= nativeFetch('/api/account', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'refresh'})}).finally(()=>{refreshing=null;}));
window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  let res = await nativeFetch(input, init);
  if (url.startsWith('/api/') && url !== '/api/account' && res.status === 401) {
    const renewed = await refreshSession();
    // An outage is not a sign-out. A fresh response each time: concurrent callers share `renewed`.
    if (renewed.status >= 500) return new Response(JSON.stringify({ error: 'Sign-in is temporarily unavailable. Please try again.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    if(renewed.ok)res=await nativeFetch(input,init);
    if(res.status===401)window.location.assign('/login.html');
  }
  // #132: a 402 means this student needs their own OpenRouter key.
  if (url.startsWith('/api/') && res.status === 402) {
    const body = await res.clone().json().catch(() => null);
    if (body?.connect) showConnect(body);
  }
  return res;
};
$('#btn-signout').addEventListener('click', async () => {
  const res=await nativeFetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});
  if(res.ok){localStorage.removeItem('opentutor-password');window.location.assign('/');}
});
// #160: shown only to self-signup accounts; the operator removes everyone else.
$('#btn-delete-account').addEventListener('click', async () => {
  if (prompt('This permanently deletes your account and all your learning data. Type DELETE to confirm.') !== 'DELETE') return;
  const remove = () => nativeFetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', confirm: 'DELETE' }) }).catch(() => null);
  let res = await remove();
  // The wrapper above skips /api/account, so an expired session is refreshed here, once,
  // and the confirmed delete retried without asking again.
  if (res?.status === 401) {
    const renewed = await refreshSession().catch(() => null);
    if (!renewed || renewed.status >= 500) return alert('Sign-in is temporarily unavailable. Please try again.');
    if (!renewed.ok) return window.location.assign('/login.html');
    res = await remove();
  }
  if (res?.ok) return window.location.assign('/?deleted=1');
  alert((await res?.json().catch(() => null))?.error || 'Your account could not be deleted. Please try again.');
});

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
      else if (event === 'error') {
        if (data.connect) showConnect(data);
        throw new Error(data.error || 'Lesson failed');
      }
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
  themeToggle.textContent = 'Light theme';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = 'Dark theme';
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = 'Light theme';
    localStorage.setItem('theme', 'dark');
  }
});

// ── Markdown rendering (minimal, no dependencies) ──────────

// Escape first, then add the few tags markdown needs: replies are model output and
// the student's own text, and neither is ever parsed as HTML (#150).
function md(text) {
  return escapeHTML(text ?? '')
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
    view.style.display = btn.dataset.view === 'chat' ? 'flex' : 'block'; // the chat is a column: messages, then input

    if (btn.dataset.view === 'topics') loadTopics();
    if (btn.dataset.view === 'learn') loadActiveTopics();
    if (btn.dataset.view === 'chat') offerKeyForChat();
    else if (chatOffer) {
      chatOffer = false;
      $('#connect-banner').classList.add('hidden');
    }
  });
});

// ── Learn view (Socratic multi-turn) ────────────────────────

let activeTopicSlug = null;
let lessonActive = false;
// Which lesson and step the student is answering (#228): the server refuses an answer for another.
let lessonAt = {};
let topicPicked = false;

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
  if (!res.ok) throw new Error('Could not load your topics.'); // keep the list it has
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
  // #203: a returning student lands on the topic of their latest lesson, not on "Select a topic".
  // Once per page view: an empty picker after that is the student's own choice.
  else if ((prev || !topicPicked) && data.active_topics?.length) {
    const latest = [...(data.history || [])].reverse().find((h) => data.active_topics.includes(h.topic))?.topic;
    select.value = latest || data.active_topics[0];
    const title = $('#empty-title'); // absent once an error message has replaced the empty state
    if (title) title.textContent = 'Ready for your next lesson?'; // the picker above names the topic
  }
  topicPicked = true;
  return data.active_topics || [];
}

async function startLesson() {
  const slug = $('#active-topic').value;
  if (!slug) return;

  activeTopicSlug = slug;
  $('#btn-next').disabled = true;
  $('#lesson-loading').classList.remove('hidden');
  $('#lesson-area').classList.add('hidden');
  $('#empty-state').classList.add('hidden');

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
    loadKeyStatus().catch(() => {});
  }
}

// The stream already painted the reply; just set the surrounding chrome.
function finishLessonStart(data, bubble) {
  lessonActive = true;
  lessonAt = { lessonId: data.lessonId, step: data.step };
  $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}: ${data.lesson.title}`;
  if (!bubble.textContent.trim()) bubble.remove();
  showLessonInput();
}

function showLessonStart(data) {
  lessonActive = true;
  lessonAt = { lessonId: data.lessonId, step: data.step };
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}: ${data.lesson.title}`;
  $('#lesson-conversation').innerHTML = '';

  // #159: a reload resumes the lesson in progress, at its last tutor message.
  if (data.resumed) appendLessonMsg('dim', 'Picking up where you left off.');
  if (data.note) appendLessonMsg('dim', data.note); // e.g. a review before moving on (#149)
  appendLessonMsg('tutor', data.reply);
  showLessonInput();
}

// The server refuses a longer turn (lib/core/llm-access.js). Say so here, and keep the text in its box.
const TURN_LIMIT = 4000;
const tooLong = (text) => `Please shorten this to 4,000 characters or fewer (it has ${text.length.toLocaleString('en-US')}). Your text is still in the box.`;

async function sendLessonAnswer() {
  const input = $('#lesson-input');
  const answer = input.value.trim();
  if (!answer || !activeTopicSlug || !lessonActive) return;
  if (answer.length > TURN_LIMIT) return appendLessonMsg('tutor', tooLong(answer));

  appendLessonMsg('student', answer);
  input.value = '';
  input.disabled = true;
  $('#btn-lesson-answer').disabled = true;

  const typing = appendLessonMsg('tutor typing', 'Thinking...');

  try {
    let bubble = null;
    // A reply belongs to the lesson it answers: the student may have moved to another topic, or to
    // the next lesson of this one, while it was on its way (#228).
    const topic = activeTopicSlug;
    const sentFor = lessonAt.lessonId;
    const current = () => topic === activeTopicSlug && sentFor === lessonAt.lessonId;
    const data = await streamLesson({ topicSlug: topic, answer, ...lessonAt }, (chunk) => {
      if (!current()) return;
      if (!bubble) { typing.remove(); bubble = appendLessonMsg('tutor', ''); }
      appendToBubble(bubble, chunk);
    });
    if (!current()) return;
    if (!bubble) { typing.remove(); appendLessonMsg('tutor', data.reply); }
    else if (typeof data.reply === 'string') {
      // The server's reply is the one to keep: it is cleaned of anything the stream let through (#224).
      const body = bubble.querySelector?.('div') || bubble;
      body.dataset.raw = data.reply;
      body.innerHTML = md(data.reply);
    }

    if (data.done) {
      lessonActive = false;
      $('#lesson-input-area').classList.add('hidden');
      // #159: a lesson that was not recorded is finished, not celebrated as progress.
      if (data.warning) appendLessonMsg('tutor', `**Lesson finished.** ${data.warning} Choose **Next lesson** to continue.`);
      else showCelebration();
    } else {
      lessonAt = { lessonId: data.lessonId, step: data.step };
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
    div.innerHTML = '<span class="tutor-avatar" aria-hidden="true">✦</span><div>' + md(text) + '</div>';
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
  celebrationDiv.innerHTML = '<strong>Lesson complete.</strong> <span class="dim">Choose <strong>Next lesson</strong> when you are ready for the next one.</span>';
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
  if (!res.ok) throw new Error('Could not load topics.');
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
    html += `<p class="topic-group">In progress (${progress.length})</p>`;
    html += progress.map(topicCard).join('');
  }

  if (available.length) html += `<p class="topic-group">Not started (${available.length})</p>`;
  html += available.slice(0, 50).map(topicCard).join('');

  if (available.length > 50) {
    html += `<p class="topic-group">Showing 50 of ${available.length}. Search to find the rest.</p>`;
  }

  list.innerHTML = html || '<p class="topic-group">No topics found.</p>';

  list.querySelectorAll('.topic-card').forEach((card) => {
    card.addEventListener('click', () => selectTopic(card.dataset.slug));
  });
}

function topicCard(t) {
  // A button, so a keyboard reaches every topic; spans, because a button holds only phrasing content.
  // A course's length until it is started, then how far along it is.
  const started = t.completed > 0;
  return `<button type="button" class="topic-card" data-slug="${escapeHTML(t.slug)}">
    <span class="topic-main">
      <span class="topic-name">${escapeHTML(t.topic || formatSlug(t.slug))}</span>
      ${started ? `<span class="progress-bar"><span class="progress-fill" style="width:${Number(t.percent) || 0}%"></span></span>` : ''}
    </span>
    <span class="topic-progress">${started ? `${Number(t.completed)} of ${Number(t.total)} lessons` : `${Number(t.total)} lessons`}</span>
  </button>`;
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
    const data = await requestTopic(slug);
    if (data.status !== 'existing') watchTopicBuild(slug);
    await loadActiveTopics();
    $('#active-topic').value = slug;
    $$('.nav-btn')[0].click();
    $('#btn-next').focus(); // the list the student chose from is now hidden: land on the next step
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
    $('#topic-error').textContent = 'Preparing your starter lessons…';
    const data = await requestTopic(topic, level);
    $('#topic-error').textContent = '';
    $('#new-topic').value = '';
    await enterNewTopic(data);
    loadTopics();
    loadActiveTopics();
  } catch (err) {
    $('#topic-error').textContent = err.message;
  } finally {
    $('#btn-add').disabled = false;
  }
}

// Build progress survives a page reload: changing the active topic reads its saved job.
let buildTimer;
let watchedBuild;
$('#active-topic').addEventListener('change', () => watchTopicBuild($('#active-topic').value));
$('#btn-retry-build').addEventListener('click', async () => {
  if (!watchedBuild) return;
  $('#btn-retry-build').disabled = true;
  try { await enterNewTopic(await requestTopic(watchedBuild)); }
  catch (err) { $('#topic-build-status').textContent = err.message; }
  finally { $('#btn-retry-build').disabled = false; }
});

async function enterNewTopic(data) {
  $$('.nav-btn')[0].click();
  await loadActiveTopics();
  if (data.lessonCount) {
    $('#active-topic').value = data.slug;
    if (!lessonActive) await startLesson();
  }
  if (data.status !== 'existing') watchTopicBuild(data.slug, !data.lessonCount);
}

function watchTopicBuild(slug, waitingForStarter = false) {
  clearTimeout(buildTimer);
  watchedBuild = slug;
  $('#topic-build-status').textContent = '';
  $('#btn-retry-build').classList.add('hidden');
  if (!slug) return;
  async function poll() {
    try {
      const res = await fetch(`/api/topic-build?slug=${encodeURIComponent(slug)}`);
      if (watchedBuild !== slug) return;
      if (res.status === 404) return;
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not read curriculum progress.');
      const phases = { quick: 'Preparing starter lessons', plan: 'Planning the full course', build: 'Writing the full course', critique: 'Reviewing the full course' };
      $('#topic-build-status').textContent = data.status === 'ready'
        ? (data.approved ? 'Full curriculum ready.' : 'Full curriculum ready; some review feedback remains.')
        : data.status === 'failed' ? (data.lessonCount ? 'The full curriculum could not finish. Your available lessons are saved.' : 'Starter lessons could not be prepared. Retry to try again.')
        : `${phases[data.phase] || 'Preparing your course'}…${data.lessonCount ? ' You can keep learning.' : ''}`;
      $('#btn-retry-build').classList.toggle('hidden', data.status !== 'failed');
      if (waitingForStarter && data.lessonCount) {
        waitingForStarter = false;
        const ready = await requestTopic(slug);
        if (watchedBuild !== slug) return;
        await loadActiveTopics(); $('#active-topic').value = ready.slug;
        if (!lessonActive) await startLesson();
      }
      if (['ready', 'failed'].includes(data.status)) return;
    } catch (err) {
      if (watchedBuild !== slug) return;
      $('#topic-build-status').textContent = err.message;
      $('#btn-retry-build').classList.remove('hidden');
      return;
    }
    if (watchedBuild === slug) buildTimer = setTimeout(poll, 3000);
  }
  poll();
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
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
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
    div.innerHTML = '<span class="tutor-avatar" aria-hidden="true">✦</span><div>' + md(text) + '</div>';
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
  setOnboarding(false);
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
    if (!res.ok) return; // unknown is not "no profile": never onboard a returning student by mistake
    const data = await res.json();
    // A student with topics was onboarded, whatever the profile says (#155).
    if (!data.hasProfile && !data.onboarded) showOnboarding();
  } catch { /* server might not support it yet */ }
}

// #167: the dialog is modal, so the page behind it can't be focused or clicked while it is open.
function setOnboarding(open) {
  $('#onboarding-overlay').classList.toggle('hidden', !open);
  $('#app').inert = open;
  if (!open) $('#active-topic').focus(); // focus leaves the closed dialog; "browse" then moves it to search
}

function showOnboarding() {
  setOnboarding(true);
  appendOnboardMsg('assistant', "Hey! I'm OpenTutor. What's your name? And are you here for school, work, or the noble art of internet rabbit holes?");
  $('#onboarding-input').focus();
}

async function sendOnboard() {
  const input = $('#onboarding-input');
  const message = input.value.trim();
  if (!message) return;
  if (message.length > TURN_LIMIT) return appendOnboardMsg('assistant', tooLong(message));

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
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    typing.remove();
    appendOnboardMsg('assistant', data.reply);
    onboardingHistory.push({ role: 'assistant', content: data.reply });

    if (data.confirmedTopic) {
      const topic = await requestTopic(data.confirmedTopic);
      await enterNewTopic(topic);

      setTimeout(() => {
        setOnboarding(false);
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
    div.innerHTML = '<span class="tutor-avatar" aria-hidden="true">✦</span><div>' + md(text) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#onboarding-chat').appendChild(div);
  $('#onboarding-chat').scrollTop = $('#onboarding-chat').scrollHeight;
  return div;
}

// ── OpenRouter (#132): 3 free lessons, then the student's own key ──

function showConnect({ error }) {
  chatOffer = false; // whatever shows the banner now owns it
  $('#connect-message').textContent = error;
  $('#connect-banner').classList.remove('hidden');
}

$('#btn-connect').addEventListener('click', async () => {
  $('#btn-connect').disabled = true;
  try {
    const res = await fetch('/api/openrouter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'start' }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.url) return window.location.assign(data.url);
    $('#connect-message').textContent = data.error || 'Could not reach OpenRouter. Please try again.';
  } catch {
    $('#connect-message').textContent = 'Could not reach OpenRouter. Please try again.';
  } finally {
    $('#btn-connect').disabled = false;
  }
});
// #246: or paste a key. The server checks it with OpenRouter before keeping it.
$('#key-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const key = $('#key-input').value.trim();
  if (!key) return;
  $('#key-input').value = ''; // read once: a secret must not stay in the page, whatever the answer
  $('#btn-save-key').disabled = true;
  try {
    const res = await fetch('/api/openrouter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save', key }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return void ($('#connect-message').textContent = data.error || 'Could not save the key. Please try again.');
    if (data.freeTier) showConnect({ error: 'Saved, but your OpenRouter account has no credits yet. Add some at openrouter.ai to keep learning.' });
    else $('#connect-banner').classList.add('hidden');
    loadKeyStatus().catch(() => {});
  } catch {
    $('#connect-message').textContent = 'Could not save the key. Please try again.';
  } finally {
    $('#btn-save-key').disabled = false;
  }
});
$('#btn-connect-browse').addEventListener('click', () => {
  $('#connect-banner').classList.add('hidden');
  $('.nav-btn[data-view="topics"]').click();
});
$('#btn-disconnect').addEventListener('click', async () => {
  await fetch('/api/openrouter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) });
  showConnect({ error: 'Disconnected. To revoke the key itself, delete it in your OpenRouter settings (openrouter.ai/settings/keys).' });
  loadKeyStatus().catch(() => {});
});

// #250: the chat always runs on the student's own key, so say so before they type.
let chatNeedsKey = null; // unknown until a key status loads
let chatOffer = false; // the banner is up because the chat put it there
let keyStatusSeq = 0; // only the newest status request may update the page
async function offerKeyForChat() {
  if (chatNeedsKey === null) await loadKeyStatus().catch(() => {});
  // The student may have left Chat while it loaded, and another message may already hold the banner.
  if (!chatNeedsKey || !$('#view-chat').classList.contains('active')) return;
  if (!$('#connect-banner').classList.contains('hidden')) return;
  showConnect({ error: 'Chatting with OpenTutor uses your own OpenRouter key. Connect your account or paste a key to start.' });
  chatOffer = true;
}

// Only self-signup accounts get an answer; anyone else sees nothing.
async function loadKeyStatus() {
  const seq = ++keyStatusSeq;
  const res = await fetch('/api/openrouter');
  if (seq !== keyStatusSeq) return;
  // 403: the owner and admin-created students chat on the deployment's key. Any other failure
  // leaves the status unknown, so opening Chat asks again.
  if (res.status === 403) chatNeedsKey = false;
  if (!res.ok) return;
  const s = await res.json();
  if (seq !== keyStatusSeq) return;
  chatNeedsKey = !s.connected;
  $('#key-status').textContent = s.connected ? 'OpenRouter connected' : `${s.trialLessonsLeft} of ${s.trialLessons} free lessons left`;
  $('#key-status').classList.remove('hidden');
  $('#btn-disconnect').classList.toggle('hidden', !s.connected);
}

// OpenRouter sends the student back to learn.html?code=… once they approve.
async function finishConnect() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return;
  params.delete('code');
  const rest = params.toString();
  window.history.replaceState(null, '', window.location.pathname + (rest ? `?${rest}` : ''));
  try {
    const res = await fetch('/api/openrouter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'connect', code }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) showConnect({ error: data.error || 'Could not connect OpenRouter. Please try again.' });
    else if (data.freeTier) showConnect({ error: 'Connected, but your OpenRouter account has no credits yet. Add some at openrouter.ai to keep learning.' });
  } catch {
    showConnect({ error: 'Could not connect OpenRouter. Please try again.' });
  }
}

// ── Init ────────────────────────────────────────────────────

async function restoreTopicBuild() {
  const active = await loadActiveTopics();
  try {
    const res = await fetch('/api/topic-build');
    if (!res.ok) return;
    const builds = await res.json();
    const pending = builds.find((b) => b.status !== 'ready' || !active.includes(b.slug));
    if (pending && !watchedBuild) watchTopicBuild(pending.slug, !active.includes(pending.slug));
  } catch { /* Topics remains available if status cannot be fetched. */ }
}
async function initializeLearning() {
  // A 5xx is an outage, not a sign-out: stay here and say so (the catch below) instead of going to login.
  const current = await nativeFetch('/api/account');
  if (current.status >= 500) throw new Error('Sign-in is unavailable');
  const session = await current.json();
  let user = session.user;
  if(!user&&!session.local) {
    const refreshed=await nativeFetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'refresh'})});
    if (refreshed.status >= 500) throw new Error('Sign-in is unavailable');
    if(!refreshed.ok){window.location.replace('/login.html'+window.location.search);return;}
    user = (await refreshed.json().catch(() => ({}))).user; // a returning student arrives here
  }
  if (user?.id?.startsWith('acct-')) $('#btn-delete-account').classList.remove('hidden');
  await finishConnect();
  await restoreTopicBuild();
  const topic = new URLSearchParams(window.location.search).get('topic');
  // A link may only pre-select a ready-made topic; building a custom one must be the student's own click.
  if (topic && /^[a-z0-9-]{1,80}$/.test(topic)) {
    const catalog = await fetch('/api/catalog').then((r) => (r.ok ? r.json() : [])).catch(() => []);
    if (Array.isArray(catalog) && catalog.some((t) => t.slug === topic)) await selectTopic(topic);
  }
  localStorage.removeItem('opentutor-pending-topic');
  checkOnboarding();
  loadKeyStatus().catch(() => {});
}
initializeLearning().catch(()=>{ $('#empty-state').textContent='Could not load your workspace. Please refresh to try again.'; });

function escapeHTML(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
