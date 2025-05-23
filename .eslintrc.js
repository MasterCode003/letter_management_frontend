module.exports = {
  // ... other ESLint config options ...
  rules: {
    'max-lines': ['error', {
      max: 2000,
      skipBlankLines: true,
      skipComments: true
    }],
    'max-lines-per-function': ['error', {
      max: 2000,
      skipBlankLines: true,
      skipComments: true
    }]
  }
}