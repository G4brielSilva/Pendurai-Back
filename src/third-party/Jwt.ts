import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class JWT {
    // eslint-disable-next-line consistent-return
    public static authenticateToken(req: Request, res: Response, next: NextFunction): any {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_TOKEN as string);

        next();
    }

    public static generateAccessToken(userId: string, authId: string): string {
        return jwt.sign({ userId, authId }, process.env.JWT_TOKEN as string, { expiresIn: '8h' });
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
