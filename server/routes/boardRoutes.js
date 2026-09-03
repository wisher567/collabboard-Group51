const express = require('express');
const {
  getBoardById,
  createBoard,
  updateBoard,
} = require('../controllers/boardController');

const router = express.Router();

router.get('/:id', getBoardById);
router.post('/', createBoard);
router.patch('/:id', updateBoard);

module.exports = router;
