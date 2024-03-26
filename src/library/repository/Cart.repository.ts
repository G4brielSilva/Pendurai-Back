import { IsNull } from 'typeorm';
import { BaseRepository } from '../../common/models/BaseRepository';
import { ShopCart } from '../entity/ShopCart.entity';

export class CartRepository extends BaseRepository(ShopCart) {
    /**
     * findByStoreId - Busca carrinho por id da loja
     * @param { string } storeId
     * @returns { Promise<ShopCart | null> }
     */
    public async findByStoreId(storeId: string): Promise<ShopCart | null> {
        return this.repository.findOne({ where: { store: { id: storeId }, closedAt: IsNull() } });
    }
}
