/* eslint-disable no-plusplus */
import { RequestHandler } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';

export class ProductValidator extends BaseValidator {
    /**
     * storeData - Valida dados da loja (name & cnpj)
     * @return { Array<RequestHandler> }
     */
    public static createProduct(): Array<RequestHandler> {
        return ProductValidator.validationList({
            name: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 3, max: 254 },
                    errorMessage: 'name must be at least 3 characters long'
                },
                errorMessage: 'name is invalid'
            }
        });
    }
}
