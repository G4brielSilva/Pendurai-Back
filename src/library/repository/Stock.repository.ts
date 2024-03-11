import { FindManyOptions } from 'typeorm';
import { IListParams } from '../../common/models/BaseController';
import { BaseRepository } from '../../common/models/BaseRepository';
import { StoreItem } from '../entity';

export class StockRepository extends BaseRepository(StoreItem) {
    /**
     * getStoreStock - Listar os items no estoque da loja
     *
     * @param { string } storeId
     * @returns { Promise<void> }
     */
    public async getStoreStock(storeId: string, params: IListParams): Promise<void> {
        const skip = params.size * (params.page - 1);
        const take = params.size;

        const options: FindManyOptions<StoreItem> = { take, skip, where: { store: { id: storeId } }, relations: ['product'] };

        if (params.order) {
            options.order = { [params.order]: params.orderBy };
        }

        this.repository.find(options);
    }
}
