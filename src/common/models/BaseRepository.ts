/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import { DeepPartial, EntityTarget, FindManyOptions, FindOptionsOrder, ObjectLiteral, Repository } from 'typeorm';
import { dataSource } from '../../config/database';
import { IListParams } from './BaseController';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const BaseRepository = <T extends ObjectLiteral>(entity: EntityTarget<T>) => {
    class GenericBaseRepository {
        protected repository: Repository<T>;

        constructor() {
            this.repository = dataSource.getRepository(entity);
        }

        public async findById(id: any): Promise<T | null> {
            return this.repository.findOne({ where: { id } });
        }

        public async find(params: IListParams): Promise<T[]> {
            const skip = params.size * (params.page - 1);
            const take = params.size;

            const options: FindManyOptions<T> = { skip, take };

            if (params.order) {
                options.order = { [params.order]: params.orderBy } as FindOptionsOrder<T>;
            }

            return this.repository.find(options);
        }

        public async create(data: DeepPartial<T>): Promise<T> {
            return this.repository.save(data);
        }

        public async update(data: DeepPartial<T>): Promise<T> {
            return this.repository.save(data);
        }
    }
    return GenericBaseRepository;
};
