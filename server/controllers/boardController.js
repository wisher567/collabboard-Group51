const Board = require('../models/Board');
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// GET /boards
exports.getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (err) {
    next(err);
  }
};

const DEFAULT_COLUMNS = [
  { id: 'col-todo', title: 'To Do' },
  { id: 'col-progress', title: 'In Progress' },
  { id: 'col-done', title: 'Done' },
];

const DEFAULT_MEMBERS = [
  {
    id: 'mem-2',
    name: 'Alex Johnson',
    email: 'alex.j@collabboard.dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    role: 'Editor',
  },
  {
    id: 'mem-3',
    name: 'Sarah Chen',
    email: 'sarah.c@collabboard.dev',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    role: 'Member',
  },
  {
    id: 'mem-4',
    name: 'Michael Ross',
    email: 'michael.r@collabboard.dev',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    role: 'Member',
  },
];

function buildMemberFromUser(user, role = 'Owner') {
  const name = user.name || user.email.split('@')[0];
  return {
    id: user._id.toString(),
    name,
    email: user.email,
    role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  };
}

// GET /boards/:id
exports.getBoardById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid board ID format' });
    }
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    let needsSave = false;
    if (!board.columns || board.columns.length === 0) {
      board.columns = DEFAULT_COLUMNS;
      needsSave = true;
    }

    if (board.createdBy) {
      const creator = await User.findById(board.createdBy);
      if (creator) {
        const ownerMember = buildMemberFromUser(creator, 'Owner');
        const hasCreator = (board.members || []).some(
          (m) => m.email === creator.email || m.id === creator._id.toString()
        );
        if (!hasCreator) {
          const nonOwnerMembers = (board.members || []).filter(
            (m) => m.role !== 'Owner' && m.email !== creator.email
          );
          board.members = [ownerMember, ...nonOwnerMembers];
          needsSave = true;
        }
      }
    } else if (!board.members || board.members.length === 0) {
      board.members = [
        {
          id: 'mem-1',
          name: 'Jane Doe',
          email: 'jane.doe@collabboard.dev',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          role: 'Owner',
        },
        ...DEFAULT_MEMBERS,
      ];
      needsSave = true;
    }

    if (needsSave) {
      await board.save();
    }

    const tasks = await Task.find({ boardId: board._id });
    const boardObj = board.toObject();
    boardObj.columns = (boardObj.columns || []).map((col) => ({
      ...col,
      tasks: tasks
        .filter((t) => t.columnId === col.id)
        .map((t) => {
          const taskObj = t.toObject();
          return {
            ...taskObj,
            id: t._id.toString(),
            _id: t._id.toString(),
          };
        }),
    }));
    res.status(200).json(boardObj);
  } catch (err) {
    next(err);
  }
};

// POST /boards
exports.createBoard = async (req, res, next) => {
  try {
    const { title, columns } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Normalise columns: accept either ['To Do', 'Done'] or [{ id, title }]
    let normalizedColumns = [];
    if (Array.isArray(columns) && columns.length > 0) {
      normalizedColumns = columns.map((col, idx) => {
        if (typeof col === 'string') {
          return { id: `col-${idx + 1}`, title: col };
        }
        return col;
      });
    } else {
      normalizedColumns = DEFAULT_COLUMNS;
    }

    let initialMembers = [
      {
        id: 'mem-1',
        name: 'Jane Doe',
        email: 'jane.doe@collabboard.dev',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        role: 'Owner',
      },
      ...DEFAULT_MEMBERS,
    ];

    if (req.user && req.user.id) {
      const creator = await User.findById(req.user.id);
      if (creator) {
        const ownerMember = buildMemberFromUser(creator, 'Owner');
        const teamMembers = DEFAULT_MEMBERS.filter((m) => m.email !== creator.email && m.role !== 'Owner');
        initialMembers = [ownerMember, ...teamMembers];
      }
    }

    if (Array.isArray(req.body.members) && req.body.members.length > 0) {
      initialMembers = req.body.members;
    }

    const board = await Board.create({
      title,
      columns: normalizedColumns,
      members: initialMembers,
      createdBy: req.user ? req.user.id : undefined,
    });
    res.status(201).json(board);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

// POST /boards/:id/members
exports.addMember = async (req, res, next) => {
  try {
    const { name, email, role, avatar } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Member name is required' });
    }
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    const newMember = {
      id: `mem-${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim() : `${name.toLowerCase().replace(/\s+/g, '.')}@collabboard.dev`,
      role: role || 'Member',
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
    };
    board.members = board.members || [];
    board.members.push(newMember);
    await board.save();
    res.status(201).json(newMember);
  } catch (err) {
    next(err);
  }
};

// PATCH /boards/:id
exports.updateBoard = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid board ID format' });
    }
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