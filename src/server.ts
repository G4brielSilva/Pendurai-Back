/* eslint-disable no-console */
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { dataSource } from './config/database';
import { swaggerConfig } from './config/swagger';
import { routes } from './routes';

const app = express();

app.use(express.json());
app.use('/', routes);

async function startServer(): Promise<void> {
    try {
        await dataSource.initialize();
        await dataSource.runMigrations();

        app.listen(3000, () => console.log('Server is running on port 3000'));
    } catch (error) {
        console.error('Error initializing server:', error);
    }
}

const swaggerSpecs = swaggerJSDoc(swaggerConfig);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

startServer();
export { app };
