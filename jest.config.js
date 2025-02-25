/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|js)$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/test-guardianjs/',
        '/guardianjs-demo/'
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!(node-fetch|data-uri-to-buffer|fetch-blob|formdata-polyfill)/).+\\.js$'
    ],
    moduleNameMapper: {
        '^bot-guardian-js$': '<rootDir>/src/index.ts'
    },
    testTimeout: 15000,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    },
    setupFilesAfterEnv: ['./jest.setup.js']
}; 