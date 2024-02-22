import { TObject } from 'common/models/TObject';
import 'dotenv/config';
import { readFile } from 'fs/promises';
import mustache from 'mustache';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import path from 'path';

export class MailSender {
    private transporter: Transporter;

    public constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    private getMailOptions(to: string, subject: string, text: string, html?: string): SendMailOptions {
        return {
            from: `Pendurai <${process.env.EMAIL_ORIGIN}>`,
            replyTo: process.env.EMAIL_REPLY_TO,
            to,
            subject,
            text,
            html
        };
    }

    public async sendEmail(to: string, subject: string, text: string, html?: string, htmlParameters?: TObject): Promise<void> {
        const renderedHtml = this.renderHtml(html, htmlParameters);

        const mailOptions = this.getMailOptions(to, subject, text, renderedHtml);
        return this.transporter.sendMail(mailOptions);
    }

    private renderHtml(html?: string, parameters?: TObject): string | undefined {
        return html ? mustache.render(html, parameters) : html;
    }

    private async getHtml(htmlPath: string, encoding: BufferEncoding | null = 'utf8'): Promise<string | Buffer> {
        const resolvedPath = path.resolve(htmlPath);
        return readFile(resolvedPath, encoding);
    }

    /**
     * getTemplate - Retorna template HTML para emails
     *
     * @param { string } templateName - Nome do template sem a extensão html
     * @returns { Promise<string> } conteúdo do template
     */
    public async getTemplate(templateName: string): Promise<string> {
        return this.getHtml(`/app/templates/${templateName}.html`) as Promise<string>;
    }
}
