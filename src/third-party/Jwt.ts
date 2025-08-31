/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import { TObject } from '../common/models/TObject';

export interface ITokens {
    accessToken: string;
    refreshToken: string;
}

export class JWT {
    public static generateAccessAndRefreshToken(userId: string, authId: string, role: string): ITokens {
        const accessToken = jwt.sign({ userId, authId, role }, process.env.JWT_TOKEN as string, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId, authId, role }, process.env.JWT_TOKEN as string, { expiresIn: '8h' });
        return { accessToken, refreshToken };
    }

    public static async decodeToken(token: string): Promise<TObject> {
        try {
            const result = jwt.verify(token, process.env.JWT_TOKEN as string);
            return Promise.resolve(result) as TObject;
        } catch (error) {
            throw new Error('invalid token');
        }
    }
}
