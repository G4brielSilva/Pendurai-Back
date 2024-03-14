import { RequestHandler } from 'express';
import { Schema, checkSchema, validationResult } from 'express-validator';
import { RouteResponse } from './RouteResponse';

export class BaseValidator {
    protected static validationList(schema: Schema): Array<RequestHandler> {
        return [
            ...checkSchema(schema),
            // eslint-disable-next-line consistent-return
            (req, res, next): void => {
                const errors = validationResult(req);

                if (!errors.isEmpty) return RouteResponse.badRequest(res, errors);
                next();
            }
        ];
    }
}
