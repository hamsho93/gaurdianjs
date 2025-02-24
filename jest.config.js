/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    testMatch: ['**/__tests__/**/*.test.(ts|js)', '**/test/**/*.test.(ts|js)'],
    modulePathIgnorePatterns: ['<rootDir>/guardianjs-demo/'],
    moduleNameMapper: {
        '^bot-guardian-js$': '<rootDir>/dist'
    },
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json'
        }
    }
}; 