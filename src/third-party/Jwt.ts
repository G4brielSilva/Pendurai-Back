/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { TObject } from '../common/models/TObject';
import { Redis } from './Redis';

export class JWT {
    // eslint-disable-next-line consistent-return
    public static async deactiveToken(authorizationToken: string | undefined): Promise<void> {
        if (!authorizationToken) return Promise.resolve();

        const token = authorizationToken.split(' ')[1];
        const result = await new Redis().addTokenBlackList(token);
        return result ? Promise.resolve() : Promise.reject(new Error('Error on token deactivating'));
    }

    public static generateAccessToken(userId: string, authId: string, role: string): string {
        return jwt.sign({ userId, authId, role }, process.env.JWT_TOKEN as string, { expiresIn: '8h' });
    }

    public static async decodeToken(token: string): Promise<TObject> {
        let result: TObject;

        try {
            if (await new Redis().connectAndgetTokenByBlackList(token)) return { error: 'Token is deactivated' };

            result = jwt.verify(token, process.env.JWT_TOKEN as string) as TObject;
        } catch (error) {
            return { error: 'Invalid Token' };
        }

        return Promise.resolve(result as TObject);
    }
}
