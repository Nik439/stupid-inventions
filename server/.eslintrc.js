module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "ignorePatterns": ["./node_modules/*.*", ".eslintrc.js"],
    "rules": {
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
