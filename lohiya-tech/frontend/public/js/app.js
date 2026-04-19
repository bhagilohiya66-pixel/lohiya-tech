/* =========================================
   LOHIYA TECH — Global Utilities
   ========================================= */

const API_BASE = '/api';

// ── Token Management ──
const Auth = {
  setToken: (token) => localStorage.setItem('lt_token', token),
  getToken: () => localStorage.getItem('lt_token'),
  removeToken: () => localStorage.removeItem('lt_token'),

  setUser: (user) => localStorage.setItem('lt_user', JSON.stringify(user)),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('lt_user')); }
    catch { return null; }
  },
  removeUser: () => localStorage.removeItem('lt_user'),

  isLoggedIn: () => !!localStorage.getItem('lt_token'),

  logout: () => {
    Auth.removeToken();
    Auth.removeUser();
    window.location.href = '/';
  },

  requireAuth: () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = '/login';
      return false;
    }
    return true;
  },

  requireGuest: () => {
    if (Auth.isLoggedIn()) {
      window.location.href = '/dashboard';
      return false;
    }
    return true;
  }
};

// ── API Helper ──
const api = {
  async request(method, endpoint, data = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const token = Auth.getToken();
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (data) options.body = JSON.stringify(data);

    const res = await fetch(`${API_BASE}${endpoint}`, options);
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json;
  },

  get: (endpoint) => api.request('GET', endpoint),
  post: (endpoint, data) => api.request('POST', endpoint, data),
  put: (endpoint, data) => api.request('PUT', endpoint, data),
  delete: (endpoint) => api.request('DELETE', endpoint),
};

// ── Toast Notifications ──
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 4000) {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span style="margin-right:8px">${type === 'success' ? '✓' : '✗'}</span>
      ${message}
    `;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success: (msg) => Toast.show(msg, 'success'),
  error: (msg) => Toast.show(msg, 'error'),
};

// ── Navbar Logic ──
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }

  // Update nav based on auth state
  const navAuth = document.getElementById('nav-auth');
  if (navAuth) {
    if (Auth.isLoggedIn()) {
      const user = Auth.getUser();
      navAuth.innerHTML = `
        <li><a href="/dashboard">Dashboard</a></li>
        ${user?.role === 'admin' ? '<li><a href="/admin">Admin</a></li>' : ''}
        <li>
          <button class="btn btn-outline btn-sm" onclick="logoutUser()">Logout</button>
        </li>
      `;
    } else {
      navAuth.innerHTML = `
        <li><a href="/login">Login</a></li>
        <li><a href="/register"><button class="btn btn-primary btn-sm">Get Started</button></a></li>
      `;
    }
  }
}

async function logoutUser() {
  try { await api.post('/auth/logout'); } catch {}
  Auth.logout();
}

// ── Form Helpers ──
function showLoading(btn, text = 'Processing...') {
  btn.dataset.originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="loader"></span> ${text}`;
}

function hideLoading(btn) {
  btn.disabled = false;
  btn.innerHTML = btn.dataset.originalText;
}

function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (input) input.classList.add('error');
  if (error) { error.textContent = message; error.classList.add('show'); }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  if (input) input.classList.remove('error');
  if (error) { error.textContent = ''; error.classList.remove('show'); }
}

function clearAllErrors(form) {
  form.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(e => { e.textContent = ''; e.classList.remove('show'); });
}

// ── Relative Time ──
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', initNavbar);
