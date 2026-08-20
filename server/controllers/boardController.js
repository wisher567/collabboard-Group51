const crypto = require('crypto');

// In-memory storage (temporary — replaced by MongoDB in M3)
let boards = [];

function generateId() {
  return crypto.randomUUID();
}

function findBoardIndex(id) {
  return boards.findIndex((board) => board.id === id);
}

/**
 * GET /api/boards/:id
 */
function getBoard(req, res) {
  const { id } = req.params;
  const board = boards.find((b) => b.id === id);

  if (!board) {
    return res.status(404).json({ error: `Board with id "${id}" not found` });
  }

  return res.status(200).json(board);
}

/**
 * POST /api/boards
 * Body: { title, columns? }
 */
function createBoard(req, res) {
  const { title, columns } = req.body || {};

  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Field "title" is required and must be a string' });
  }

  const board = {
    id: generateId(),
    title,
    columns: Array.isArray(columns)
      ? columns.map((col) => ({
          id: col.id || generateId(),
          title: col.title,
          tasks: Array.isArray(col.tasks)
            ? col.tasks.map((task) => ({
                id: task.id || generateId(),
                title: task.title,
              }))
            : [],
        }))
      : [],
  };

  boards.push(board);

  return res.status(201).json(board);
}

/**
 * PATCH /api/boards/:id
 * Body: any subset of { title, columns }
 */
function updateBoard(req, res) {
  const { id } = req.params;
  const index = findBoardIndex(id);

  if (index === -1) {
    return res.status(404).json({ error: `Board with id "${id}" not found` });
  }

  const { title, columns } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Field "title" must be a string' });
    }
    boards[index].title = title;
  }

  if (columns !== undefined) {
    if (!Array.isArray(columns)) {
      return res.status(400).json({ error: 'Field "columns" must be an array' });
    }
    boards[index].columns = columns;
  }

  return res.status(200).json(boards[index]);
}

module.exports = {
  getBoard,
  createBoard,
  updateBoard,
};