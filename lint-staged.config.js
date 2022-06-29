module.exports = {
    '*.{ts,tsx}': [() => 'yarn tsc:check', 'yarn format:fix', 'yarn lint:fix', 'yarn test', 'git add .'],
  };