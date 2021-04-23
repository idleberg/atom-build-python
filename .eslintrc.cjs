/* eslint-disable */
module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:json/recommended'
  ],
  ignorePatterns: [
    '/lib',
    '/node_modules'
  ],
  globals: {
    atom: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  plugins: [],
  rules: {}
};
