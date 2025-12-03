module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true,
    },
    extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-console': 'off',
    },
};
