/* eslint-disable no-plusplus */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { EnumTransactions } from '../../../common/models/enum/EnumTransactions';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { Transaction } from '../../../library/entity';
import { TransactionRepository } from '../../../library/repository';

export class TransactionValidator extends BaseValidator {
    /**
     * transactionBody - Valida tipo de Transação
     * @return { Array<RequestHandler> }
     */
    public static transactionBody(): Array<RequestHandler> {
        return TransactionValidator.validationList({
            transactionType: {
                in: 'body',
                isString: true,
                isIn: {
                    options: [Object.values(EnumTransactions)]
                },
                errorMessage: 'transactionType is invalid'
            }
        });
    }

    /**
     * transactionId - Validação de Id de Transação
     * @return { Array<RequestHandler> }
     */
    private static transactionId(): Array<RequestHandler> {
        return this.validationList({
            transactionId: {
                in: 'params',
                isString: true,
                custom: {
                    options: async (value: string, { req }): Promise<void> => {
                        const transaction = await new TransactionRepository().findById(value);

                        if (!transaction) return Promise.reject();
                        req.body.transactionId = value;
                        return Promise.resolve();
                    },
                    errorMessage: 'invalid transactionId'
                },
                errorMessage: 'transactionId is invalid'
            }
        });
    }

    private static async userCanAcessTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { transactionId } = req.body;
        const transaction = (await new TransactionRepository().findById(transactionId)) as Transaction;

        const { id: ownerId } = transaction.cart.store.owner;
        const { userId } = req.body.authentication;

        if (ownerId !== userId) return RouteResponse.unauthorized(res);

        return next();
    }

    public static onlyId(): Array<RequestHandler> {
        return [...this.transactionId(), this.userCanAcessTransaction];
    }
}
