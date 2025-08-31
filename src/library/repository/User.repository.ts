import { DeepPartial } from 'typeorm';
import { BaseRepository } from '../../common/models/BaseRepository';
import { User } from '../entity';

export class UserRepository extends BaseRepository(User) {
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
