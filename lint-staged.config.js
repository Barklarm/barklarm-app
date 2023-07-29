module.exports = {
    '*.{ts,tsx}': [() => 'npm run tsc:check', 'npm run format:fix', 'npm run lint:fix', 'npm run test', 'git add .'],
  };