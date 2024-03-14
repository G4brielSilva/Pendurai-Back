import { RequestHandler } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { Validations } from '../../../common/models/Validations';
import { StoreRepository } from '../../../library/repository';

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

    public static listStoreById(): Array<RequestHandler> {
        return StoreValidator.validationList({
            storeId: {
                in: 'params',
                isString: true,
                custom: {
                    options: async (storeId: string, { req }): Promise<void> => {
                        const store = await new StoreRepository().findById(storeId);
                        req.body.storeId = storeId;

                        return store ? Promise.resolve() : Promise.reject();
                    }
                },
                errorMessage: 'storeId is invalid'
            }
        });
    }
}
