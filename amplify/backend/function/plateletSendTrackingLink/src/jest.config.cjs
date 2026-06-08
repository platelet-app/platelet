module.exports = {
  transform: {
    '^.+\.js$': ['babel-jest', { configFile: '../../../../../babel.config.json' }],
  },
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js', 'json', 'node', 'mjs'],
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['./setupTests.js'],
};
