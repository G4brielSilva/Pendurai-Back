/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RouteResponse } from '../common/models/RouteResponse';

export class JWT {
    // eslint-disable-next-line consistent-return
    public static authenticateToken(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return RouteResponse.unauthorized('Unauthorized', res);

        jwt.verify(token, process.env.JWT_TOKEN as string);

        next();
    }

    public static generateAccessToken(userId: string, authId: string, role: string): string {
        return jwt.sign({ userId, authId, role }, process.env.JWT_TOKEN as string, { expiresIn: '8h' });
    }

    public static decodeToken(token: string): any {
        try {
            return jwt.verify(token, process.env.JWT_TOKEN as string);
        } catch (error: Error | any) {
            console.log('Error decoding token:', error.message);
            return null;
        }
    }
}
