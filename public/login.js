const $ = (s) => document.querySelector(s),
  params = new URLSearchParams(location.search);
const allowed = ['login', 'signup', 'forgot', 'reset', 'legacy'];
let mode = allowed.includes(params.get('mode')) ? params.get('mode') : 'login';
const topic = params.get('topic') || localStorage.getItem('opentutor-pending-topic');
if (topic && /^[a-z0-9-]{1,80}$/.test(topic))
  localStorage.setItem('opentutor-pending-topic', topic);
const next =
  '/learn.html' +
  (topic && /^[a-z0-9-]{1,80}$/.test(topic) ? `?topic=${encodeURIComponent(topic)}` : '');
const code = params.get('code');
if (code) history.replaceState(null, '', `/login.html?mode=${mode}`);
function configure() {
  const signup = mode === 'signup',
    forgot = mode === 'forgot',
    reset = mode === 'reset',
    legacy = mode === 'legacy';
  $('#auth-title').textContent = signup
    ? 'Create your account'
    : forgot
      ? 'Reset your password'
      : reset
        ? 'Choose a new password'
        : legacy
          ? 'Use existing access'
          : 'Log in to OpenTutor';
  $('#auth-eyebrow').textContent = signup ? 'Make space for curiosity' : 'Your learning, continued';
  $('#auth-description').textContent = signup
    ? 'Start with a question. Keep growing from there.'
    : forgot
      ? 'We’ll email you a link to choose a new password.'
      : reset
        ? 'Choose a password you haven’t used before.'
        : legacy
          ? 'For students invited with a token, or a self-hosted instance.'
          : 'Welcome back. Pick up where you left off.';
  $('#name-field').hidden = !signup;
  $('#email-field').hidden = legacy || reset;
  $('#email').required = !legacy && !reset;
  $('#password-field').hidden = forgot || legacy;
  $('#password').required = !forgot && !legacy;
  $('#password').minLength = signup || reset ? 12 : 1;
  $('#password').autocomplete = signup || reset ? 'new-password' : 'current-password';
  $('#password-help').hidden = !signup && !reset;
  $('#credential-field').hidden = !legacy;
  $('#credential').required = legacy;
  $('#auth-submit').textContent = signup
    ? 'Create account ↗'
    : forgot
      ? 'Send reset link ↗'
      : reset
        ? 'Save password ↗'
        : 'Log in ↗';
  $('#forgot-link').hidden = mode !== 'login';
  $('#legacy-link').hidden = legacy;
  $('#switch-copy').replaceChildren();
  const link = document.createElement('a');
  link.textContent = signup ? 'Already have an account? Log in' : 'New here? Create an account';
  link.href = `?mode=${signup ? 'login' : 'signup'}${topic ? `&topic=${encodeURIComponent(topic)}` : ''}`;
  $('#switch-copy').append(link);
}
async function action(body) {
  const res = await fetch('/api/account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw Error(data.error || 'Please try again.');
  return data;
}
$('#account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  $('#auth-submit').disabled = true;
  $('#auth-status').textContent = '';
  try {
    const data = await action({
      action: mode,
      email: $('#email').value,
      name: $('#name').value,
      password: $('#password').value,
      credential: $('#credential').value,
    });
    $('#password').value = '';
    $('#credential').value = '';
    if (data.message) {
      $('#auth-status').textContent = data.message;
      return;
    }
    localStorage.removeItem('opentutor-password');
    location.assign(next);
  } catch (error) {
    $('#auth-status').textContent = error.message;
  } finally {
    $('#auth-submit').disabled = false;
  }
});
configure();
(async () => {
  if (code) {
    $('#auth-submit').disabled = true;
    $('#auth-status').textContent = 'Verifying your email link…';
    try {
      const verified = await action({ action: 'callback', code });
      localStorage.removeItem('opentutor-password');
      if (!verified.recovery) {
        location.replace(next);
        return;
      }
      mode = 'reset';
      configure();
      $('#auth-status').textContent = 'Email verified. Enter your new password.';
    } catch (error) {
      $('#auth-status').textContent = error.message;
    } finally {
      $('#auth-submit').disabled = false;
    }
    return;
  }
  const response = await fetch('/api/account');
  if (!response.ok) return;
  const data = await response.json();
  if (data.user && mode === 'login') location.replace(next);
  if (!data.available && mode !== 'legacy') {
    $('#auth-status').textContent =
      'Email accounts are not configured on this installation. Browse topics or use existing access.';
    $('#auth-submit').disabled = true;
    if (data.local) {
      const link = document.createElement('a');
      link.href = next;
      link.textContent = 'Open local workspace ↗';
      $('#auth-status').append(document.createElement('br'), link);
    }
  }
})().catch(() => {
  $('#auth-status').textContent = 'Could not check sign-in availability. Please try again.';
});
