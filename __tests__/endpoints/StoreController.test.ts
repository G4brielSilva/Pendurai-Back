import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';
import { StoreRepository } from '../../src/library/repository';

// Repositories mock
jest.mock('../../src/library/repository/Store.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Store.repository');
});

// Third-Party mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

const app = new App({
    path: '/api',
    port: process.env.API_PORT as unknown as number,
    middlewares: [],
    controllers: [...v1]
}).app;

const USER_VALID_TOKEN = 'USER_VALID_TOKEN';

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
            const response = await request(app).post(URL).send(validStoreCredentials).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET - listStores', () => {
        const URL = '/api/store';

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).get(URL).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET - listStore', () => {
        const URL = '/api/store';
        const validStoreId = 1;

        it('should return 400 if an invalid storeId was provided', async () => {
            const response = await request(app).get(`${URL}/invalid_store_id`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid storeId was provided', async () => {
            const response = await request(app).get(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.status).toBe(200);
        });

        it('should return empty data if incorrect id was used to get Store', async () => {
            jest.spyOn(StoreRepository.prototype, 'findStoreById').mockResolvedValueOnce(null);
            const response = await request(app).get(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.body.data).toBeFalsy();
        });

        it('should return store data if correct id was used to get Store', async () => {
            const response = await request(app).get(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.body.data).toBeTruthy();
        });
    });
});
