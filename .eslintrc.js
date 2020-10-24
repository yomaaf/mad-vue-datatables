module.exports = {
  root: true,
  env: {
    browser: true,
  },
  plugins: ['vue'],
  extends: ["plugin:vue/recommended", "prettier"],
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "globalReturn": false,
      "impliedStrict": false,
      "jsx": false,
      "experimentalObjectRestSpread": false,
      "allowImportExportEverywhere": false
    }
  },
  rules: {
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
    "semi": [2, "never"],
    "quotes": [2, "single"],
    "vue/require-default-prop": 0,
    "vue/require-prop-types": 0,
    "vue/no-v-html": 0,
    "vue/html-indent": 0,
    "vue/component-name-in-template-casing": ['error', 'kebab-case']
  }
};
