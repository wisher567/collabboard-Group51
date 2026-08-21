const express = require('express');
const {
  getBoard,
  createBoard,
  updateBoard,
} = require('../controllers/boardController');

const router = express.Router();

router.get('/:id', getBoard);
router.post('/', createBoard);
router.patch('/:id', updateBoard);

module.exports = router;