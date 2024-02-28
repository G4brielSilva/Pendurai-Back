import { DeepPartial, Repository } from 'typeorm';
import { dataSource } from '../../config/database';
import { Store } from '../entity';

export class StoreRepository {
    repository: Repository<Store>;

    public constructor() {
        this.repository = dataSource.getRepository(Store);
    }

    /**
     * insert
     *
     * Insere um usuário no banco
     *
     * @param { DeepPartial<Store> } store
     * @returns { Promise<Store> }
     */
    public async insert(store: DeepPartial<Store>): Promise<Store> {
        return this.repository.save(this.repository.create(store));
    }
}
