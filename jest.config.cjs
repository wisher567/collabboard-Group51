module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testMatch: [
    '<rootDir>/src/**/*.test.jsx',
  ],
};