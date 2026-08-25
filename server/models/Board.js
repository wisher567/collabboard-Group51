const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    columns: {
      type: [columnSchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);