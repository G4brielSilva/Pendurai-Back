import { BaseRepository } from '../../common/models/BaseRepository';
import { Product } from '../entity';

export class ProductRepository extends BaseRepository(Product) {}
