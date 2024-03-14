import { RedisClientType, createClient } from 'redis';

export class Redis {
    private client: RedisClientType;

    /* Redis Config */

    public constructor() {
        this.client = createClient({
            url: 'redis://default:anRedisPassword@pendurai-redis:6379' || (process.env.REDIS_URL as string)
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

    /* Auth Token Management */

    /**
     * createBlackListAuthKey
     *
     * @param { string } key
     * @returns { string } key para inserção em blacklist no Redis
     */
    private createBlackListAuthKey(key: string): string {
        return `auth-token:blacklist:${key}`;
    }

    /**
     * addTokenBlackList - adiciona token a blacklist
     *
     * @param { string } key
     * @returns { Promise<boolean> } Valor que define se o token foi adicionado ou não
     */
    public async addTokenBlackList(key: string): Promise<boolean> {
        await this.clientConnect();

        await this.client.set(this.createBlackListAuthKey(key), 'true', { EX: 60 * 60 * 24, NX: true });
        const result = await this.getTokenByBlackList(this.createBlackListAuthKey(key));

        await this.clienteClose();

        return Promise.resolve(Boolean(result));
    }

    /**
     * getTokenByBlackList
     *
     * @param { string } key
     * @returns { Promise<string | null> } Token da blacklist
     */
    private async getTokenByBlackList(key: string): Promise<string | null> {
        const result = await this.client.get(key);
        return Promise.resolve(result);
    }

    /**
     * connectAndGetTokenByBlackList
     *
     * @param { string } key
     * @returns { Promise<string | null> } Recupera Token da blacklist
     */
    public async connectAndgetTokenByBlackList(key: string): Promise<string | null> {
        await this.clientConnect();

        const result = await this.getTokenByBlackList(this.createBlackListAuthKey(key));

        await this.clienteClose();

        return Promise.resolve(result);
    }

    /* Password Recovery Code Management */

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
