const Task = require('../models/Task');

/**
 * PATCH /api/tasks/:id
 * Body: { title?, columnId?, version }
 *
 * Optimistic concurrency control: the client must send the version it last
 * saw. If it no longer matches the task's current version in the database,
 * someone else updated the task in the meantime — reject with 409 instead
 * of silently overwriting their change.
 */
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, columnId, version } = req.body || {};

    if (version === undefined) {
      return res.status(400).json({ error: 'version is required to update a task' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: `Task with id "${id}" not found` });
    }

    // Conflict check — someone else updated this task since the client last saw it
    if (task.version !== version) {
      return res.status(409).json({
        error: 'This task was updated by someone else. Please refresh and try again.',
        currentTask: task,
      });
    }

    // No conflict — apply the update and bump the version
    if (title !== undefined) task.title = title;
    if (columnId !== undefined) task.columnId = columnId;
    task.version += 1;

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
}

module.exports = { updateTask /* , createTask, deleteTask — keep whatever replace-mock-with-db already exported */ };
