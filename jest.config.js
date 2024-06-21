module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageProvider: 'v8',
    reporters: ['default', 'jest-html-reporters'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/main.ts',
        '!src/**/index.ts',
        '!src/**/*.module.ts',
        '!src/common/**',
    ],
};
