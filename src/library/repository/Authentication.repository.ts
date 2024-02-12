// import { Repository } from 'typeorm';
import { Repository } from 'typeorm';
import { dataSource } from '../../config/database';
import { Authentication } from '../entity/Authentication.entity';

export class AuthenticationRepository {
    repository: Repository<Authentication>;

    public constructor() {
        this.repository = dataSource.getRepository(Authentication);
    }

    public async getHashedPassword(email: string): Promise<Authentication | null> {
        if (!email) return null;
        return this.repository.findOne({ select: ['password', 'salt'], where: { email } });
    }
}

// user.repository.ts
export const UserRepository = dataSource.getRepository(Authentication);
