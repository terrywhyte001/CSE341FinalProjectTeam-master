// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/CSE341FinalProjectTeam-master/'
  ],
  verbose: true
};