module.exports = {
  roots: [
    '<rootDir>/src/'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '[\\\\/]node_modules[\\\\/](?!@babel[\\\\/]runtime)'
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  setupFiles: [
    '<rootDir>/test/bem'
  ],
  setupTestFrameworkScriptFile: 'jest-extended'
};
