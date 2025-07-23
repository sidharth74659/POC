module.exports = [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { require: 'readonly', module: 'readonly', __dirname: 'readonly' }
    },
    plugins: {
      prettier: require('eslint-plugin-prettier')
    },
    rules: {
      'prettier/prettier': 'error'
    },
    ignores: ['node_modules']
  }
]; 