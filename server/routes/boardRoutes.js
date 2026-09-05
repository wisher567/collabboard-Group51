const express = require('express');
const {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  addMember,
} = require('../controllers/boardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getBoards);
router.get('/:id', authMiddleware, getBoardById);
router.post('/', authMiddleware, createBoard);
router.patch('/:id', authMiddleware, updateBoard);
router.post('/:id/members', authMiddleware, addMember);

module.exports = router;
