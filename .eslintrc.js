module.exports = {
  "extends": "google",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "require-jsdoc": ["off"],
    "arrow-parens": ["off"],
    "space-infix-ops": ["error", {"int32Hint": false}],
    "no-console": ["error"]
  },
  "plugins": ["react"]
};