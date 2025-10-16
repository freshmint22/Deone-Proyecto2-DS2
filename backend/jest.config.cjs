module.exports = {
  testEnvironment: 'node',
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/tests/**/*.test.js', '**/tests/**/*.test.jsx'],
  testPathIgnorePatterns: ['<rootDir>/archived_root/', '<rootDir>/node_modules/'],
};
