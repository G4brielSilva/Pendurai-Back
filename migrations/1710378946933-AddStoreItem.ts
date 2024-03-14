import { MigrationInterface, QueryRunner } from 'typeorm';
import { Product, Store, StoreItem } from '../src/library/entity';

export class AddStoreItem1710378946933 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const product = (await queryRunner.manager.findBy(Product, { name: 'test_product' }))[0];
        const store = (await queryRunner.manager.findBy(Store, { name: 'test_store' }))[0];
        await queryRunner.connect();

        await queryRunner.manager.insert(StoreItem, {
            quantity: 10,
            value: 18.99,
            product,
            store
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from(StoreItem).where('name = :name', { name: 'an_product' }).execute();
    }
}
