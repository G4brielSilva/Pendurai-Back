/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import { EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { dataSource } from '../../config/database';

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

        public async find(): Promise<T[]> {
            return this.repository.find();
        }
    }
    return GenericBaseRepository;
};
