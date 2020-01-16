module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    "no-cond-assign": 0,
    "max-len": 0,
    "linebreak-style": 0,
    "one-var": [0, "always"],
    "func-names": ["error", "never"],
    "indent": ["error", 2, { "VariableDeclarator": { "var": 2, "let": 2, "const": 3 } }],
    "keyword-spacing": 0,
    "no-use-before-define": 0,
    "no-underscore-dangle": "off",
    "one-var-declaration-per-line": 0
  },
};
