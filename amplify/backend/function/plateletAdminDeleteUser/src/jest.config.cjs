module.exports = {
  transform: {
    // Use babel-jest for .js files, explicitly referencing the root babel.config.json
    '^.+\.js$': ['babel-jest', { configFile: '../../../../../babel.config.json' }],
  },
  // This moduleNameMapper helps Jest resolve ES module imports that include the .js extension.
  // It effectively tells Jest to consider 'module.js' as 'module' when resolving.
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
  // Specify the test environment
  testEnvironment: 'node',
  // Match test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  // Add other configurations as needed
  moduleFileExtensions: ['js', 'json', 'node', 'mjs'],
  // Ensure node_modules are not ignored for transformation, especially for ES module packages
  transformIgnorePatterns: [],
  // Use setupTests.js to configure environment variables
  setupFilesAfterEnv: ['./setupTests.js'],
};
