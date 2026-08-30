const API_BASE = 'http://localhost:5000/api';


export async function getBoard(id) {
  const response = await fetch(`${API_BASE}/boards/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch board ${id}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}


export async function createBoard(title) {
  const response = await fetch(`${API_BASE}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create board: ${response.status} ${response.statusText}`);
  }

  return response.json();
}


export async function updateTask(taskId, updates) {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task ${taskId}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
