import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';

// Repositories mock
jest.mock('../../src/library/repository/Store.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Store.repository');
});

jest.mock('../../src/library/repository/Product.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Product.repository');
});

jest.mock('../../src/library/repository/Stock.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Stock.repository');
});

// Third-Party mock
jest.mock('../../src/third-party/Jwt', () => {
    return jest.requireActual('../../__mocks__/third-party/Jwt');
});

// Utils mock
jest.mock('../../src/utils/ActionLoger', () => {
    return jest.requireActual('../../__mocks__/utils/ActionLoger');
});

const app = new App({
    path: '/api',
    port: process.env.API_PORT as unknown as number,
    middlewares: [],
    controllers: [...v1]
}).app;

const UNAUTHORIZED_USER_TOKEN = 'USER_VALID_TOKEN';
const AUTHORIZED_USER_TOKEN = 'ADMIN_VALID_TOKEN';

describe('ProductController', () => {
    describe('POST - createProduct', () => {
        const URL = '/api/product';

        const validProductCredentials = {
            storeId: '1',
            name: 'valid_product_name',
            description: 'valid_product_description'
        }

        it('should return 401 if an unauthorized User was tried to create a Product from other Store', async () => {
            const response = await request(app).post('/api/product').send({
                ...validProductCredentials,
                storeId: '2'
            }).set('Authorization', `Bearer ${UNAUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid storeId was provided', async () => {
            const response = await request(app).post('/api/product').send({
                ...validProductCredentials,
                storeId: 'invalid_store_id'
            }).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 401 if an unauthorized User was tried to create a Product', async () => {
            const response = await request(app).post(URL).send({
                ...validProductCredentials
            }).set('Authorization', `Bearer ${UNAUTHORIZED_USER_TOKEN}`);
            
            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid name was provided', async () => {
            const response = await request(app).post(URL).send({
                ...validProductCredentials,
                name: 'nm'
            }).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).post(URL).send(validProductCredentials).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);
            
            expect(response.status).toBe(200);
        });
    });

    describe('GET - listProducts', () => {
        const URL = '/api/product';

        it('should return 401 if an unauthorized User was tried to get a Product', async () => {
            const response = await request(app).get(URL);

            expect(response.status).toBe(401);
        });

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).get(URL).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });

    describe('GET - listProduct', () => {
        const URL = '/api/product';
        const validProductId = 1;

        it('should return 401 if an invalid User is trying to get a Store data', async () => {
            const response = await request(app).get(`${URL}/${validProductId}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid productId was provided', async () => {
            const response = await request(app).get(`${URL}/invalid_store_id`).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid storeId was provided', async () => {
            const response = await request(app).get(`${URL}/1`).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });

    describe('PUT - updateProduct', () => {
        const URL = '/api/product';

        const validProductCredentials = {
            productId: '1',
            name: 'valid_product_name',
            description: 'valid_product_description'
        }

        it('should return 401 if an invalid User is trying to get a Store data', async () => {
            const response = await request(app).get(URL).send(validProductCredentials);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid productId was provided', async () => {
            const response = await request(app).put(URL).send({ ...validProductCredentials, productId: 'invalid_product_id'}).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid name was provided', async () => {
            const response = await request(app).put(URL).send({
                ...validProductCredentials,
                name: 'nm'
            }).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).put(URL).send(validProductCredentials).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });

    describe('DELETE - deleteProduct', () => {
        const URL = '/api/product';

        const validProductId = 1;

        it('should return 401 if an invalid User is trying to delete a Product', async () => {
            const response = await request(app).get(`${URL}/${validProductId}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid productId was provided', async () => {
            const response = await request(app).delete(`${URL}/${'invalid_product_id'}`).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 204 if valid email and password was provided', async () => {
            const response = await request(app).delete(`${URL}/${validProductId}`).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(204);
        });
    });
});
