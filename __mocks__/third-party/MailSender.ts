export class MailSender {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async sendEmail(...args: string[]): Promise<void> {
        return Promise.resolve();
    }

    public async getTemplate(template: string): Promise<string> {
        return Promise.resolve(template);
    }
}
