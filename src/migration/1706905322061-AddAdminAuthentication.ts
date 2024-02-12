import 'dotenv/config';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Authentication, User } from '../library/entity';

export class AddAdminAndAuthentication1706905322061 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = (await queryRunner.manager.findBy(User, { name: 'admin' }))[0];
        await queryRunner.connect();

        const authentication = new Authentication();

        authentication.email = process.env.ADMIN_EMAIL as string;
        authentication.password = process.env.ADMIN_PASSWORD as string;
        authentication.user = user;
        authentication.admin = true;

        await authentication.hashPassword();
        await queryRunner.manager.insert(Authentication, authentication);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from(Authentication).where('admin = :admin', { admin: true }).execute();
    }
}
