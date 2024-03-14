import { MigrationInterface, QueryRunner } from 'typeorm';
import { Authentication, User } from '../src/library/entity';

export class AddUserAuthentication1709920637874 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = (await queryRunner.manager.findBy(User, { name: 'user' }))[0];
        await queryRunner.connect();

        const authenticaton = new Authentication();

        authenticaton.email = 'user@email.com';
        authenticaton.password = 'P@2sword';
        authenticaton.user = user;

        await queryRunner.manager.insert(Authentication, authenticaton);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from(Authentication).where('email = :email', { email: 'email@email.com' }).execute();
    }
}
