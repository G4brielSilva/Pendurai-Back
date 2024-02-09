import { dataSource } from './config/database';

dataSource
    .initialize()
    .then(async () => {
        console.log('Database has been initialized');
        await dataSource.runMigrations();
        console.log('Migration has been run');
    })
    .catch(error => console.error('Error initializing database:', error));
