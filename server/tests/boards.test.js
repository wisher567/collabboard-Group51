/**
 * server/tests/boards.test.js
 *
 * Integration tests for the Board API using Jest + Supertest against a
 * real (in-memory) MongoDB instance.
 *
 * Assumptions about the project layout (adjust the import paths below if
 * yours differ):
 *   - server/app.js            exports the configured Express app (NOT listening on a port)
 *   - server/models/Board.js   exports the Mongoose Board model
 *   - server/models/User.js    exports the Mongoose User model
 *   - server/tests/setup.js    starts/stops mongodb-memory-server and
 *                              connects/disconnects mongoose. It is wired
 *                              in via `setupFilesAfterEach`/`globalSetup`
 *                              in jest.config.js, OR you can import its
 *                              helpers directly (see below).
 *   - Auth middleware verifies a JWT signed with process.env.JWT_SECRET
 *     and attaches the decoded payload as `req.user` (expects `{ id }`).
 *
 * If your setup.js exposes named helpers (e.g. `connect`, `closeDatabase`,
 * `clearDatabase`) instead of running automatically, uncomment the calls
 * in the beforeAll/afterEach/afterAll hooks below.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../app');
const Board = require('../models/Board');
const User = require('../models/User');

// If setup.js exports explicit lifecycle helpers, pull them in.
// (Safe no-ops if setup.js instead wires itself up automatically via Jest config.)
let testDb;
try {
  // eslint-disable-next-line global-require
  testDb = require('./setup');
} catch (err) {
  testDb = null;
}

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

/**
 * Build a valid JWT for a given user id, signed the same way the app's
 * auth middleware expects.
 */
function makeAuthToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

describe('Board API', () => {
  let user;
  let token;

  beforeAll(async () => {
    if (testDb && typeof testDb.connect === 'function') {
      await testDb.connect();
    }
  });

  afterAll(async () => {
    if (testDb && typeof testDb.closeDatabase === 'function') {
      await testDb.closeDatabase();
    } else {
      await mongoose.connection.close();
    }
  });

  afterEach(async () => {
    if (testDb && typeof testDb.clearDatabase === 'function') {
      await testDb.clearDatabase();
    } else {
      // Fallback: wipe all collections directly.
      const collections = mongoose.connection.collections;
      // eslint-disable-next-line no-restricted-syntax
      for (const key of Object.keys(collections)) {
        await collections[key].deleteMany({});
      }
    }
  });

  beforeEach(async () => {
    // Create a real user in the test DB and a matching JWT for protected routes.
    user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'hashed-or-irrelevant-for-tests',
    });
    token = makeAuthToken(user._id.toString());
  });

  describe('POST /api/boards', () => {
    it('creates a new board successfully', async () => {
      const payload = {
        title: 'Sprint Planning',
        columns: ['To Do', 'In Progress', 'Done'],
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

      // Verify it was actually persisted in MongoDB, not just returned.
      const savedBoard = await Board.findById(res.body._id);
      expect(savedBoard).not.toBeNull();
      expect(savedBoard.title).toBe('Sprint Planning');
      expect(savedBoard.owner.toString()).toBe(user._id.toString());
    });

    it('rejects board creation without a title', async () => {
      const res = await request(app)
        .post('/api/boards')
        .set('Authorization', `Bearer ${token}`)
        .send({ columns: ['To Do'] });

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
        owner: user._id,
        columns: ['Backlog', 'Doing', 'Done'],
      });

      const res = await request(app)
        .get(`/api/boards/${board._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(board._id.toString());
      expect(res.body.title).toBe('Marketing Roadmap');
    });

    it('returns 404 for a nonexistent board id', async () => {
      // Well-formed ObjectId that does not correspond to any document.
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
        owner: user._id,
        columns: ['To Do', 'Done'],
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
