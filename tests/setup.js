// tests/setup.js
// Simple test setup without database dependencies

// Setup for Jest tests
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  console.log('Setting up tests...');
});

afterAll(async () => {
  console.log('Tests completed');
});