/* eslint-disable no-plusplus */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { StoreRepository } from '../../../library/repository';

export class StoreValidator extends BaseValidator {
    /**
     * storeData - Valida dados da loja (name & cnpj)
     * @return { Array<RequestHandler> }
     */
    public static storeData(): Array<RequestHandler> {
        return StoreValidator.validationList({
            name: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 3, max: 254 },
                    errorMessage: 'name must be at least 3 characters long'
                },
                errorMessage: 'name is invalid'
            },
            cnpj: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 14, max: 14 },
                    errorMessage: 'cnpj must be at least 14 characters long'
                },
                custom: {
                    options: async (cnpj: string): Promise<void> => {
                        const digits = new Set(cnpj);
                        if (digits.size === 1) return Promise.reject();

                        let size = cnpj.length - 2;
                        let numbers = cnpj.substring(0, size);
                        const verifiersDigits = cnpj.substring(size);

                        let sum = 0;
                        let pos = size - 7;

                        for (let i = size; i >= 1; i--) {
                            sum += Number(numbers.charAt(size - i)) * pos--;
                            if (pos < 2) pos = 9;
                        }
                        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
                        if (result !== Number(verifiersDigits.charAt(0))) return Promise.reject();

                        size += 1;
                        numbers = cnpj.substring(0, size);
                        sum = 0;
                        pos = size - 7;

                        for (let i = size; i >= 1; i--) {
                            sum += Number(numbers.charAt(size - i)) * pos--;
                            if (pos < 2) pos = 9;
                        }
                        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
                        if (result !== Number(verifiersDigits.charAt(1))) return Promise.reject();

                        // Verifing if cnpj already exists in the system

                        const store = await new StoreRepository().findStoreByCnpj(cnpj);

                        // eslint-disable-next-line prefer-promise-reject-errors
                        if (store) return Promise.reject('cnpj already registered in the system');

                        return Promise.resolve();
                    }
                },
                errorMessage: 'cnpj is invalid'
            }
        });
    }

    /**
     * onlyId - Verifica se o id passado no path é válido e corresponde ao usuário autenticado
     */
    public static async onlyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { storeId } = req.params;

        const store = await new StoreRepository().findById(storeId);

        if (!store) return RouteResponse.badRequest(res, 'invalid StoreId');

        const { role, userId } = req.body.authentication;

        if (store?.owner.id !== userId && role !== EnumRoles.ADMIN) return RouteResponse.unauthorized(res);

        req.body.storeId = storeId;
        return next();
    }
}
