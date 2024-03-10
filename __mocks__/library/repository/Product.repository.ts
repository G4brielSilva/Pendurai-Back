/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from '../../../src/library/entity';

export class ProductRepository {
    private mockList = [
        {
            id: '1',
            name: 'valid_product_name',
            description: 'valid_product_description',
            Product: {
                id: '1'
            }
        }
    ] as unknown as Product[];

    public async create(product: Product): Promise<Product> {
        return this.mockList[0];
    }
}
