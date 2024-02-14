module.exports = {
    clearMocks: true,
    collectCoverageFrom: ['src/endpoints/**/*.ts', '!src/**/*.entity.ts', '!src/**/*.repository.ts', '!src/**/index.ts'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest/setEnvVars.ts']
};
