import { Entity, ObjectLiteral, Repository } from 'typeorm';
import { dataSource } from '../../config/database';

export class BaseRepository<T extends ObjectLiteral> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository: Repository<T>;

    public constructor() {
        this.repository = dataSource.getRepository<T>(Entity);
    }

    public async findById(id: string): Promise<T | null> {
        return this.repository.findOne({ where: { id: id as unknown as NonNullable<T[string]> } });
    }

    public async find(): Promise<T[]> {
        return this.repository.find();
    }
}
