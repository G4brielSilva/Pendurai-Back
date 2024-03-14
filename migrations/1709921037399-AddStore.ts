import { MigrationInterface, QueryRunner } from 'typeorm';
import { Store, User } from '../src/library/entity';

export class AddStore1709921037399 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const user = (await queryRunner.manager.findBy(User, { name: 'user' }))[0];
        await queryRunner.connect();

        await queryRunner.manager.insert(Store, {
            name: 'test_store',
            cnpj: '1',
            owner: user
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from(Store).where('cnpj = :cnpj', { name: '1' }).execute();
    }
}
