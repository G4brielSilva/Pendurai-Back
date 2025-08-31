 import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';
import { Password } from '../../src/utils/Password';

// Repositories mock
jest.mock('../../src/library/repository/Authentication.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Authentication.repository');
});

jest.mock('../../src/library/repository/User.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/User.repository');
});

// Third-Party mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

// Utils mock
jest.mock('../../src/utils/Email', () => {
    return jest.requireActual('../../__mocks__/utils/Email');
});

jest.mock('../../src/utils/Password', () => {
    return jest.requireActual('../../__mocks__/utils/Password');
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

        it('should return 400 if a login is tried to a non existing User', async () => {
            spyVerifyPassword.mockReturnValueOnce(true);

            const response = await request(app).post(URL).send({
                ...validLoginCredentials,
                email: 'non_existing_account@email.com'
            });

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            spyVerifyPassword.mockReturnValueOnce(true);

            const response = await request(app).post(URL).send(validLoginCredentials);

            expect(response.status).toBe(200);
        });
    });

    describe('POST - refresh-token', () => {
        const URL = '/api/auth/refresh-token';
        const validBody = {
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZmJiMTgwYS02NDJlLTQ4N2QtYTM3Ni04MTJkYjI5NzZiY2IiLCJhdXRoSWQiOiJhYWZjODU3ZC01MjVmLTRiNmEtYjFjYy1jOTAyOTVkMDVjODgiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NjY1NzIzNywiZXhwIjoxNzU2Njg2MDM3fQ.eZRPkC46VGwP48igRdCBj1MaWJmMQKOlxWDLVoVrUbs'
        };

        it('should return 400 if no refreshToken was provided', async () => {
            const response = await request(app).post(URL).send({});
            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid refreshToken was provided', async () => {
            const response = await request(app).post(URL).send({ refreshToken: 'invalid_refresh_token'});
            expect(response.status).toBe(400);
        });

        it('should return 200 if a valid refreshToken was provided', async () => {
            const response = await request(app).post(URL).send(validBody);

            expect(response.status).toBe(200);
        });
    });

    describe('POST - forgot-password', () => {
        const URL = '/api/auth/forgot-password';
        const validBody = {
            email: 'valid_email@email.com'
        };

        it('should return 400 if an invalid email was provided', async () => {
            const response = await request(app).post(URL).send({ email: 'invalid_email'});

            expect(response.status).toBe(400);
        });
        
        it('should return 204 if an valid email was provided', async () => {
            const response = await request(app).post(URL).send(validBody);

            expect(response.status).toBe(204);
        });
    });

    describe('GET - verify-recovery-code/:recoveryCode', () => {
        const URL = '/api/auth/verify-recovery-code';
        const validCode = 'ABC123'

        it('should return 400 if an invalid code was provided', async () => {
            const response = await request(app).get(`${URL}/invalid_code`);

            expect(response.status).toBe(400);
        });

        it('should return 204 if an valid email was provided', async () => {
            const response = await request(app).get(`${URL}/${validCode}`);

            expect(response.status).toBe(204);
        });
    });

    describe('PUT - change-password', () => {
        const URL = '/api/auth/change-password';

        const validBody = {
            email: 'valid_email@email.com',
            recoveryCode: 'ABCDEF',
            newPassword: 'P@2sw0rd'
        };

        it('should return 400 if an invalid email was provided', async () => {
            const response = await request(app).put(URL).send({ ...validBody, email: 'invalid_email'});

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid recoveryCode was provided', async () => {
            const response = await request(app).put(URL).send({ ...validBody, recoveryCode: 'invalid_recoveryCode'});

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid newPassword was provided', async () => {
            const response = await request(app).put(URL).send({ ...validBody, newPassword: 'invalid_newPassword'});

            expect(response.status).toBe(400);
        });

        it('should return 200 if an valid body was provided', async () => {
            const response = await request(app).put(URL).send(validBody);

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
