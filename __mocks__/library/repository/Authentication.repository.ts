// eslint-disable-next-line import/extensions, import/no-unresolved
import { Authentication } from '../../../src/library/entity';

export class AuthenticationRepository {
    public mockList = [
        {
            id: '62d5bb3b188314032c4f7813',
            email: 'valid_email@email.com',
            password: 'valid_hashed_password',
            salt: '123',
            user: {
                id: 'valid_user_id',
                deletedAt: null
            }
        },
        {
            id: '62d5bb3b188314032c4f7814',
            email: 'deleted_user_email@email.com',
            password: 'valid_hashed_password',
            salt: '123',
            user: {
                id: 'deleted_user_id',
                deletedAt: new Date().toISOString()
            }
        },
        {
            id: '62d5bb3b188314032c4f7815',
            email: 'registered_account_email@email.com',
            password: 'valid_hashed_password',
            salt: '123',
            user: {
                id: 'deleted_user_id'
            }
        }
    ] as unknown as Authentication[];

    public findByEmail = jest.fn().mockImplementation((email: string): Promise<Authentication> => {
        return Promise.resolve(this.mockList.find(auth => auth.email === email) as Authentication);
    });

    public insert = jest.fn().mockImplementation((): Promise<Authentication> => {
        return Promise.resolve(this.mockList[0]);
    });
}
