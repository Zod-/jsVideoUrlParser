module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    es6: true,
    node: true,
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
  ],
  plugins: [
    'jest',
  ],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    sourceType: 'module',
  },
  rules: {
    'arrow-body-style': ['error', 'as-needed', {
      requireReturnForObjectLiteral: true,
    }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': 'error',
    'camelcase': ['error', {properties: 'never'}],
    'comma-dangle': ['error', 'always-multiline'],
    'guard-for-in': 'error',
    'indent': ['error', 2],
    'keyword-spacing': 'error',
    'linebreak-style': ['error','unix'],
    'no-eq-null': 'error',
    'no-multi-str': 'error',
    'no-trailing-spaces': 'error',
    'no-useless-escape': 'error',
    'no-use-before-define': ['error', {'functions': false}],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'space-before-blocks': ['error', {
      classes: 'always',
      functions: 'always',
      keywords: 'always',
    }],
    'space-before-function-paren': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': ['error', {
      nonwords: false,
      words: true,
    }],
    'jest/expect-expect': 'off',
    'jest/valid-expect': 'off',
  },
};
