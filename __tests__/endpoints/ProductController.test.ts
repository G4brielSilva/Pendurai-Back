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

const UNAUTHORIZED_USER_TOKEN = 'USER_VALID_TOKEN';
const AUTHORIZED_USER_TOKEN = 'ADMIN_VALID_TOKEN';

describe('ProductController', () => {
    describe('POST - createProduct', () => {
        const URL = '/api/store/1/product';

        const validProductCredentials = {
            name: 'valid_product_name',
            description: 'valid_product_description'
        }

        it('should return 401 if an unauthorized User was tried to create a Product in a Store', async () => {
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

    describe('PUT - updateProduct', () => {
        const URL = '/api/store/1/product';

        const validProductCredentials = {
            name: 'valid_product_name',
            description: 'valid_product_description'
        }

        it('should return 401 if an unauthorized User was tried to update a Product in a Store', async () => {
            const response = await request(app).put(`${URL}/1`).send({
                ...validProductCredentials
            }).set('Authorization', `Bearer ${UNAUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(401);
        });

        it('should return 401 if an User was tried to update a Product from another Store', async () => {
            const response = await request(app).put(`/api/store/2/product/1`).send({
                ...validProductCredentials
            }).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid productId was provided', async () => {
            const response = await request(app).put(`${URL}/invalid_product_id`).send(validProductCredentials).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid name was provided', async () => {
            const response = await request(app).put(`${URL}/1`).send({
                ...validProductCredentials,
                name: 'nm'
            }).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid email and password was provided', async () => {
            const response = await request(app).put(`${URL}/1`).send(validProductCredentials).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(200);
        });
    });

    describe('DELETE - deleteProduct', () => {
        const URL = '/api/store/1/product';

        const validProductId = 1;

        it('should return 401 if an unauthorized User was tried to update a Product in a Store', async () => {
            const response = await request(app).delete(`${URL}/${validProductId}`).set('Authorization', `Bearer ${UNAUTHORIZED_USER_TOKEN}`);

            expect(response.status).toBe(401);
        });

        it('should return 401 if an User was tried to update a Product from another Store', async () => {
            const response = await request(app).delete(`/api/store/2/product/${validProductId}`).set('Authorization', `Bearer ${AUTHORIZED_USER_TOKEN}`);

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
