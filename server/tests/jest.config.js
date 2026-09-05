module.exports = {
  testEnvironment: 'node',
  rootDir: '..',
  setupFiles: [],
  globalSetup: undefined,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 20000,
};
