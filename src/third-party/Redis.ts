import { RedisClientType, createClient } from 'redis';

export class Redis {
    private client: RedisClientType;

    public constructor() {
        this.client = createClient({
            url: 'redis://default:anRedisPassword@pendurai-redis:6379' || (process.env.REDIS_URL as string)
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async addTokenBlackList(key: string): Promise<string | null> {
        await this.clientConnect();

        await this.client.set(`blacklist:${key}`, 'true', { EX: 60 * 60 * 24, NX: true });
        const result = await this.getTokenByBlackList(`blacklist:${key}`);

        await this.clienteClose();

        return Promise.resolve(result);
    }

    private async getTokenByBlackList(key: string): Promise<string | null> {
        const result = await this.client.get(key);
        return Promise.resolve(result);
    }

    public async connectAndgetTokenByBlackList(key: string): Promise<string | null> {
        await this.clientConnect();

        const result = await this.getTokenByBlackList(`blacklist:${key}`);

        await this.clienteClose();

        return Promise.resolve(result);
    }

    private async clientConnect(): Promise<RedisClientType> {
        return this.client.connect();
    }

    private async clienteClose(): Promise<string> {
        return this.client.quit();
    }
}
