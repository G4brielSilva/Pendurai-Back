import crypto from 'crypto';

export function verifyPassword(providedPassword: string, hashedPassword: string, salt: string): boolean {
    const hash = crypto.pbkdf2Sync(providedPassword, salt, 1000, 64, `sha512`).toString(`hex`);
    console.log(hash, hashedPassword);
    return hashedPassword === hash;
}
