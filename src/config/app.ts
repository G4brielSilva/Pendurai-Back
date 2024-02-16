/* eslint-disable no-console */
import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { setupRoutes } from '../routes';
import { swaggerConfig } from './swagger';

const app = express();

app.use(express.json());
setupRoutes(app);

const swaggerSpecs = swaggerJSDoc(swaggerConfig);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

export default app;
