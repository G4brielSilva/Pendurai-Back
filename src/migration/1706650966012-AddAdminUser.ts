import 'dotenv/config';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entity';

export class AddAdminAndAuthentication1706650966012 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                name: 'admin'
            })
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from('user').where('name = :name', { name: 'admin' }).execute();
    }
}
