/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transaction } from '../../../src/library/entity';

export class TransactionRepository {
    private mockList = [
        {
            id: '1',
            total: 100.0,
            transactionType: 'Compra',
            cart: {
                id: '1',
                store: {
                    id: '1',
                    owner: {
                        id: 'valid_user_id'
                    }
                }
            }
        }
    ] as unknown as Transaction[];

    public async create(transaction: Transaction): Promise<Transaction> {
        return Promise.resolve(this.mockList[0]);
    }

    public async createTransaction(transaction: Transaction): Promise<Transaction> {
        return Promise.resolve(this.mockList[0]);
    }

    public async findById(id: string): Promise<Transaction | undefined> {
        return Promise.resolve(this.mockList.find(transaction => transaction.id === id));
    }

    public async softDelete(id: string): Promise<Transaction> {
        return Promise.resolve({ ...this.mockList[0], deletedAt: new Date() });
    }
}
