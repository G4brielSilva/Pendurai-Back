import 'dotenv/config';
import { DataSource } from 'typeorm';
import { EnvUtils } from '../utils/EnvUtils';

export const dataSource = new DataSource({
    name: 'default',
    type: 'mariadb',
    host: process.env.MARIADB_HOST,
    port: 3306,
    username: 'root',
    password: process.env.MARIADB_ROOT_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    entities: ['src/library/entity/*.ts'],
    migrations: ['./migrations/*.ts'],
    migrationsRun: EnvUtils.isDevelopment(),
    logging: false,
    synchronize: true
});

export const mongoDataSource = new DataSource({
    type: 'mongodb',
    host: process.env.MONGODB_HOST,
    url: process.env.MONGODB_URL,
    entities: ['src/library/ActionsLog/*.ts'],
    synchronize: true
});
