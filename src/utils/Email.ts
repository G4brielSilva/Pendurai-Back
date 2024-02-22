import 'dotenv/config';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';

export class Email {
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

    public async sendEmail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = this.getMailOptions(to, subject, text); // Added missing method call
        return this.transporter.sendMail(mailOptions);
    }
}
