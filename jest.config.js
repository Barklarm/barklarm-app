/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/renderer/themes/**",
    "!src/types/**",
    "!src/**/*.d.ts"
  ]
};