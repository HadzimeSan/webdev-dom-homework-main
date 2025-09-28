/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
  },
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "import/no-unresolved": "off",
  },
  ignorePatterns: ["dist/", "node_modules/"],
};


