import { Password } from '../../src/utils/Password';

// Third-Party mock
jest.mock('../../src/third-party/Redis', () => {
    return jest.requireActual('../../__mocks__/third-party/Redis');
});

describe('Password', () => {
    it('should call verifyPassword with correct params', async () => {
        const verifyPasswordSpy = jest.spyOn(Password, 'verifyPassword');

        const password = 'password';
        const salt = 'valid_salt';
        const hashedPassword = 'hashed_password';

        Password.verifyPassword(password, hashedPassword, salt);

        expect(verifyPasswordSpy).toHaveBeenCalledWith(password, hashedPassword, salt);
    });


    it('should call verifyPassword with correct params', async () => {
        const createRecoveryCodeSpy = jest.spyOn(Password, 'createRecoveryCode');
        jest.spyOn(Password, 'invalidateRecoveryCode').mockResolvedValue(true);

        const email = 'valid_email';

        Password.createRecoveryCode(email);

        expect(createRecoveryCodeSpy).toHaveBeenCalledWith(email);
    });


    it('should call recoveryCodeIsValid with correct params', async () => {
        const recoveryCodeIsValidSpy = jest.spyOn(Password, 'recoveryCodeIsValid');

        const email = 'valid_email';
        const recoveryCode = 'valid_recovery_code';

        Password.recoveryCodeIsValid(email, recoveryCode);

        expect(recoveryCodeIsValidSpy).toHaveBeenCalledWith(email, recoveryCode);
    });
});
