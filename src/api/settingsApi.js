const API_BASE = 'http://localhost:5000/api';

function authHeaders(extra = {}) {
  const headers = { ...extra };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to load settings: ${res.statusText}`);
  }
  return res.json();
}

export async function updateSettings(updates) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error(`Failed to save settings: ${res.statusText}`);
  }
  return res.json();
}

export async function resetNotificationDefaults() {
  const res = await fetch(`${API_BASE}/settings/reset-notifications`, {
    method: 'POST',
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to reset notifications: ${res.statusText}`);
  }
  return res.json();
}
