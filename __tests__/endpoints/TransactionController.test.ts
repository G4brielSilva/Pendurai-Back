 import request from 'supertest';
import { App } from '../../src/config/App';
import { v1 } from '../../src/endpoints/v1';

// Repositories mock
jest.mock('../../src/library/repository/Authentication.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Authentication.repository');
});

jest.mock('../../src/library/repository/Store.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Store.repository');
});

jest.mock('../../src/library/repository/Cart.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Cart.repository');
});

jest.mock('../../src/library/repository/Transaction.repository', () => {
    return jest.requireActual('../../__mocks__/library/repository/Transaction.repository');
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
const ADMIN_VALID_TOKEN = 'ADMIN_VALID_TOKEN';

describe('TransactionController', () => {
    describe('POST - createTransaction', () => {
        const URL = '/api/transactions';
        const validStoreId = 1;
        const validBody = {
            transactionType: 'Compra'
        };

        it('should return 401 if an unauthorized user is trying to register a transaction', async () => {
            const response = await request(app).post(`${URL}/1`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`).send(validBody);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid storeId was provided', async () => {
            const response = await request(app).post(`${URL}/invalid-store-id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send(validBody);

            expect(response.status).toBe(400);
        });

        it('should return 400 if an invalid transactionType was provided', async () => {
            const response = await request(app).post(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send({
                transactionType: 'invalid_transaction_type'
            });

            expect(response.status).toBe(400);
        });

        it('should return 200 if valid data was provided', async () => {
            const response = await request(app).post(`${URL}/${validStoreId}`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`).send(validBody);

            expect(response.status).toBe(200);
        });
    });

    describe('DELETE - softDeleteTransaction', () => {
        const URL = '/api/transactions';
        const validTransactionId = 1;

        it('should return 401 if an unauthorized user is trying to delete a transaction', async () => {
            const response = await request(app).delete(`${URL}/1`).set('Authorization', `Bearer ${USER_VALID_TOKEN}`);

            expect(response.status).toBe(401);
        });

        it('should return 400 if an invalid transactionId was provided', async () => {
            const response = await request(app).delete(`${URL}/invalid-transaction-id`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

            expect(response.status).toBe(400);
        });

        it('should return 204 if valid data was provided', async () => {
            const response = await request(app).delete(`${URL}/${validTransactionId}`).set('Authorization', `Bearer ${ADMIN_VALID_TOKEN}`);

            expect(response.status).toBe(204);
        });
    });
});
