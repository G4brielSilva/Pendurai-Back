import app from './config/app';
import { dataSource } from './config/database';

dataSource
    .initialize()
    .then(async () => {
        await dataSource.runMigrations();
        app.listen(3000, () => console.log('Server is running on port 3000'));
    })
    .catch(error => console.error('Error initializing server:', error));
