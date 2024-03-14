import { Hash } from '../third-party/Hash';
import { Redis } from '../third-party/Redis';

export class Password {
    public static genSalt(): string {
        return Hash.salt(16);
    }

    public static hashPassword(password: string, salt: string): string {
        return Hash.hash(password, salt);
    }

    /**
     * verifyPassword
     *
     * @param { string } providedPassword
     * @param { string } hashedPassword
     * @param { string} salt
     * @returns { boolean } Valor que define se a senha é válida ou não
     */
    public static verifyPassword(providedPassword: string, hashedPassword: string, salt: string): boolean {
        return hashedPassword === Hash.hash(providedPassword, salt);
    }

    /**
     * createCode
     *
     * @returns { number } código numérico que será utilizado para recuperação do email
     */
    private static createCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    /**
     * createRecoveryCode
     *
     * @param { string } email
     * @return { Promise<string> } Novo recoveryCode
     */
    public static async createRecoveryCode(email: string): Promise<string> {
        await Password.invalidateRecoveryCode(email);

        const recoveryCode = Password.createCode();

        await new Redis().setRecoveryCode(email, recoveryCode);
        return Promise.resolve(recoveryCode);
    }

    /**
     * invalidateRecoveryCode
     *
     * @param { string } email
     * @return { Promise<boolean> }
     */
    public static async invalidateRecoveryCode(email: string): Promise<boolean> {
        return new Redis().deleteRecoveryCode(email);
    }

    /**
     * recoveryCodeIsValid
     * @param { string } email
     * @param { string } recoveryCode
     * @return Valor que define se o código é válido ou não
     */
    public static async recoveryCodeIsValid(email: string, recoveryCode: string): Promise<boolean> {
        const isValidRecoveryCode = recoveryCode === (await new Redis().getRecoveryCode(email));

        if (isValidRecoveryCode) await new Redis().deleteRecoveryCode(email);

        return Promise.resolve(isValidRecoveryCode);
    }
}
