import { BaseRepository } from '../../common/models/BaseRepository';
import { Store } from '../entity';

export class StoreRepository extends BaseRepository(Store) {
    /**
     * softDeleteStore - Soft Delete Store
     *
     * @param { string } storeId
     * @returns { Promise<void> }
     */
    public async softDeleteStore(storeId: string): Promise<void> {
        this.repository.softDelete(storeId);
    }
}
