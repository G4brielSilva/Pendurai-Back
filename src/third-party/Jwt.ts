/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { TObject } from '../common/models/TObject';
import { Redis } from './Redis';

export class JWT {
    public static async deactiveToken(authorizationToken: string): Promise<void> {
        const token = authorizationToken.split(' ')[1];
        const result = await new Redis().addTokenBlackList(token);

        if (!result) throw new Error('Error on token deactivating');
    }

    public static generateAccessToken(userId: string, authId: string, role: string): string {
        return jwt.sign({ userId, authId, role }, process.env.JWT_TOKEN as string, { expiresIn: '8h' });
    }

    public static async decodeToken(token: string): Promise<TObject> {
        try {
            if (await new Redis().connectAndGetTokenByBlackList(token)) throw new Error('invalid Token');

            const result = jwt.verify(token, process.env.JWT_TOKEN as string);
            return Promise.resolve(result) as TObject;
        } catch (error) {
            throw new Error('invalid token');
        }
    }
}
