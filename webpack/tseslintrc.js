module.exports = {
  root: true,
  parserOptions:  {
    ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
    sourceType:  'module',  // Allows for the use of imports
    parser: '@typescript-eslint/parser',
    ecmaFeatures:  {
      jsx:  true,  // Allows for the parsing of JSX
    },
  },
  env: {
    browser: true,
    node: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  // 'plugin:@typescript-eslint/recommended', 'plugin:vue/essential', 'standard'
  extends: ['plugin:vue/base', 'plugin:@typescript-eslint/recommended', 'plugin:vue/essential', 'airbnb-base'],
  // check if imports actually resolve
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack/webpack.config.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never',
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': 'off',
    'prefer-template': 'off',
    'no-continue': 'off',
    // allow optionalDependencies
    // allow debugger during development
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'import/no-cycle': 'off',
    'import/no-self-import': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'off',
    'import/named': 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': 'off',
    'max-len': 'off',
    'no-eval': 'off',
    'no-underscore-dangle': 'off',
    'max-classes-per-file': 'off',
  }
}