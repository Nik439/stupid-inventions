module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "ignorePatterns": ["./node_modules/*.*", "*.test.js", "serviceWorker.js"],
    "rules": {
        "react/prop-types": 0,
        "indent": [
        "error",
        2
      ],
      "keyword-spacing": "error",
      "linebreak-style": "error",
      "quotes": [
        "error",
        "single"
      ],
      "semi": "error",
      "space-before-blocks": "error",
      "space-before-function-paren": "error",
      "no-undef": "off",
      "no-unused-vars": "off"
    }
};
