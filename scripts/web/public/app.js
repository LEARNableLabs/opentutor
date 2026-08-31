const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

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

// ── Learn view ──────────────────────────────────────────────

$('#btn-next').addEventListener('click', deliverLesson);

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

async function deliverLesson() {
  const slug = $('#active-topic').value;
  if (!slug) return;

  $('#btn-next').disabled = true;
  $('#lesson-loading').classList.remove('hidden');
  $('#lesson-area').classList.add('hidden');
  $('#empty-state').classList.add('hidden');

  try {
    const res = await fetch('/api/lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicSlug: slug }),
    });
    const data = await res.json();

    if (data.done) {
      showCompletion(data.message);
    } else {
      showLesson(data);
    }
  } catch (err) {
    showError(err.message);
  } finally {
    $('#btn-next').disabled = false;
    $('#lesson-loading').classList.add('hidden');
  }
}

function showLesson(data) {
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}`;

  const chunks = parseLessonChunks(data.content);
  const container = $('#lesson-chunks');
  container.innerHTML = '';

  const ANCHOR_TYPES = { '📖': '', '🧠': 'concept', '💡': 'example', '✏️': 'exercise', '🔗': '' };

  let exerciseChunk = null;

  chunks.forEach((chunk, i) => {
    const div = document.createElement('div');
    div.className = `lesson-chunk ${ANCHOR_TYPES[chunk.anchor] || ''}`;
    div.innerHTML = md(stripAnswerKey(chunk.text));
    div.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(div);

    if (chunk.anchor === '✏️' || (!exerciseChunk && i === chunks.length - 1)) {
      exerciseChunk = chunk;
    }
  });

  // Parse exercise and show buttons
  const correct = parseCorrectAnswer(data.content);
  const options = parseExerciseOptions(exerciseChunk?.text || '');

  if (options.length >= 2) {
    showExercise(options, correct);
  } else {
    $('#exercise-area').classList.add('hidden');
  }
}

function showExercise(options, correct) {
  const area = $('#exercise-area');
  const btns = $('#exercise-buttons');
  const feedback = $('#exercise-feedback');

  area.classList.remove('hidden');
  feedback.textContent = '';
  feedback.className = '';
  btns.innerHTML = '';

  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'exercise-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      const letter = opt.charAt(0);
      const allBtns = btns.querySelectorAll('.exercise-btn');
      allBtns.forEach((b) => {
        b.disabled = true;
        const bLetter = b.textContent.charAt(0);
        if (correct && bLetter === correct) b.classList.add('correct', 'reveal');
        else if (bLetter === letter && letter !== correct) b.classList.add('incorrect');
      });

      if (correct && letter === correct) {
        feedback.textContent = 'Correct! Nice one.';
        feedback.className = 'correct';
      } else if (correct) {
        feedback.textContent = `Not quite — the answer is ${correct}. Think about why.`;
        feedback.className = 'incorrect';
      } else {
        feedback.textContent = `You picked ${letter}. Let's keep going!`;
      }
    });
    btns.appendChild(btn);
  });
}

function showCompletion(msg) {
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = 'Complete';
  $('#lesson-chunks').innerHTML = `<div class="lesson-chunk">${md(msg)}</div>`;
  $('#exercise-area').classList.add('hidden');
}

function showError(msg) {
  $('#lesson-area').classList.remove('hidden');
  $('#lesson-meta').textContent = 'Error';
  $('#lesson-chunks').innerHTML = `<div class="lesson-chunk" style="color: var(--error)">${msg}</div>`;
  $('#exercise-area').classList.add('hidden');
}

// ── Lesson parsing helpers ──────────────────────────────────

const ANCHORS = ['📖', '🧠', '💡', '✏️', '🔗'];

function parseLessonChunks(text) {
  const chunks = [];
  const lines = text.split('\n');
  let current = null;

  for (const line of lines) {
    const anchor = ANCHORS.find((a) => line.trimStart().startsWith(a));
    if (anchor) {
      if (current) chunks.push(current);
      current = { anchor, text: line + '\n' };
    } else if (current) {
      current.text += line + '\n';
    } else if (line.trim()) {
      current = { anchor: null, text: line + '\n' };
    }
  }
  if (current) chunks.push(current);
  return chunks.map((c) => ({ ...c, text: c.text.trim() }));
}

function stripAnswerKey(text) {
  return text
    .replace(/^\s*(?:correct|answer)\s*(?:is)?\s*[:\s]\s*\(?[A-D]\)?\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseCorrectAnswer(text) {
  const patterns = [
    /(?:correct|answer)\s*(?:is)?[:\s]*\(?([A-D])\)?/i,
    /\b([A-D])\b\s*(?:is\s+)?(?:the\s+)?(?:correct|right)\b/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

function parseExerciseOptions(text) {
  const options = [];
  const pattern = /^[*\-•]?\s*\**([A-D])[.):\s]+\**\s*(.+)$/gm;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    options.push(`${m[1]}. ${m[2].replace(/\*\*/g, '').trim()}`);
  }
  if (options.length < 2) {
    const simple = /\b([A-D])[.)]\s+(.+)/gm;
    while ((m = simple.exec(text)) !== null) {
      const opt = `${m[1]}. ${m[2].trim()}`;
      if (!options.includes(opt)) options.push(opt);
    }
  }
  return options;
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

async function selectTopic(slug) {
  const res = await fetch('/api/add-topic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: slug, level: 'intermediate' }),
  });
  await res.json();
  await loadActiveTopics();
  $('#active-topic').value = slug;
  $$('.nav-btn')[0].click();
}

async function addTopic() {
  const topic = $('#new-topic').value.trim();
  if (!topic) return;

  const level = $('#new-level').value;
  $('#btn-add').disabled = true;

  try {
    const res = await fetch('/api/add-topic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, level }),
    });
    const data = await res.json();
    $('#new-topic').value = '';
    loadTopics();
    loadActiveTopics();
  } catch (err) {
    console.error('Add topic failed:', err);
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
  div.innerHTML = md(text);
  $('#chat-messages').appendChild(div);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
  return div;
}

// ── Helpers ─────────────────────────────────────────────────

function formatSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Init ────────────────────────────────────────────────────

loadActiveTopics();
