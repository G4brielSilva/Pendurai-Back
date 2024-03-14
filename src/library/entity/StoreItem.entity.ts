import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product.entity';
import { Store } from './Store.entity';

@Entity('store_items')
export class StoreItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', unsigned: true })
    quantity: string;

    @Column({ type: 'float', unsigned: true })
    value: number;

    @OneToOne(() => Store, { eager: true })
    @JoinColumn()
    store: Store;

    @OneToOne(() => Store, { eager: true })
    @JoinColumn()
    product: Product;
}
