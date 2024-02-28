import { RequestHandler } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { Validations } from '../../../common/models/Validations';

// TODO: adicionar model para poupar repetição de validação
export class StoreValidator extends BaseValidator {
    /**
     * createStore
     * @return { Array<RequestHandler> }
     */
    public static createStore(): Array<RequestHandler> {
        const { cnpj } = Validations;
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
            cnpj
        });
    }
}
