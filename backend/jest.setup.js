// Jest setup: set test env, restore mocks between tests and provide default secrets
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_for_ci';

// Ensure tests don't leak mocked modules or timers
afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  jest.useRealTimers();
});
