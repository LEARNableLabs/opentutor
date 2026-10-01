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
// Markdown, after escaping everything (#271). Links are opt-in: only the tutor's finished lesson and chat
// replies carry them, after the server kept only trusted ones. Anything else shows a link's text.
function md(text, { links = false } = {}) {
  // A finished link is set aside while the rest is formatted, so a * or ` in its URL stays put.
  const anchors = [];
  return escapeHTML(text ?? '')
    .replace(/\[([^\]\n]+)\]\((https?:\/\/(?:[^\s()]|\([^\s()]*\))+)\)/g, (_, label, url) => (links ? `\uE000${anchors.push(`<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`) - 1}\uE001` : label))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Preserve the preceding line boundary until lists and headings have been grouped.
    .replace(/^&gt; ?(.+)$/gm, '<blockquote class="md-quote">$1</blockquote>')
    .replace(/^\d+[.)] (.+)$/gm, '<li class="n">$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (list) => `<ul>${list.replace(/\n/g, '')}</ul>`)
    .replace(/(<li class="n">.*<\/li>\n?)+/g, (list) => `<ol>${list.replace(/\n/g, '').replaceAll(' class="n"', '')}</ol>`)
    .replace(/^#{1,3} (.+)$\n?/gm, '<h4 class="md-h">$1</h4>')
    .replace(/\n*(<blockquote class="md-quote">.*?<\/blockquote>)\n?/g, '$1')
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/\uE000(\d+)\uE001/g, (_, i) => anchors[i] ?? '');
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
    if (btn.dataset.view === 'learn') loadActiveTopics().catch(() => {}); // the picker keeps what it had
    openView = btn.dataset.view;
    // The chat greets when it opens, unless a reply is on its way or the student left a draft there.
    if (openView === 'chat' && !companionFor.chat && !$('#chat-input').value.trim()) companionFor.chat = 'chat-idle';
    showCompanion();
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

// ── Companion (#263, #268) ────────────────────────────────────
// The book with a face, at a few moments: in a lesson, when it starts, while an answer is read, at a right
// answer and at a second miss in a row; in the chat, when it opens and while a reply is written. It steps
// back while the student types, and a tap hides it everywhere for the session. One companion, moved above
// the input of whichever tab it speaks in.
const COMPANION_MOMENTS = {
  idle: ['idle', 'Ready when you are.'],
  thinking: ['thinking', 'Reading your answer.'],
  right: ['right', "That's it. Now it's yours."],
  stuck: ['stuck', 'Try the smallest version of the problem first.'],
  'chat-idle': ['idle', "What's on your mind?"],
  'chat-thinking': ['thinking', 'Thinking it over.'],
};
// #270: what a tap on it says, for what is on screen: only what the page really offers there.
const COMPANION_TIPS = {
  options: 'Tap a suggested answer, or answer in your own words.',
  lesson: 'Answer in your own words. A sentence or two is enough.',
  chat: 'Ask me anything: a question, an example, or a quick explanation.',
};
let companionAway = false;
try { companionAway = sessionStorage.getItem('ot_companion') === 'hidden'; } catch { /* storage may be off */ }
// Each tab keeps its own moment, and only the open tab's is shown (#269): a reply landing in one tab
// never changes what the other shows, and switching back finds the tab as it was left.
const companionFor = { learn: null, chat: null };
let studentName = null; // what the welcome calls them (#278)
let openView = 'learn';
function companion(moment, view = 'learn') {
  companionFor[view] = COMPANION_MOMENTS[moment] ? moment : null;
  if (view === openView) showCompanion();
}
function showCompanion(tip) {
  const el = $('#companion');
  if (!el) return;
  // A tip covers the bubble for now; the tab's own moment stays recorded, and comes back on the next update.
  const known = tip ? ['idle', tip] : COMPANION_MOMENTS[companionFor[openView]];
  if (companionAway || !known) return void el.classList.add('hidden');
  const home = openView === 'chat' ? $('#chat-input-area') : $('#answer-options');
  if (home && el.nextElementSibling !== home) home.parentNode?.insertBefore?.(el, home);
  el.dataset.state = '';
  void el.offsetWidth; // replay a one-shot reaction
  el.dataset.state = known[0];
  // #279: the chat greets a student we know by name.
  $('#companion-says').textContent = !tip && companionFor[openView] === 'chat-idle' && studentName ? `What's on your mind, ${studentName}?` : known[1];
  el.classList.remove('hidden');
}
$('#companion-tip').addEventListener('click', () => {
  const options = !$('#answer-options').classList.contains('hidden') && $('#answer-options').children.length > 0;
  showCompanion(COMPANION_TIPS[openView === 'chat' ? 'chat' : options ? 'options' : 'lesson']);
});
$('#companion-hide').addEventListener('click', () => {
  companionAway = true;
  try { sessionStorage.setItem('ot_companion', 'hidden'); } catch { /* the choice lasts this page anyway */ }
  showCompanion();
});

const lessonInput = $('#lesson-input');
if (lessonInput) {
  lessonInput.addEventListener('input', () => { if (lessonInput.value.trim()) companion(null); });
  lessonInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendLessonAnswer();
    }
  });
}

let activeRefresh;
function loadActiveTopics({ choice = latestChoice } = {}) {
  // Refreshes for the same choice share their result, so every caller waits until
  // the picker is populated. A later choice gets its own request and owns the UI.
  if (activeRefresh?.choice === choice) return activeRefresh.promise;
  const refresh = { choice };
  refresh.promise = readActiveTopics(choice).finally(() => {
    if (activeRefresh === refresh) activeRefresh = null;
  });
  activeRefresh = refresh;
  return refresh.promise;
}

async function readActiveTopics(choice) {
  const asked = ++progressAsked;
  const res = await fetch('/api/progress');
  if (!res.ok) throw new Error('Could not load your topics.'); // keep the list it has
  const data = await res.json();
  showProgress(data, asked); // the numbers go by when they were asked for, not by which choice asked
  // A stale snapshot must not rewrite the picker after a newer course was chosen.
  if (choice !== latestChoice) return null;
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

// ── Progress (#292) ─────────────────────────────────────────
// The streak and this week's lessons, in the header. No lesson yet, or a broken streak, leaves its
// part out: nothing is shown as lost, and never as 0.
let progressStats = {}; // the latest GET /api/progress: the Topics tab reads each topic's accuracy here
// Each request is numbered. An answer to an older request than the one on screen, say one asked
// before a lesson was counted and answered after, changes nothing.
let progressAsked = 0;
let progressShown = 0;
const counted = (n) => Number.isInteger(n) && n > 0;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const streakText = (days) => (counted(days) ? `🔥 ${plural(days, 'day')}` : '');

function showProgress(data, asked) {
  if (asked < progressShown) return;
  progressShown = asked;
  progressStats = data || {};
  const week = counted(data?.lessonsThisWeek) ? `${plural(data.lessonsThisWeek, 'lesson')} this week` : '';
  const line = [streakText(data?.streak), week].filter(Boolean).join(' · ');
  $('#stats-line').textContent = line;
  $('#stats-line').classList.toggle('hidden', !line);
  if (openView === 'topics' && allTopics.length) refreshTopics();
}

// A topic list takes the newer numbers: a lesson finished since it was read moves its card on, count and
// bar included, beside its new accuracy. Counts only grow, so a list or an answer that saw fewer lessons
// moves nothing back. Both orders happen: the numbers arrive after the list, or a slow list after them.
function takeProgress() {
  for (const stat of Array.isArray(progressStats.topics) ? progressStats.topics : []) {
    const topic = allTopics.find((t) => t.slug === stat?.slug);
    if (topic && Number.isInteger(stat.completed) && stat.completed > topic.completed) Object.assign(topic, { completed: stat.completed, total: stat.total, percent: stat.percent });
  }
}

function refreshTopics() {
  takeProgress();
  filterTopics();
}

/** The numbers now: this answer, or a newer one already on screen. Null if this request failed. */
async function loadProgress() {
  const asked = ++progressAsked;
  const res = await fetch('/api/progress');
  if (!res.ok) return null;
  showProgress(await res.json(), asked);
  return progressStats;
}

// Review of #273: two starts can overlap (two course offers, a welcome button and Next lesson).
// The newest one wins: an older one answering late changes nothing on screen.
let lessonStart = 0;
// And the latest thing the student chose, a lesson or a course offered in the chat, is the one that
// opens: a course still being added or built never takes the screen from a later choice.
let latestChoice = 0;
let cancelPendingStart;
function newChoice() {
  cancelPendingStart?.();
  return ++latestChoice;
}

/** Opens the picker's topic: 'opened' with its lesson on screen, 'complete' when it has none left, else null. */
async function startLesson() {
  const slug = $('#active-topic').value;
  if (!slug) return null;

  const choice = newChoice();
  const mine = ++lessonStart;
  const current = () => mine === lessonStart && choice === latestChoice;
  cancelPendingStart = () => {
    if (mine !== lessonStart) return;
    lessonStart++;
    cancelPendingStart = null;
    $('#btn-next').disabled = false;
    $('#lesson-loading').classList.add('hidden');
    $('#lesson-area').classList.add('hidden');
    $('#empty-state').classList.remove('hidden');
  };
  activeTopicSlug = slug;
  lessonActive = false; // the lesson on screen is going away: until this one opens, none takes answers
  showOptions(null); // the last lesson's suggested answers belong to it, however this start goes
  companion(null);
  $('#btn-next').disabled = true;
  $('#lesson-loading').classList.remove('hidden');
  $('#lesson-area').classList.add('hidden');
  $('#empty-state').classList.add('hidden');

  try {
    let bubble = null;
    const data = await streamLesson({ topicSlug: slug }, (chunk) => {
      if (!current()) return;
      if (!bubble) {
        $('#lesson-loading').classList.add('hidden');
        $('#lesson-area').classList.remove('hidden');
        $('#lesson-conversation').innerHTML = '';
        bubble = appendLessonMsg('tutor', '');
      }
      appendToBubble(bubble, chunk);
    });
    if (!current()) return null;

    if (data.done) {
      showCompletion(data.message);
    } else if (bubble) {
      finishLessonStart(data, bubble);
    } else {
      showLessonStart(data);
    }
    return data.done ? 'complete' : 'opened';
  } catch (err) {
    if (current()) showError(err.message);
    return null;
  } finally {
    if (current()) {
      cancelPendingStart = null;
      $('#btn-next').disabled = false;
      $('#lesson-loading').classList.add('hidden');
    }
    loadKeyStatus().catch(() => {});
  }
}

// The stream already painted the reply; just set the surrounding chrome.
function finishLessonStart(data, bubble) {
  lessonActive = true;
  lessonAt = { lessonId: data.lessonId, step: data.step };
  $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}: ${data.lesson.title}`;
  if (!bubble.textContent.trim()) bubble.remove();
  showOptions(data.options);
  companion('idle');
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
  showOptions(data.options);
  companion('idle');
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
  showOptions(null);
  companion('thinking');
  input.value = '';
  input.disabled = true;
  $('#btn-lesson-answer').disabled = true;

  const typing = appendLessonMsg('tutor typing', 'Thinking...');

  // A reply belongs to the lesson it answers: the student may have moved to another topic, or to
  // the next lesson of this one, while it was on its way (#228). So does a failure (#265).
  const topic = activeTopicSlug;
  const sentFor = lessonAt.lessonId;
  const current = () => topic === activeTopicSlug && sentFor === lessonAt.lessonId;
  try {
    let bubble = null;
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
      body.innerHTML = md(data.reply, { links: true });
    }

    companion(data.done ? null : data.mood); // a finished lesson has its own celebration
    if (data.done) {
      lessonActive = false;
      $('#lesson-input-area').classList.add('hidden');
      // #159: a lesson that was not recorded is finished, not celebrated as progress.
      if (data.warning) appendLessonMsg('tutor', `**Lesson finished.** ${data.warning} Choose **Next lesson** to continue.`);
      else showCelebration();
    } else {
      lessonAt = { lessonId: data.lessonId, step: data.step };
      showOptions(data.options);
      const progress = `Step ${data.step + 1}/${data.totalSteps}`;
      $('#lesson-meta').textContent = $('#lesson-meta').textContent.replace(/ — Step.*/, '') + ` — ${progress}`;
    }
  } catch (err) {
    typing.remove();
    if (current()) companion(null);
    appendLessonMsg('tutor', `Error: ${err.message}`);
  } finally {
    input.disabled = false;
    $('#btn-lesson-answer').disabled = false;
    input.focus();
  }
}

// #255: suggested answers for a checking question. A tap sends one as the answer; typing still works.
function showOptions(options) {
  const box = $('#answer-options');
  box.replaceChildren(...(options || []).map((text) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'secondary answer-option';
    option.textContent = text;
    option.addEventListener('click', () => {
      $('#lesson-input').value = text;
      sendLessonAnswer();
    });
    return option;
  }));
  box.classList.toggle('hidden', !options?.length);
}

function showLessonInput() {
  $('#lesson-input-area').classList.remove('hidden');
  $('#lesson-input').focus();
}

function appendLessonMsg(classes, text) {
  const div = document.createElement('div');
  div.className = `lesson-msg ${classes}`;
  if (classes.includes('tutor') && !classes.includes('typing')) {
    div.innerHTML = '<span class="tutor-avatar" aria-hidden="true">✦</span><div>' + md(text, { links: true }) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#lesson-conversation').appendChild(div);
  fitBubbles([div]);
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
  const say = (streak) => `<strong>Lesson complete.</strong>${streak ? ` ${streak} in a row.` : ''} <span class="dim">Choose <strong>Next lesson</strong> when you are ready for the next one.</span>`;
  celebrationDiv.innerHTML = say('');
  container.appendChild(celebrationDiv);
  container.scrollTop = container.scrollHeight;
  // #292: and the streak this lesson kept going, once the server has counted it. It never waits for it.
  loadProgress().then((data) => {
    if (!streakText(data?.streak)) return;
    celebrationDiv.innerHTML = say(streakText(data.streak));
    container.scrollTop = container.scrollHeight;
  }).catch(() => {});
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
  takeProgress();
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
  const focused = document.activeElement?.closest?.('.topic-card')?.dataset.slug; // a redraw keeps a keyboard student's place
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
    if (focused && card.dataset.slug === focused) card.focus();
  });
}

function topicCard(t) {
  // A button, so a keyboard reaches every topic; spans, because a button holds only phrasing content.
  // A course's length until it is started, then how far along it is.
  // #251: how hard it is, and before starting, what to know first.
  const started = t.completed > 0;
  // #292: how a started topic is going lately, once a graded lesson says.
  const accuracy = started && Array.isArray(progressStats.topics) ? progressStats.topics.find((s) => s?.slug === t.slug)?.accuracy : null;
  const level = typeof t.level === 'string' && t.level ? t.level[0].toUpperCase() + t.level.slice(1) : '';
  const before = !started && Array.isArray(t.prerequisites) && t.prerequisites.length ? `Before you start: ${t.prerequisites.join(', ')}. Rusty on any of these? Ask the tutor as you go.` : ''; // it prepares, never gates (#260)
  return `<button type="button" class="topic-card" data-slug="${escapeHTML(t.slug)}">
    <span class="topic-main">
      <span class="topic-name">${escapeHTML(t.topic || formatSlug(t.slug))}</span>
      ${before ? `<span class="topic-before">${escapeHTML(before)}</span>` : ''}
      ${started ? `<span class="progress-bar"><span class="progress-fill" style="width:${Number(t.percent) || 0}%"></span></span>` : ''}
    </span>
    <span class="topic-progress">${started ? `${Number(t.completed)} of ${Number(t.total)} lessons` : `${Number(t.total)} lessons`}${Number.isInteger(accuracy) ? `<span class="topic-accuracy">${accuracy}% accuracy</span>` : ''}${level ? `<span class="topic-level">${escapeHTML(level)}</span>` : ''}</span>
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
  let mine = newChoice();
  try {
    $('#topic-error').textContent = '';
    const data = await requestTopic(slug);
    if (mine !== latestChoice) return;
    mine = newChoice(); // the activation needs a snapshot taken after it completed
    if (data.status !== 'existing') watchTopicBuild(slug);
    await loadActiveTopics({ choice: mine });
    if (mine !== latestChoice) return;
    $('#active-topic').value = slug;
    $$('.nav-btn')[0].click();
    $('#btn-next').focus(); // the list the student chose from is now hidden: land on the next step
  } catch (err) {
    if (mine === latestChoice) $('#topic-error').textContent = err.message;
  }
}

async function addTopic() {
  const topic = $('#new-topic').value.trim();
  if (!topic) return;

  const level = $('#new-level').value;
  let mine = newChoice();
  $('#btn-add').disabled = true;

  try {
    $('#topic-error').textContent = '';
    $('#topic-error').textContent = 'Preparing your starter lessons…';
    const data = await requestTopic(topic, level);
    if (mine !== latestChoice) return;
    mine = newChoice(); // don't reuse a Learn refresh that began before this addition
    $('#topic-error').textContent = '';
    $('#new-topic').value = '';
    await enterNewTopic(data, { choice: mine });
    loadTopics();
    loadActiveTopics();
  } catch (err) {
    if (mine === latestChoice) $('#topic-error').textContent = err.message;
  } finally {
    $('#btn-add').disabled = false;
  }
}

// Build progress survives a page reload: changing the active topic reads its saved job.
let buildTimer;
let watchedBuild;
$('#active-topic').addEventListener('change', () => {
  newChoice();
  watchTopicBuild($('#active-topic').value);
});
$('#btn-retry-build').addEventListener('click', async () => {
  if (!watchedBuild) return;
  const slug = watchedBuild;
  let mine = newChoice();
  $('#btn-retry-build').disabled = true;
  try {
    const data = await requestTopic(slug);
    if (mine !== latestChoice) return;
    mine = newChoice();
    await enterNewTopic(data, { choice: mine });
  }
  catch (err) { if (mine === latestChoice) $('#topic-build-status').textContent = err.message; }
  finally { $('#btn-retry-build').disabled = false; }
});

// From the chat's course offer (#273) the student chose this course: `open` is that choice, and its
// lesson opens even over one in progress, which stays saved, unless something newer was chosen since.
// From Topics, an open lesson is left alone. Says what happened: opened, failed, building or superseded.
async function enterNewTopic(data, { open = 0, choice = open || latestChoice } = {}) {
  const superseded = () => choice !== latestChoice;
  if (superseded()) return 'superseded';
  $$('.nav-btn')[0].click();
  await loadActiveTopics({ choice });
  if (superseded()) return 'superseded';
  let outcome = 'building';
  if (data.lessonCount) {
    $('#active-topic').value = data.slug;
    if (open || !lessonActive) {
      const started = startLesson();
      const startedChoice = latestChoice; // startLesson advances the choice before its first await
      outcome = (await started) || 'failed';
      if (startedChoice !== latestChoice) return 'superseded';
    }
  }
  if (data.status !== 'existing') watchTopicBuild(data.slug, !data.lessonCount, open);
  return outcome;
}

function watchTopicBuild(slug, waitingForStarter = false, open = false) {
  const since = latestChoice; // its starter lessons open only if nothing was chosen after this
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
        await loadActiveTopics();
        if (watchedBuild !== slug) return; // another course took over while the topics loaded
        // Its lessons open when ready, if nothing was chosen since (a lesson still loading counts):
        // over an open lesson when the student chose this course in the chat, else only on an empty page.
        if (latestChoice === since && (open || !lessonActive)) {
          $('#active-topic').value = ready.slug;
          await startLesson();
        }
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
$('#chat-input').addEventListener('input', () => { if ($('#chat-input').value.trim()) companion(null, 'chat'); });
$('#chat-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

async function sendChat() {
  const input = $('#chat-input');
  const message = input.value.trim();
  // One message at a time: Enter waits for the reply, as the disabled Send button does (#269).
  if (!message || $('#btn-send').disabled) return;

  appendChat('user', message);
  companion('chat-thinking', 'chat');
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
    companion(null, 'chat');
    appendChat('assistant', data.reply);
    if (data.course) offerCourse(data.course);
  } catch (err) {
    typing.remove();
    companion(null, 'chat');
    appendChat('assistant', `Error: ${err.message}`);
  } finally {
    $('#btn-send').disabled = false;
    input.focus();
  }
}

// #273: a course the chat offered starts with one tap, through the same add-topic flow as the Topics
// tab. Nothing starts on its own.
function offerCourse(course) {
  const offer = document.createElement('div');
  offer.className = 'chat-msg course-offer';
  const start = document.createElement('button');
  start.type = 'button';
  start.className = 'secondary course-start';
  start.textContent = course.slug ? `📚 Start the course: ${course.topic}` : `📚 Build a course on ${course.topic}`;
  start.addEventListener('click', async () => {
    start.disabled = true;
    let mine = newChoice(); // from the click, so a later click wins whichever answers first
    try {
      const added = await requestTopic(course.slug || course.topic);
      if (mine !== latestChoice) { start.disabled = false; return; }
      mine = newChoice();
      const outcome = await enterNewTopic(added, { open: mine });
      // Said once it is true. Anything else leaves the button for another try (Learn shows a failed start).
      if (outcome === 'opened') appendChat('assistant', `Added **${course.topic}** to your topics. Your first lesson is open in Learn.`);
      else if (outcome === 'building') appendChat('assistant', `Building your course on **${course.topic}**. The first lessons take about a minute: you'll see the progress in Learn.`);
      else if (outcome === 'complete') appendChat('assistant', `You've already finished every lesson in **${course.topic}**. 🎉`);
      else start.disabled = false;
    } catch (err) {
      start.disabled = false;
      appendChat('assistant', err.message);
    }
  });
  offer.appendChild(start);
  $('#chat-messages').appendChild(offer);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
}

function appendChat(classes, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${classes}`;
  if (classes.includes('assistant') && !classes.includes('typing')) {
    div.innerHTML = '<span class="tutor-avatar" aria-hidden="true">✦</span><div>' + md(text, { links: true }) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#chat-messages').appendChild(div);
  fitBubbles([div]);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
  return div;
}

// ── Helpers ─────────────────────────────────────────────────

// #305: a wrapped bubble keeps the whole width it was offered, so it runs on past its longest line.
// Narrowed to that line, a student's bubble is only ever its padding wider than the text. Widths
// are cleared, then all measured, then all set: one layout however many bubbles there are.
function fitBubbles(elements) {
  const bubbles = [...elements].filter((el) => el.matches('.chat-msg.user, .lesson-msg.student'));
  for (const el of bubbles) el.style.width = '';
  const widths = bubbles.map((el) => {
    let right = 0;
    const range = document.createRange();
    const nodes = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (nodes.nextNode()) {
      const node = nodes.currentNode;
      let lines = [];
      if (node.nodeType === Node.TEXT_NODE) {
        range.selectNodeContents(node);
        lines = range.getClientRects();
      } else if (getComputedStyle(node).display === 'inline') {
        lines = node.getClientRects(); // an inline box such as code: its padding and border reach past its text
      }
      for (const line of lines) right = Math.max(right, line.right);
    }
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const gap = box.right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth) - right;
    return right && gap >= 1 ? `${Math.ceil(box.width - gap)}px` : '';
  });
  bubbles.forEach((el, i) => { el.style.width = widths[i]; });
}

// Text re-wraps when its column changes width (a resized window, a turned phone, a view shown
// again), so the bubbles in it are fitted again. A column growing taller as messages arrive isn't.
const columnWidths = new WeakMap();
const bubbleColumns = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    if (columnWidths.get(target) === contentRect.width) continue;
    columnWidths.set(target, contentRect.width);
    fitBubbles(target.children);
  }
});
['#lesson-conversation', '#chat-messages', '#onboarding-chat'].forEach((s) => bubbleColumns.observe($(s)));

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
    else if (data.welcome) showWelcome(data.welcome);
  } catch { /* server might not support it yet */ }
}

// #278: where each course stands, and a button for each thing the student can do next.
// Only over the empty state: a lesson already open (a link, a quick click) keeps the page.
function showWelcome({ name, courses }) {
  studentName = name;
  const title = $('#empty-title');
  if (lessonActive || !title || $('#empty-state').classList.contains('hidden')) return;
  title.textContent = name ? `Welcome back, ${name}.` : 'Welcome back.';
  $('#empty-hint').classList.add('hidden');
  $('#welcome-courses').replaceChildren(...courses.map((course, i) => welcomeCourse(course, i === 0)));
  $('#welcome').classList.remove('hidden');
  showGreeting();
}

// #279: one personal line under the greeting, made once a day. The welcome never waits for it.
async function showGreeting() {
  try {
    const res = await nativeFetch('/api/user?greeting=1'); // optional: a 402 never opens the global connect banner
    const { greeting } = res.ok ? await res.json() : {};
    if (!greeting) return;
    $('#welcome-touch').textContent = greeting;
    $('#welcome-touch').classList.remove('hidden');
  } catch { /* the welcome stands without it */ }
}

function welcomeCourse({ slug, topic, completed, total, next, inFlight }, lead) {
  const item = document.createElement('li');
  const about = document.createElement('div');
  const name = document.createElement('strong');
  name.textContent = topic.split(/\s+[—–]\s+/)[0]; // "Amateur radio — propagation, …" is "Amateur radio"
  const where = document.createElement('p');
  where.className = 'dim';
  const done = `${completed} of ${total} lessons done.`;
  // The title closes the sentence: most are questions, and "…space?". reads badly.
  where.textContent = inFlight ? `${done} You're on question ${inFlight.step + 1} of ${inFlight.steps} in lesson ${inFlight.day}, “${inFlight.title}”`
    : next ? `${done} Next: lesson ${next.day}, “${next.title}”`
    : `All ${total} lessons done. 🎉`;
  about.appendChild(name);
  about.appendChild(where);
  const go = document.createElement('button');
  go.type = 'button';
  go.className = lead ? 'primary' : 'secondary';
  go.textContent = inFlight ? '▶ Continue' : !next ? 'Open' : completed ? '▶ Next lesson' : '▶ Start';
  go.addEventListener('click', () => {
    $('#active-topic').value = slug;
    startLesson();
  });
  item.appendChild(about);
  item.appendChild(go);
  return item;
}

$('#welcome-find').addEventListener('click', () => $('.nav-btn[data-view="topics"]').click());
$('#welcome-ask').addEventListener('click', () => {
  $('.nav-btn[data-view="chat"]').click();
  $('#chat-input').focus();
});

// #167: the dialog is modal, so the page behind it can't be focused or clicked while it is open.
function setOnboarding(open) {
  $('#onboarding-overlay').classList.toggle('hidden', !open);
  $('#app').inert = open;
  if (!open) $('#active-topic').focus(); // focus leaves the closed dialog; "browse" then moves it to search
}

function showOnboarding() {
  setOnboarding(true);
  appendOnboardMsg('assistant', "Hi! I'm OpenTutor 👋 What's your name?");
  $('#onboarding-input').focus();
}

async function sendOnboard() {
  const input = $('#onboarding-input');
  const message = input.value.trim();
  // One answer at a time: a tap or Enter waits for the reply, as the disabled Send button does.
  if (!message || $('#btn-onboard-send').disabled) return;
  if (message.length > TURN_LIMIT) return appendOnboardMsg('assistant', tooLong(message));

  appendOnboardMsg('user', message);
  showOnboardOptions(null);
  input.value = '';
  $('#btn-onboard-send').disabled = true;
  $('#btn-onboard-browse').disabled = true; // closing the card now would leave the reply nowhere to land

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
    // The choices go back as the model wrote them: shown its own questions without them, it stops offering any.
    const offered = data.options?.length ? `\n<OPTIONS>${data.options.join(' | ')}</OPTIONS>` : '';
    onboardingHistory.push({ role: 'assistant', content: data.reply + offered });

    if (data.confirmedTopic) {
      const topic = await requestTopic(data.confirmedTopic);
      await enterNewTopic(topic);
      showTour(); // the student closes it when they have read it
    } else {
      showOnboardOptions(data.options);
    }
  } catch (err) {
    typing.remove();
    appendOnboardMsg('assistant', `Error: ${err.message}`);
  } finally {
    $('#btn-onboard-send').disabled = false;
    $('#btn-onboard-browse').disabled = false;
    if ($('#onboarding-tour').classList.contains('hidden')) input.focus(); // the tour keeps its own focus
  }
}

// #272: a question's choices, as buttons. A tap answers with that text; typing still works.
function showOnboardOptions(options) {
  const box = $('#onboarding-options');
  box.replaceChildren(...(options || []).map((text) => {
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.className = 'secondary answer-option';
    choice.textContent = text;
    choice.addEventListener('click', () => {
      $('#onboarding-input').value = text;
      sendOnboard();
    });
    return choice;
  }));
  box.classList.toggle('hidden', !options?.length);
  $('#onboarding-chat').scrollTop = $('#onboarding-chat').scrollHeight; // the chat got shorter: keep the question in view
}

// Once a course is chosen: a short tour of the tabs in place of the input.
function showTour() {
  for (const id of ['#onboarding-input-area', '#onboarding-options', '#btn-onboard-browse']) $(id).classList.add('hidden');
  $('#onboarding-tour').classList.remove('hidden');
  $('#onboarding-chat').scrollTop = $('#onboarding-chat').scrollHeight;
  $('#btn-tour-start').focus();
}
$('#btn-tour-start').addEventListener('click', () => {
  setOnboarding(false);
  loadActiveTopics().catch(() => {});
  loadTopics();
});

function appendOnboardMsg(classes, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${classes}`;
  if (classes.includes('assistant') && !classes.includes('typing')) {
    div.innerHTML = '<span class="tutor-avatar" aria-hidden="true">✦</span><div>' + md(text) + '</div>';
  } else {
    div.innerHTML = md(text);
  }
  $('#onboarding-chat').appendChild(div);
  fitBubbles([div]);
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
    knowKey(true);
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
  const res = await fetch('/api/openrouter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'disconnect' }) });
  if (res.ok) knowKey(false);
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

// A save, connect or disconnect the server confirmed is the newest status: nothing older may undo it.
function knowKey(connected) {
  keyStatusSeq++;
  chatNeedsKey = !connected;
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
    else knowKey(true);
    if (res.ok && data.freeTier) showConnect({ error: 'Connected, but your OpenRouter account has no credits yet. Add some at openrouter.ai to keep learning.' });
  } catch {
    showConnect({ error: 'Could not connect OpenRouter. Please try again.' });
  }
}

// ── Init ────────────────────────────────────────────────────

async function restoreTopicBuild() {
  const active = await loadActiveTopics();
  if (!active) return; // a newer choice owns the picker and its build recovery
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
