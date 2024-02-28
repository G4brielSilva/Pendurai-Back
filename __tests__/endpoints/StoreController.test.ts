import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';

// Repositories mock
jest.mock('../../src/library/repository/Store.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Store.repository');
});

// jest.mock('../../src/library/repository/User.repository', () => {
//     return jest.requireActual('../../__mocks__/library/repository/User.repository');
// });

// Third-Party mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

// // Utils mock
// jest.mock('../../src/utils/Email', () => {
//     return jest.requireActual('../../__mocks__/utils/Email');
// });

// jest.mock('../../src/utils/Password', () => {
//     return jest.requireActual('../../__mocks__/utils/Password');
// });



const app = new App({
    path: '/api',
    port: process.env.API_PORT as unknown as number,
    middlewares: [],
    controllers: [...v1]
}).app;

const AN_VALID_TOKEN = 'AN_VALID_TOKEN';

describe('StoreController', () => {
    describe('POST - createStore', () => {
        const URL = '/api/store';

        const validStoreCredentials = {
            name: 'valid_store_name',
            cnpj: '62781317000160'
        }

        it('should return 400 if an invalid name was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validStoreCredentials,
                name: 'nm'
            });

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid cnpj was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validStoreCredentials,
                cnpj: 'invalid_cnpj'
            });

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).post(URL).send(validStoreCredentials).set('Authorization', `Bearer ${AN_VALID_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });
});
