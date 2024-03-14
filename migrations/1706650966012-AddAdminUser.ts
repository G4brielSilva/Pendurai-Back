import 'dotenv/config';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../src/library/entity';

export class AddAdminUser1706650966012 implements MigrationInterface {
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
        await queryRunner.manager.createQueryBuilder().delete().from(User).where('name = :name', { name: 'admin' }).execute();
    }
}
