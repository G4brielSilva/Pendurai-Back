import crypto from 'crypto';

export class Password {
    public static verifyPassword(providedPassword: string, hashedPassword: string, salt: string): boolean {
        const hash = crypto.pbkdf2Sync(providedPassword, salt, 1000, 64, `sha512`).toString(`hex`);

        return hashedPassword === hash;
    }
}
