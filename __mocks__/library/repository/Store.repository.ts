/* eslint-disable @typescript-eslint/no-unused-vars */
import { Store } from '../../../src/library/entity';

export class StoreRepository {
    private mockList = [
        {
            id: '1',
            name: 'store_name',
            cnpj: '62781317000160'
        }
    ] as unknown as Store[];

    public async insert(store: Store): Promise<Store> {
        return this.mockList[0];
    }
}
