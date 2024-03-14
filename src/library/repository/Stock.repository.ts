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
    public async getStoreStock(storeId: string, params: IListParams): Promise<StoreItem[]> {
        const skip = params.size * (params.page - 1);
        const take = params.size;

        const options: FindManyOptions<StoreItem> = { take, skip, where: { store: { id: storeId } } };

        if (params.order) {
            options.order = { [params.order]: params.orderBy };
        }

        return this.repository.find(options);
    }

    /**
     * changeStoreItemStock - Alterar quantidade de itens no estoque
     * @param { string } storeItemId
     * @param { number } quantity
     * @param { '-' | '+' } operation
     * @returns { Promise<StoreItem> }
     */
    private async changeStoreItemStock(storeItemId: string, quantity: number, operation: '-' | '+'): Promise<StoreItem> {
        return this.repository
            .createQueryBuilder()
            .update(StoreItem)
            .set({ quantity: () => `"quantity" ${operation} ${quantity}` })
            .where('id = :id', { id: storeItemId })
            .returning('*')
            .execute()
            .then(response => response.raw[0]);
    }

    /**
     * addStoreItemToStock - Adicionar quantidade de itens no estoque
     *
     * @param { string } storeItemId
     * @param { number } quantity
     * @returns { Promise<StoreItem | null> }
     */
    public async addStoreItemToStock(storeItemId: string, quantity: number): Promise<StoreItem> {
        return this.changeStoreItemStock(storeItemId, quantity, '+');
    }

    /**
     * removeStoreItemToStock - Adicionar quantidade de itens no estoque
     *
     * @param { string } storeItemId
     * @param { number } quantity
     * @returns { Promise<StoreItem | null> }
     */
    public async removeStoreItemToStock(storeItemId: string, quantity: number): Promise<StoreItem> {
        return this.changeStoreItemStock(storeItemId, quantity, '-');
    }
}
