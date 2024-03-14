import { App } from './config/App';
import { dataSource } from './config/database';
import { swaggerConfig } from './config/swagger';
import { v1 } from './endpoints/v1';
import { EnvUtils } from './utils/EnvUtils';

const app = new App({
    path: '/api',
    port: Number(process.env.API_PORT || 8080),
    controllers: [...v1],
    middlewares: [],
    assets: EnvUtils.isDevelopment() ? [{ route: '/test', dir: './coverage/lcov-report' }] : undefined,
    docs: EnvUtils.isDevelopment(),
    swaggerConfig,
    dataSource
});

app.start();
