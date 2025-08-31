// eslint-disable-next-line import/extensions, import/no-unresolved
import { User } from '../../../src/library/entity';

export class UserRepository {
    public mockList = [
        {
            id: '62d5bb3b188314032c4f7813',
            name: 'valid_name'
        }
    ] as unknown as User[];

    public insert = jest.fn().mockImplementation((): Promise<User> => {
        return Promise.resolve(this.mockList[0]);
    });
}
