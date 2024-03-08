import { MigrationInterface, QueryRunner } from 'typeorm';
import { Authentication, User } from '../src/library/entity';

export class AddUserAuthentication1709920637874 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = (await queryRunner.manager.findBy(User, { name: 'user' }))[0];
        await queryRunner.connect();

        await queryRunner.manager.insert(Authentication, {
            email: 'email@email.com',
            password: 'P@2sword',
            user
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from(Authentication).where('email = :email', { email: 'email@email.com' }).execute();
    }
}
