module.exports = {
    'extends': ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
    'parser': 'babel-eslint',
    'rules': {
        'prettier/prettier': [
            'error', {
                singleQuote: true,
                jsxBracketSameLine: true
            }
        ],

        'no-console': ['error', {
            allow: ['warn', 'error']
        }],

        'react/prop-types': 0

    },
    'plugins': [
        'prettier',
        'jest'
    ],
    'settings': {
        'ecmascript': 2015,
        'react': {
          'version': '16'
        }
    },
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 6,
    },
    'env': {
        'browser': true,
        'node': true,
        'es6': true,
        'jest': true
    },
    'globals': {}
};
