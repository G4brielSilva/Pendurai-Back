import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { Validations } from '../../../common/models/Validations';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { StoreRepository } from '../../../library/repository';

export class StoreValidator extends BaseValidator {
    /**
     * storeData - Valida dados da loja (name & cnpj)
     * @return { Array<RequestHandler> }
     */
    public static storeData(): Array<RequestHandler> {
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

    // /**
    //  * createStore
    //  * @return { Array<RequestHandler> }
    //  */
    // public static updateStore(): Array<RequestHandler> {
    //     const { cnpj } = Validations;
    //     return StoreValidator.validationList({
    //         name: {
    //             in: 'body',
    //             isString: true,
    //             isLength: {
    //                 options: { min: 3, max: 254 },
    //                 errorMessage: 'name must be at least 3 characters long'
    //             },
    //             errorMessage: 'name is invalid'
    //         },
    //         cnpj
    //     });
    // }

    /**
     * onlyId - Verifica se o id passado no path é válido e corresponde ao usuário autenticado
     */
    public static async onlyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { storeId } = req.params;

        const store = await new StoreRepository().findById(storeId);

        if (!store) return RouteResponse.badRequest(res, 'invalid StoreId');

        const { role, userId } = req.body.authentication;
        console.log(store);
        console.log(req.body.authentication);
        if (store?.owner.id !== userId || role !== EnumRoles.ADMIN) return RouteResponse.unauthorized(res);
        console.log(store);
        console.log(req.body.authentication);
        req.body.storeId = storeId;
        return next();
    }
}
