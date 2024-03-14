/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepPartial } from 'typeorm';
import { Product } from '../../../src/library/entity';

export class ProductRepository {
    private mockList = [
        {
            id: '1',
            name: 'valid_product_name',
            description: 'valid_product_description'
        }
    ] as unknown as Product[];

    public async create(product: Product): Promise<Product> {
        return Promise.resolve(this.mockList[0]);
    }

    public async find(params: any): Promise<[Product[], number]> {
        return Promise.resolve([this.mockList, this.mockList.length]);
    }

    public async findById(productId: string): Promise<Product> {
        return Promise.resolve(this.mockList.find(product => product.id === productId) as Product);
    }

    public async update(id: string, store: DeepPartial<Product>): Promise<Product> {
        return Promise.resolve(this.mockList[0]);
    }

    public async softDelete(id: string): Promise<Product> {
        return Promise.resolve(this.mockList[0]);
    }
}
