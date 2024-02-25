import { Email } from '../../src/utils/Email';

// Third-Party mock
jest.mock('../../src/third-party/MailSender', () => {
    return jest.requireActual('../../__mocks__/third-party/MailSender');
});

// Utils mock
jest.mock('../../src/utils/Password', () => {
    return jest.requireActual('../../__mocks__/utils/Password');
});

describe('Email', () => {
    it('should call sendForgotPasswordEmail with correct params', async () => {
        const sendForgotPasswordEmailSpy = jest.spyOn(Email, 'sendForgotPasswordEmail');

        const email = 'email@email.com';

        await Email.sendForgotPasswordEmail(email);

        expect(sendForgotPasswordEmailSpy).toHaveBeenCalledWith(email);
    });
});
