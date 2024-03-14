/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable lines-between-class-members */

export class Password {
    public static async recoveryCodeIsValid(email: string, recoveryCode: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public static verifyPassword(providedPassword: string, hashedPassword: string, salt: string): boolean {
        return false;
    }

    public static async invalidateRecoveryCode(email: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    public static async createRecoveryCode(email: string): Promise<string> {
        return Promise.resolve('code');
    }
}
