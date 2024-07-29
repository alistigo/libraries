module.exports = {
  env: {
    browser: false,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/*.{js,jsx,ts,tsx}'],
      },
    ],
  },
};
