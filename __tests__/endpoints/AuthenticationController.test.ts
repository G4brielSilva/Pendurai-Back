import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';
import { Password } from '../../src/utils/Password';

// Authentication repository mock
jest.mock('../../src/library/repository/Authentication.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Authentication.repository');
});

// User repository mock
jest.mock('../../src/library/repository/User.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/User.repository');
});

// JWT mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

const app = new App({
    path: '/api',
    port: process.env.API_PORT as unknown as number,
    middlewares: [],
    controllers: [...v1]
}).app;
describe('AuthenticationController', () => {
    describe('POST - login', () => {
        const URL = '/api/auth/login';

        const validLoginCredentials = {
            email: 'valid_email@email.com',
            password: 'V@lid_P4ssw0rd'
        }

        const spyVerifyPassword = jest.spyOn(Password, 'verifyPassword');

        it('should return 400 if an invalid email was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validLoginCredentials,
                email: 'invalid_email'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid password was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validLoginCredentials,
                password: '123'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if a login is tried to a deleted User', async () => {
            spyVerifyPassword.mockReturnValueOnce(true);

            const response = await request(app).post(URL).send({
                ...validLoginCredentials,
                email: 'deleted_user_email@email.com'
            });

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            spyVerifyPassword.mockReturnValueOnce(true);

            const response = await request(app).post(URL).send(validLoginCredentials);

            expect(response.status).toBe(200);
        });
    });

    describe('POST - register', () => {
        const URL = '/api/auth/register';

        const validRegisterCredentials = {
            email: 'valid_email_to_register@email.com',
            password: 'V@lid_P4ssw0rd',
            passwordConfirmation: 'V@lid_P4ssw0rd',
            name: 'valid_name'
        }

        it('should return 400 if an invalid email was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validRegisterCredentials,
                email: 'invalid_email'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid password was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validRegisterCredentials,
                password: '123'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if passwordConfirmation is different to password', async () => {
            const response = await request(app).post(URL).send({
                ...validRegisterCredentials,
                passwordConfirmation: 'an_password_confirmation'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid name is provided', async () => {
            const response = await request(app).post(URL).send({
                ...validRegisterCredentials,
                name: 'ab'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if a register is tried with an existing account', async () => {
            const response = await request(app).post(URL).send({
                ...validRegisterCredentials,
                email: 'registered_account_email@email.com'
            });

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).post(URL).send(validRegisterCredentials);

            expect(response.status).toBe(200);
        });
    });
});
