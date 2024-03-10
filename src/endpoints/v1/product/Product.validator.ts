/* eslint-disable no-plusplus */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BaseValidator } from '../../../common/models/BaseValidator';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { ProductRepository } from '../../../library/repository';

export class ProductValidator extends BaseValidator {
    /**
     * productData - Valida dados de criação de Product (name)
     * @return { Array<RequestHandler> }
     */
    public static productData(): Array<RequestHandler> {
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

    /**
     * onlyId - Verifica se o id passado no path é válido e correspondente a Loja
     */
    public static async onlyId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { productId } = req.params;

        if (!productId) return RouteResponse.badRequest(res, 'productId are required');

        const product = await new ProductRepository().findById(productId);
        if (!product) return RouteResponse.badRequest(res, 'invalid productId');

        const { storeId } = req.body;
        if (product.store.id !== storeId) return RouteResponse.unauthorized(res, 'The product does not belong to this store.');

        req.body.storeId = storeId;
        return next();
    }
}
