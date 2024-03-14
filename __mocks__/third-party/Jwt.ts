/* eslint-disable @typescript-eslint/no-unused-vars */
export class JWT {
    public static authenticateToken(req: any, res: any, next: any): any {
        return next();
    }

    public static generateAccessToken(userId: string, authId: string): string {
        return 'AN_VALID_TOKEN';
    }

    public static decodeToken(token: string): any {
        return { user: 'AN_VALID_USER', authId: 'AN_VALID_AUTH_ID' };
    }
}
