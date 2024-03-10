/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepPartial } from 'typeorm';
import { Product } from '../../../src/library/entity';

export class ProductRepository {
    private mockList = [
        {
            id: '1',
            name: 'valid_product_name',
            description: 'valid_product_description',
            store: {
                id: '1'
            }
        }
    ] as unknown as Product[];

    public async create(product: Product): Promise<Product> {
        return this.mockList[0];
    }

    public async findById(productId: string): Promise<Product> {
        return this.mockList.find(product => product.id === productId) as Product;
    }

    public async update(id: string, store: DeepPartial<Product>): Promise<Product> {
        return this.mockList[0];
    }
}
