module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setuptests.ts'],
  resetMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)'],
};
