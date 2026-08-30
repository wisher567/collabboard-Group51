const Board = require('../models/Board');

// GET /boards
exports.getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
};

// GET /boards/:id
exports.getBoardById = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
};

// POST /boards
exports.createBoard = async (req, res, next) => {
  try {
    const board = await Board.create(req.body);
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
};

// PUT /boards/:id
exports.updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (err) {
    next(err);
  }
};

// DELETE /boards/:id
exports.deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};