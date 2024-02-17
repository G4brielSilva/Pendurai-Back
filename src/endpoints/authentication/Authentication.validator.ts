import { RequestHandler } from 'express';
// import { RouteResponse } from '../../common/models/RouteResponse';
import { BaseValidator } from '../../common/models/BaseValidator';

export class AuthenticationValidator extends BaseValidator {
    public static login(): Array<RequestHandler> {
        return AuthenticationValidator.validationList({
            email: {
                in: 'body',
                isEmail: true,
                errorMessage: 'Email inválido'
            },
            password: {
                in: 'body',
                isString: true,
                isLength: {
                    options: { min: 8 },
                    errorMessage: 'Senha inválida'
                },
                errorMessage: 'Senha inválida'
            }
        });
    }
}
