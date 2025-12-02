const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@vizzy/charts$': '<rootDir>/_new/packages/charts/src',
    '^@vizzy/charts/(.*)$': '<rootDir>/_new/packages/charts/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/(?!lucide-react/)'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/_new/packages/charts/',
    '<rootDir>/cli/',
    '<rootDir>/tests/',
  ],
};

module.exports = createJestConfig(customJestConfig);

