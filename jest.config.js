/** @type {import('jest').Config} */
module.exports = {
  cacheDirectory: '.jest/cache',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  bail: false,
  testPathIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/node_modules/',
    '<rootDir>/dist',
    '<rootDir>/storybook',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '\\.snap$',
    '<rootDir>/dist'
  ],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testMatch: null,
  prettierPath: require.resolve('prettier-2'),
  moduleDirectories: ['node_modules'],
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/firebase-functions',
    '<rootDir>/node_modules/firebase-admin',
    '<rootDir>/node_modules/firebase-functions-test',
  ],
  restoreMocks: true,
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/vendor/**',
    '!**/__mocks__/**',
    '!**/storybook/**',
    '!**/__snapshots__/**',
    '!**/index.ts',
    '!**/tsup.config.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    // To make exceptions:
    // './src/features/login/LoginForm.tsx': {
    //   branches: 87,
    //   functions: 100,
    //   lines: 100,
    //   statements: 100,
    // },
  },
  reporters: [
    'default',
    'jest-junit',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Unit Test Report',
        includeConsoleLog: false,
        sort: 'titleAsc',
      },
    ],
  ],
};
