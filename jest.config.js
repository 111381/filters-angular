export default {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(ts|js|html)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
            },
        ],
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/main.ts',
        '!src/app.config.ts',
        '!src/test-setup.ts',
        '!src/environment*.ts',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@/src/(.*)$': '<rootDir>/src/$1',
        '^@/environment$': '<rootDir>/environment.ts',
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    testMatch: ['**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
};
