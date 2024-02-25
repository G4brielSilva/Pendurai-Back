import crypto from 'crypto';

export class Hash {
    public static salt(size: number): string {
        return crypto.randomBytes(size).toString('hex');
    }

    public static hash(value: string, salt?: string): string {
        // With salt
        if (salt) return crypto.pbkdf2Sync(value, salt, 1000, 64, `sha512`).toString(`hex`);

        // Without salt
        return crypto.createHash('sha5125').update(value).digest('hex');
    }
}
