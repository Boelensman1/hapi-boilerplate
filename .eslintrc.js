module.exports = {
  extends: ['airbnb/base'],
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
    }],
    'max-len': ['error', 80, 4],
    'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
    'no-param-reassign': 0,
    'arrow-parens': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'semi': ['error', 'never'],
    'key-spacing': 0,
    'global-require': 0,
    'space-before-function-paren': [ 'error', 'never' ],
    'no-extra-parens': [ 'error', 'functions' ],
    'valid-jsdoc': 'error',
    'require-jsdoc': [
      'error', {
        'require': {
          'FunctionDeclaration': true,
          'MethodDefinition': false,
          'ClassDeclaration': false
        }
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'no-console': 0,
  },
}
