/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { TObject } from '../common/models/TObject';
import { Redis } from './Redis';

export class JWT {
    // eslint-disable-next-line consistent-return
    public static async deactiveToken(authorizationToken: string | undefined): Promise<string | void> {
        if (!authorizationToken) return Promise.resolve();

        const token = authorizationToken.split(' ')[1];
        return new Redis().addTokenBlackList(token);
    }

    public static generateAccessToken(userId: string, authId: string, role: string): string {
        return jwt.sign({ userId, authId, role }, process.env.JWT_TOKEN as string, { expiresIn: '8h' });
    }

    public static async decodeToken(token: string): Promise<TObject> {
        if (await new Redis().connectAndgetTokenByBlackList(token)) return { error: 'Token is deactivated' };
        const result = jwt.verify(token, process.env.JWT_TOKEN as string);
        return Promise.resolve(result as TObject);
    }
}
