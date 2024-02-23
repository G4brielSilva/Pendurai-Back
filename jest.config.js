module.exports = {
    clearMocks: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    coveragePathIgnorePatterns: [
        '.Logger.ts',
        '.entity.ts',
        '.repository.ts',
        '/node_modules/',
        'index.ts',
        'src/common/errors/',
        'src/common/models/',
        'src/config/',
        'src/server.ts',
        'src/third-party/swagger/',
        'src/cron/'
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/jest/setEnvVars.ts']
};
