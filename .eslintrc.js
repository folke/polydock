module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:unicorn/recommended",
    "plugin:promise/recommended",
  ],
  env: {
    node: true,
    browser: false,
  },
  plugins: ["@typescript-eslint", "prettier", "import", "promise"],
  parserOptions: {
    ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    // project: "./tsconfig.json",
    impliedStrict: true,
    createDefaultProgram: true,
  },
  ignorePatterns: ["/src/types/*.js", "/src/types/*.ts", "/dist/**/*.js"],
  rules: {
    "array-callback-return": "error",
    "prefer-template": "warn",
    "prefer-promise-reject-errors": "error",
    "require-unicode-regexp": "error",
    yoda: "error",
    "prefer-spread": "error",
    "prettier/prettier": "warn",
    "unicorn/prevent-abbreviations": "off",
    "unicorn/explicit-length-check": "off",
    "unicorn/no-reduce": "off",
    "no-console": "error",
    "unicorn/consistent-function-scoping": "off",
    "lines-between-class-members": [
      "error",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
}
