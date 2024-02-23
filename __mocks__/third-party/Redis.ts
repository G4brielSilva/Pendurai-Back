/* eslint-disable @typescript-eslint/no-unused-vars */

export class Redis {
    public async setRecoveryCode(email: string, code: string): Promise<void> {
        return Promise.resolve();
    }

    public async getRecoveryCode(email: string): Promise<string | null> {
        return Promise.resolve('code');
    }

    public async deleteRecoveryCode(email: string): Promise<boolean> {
        return Promise.resolve(true);
    }
}
