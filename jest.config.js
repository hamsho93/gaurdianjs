/** @type {import('jest').Config} */
module.exports = {
    testMatch: ['**/test/integration/**/*.js'],
    testTimeout: 30000,
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    testEnvironment: 'node'
}; 