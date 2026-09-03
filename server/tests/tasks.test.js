/**
 * server/tests/tasks.test.js
 *
 * Tests for the Kanban board app's Task API.
 * Assumes:
 *  - server/tests/setup.js is already configured globally (in-memory MongoDB via mongodb-memory-server)
 *  - Express app is exported from server/index.js as `app` (not calling app.listen there)
 *  - Task model has fields: title, columnId, boardId, version
 *  - Task endpoints:
 *      POST   /api/tasks              -> create a task
 *      PATCH  /api/tasks/:id          -> update a task (expects { columnId, version } in body)
 *  - PATCH checks the incoming `version` against the stored version:
 *      - if it matches: apply update, increment version, return 200
 *      - if it doesn't match: return 409 Conflict
 *
 * Adjust field/route names below if your actual API differs.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../index');
const Board = require('../models/Board');
const Task = require('../models/Task');

// Use the same secret your auth middleware verifies against.
// If your app reads this from process.env.JWT_SECRET, make sure that's set in setup.js/.env.test
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

function makeTestToken(userId = new mongoose.Types.ObjectId().toString()) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Task API', () => {
  let token;
  let board;

  beforeEach(async () => {
    token = makeTestToken();

    // Create a board to attach tasks to
    board = await Board.create({
      title: 'Test Board',
      columns: [
        { id: 'col-1', title: 'To Do', tasks: [] },
        { id: 'col-2', title: 'In Progress', tasks: [] },
      ],
    });
  });

  test('creates a task on a board', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        boardId: board._id,
        columnId: 'col-1',
        title: 'Write tests',
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Write tests');
    expect(res.body.columnId).toBe('col-1');
    expect(res.body.version).toBe(1);
  });

  test('updates a task columnId (moving it) with the correct version', async () => {
    const task = await Task.create({
      boardId: board._id,
      columnId: 'col-1',
      title: 'Move me',
      version: 1,
    });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        columnId: 'col-2',
        version: 1,
      });

    expect(res.status).toBe(200);
    expect(res.body.columnId).toBe('col-2');
    expect(res.body.version).toBe(2);
  });

  test('returns 409 Conflict when updating with a stale version number', async () => {
    const task = await Task.create({
      boardId: board._id,
      columnId: 'col-1',
      title: 'Stale update target',
      version: 3,
    });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        columnId: 'col-2',
        version: 1, // stale/incorrect version
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });
});
