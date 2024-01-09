module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    'node_modules/react-monaco-editor/.*': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/Tests/fileMock.js',
    'react-monaco-editor': '<rootDir>/__mocks__/react-monaco-editor.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-monaco-editor).+\\.js$',
  ],
  setupFiles: ['<rootDir>/jest.setup.js']
};
