// Configure Jest to Understand Path Aliases.
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom'
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust this according to your structure
  },
};