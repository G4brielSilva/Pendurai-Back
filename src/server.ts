import swaggerJSDoc from 'swagger-jsdoc';
import { dataSource } from './config/database';
import { swaggerConfig } from './config/swagger';

dataSource
    .initialize()
    .then(async () => {
        console.log('Database has been initialized');
        await dataSource.runMigrations();
        console.log('Migration has been run');
    })
    .catch(error => console.error('Error initializing database:', error));

swaggerJSDoc(swaggerConfig);
