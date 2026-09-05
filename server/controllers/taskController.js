const Task = require('../models/Task');

// GET /tasks
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// GET /tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// POST /tasks
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      version: 1,
    });
    const taskObj = task.toObject();
    taskObj.id = task._id.toString();
    res.status(201).json(taskObj);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// PATCH /tasks/:id — with optimistic concurrency (version check)
exports.updateTask = async (req, res, next) => {
  try {
    const { version, ...updates } = req.body;

    // If a version is provided, enforce optimistic concurrency
    if (version !== undefined) {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (task.version !== version) {
        return res.status(409).json({
          error: 'Version conflict: the task was modified by another user',
          currentVersion: task.version,
          yourVersion: version,
        });
      }

      // Version matches — apply update and increment version
      Object.assign(task, updates);
      task.version = task.version + 1;
      await task.save();

      return res.status(200).json(task);
    }

    // No version provided — simple update (backwards compatible)
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
