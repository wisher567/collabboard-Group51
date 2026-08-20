const express = require('express');
const router = express.Router();
const {
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// Note: boardId is in the path here, but this stays a flat task route file
router.post('/boards/:boardId/tasks', createTask);
router.patch('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;