/**
 * server/scripts/seed.js
 *
 * Seeds the database with a demo user, a demo board (To Do / Doing / Done),
 * and a handful of demo tasks.
 *
 * Run with: npm run seed
 *
 * NOTE: This assumes the following shapes — adjust field names if your
 * actual Mongoose schemas differ:
 *   User:  { name, email, password }
 *   Board: { title, columns: [{ name }], owner (User ref) }
 *   Task:  { title, description, status, board (Board ref) }
 */

const connectDB = require('../config/db');
const User = require('../models/User');
const Board = require('../models/Board');
const Task = require('../models/Task');

const COLUMN_NAMES = ['To Do', 'Doing', 'Done'];

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Board.deleteMany({}),
    Task.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log('Creating demo user...');
  const demoUser = await User.create({
    name: 'Demo User',
    email: 'demo@collabboard.com',
    password: 'password123', // NOTE: hash this if your User model doesn't already do so via a pre-save hook
  });

  console.log('Creating demo board...');
  const demoBoard = await Board.create({
    title: 'Demo Project Board',
    columns: COLUMN_NAMES.map((name) => ({ name })),
    owner: demoUser._id,
  });

  console.log('Creating demo tasks...');
  const demoTasks = [
    {
      title: 'Set up project repository',
      description: 'Initialize git repo, add README, configure linting.',
      status: 'To Do',
      board: demoBoard._id,
    },
    {
      title: 'Design database schema',
      description: 'Define Mongoose models for User, Board, and Task.',
      status: 'To Do',
      board: demoBoard._id,
    },
    {
      title: 'Build authentication flow',
      description: 'Implement signup/login with JWT.',
      status: 'Doing',
      board: demoBoard._id,
    },
    {
      title: 'Implement drag-and-drop UI',
      description: 'Add react-beautiful-dnd for moving tasks between columns.',
      status: 'Doing',
      board: demoBoard._id,
    },
    {
      title: 'Write seed script',
      description: 'Populate the database with demo data for local development.',
      status: 'Done',
      board: demoBoard._id,
    },
    {
      title: 'Deploy staging environment',
      description: 'Set up hosting and CI/CD pipeline for the staging server.',
      status: 'Done',
      board: demoBoard._id,
    },
  ];

  await Task.insertMany(demoTasks);

  console.log('✅ Seed complete:');
  console.log(`   1 user   -> ${demoUser.email}`);
  console.log(`   1 board  -> "${demoBoard.title}" (${COLUMN_NAMES.join(', ')})`);
  console.log(`   ${demoTasks.length} tasks  -> spread across columns`);
}

seed()
  .then(async () => {
    await require('mongoose').disconnect();
    console.log('Disconnected from MongoDB. Done.');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Seed failed:', err);
    await require('mongoose').disconnect();
    process.exit(1);
  });
