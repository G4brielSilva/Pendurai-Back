import 'dotenv/config';
import { DataSource } from 'typeorm';

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
    logging: false,
    synchronize: true
});
