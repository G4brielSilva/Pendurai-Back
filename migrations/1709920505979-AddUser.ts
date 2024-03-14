import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../src/library/entity';

export class AddUser1709920505979 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                name: 'user'
            })
            .execute();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from('user').where('name = :name', { name: 'user' }).execute();
    }
}
