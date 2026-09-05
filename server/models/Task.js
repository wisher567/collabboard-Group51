const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200
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
      type: mongoose.Schema.Types.Mixed,
    },

    assignee: {
      type: mongoose.Schema.Types.Mixed,
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