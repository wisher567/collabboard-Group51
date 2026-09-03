process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const app = require('../index');

describe('Auth API', () => {
  test('successfully registers a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.email).toBe('test@example.com');
  });

  test('fails to register with a duplicate email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toBe(409);
    expect(response.body.message).toBe('User already exists');
  });

  test('successfully logs in and receives a token', async () => {
    const email = 'login@example.com';
    const password = 'password123';

    await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password,
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe('string');
  });
});

