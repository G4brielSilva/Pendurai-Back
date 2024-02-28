/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { RouteResponse } from '../../src/common/models/RouteResponse';
import { EnumRoles } from '../../src/common/models/enum/EnumRoles';

/* eslint-disable @typescript-eslint/no-unused-vars */
const generateAccessTokenFn = jest.fn();

export class JWT {
    public static decodedTokens = {
        AN_VALID_TOKEN: { user: 'AN_VALID_USER', authId: 'AN_VALID_AUTH_ID', role: EnumRoles.USER },
        ADMIN_VALID_TOKEN: { user: 'AN_VALID_USER', authId: 'AN_VALID_AUTH_ID', role: EnumRoles.ADMIN }
    };

    public static authenticateToken(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader) return RouteResponse.unauthorized('Unauthorized', res);
        const token = authHeader.split(' ')[1];

        if (!JWT.decodedTokens[token as keyof typeof JWT.decodedTokens]) return RouteResponse.unauthorized('Unauthorized', res);

        return next();
    }

    public static generateAccessToken = generateAccessTokenFn.mockImplementation((userId: string, authId: string): string => {
        return 'AN_VALID_TOKEN';
    });

    public static decodeToken(token: string): any {
        return JWT.decodedTokens[token as keyof typeof JWT.decodedTokens] || { error: true, errorMessage: 'Invalid Token' };
    }

    public static async deactiveToken(token: string): Promise<boolean> {
        return Promise.resolve(true);
    }
}

// eslint-disable-next-line prettier/prettier
export {
    generateAccessTokenFn
};
