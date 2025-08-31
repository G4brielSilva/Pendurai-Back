import { MailSender } from '../third-party/MailSender';
import { Password } from './Password';

export class Email {
    /**
     * sendForgotPasswordEmail
     *
     * @param { string } email
     * @returns { Promise<void> }
     */
    public static async sendForgotPasswordEmail(email: string): Promise<void> {
        const mailSender = new MailSender();

        const recoveryCode = await Password.createRecoveryCode(email);

        // Sending the email
        const html = await mailSender.getTemplate('forgot-password');
        return mailSender.sendEmail(email, 'Recuperação de senha - Penduraí', `Recovery Code: ${recoveryCode}`, html, { recoveryCode });
    }
}
