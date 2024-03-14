import { MigrationInterface, QueryRunner } from 'typeorm';
import { Product } from '../src/library/entity';

export class AddProduct1710378942044 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.insert(Product, {
            name: 'test_product',
            description: 'test_product_description'
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.createQueryBuilder().delete().from(Product).where('name = :name', { name: 'an_product' }).execute();
    }
}
