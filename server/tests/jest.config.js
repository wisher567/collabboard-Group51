module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEach: [], // not used here
  setupFiles: [],
  globalSetup: undefined,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 20000,
};
