module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/fileMock.cjs',
    '\\.(css|less|scss)$': '<rootDir>/fileMock.cjs',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testMatch: [
    '<rootDir>/src/**/*.test.jsx',
  ],
};