const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    columnId: {
      type: String,
      required: true
    },

    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // Used for optimistic concurrency and conflict detection
    version: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', taskSchema);