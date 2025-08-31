import { RedisClientType, createClient } from 'redis';

export class Redis {
    private client: RedisClientType;

    /* Redis Config */

    public constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL as string
        });
    }

    /**
     * clientConnect - Conecta com o Redis
     *
     * @returns { Promise<RedisClientType> } Conexão com o Redis
     */
    private async clientConnect(): Promise<RedisClientType> {
        return this.client.connect();
    }

    /**
     * clienteClose - Fecha a conexão com o Redis
     *
     * @returns { Promise<string> } Mensagem de confirmação
     */
    private async clienteClose(): Promise<string> {
        return this.client.quit();
    }

    /**
     * createRecoveryCodeKey
     *
     * @param { string } email
     * @returns { string } key de recoveryCode
     */
    private createRecoveryCodeKey(email: string): string {
        return `recovery-code:${email}`;
    }

    /**
     * setRecoveryCode
     *
     * @param { string } email
     * @param { string } code
     * @returns { Promise<void> }
     */
    public async setRecoveryCode(email: string, code: string): Promise<void> {
        await this.clientConnect();

        await this.client.set(this.createRecoveryCodeKey(email), code, { EX: 60 * 12 });

        await this.clienteClose();
    }

    /**
     * getRecoveryCode
     *
     * @param { string } email
     * @returns { Promise<string | null> } recoveryCode
     */
    public async getRecoveryCode(email: string): Promise<string | null> {
        await this.clientConnect();

        const result = await this.client.get(this.createRecoveryCodeKey(email));

        await this.clienteClose();

        return Promise.resolve(result);
    }

    /**
     * deleteRecoveryCode
     *
     * @param { string } email
     * @returns { Promise<boolean> } Valor que define se o recoveryCode foi deletado ou não
     */
    public async deleteRecoveryCode(email: string): Promise<boolean> {
        await this.clientConnect();

        const result = await this.client.del(this.createRecoveryCodeKey(email));

        await this.clienteClose();
        return Promise.resolve(Boolean(result));
    }

    /**
     * isValidRecoveryCode
     *
     * @param { string } email
     * @param { string } code
     * @returns { Promise<boolean> } Valor que define se o código é válido ou não
     */
    public async isValidRecoveryCode(email: string, code: string): Promise<boolean> {
        const recoveryCode = await this.getRecoveryCode(email);
        return code === recoveryCode;
    }
}
