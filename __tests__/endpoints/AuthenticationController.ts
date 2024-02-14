import request from 'supertest';
import { app } from '../../src/server';
import { Password } from '../../src/utils/Password';

// Authentication repository mock
jest.mock('../../src/library/repository/Authentication.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Authentication.repository');
});

// JWT mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

jest.useFakeTimers();

describe('POST /login', () => {
    const validLoginCredentials = {
        email: 'valid_email@email.com',
        password: 'valid_password'
    }

    const spyVerifyPassword = jest.spyOn(Password, 'verifyPassword');

    it('should return 400 if an invalid email was provided', async () => {
        const response = await request(app).post('/login').send({
            ...validLoginCredentials,
            email: 'invalid_email@email.com'
        });

        expect(response.status).toBe(400);
    });

    it('should return 400 if an invalid password was provided', async () => {
        const response = await request(app).post('/login').send({
            ...validLoginCredentials,
            password: 'invalid_password'
        });

        expect(response.status).toBe(400);
    });

    it('should return 200 if valid email and password was provided', async () => {
        spyVerifyPassword.mockReturnValueOnce(true);

        const response = await request(app).post('/login').send(validLoginCredentials);

        expect(response.status).toBe(200);
    });
});
