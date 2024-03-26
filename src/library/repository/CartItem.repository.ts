import { BaseRepository } from '../../common/models/BaseRepository';
import { ShopCart, StoreItem } from '../entity';
import { CartItem } from '../entity/CartItem.entity';

export class CartItemRepository extends BaseRepository(CartItem) {
    /**
     * findByStoreId - Busca carrinho por id da loja
     * @param { string } storeId
     * @returns { Promise<CartItem | null> }
     */
    public async addItemToCart(cart: ShopCart, storeItem: StoreItem, quantity: number): Promise<CartItem | null> {
        const { cartItems } = cart;

        const cartItem = cartItems.find((item: CartItem) => item.storeItem.id === storeItem.id);

        // Verifica se o item já está no carrinho
        if (cartItem) {
            await this.update(cartItem.id, { quantity });
            return this.findById(cartItem.id);
        }

        return this.create({ shopCart: cart, storeItem, quantity });
    }
}
