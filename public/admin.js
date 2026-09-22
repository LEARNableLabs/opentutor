const $ = (s) => document.querySelector(s);

// ── Auth ───────────────────────────────────────────────────
// Its own password and its own storage key. Sharing either with app.js would
// mean a student who opened the tutor was already holding admin credentials —
// which is the thing the second password exists to prevent.

const KEY = 'opentutor-admin-password';
const secret = {
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  set(v) { try { localStorage.setItem(KEY, v); } catch { /* private mode */ } },
  clear() { try { localStorage.removeItem(KEY); } catch { /* private mode */ } },
};

const nativeFetch = window.fetch.bind(window);

const withSecret = (init, password) => {
  const headers = new Headers(init.headers || {});
  if (password) headers.set('Authorization', `Bearer ${password}`);
  return { ...init, headers };
};

async function api(path, init = {}) {
  let res = await nativeFetch(path, withSecret(init, secret.get()));

  if (res.status === 401) {
    secret.clear();
    const entered = window.prompt('Admin password:');
    if (!entered) return res;
    secret.set(entered);
    res = await nativeFetch(path, withSecret(init, entered));
    if (res.status === 401) secret.clear();
  }

  if (res.status === 503) {
    const { error } = await res.clone().json().catch(() => ({}));
    alert(error || 'Provisioning is not configured on this deployment.');
  }

  return res;
}

// ── Rendering ──────────────────────────────────────────────

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const day = (iso) => (iso ? new Date(iso).toLocaleDateString() : '—');

function studentRow(s) {
  const topics = (s.topics || []).map((t) =>
    `<li><span>${escape(t.topic || t.slug)}</span>
       <span class="admin-bar"><i style="width:${t.percent}%"></i></span>
       <span class="admin-count">${t.completed}/${t.total}</span></li>`).join('');

  return `<article class="admin-card" data-id="${escape(s.id)}">
    <header>
      <div>
        <strong>${escape(s.name || s.id)}</strong>
        <code>${escape(s.id)}</code>
      </div>
      <button class="admin-token" data-id="${escape(s.id)}">Reset access token</button>
      <button class="admin-remove" data-id="${escape(s.id)}" title="Remove this student">Remove</button>
    </header>
    <dl>
      <div><dt>Added</dt><dd>${day(s.provisioned_at)}</dd></div>
      <div><dt>Last session</dt><dd>${day(s.last_session)}</dd></div>
      <div><dt>Lessons done</dt><dd>${s.lessons_completed ?? 0}</dd></div>
    </dl>
    ${topics ? `<ul class="admin-topics">${topics}</ul>` : '<p class="admin-empty">No topics yet.</p>'}
  </article>`;
}

async function refresh() {
  const res = await api('/api/admin/students');
  if (!res.ok) {
    $('#students').innerHTML = '<p class="admin-empty">Could not load students.</p>';
    return;
  }

  const { students } = await res.json();
  if (!students.length) {
    $('#students').innerHTML = '<p class="admin-empty">No students yet. Add one above.</p>';
    return;
  }

  // The list endpoint returns registry entries only; progress needs one call
  // per student. Fine for the tens of students this is built for — batch it
  // server-side if that ever stops being true.
  const detailed = await Promise.all(students.map(async (s) => {
    const r = await api(`/api/admin/students?id=${encodeURIComponent(s.id)}`);
    return r.ok ? r.json() : s;
  }));

  $('#students').innerHTML = detailed.map(studentRow).join('');
}

// ── Actions ────────────────────────────────────────────────

$('#add-student').addEventListener('submit', async (e) => {
  e.preventDefault();
  const error = $('#add-error');
  error.hidden = true;

  const res = await api('/api/admin/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: $('#new-id').value.trim(), name: $('#new-name').value.trim() || undefined }),
  });

  if (!res.ok) {
    error.textContent = (await res.json().catch(() => ({}))).error || `Failed (${res.status})`;
    error.hidden = false;
    return;
  }

  showToken((await res.json()).token);
  $('#new-id').value = '';
  $('#new-name').value = '';
  refresh();
});

$('#students').addEventListener('click', async (e) => {
  const reset = e.target.closest('.admin-token');
  if (reset) {
    if (!window.confirm(`Reset ${reset.dataset.id}'s access token? Their previous token will stop working.`)) return;
    const res = await api(`/api/admin/students?id=${encodeURIComponent(reset.dataset.id)}`, { method: 'PATCH' });
    const data = await res.json();
    if (res.ok) showToken(data.token);
    else alert(data.error || 'Could not reset access token.');
    return;
  }
  const button = e.target.closest('.admin-remove');
  if (!button) return;

  const id = button.dataset.id;
  // Deleting a student deletes their learning history, and nothing restores it.
  if (!window.confirm(`Remove ${id}? This deletes their profile, progress and every lesson they have done. It cannot be undone.`)) return;

  const res = await api(`/api/admin/students?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) alert((await res.json().catch(() => ({}))).error || `Failed (${res.status})`);
  refresh();
});

function showToken(token) {
  $('#student-token-value').value = token;
  $('#student-token').hidden = false;
  $('#student-token-value').focus();
  $('#student-token-value').select();
}

// ── Theme ──────────────────────────────────────────────────

const theme = {
  apply(t) {
    document.documentElement.dataset.theme = t;
    $('#theme-toggle').textContent = t === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('opentutor-theme', t); } catch { /* private mode */ }
  },
};

$('#theme-toggle').addEventListener('click', () => {
  theme.apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

try {
  const saved = localStorage.getItem('opentutor-theme');
  if (saved) theme.apply(saved);
} catch { /* private mode */ }

refresh();
