import { DeepPartial, Repository } from 'typeorm';
import { dataSource } from '../../config/database';
import { User } from '../entity';

export class UserRepository {
    repository: Repository<User>;

    public constructor() {
        this.repository = dataSource.getRepository(User);
    }

    /**
     * insert
     *
     * Insere um usuário no banco
     *
     * @param { DeepPartial<User> } user
     * @returns { Promise<User> }
     */
    public async insert(user: DeepPartial<User>): Promise<User> {
        return this.repository.save(this.repository.create(user));
    }
}
