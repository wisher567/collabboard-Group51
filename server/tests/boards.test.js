/**
 * server/tests/boards.test.js
 *
 * Integration tests for the Board API using Jest + Supertest against a
 * real (in-memory) MongoDB instance.
 */

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../index');
const Board = require('../models/Board');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Build a valid JWT for a given user id.
 */
function makeAuthToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Board API', () => {
  let user;
  let token;

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  beforeEach(async () => {
    const passwordHash = await bcrypt.hash('testpassword', 10);
    user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      passwordHash,
    });
    token = makeAuthToken(user._id.toString());
  });

  describe('POST /api/boards', () => {
    it('creates a new board successfully', async () => {
      const payload = {
        title: 'Sprint Planning',
        columns: [
          { id: 'col-1', title: 'To Do' },
          { id: 'col-2', title: 'In Progress' },
          { id: 'col-3', title: 'Done' },
        ],
      };

      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        title: 'Sprint Planning',
      });
      expect(res.body).toHaveProperty('_id');

      // Verify it was actually persisted in MongoDB
      const savedBoard = await Board.findById(res.body._id);
      expect(savedBoard).not.toBeNull();
      expect(savedBoard.title).toBe('Sprint Planning');
      expect(savedBoard.createdBy.toString()).toBe(user._id.toString());
    });

    it('rejects board creation without a title', async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${token}`)
        .send({ columns: [{ id: 'col-1', title: 'To Do' }] });

      expect(res.status).toBe(400);
    });

    it('rejects board creation without authentication', async () => {
      const res = await request(app)
        .post('/api/boards')
        .send({ title: 'No Auth Board' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/boards/:id', () => {
    it('fetches a board by id', async () => {
      const board = await Board.create({
        title: 'Marketing Roadmap',
        createdBy: user._id,
        columns: [
          { id: 'col-1', title: 'Backlog' },
          { id: 'col-2', title: 'Doing' },
          { id: 'col-3', title: 'Done' },
        ],
      });

      const res = await request(app)
        .get(`/api/boards/${board._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(board._id.toString());
      expect(res.body.title).toBe('Marketing Roadmap');
    });

    it('returns 404 for a nonexistent board id', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/boards/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('returns 400 for a malformed board id', async () => {
      const res = await request(app)
        .get('/api/boards/not-a-valid-object-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/boards/:id', () => {
    it('updates an existing board', async () => {
      const board = await Board.create({
        title: 'Old Title',
        createdBy: user._id,
        columns: [
          { id: 'col-1', title: 'To Do' },
          { id: 'col-2', title: 'Done' },
        ],
      });

      const res = await request(app)
        .patch(`/api/boards/${board._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Title' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('New Title');

      const updated = await Board.findById(board._id);
      expect(updated.title).toBe('New Title');
    });

    it('returns 404 when patching a nonexistent board', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .patch(`/api/boards/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Does Not Matter' });

      expect(res.status).toBe(404);
    });
  });
});
