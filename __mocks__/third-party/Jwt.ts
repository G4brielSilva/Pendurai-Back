/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { RouteResponse } from '../../src/common/models/RouteResponse';
import { EnumRoles } from '../../src/common/models/enum/EnumRoles';
import { ITokens } from '../../src/third-party/Jwt';

/* eslint-disable @typescript-eslint/no-unused-vars */
const generateAccessTokenFn = jest.fn();

export class JWT {
    public static decodedTokens = {
        USER_VALID_TOKEN: { userId: 'registered_user_id', authId: '62d5bb3b188314032c4f7815', role: EnumRoles.USER },
        ADMIN_VALID_TOKEN: { userId: 'valid_user_id', authId: '62d5bb3b188314032c4f7813', role: EnumRoles.ADMIN },
        REFRESH_TOKEN: { userId: 'valid_user_id', authId: '62d5bb3b188314032c4f7813', role: EnumRoles.ADMIN }
    };

    public static authenticateToken(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader) return RouteResponse.unauthorized(res);
        const token = authHeader.split(' ')[1];

        if (!JWT.decodedTokens[token as keyof typeof JWT.decodedTokens]) return RouteResponse.unauthorized(res);

        return next();
    }

    public static generateAccessAndRefreshToken = generateAccessTokenFn.mockImplementation((userId: string, authId: string): ITokens => {
        return { accessToken: 'USER_VALID_TOKEN', refreshToken: 'REFRESH_TOKEN' };
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
