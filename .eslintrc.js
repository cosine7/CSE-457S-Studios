module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'no-plusplus': 'off',
    'no-mixed-operators': 'off',
    // 'max-len': 'off',
    'no-param-reassign': 'off',
    'no-confusing-arrow': 'off',
    'func-names': 'off',
    'no-unused-expressions': 'off',
    'no-use-before-define': ['error', { functions: false }],
  },
};
