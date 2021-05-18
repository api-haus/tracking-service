module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    es6: true,
    node: true,
    es2021: true
  },
  rules: {
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "curly": [
      "error",
      "multi",
      "consistent"
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "semi": "off",
    "@typescript-eslint/semi": ["error"]
  }
};
