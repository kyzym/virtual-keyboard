module.exports = {
  extends: ["airbnb-base"],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
      },
    ],
    "linebreak-style": ["error", "windows"],
    quotes: ["error", "double"],
  },
};
