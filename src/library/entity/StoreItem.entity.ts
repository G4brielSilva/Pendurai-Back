import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product.entity';
import { Store } from './Store.entity';

@Entity('store_items')
export class StoreItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', unsigned: true })
    quantity: number;

    @Column({ type: 'float', unsigned: true })
    value: number;

    @ManyToOne(() => Store, { eager: true })
    @JoinColumn()
    store: Store;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn()
    product: Product;
}
