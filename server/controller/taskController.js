// In-memory storage (temporary — real MongoDB comes in M3)
let tasks = [];
let nextId = 1;

// POST /api/boards/:boardId/tasks
const createTask = (req, res) => {
  const { boardId } = req.params;
  const { title, columnId } = req.body;

  if (!title || !columnId) {
    return res.status(400).json({ error: 'title and columnId are required' });
  }

  const newTask = {
    id: nextId++,
    title,
    columnId,
    boardId,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
};

// PATCH /api/tasks/:id  (also used to move a task between columns)
const updateTask = (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === Number(id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, columnId } = req.body;
  if (title !== undefined) task.title = title;
  if (columnId !== undefined) task.columnId = columnId; // this is what "moves" the task

  res.json(task);
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex((t) => t.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
};

module.exports = { createTask, updateTask, deleteTask };