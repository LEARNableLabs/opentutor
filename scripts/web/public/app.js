const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ── Navigation ──────────────────────────────────────────────

$$('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.nav-btn').forEach((b) => b.classList.remove('active'));
    $$('.view').forEach((v) => v.classList.remove('active'));
    btn.classList.add('active');
    $(`#view-${btn.dataset.view}`).classList.add('active');

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
  select.innerHTML = '<option value="">Select a topic...</option>';
  for (const slug of data.active_topics || []) {
    const opt = document.createElement('option');
    opt.value = slug;
    opt.textContent = slug.replace(/-/g, ' ');
    select.appendChild(opt);
  }
}

async function deliverLesson() {
  const slug = $('#active-topic').value;
  if (!slug) return;

  $('#btn-next').disabled = true;
  $('#lesson-loading').classList.remove('hidden');
  $('#lesson-content').textContent = '';
  $('#lesson-meta').textContent = '';

  try {
    const res = await fetch('/api/lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicSlug: slug }),
    });
    const data = await res.json();

    if (data.done) {
      $('#lesson-content').textContent = data.message;
    } else {
      $('#lesson-meta').textContent = `${data.lesson.module} — Day ${data.lesson.day}: ${data.lesson.title}`;
      $('#lesson-content').textContent = data.content;
    }
  } catch (err) {
    $('#lesson-content').textContent = `Error: ${err.message}`;
  } finally {
    $('#btn-next').disabled = false;
    $('#lesson-loading').classList.add('hidden');
  }
}

// ── Topics view ─────────────────────────────────────────────

$('#btn-add').addEventListener('click', addTopic);

async function loadTopics() {
  const res = await fetch('/api/topics');
  const topics = await res.json();
  const list = $('#topic-list');

  if (!topics.length) {
    list.innerHTML = '<p style="color: var(--text-dim)">No topics yet. Add one below.</p>';
    return;
  }

  list.innerHTML = topics.map((t) => `
    <div class="topic-card">
      <div>
        <div class="topic-name">${t.topic}</div>
        <div class="progress-bar"><div class="progress-fill" style="width: ${t.percent}%"></div></div>
      </div>
      <div class="topic-progress">${t.completed}/${t.total} (${t.percent}%)</div>
    </div>
  `).join('');
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

    if (data.status === 'existing') {
      alert(`${topic} — already have ${data.lessonCount} lessons. Ready to learn!`);
    } else {
      alert(`${topic} — curriculum building in background. Switch to Learn to start!`);
    }

    loadTopics();
    loadActiveTopics();
  } catch (err) {
    alert(`Error: ${err.message}`);
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

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    appendChat('assistant', data.reply);
  } catch (err) {
    appendChat('assistant', `Error: ${err.message}`);
  } finally {
    $('#btn-send').disabled = false;
    input.focus();
  }
}

function appendChat(role, text) {
  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  $('#chat-messages').appendChild(div);
  $('#chat-messages').scrollTop = $('#chat-messages').scrollHeight;
}

// ── Init ────────────────────────────────────────────────────

loadActiveTopics();
