module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/Tests/fileMock.js'
  },

  setupFiles: ['<rootDir>/jest.setup.js']
};
