module.exports = {
    '*.{ts,tsx}': [() => 'yarn tsc:check', 'yarn format', 'yarn lint:fix', 'yarn test', 'git add .'],
  };