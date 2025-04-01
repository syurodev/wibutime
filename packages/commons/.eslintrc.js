module.exports = {
  root: true,
  extends: ['@workspace/eslint-config/library.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
