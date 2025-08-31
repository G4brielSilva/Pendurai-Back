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
    logging: EnvUtils.isDevelopment(),
    synchronize: true
});
