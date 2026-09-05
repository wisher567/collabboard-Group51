const API_BASE = 'http://localhost:5000/api';

function authHeaders(extra = {}) {
  const headers = { ...extra };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getAnalytics(range = '30d') {
  const res = await fetch(`${API_BASE}/analytics?range=${encodeURIComponent(range)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Failed to load analytics: ${res.statusText}`);
  }
  return res.json();
}

export async function resolveBottlenecks(payload = {}) {
  const res = await fetch(`${API_BASE}/analytics/resolve-bottlenecks`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to resolve bottlenecks: ${res.statusText}`);
  }
  return res.json();
}

export function getExportUrl() {
  return `${API_BASE}/analytics/export`;
}
