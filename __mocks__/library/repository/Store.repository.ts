/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepPartial } from 'typeorm';
import { Store } from '../../../src/library/entity';

export class StoreRepository {
    private mockList = [
        {
            id: '1',
            name: 'store_name',
            cnpj: '62781317000160',
            owner: 'valid_user_id'
        }
    ] as unknown as Store[];

    public async create(store: Store): Promise<Store> {
        return this.mockList[0];
    }

    public async find(): Promise<Store[]> {
        return this.mockList;
    }

    public async findById(storeId: string): Promise<Store> {
        return this.mockList.find(store => store.id === storeId) as Store;
    }

    public async update(store: DeepPartial<Store>): Promise<Store> {
        return this.mockList[0];
    }
}
