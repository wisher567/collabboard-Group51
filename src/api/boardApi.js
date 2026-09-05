const API_BASE = 'http://localhost:5000/api';

/**
 * Helper to build headers with auth token if present.
 */
function authHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getBoards() {
  const response = await fetch(`${API_BASE}/boards`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch boards: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getBoard(id) {
  const response = await fetch(`${API_BASE}/boards/${id}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch board ${id}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}


export async function createBoard(title, columns) {
  const defaultColumns = [
    { id: 'col-todo', title: 'To Do' },
    { id: 'col-progress', title: 'In Progress' },
    { id: 'col-done', title: 'Done' },
  ];
  const response = await fetch(`${API_BASE}/boards`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ title, columns: columns || defaultColumns }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create board: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function updateBoard(boardId, updates) {
  const response = await fetch(`${API_BASE}/boards/${boardId}`, {
    method: 'PATCH',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update board: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function addBoardMember(boardId, memberData) {
  const response = await fetch(`${API_BASE}/boards/${boardId}/members`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(memberData),
  });

  if (!response.ok) {
    throw new Error(`Failed to add member: ${response.status} ${response.statusText}`);
  }

  return response.json();
}


export async function updateTask(taskId, updates) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task ${taskId}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function createTask(taskData) {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task ${taskId}: ${response.status} ${response.statusText}`);
  }

  return response.status === 204 ? null : response.json();
}

