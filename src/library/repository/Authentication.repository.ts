import { DeepPartial, Repository } from 'typeorm';
import { dataSource } from '../../config/database';
import { Password } from '../../utils/Password';
import { Authentication } from '../entity';

export class AuthenticationRepository {
    repository: Repository<Authentication>;

    public constructor() {
        this.repository = dataSource.getRepository(Authentication);
    }

    /**
     * findByEmail
     *
     * Busca uma autenticação pelo e-mail
     *
     * @param { string } email
     * @returns { Promise<Authentication> }
     */
    public async findByEmail(email: string): Promise<Authentication | null> {
        if (!email) return null;
        return this.repository.findOne({ select: ['id', 'admin', 'user', 'password', 'salt'], where: { email } });
    }

    /**
     * insert
     *
     * Insere uma nova autenticação no banco
     *
     * @param { DeepPartial<Authentication> } authentication
     * @returns { Promise<Authentication> }
     */
    public async insert(authentication: DeepPartial<Authentication>): Promise<Authentication> {
        return this.repository.save(this.repository.create(authentication));
    }

    public async changePassword(authentication: Authentication, newPassword: string): Promise<Authentication> {
        const authenticationParsed = authentication;

        authenticationParsed.password = Password.hashPassword(newPassword, authentication.salt as string);
        const updatedAuthentication = await this.repository.save(authentication);

        return updatedAuthentication;
    }
}
