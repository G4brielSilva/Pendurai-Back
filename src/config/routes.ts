/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-types */
import { NextFunction, Request, Response, Router } from 'express';
import { RouteResponse } from '../common/models/RouteResponse';
import { JWT } from '../third-party/Jwt';

export class RoutesSetup {
    public static getEndpointsFromControllers(constructor: Function): Router {
        const router: Router = Router();

        for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
            const property = constructor.prototype[key];

            if (key !== 'constructor' && typeof property === 'function') {
                const middlewares = Reflect.getMetadata('middlewares', property) || [];

                const roles = Reflect.getMetadata('roles', property);
                const rolesMiddleware = RoutesSetup.getRolesMiddlewares(roles);

                const path = Reflect.getMetadata('path', property);
                const method: string = Reflect.getMetadata('method', property);

                (router[method as keyof Router] as Function)(constructor.prototype.baseRoute + path, rolesMiddleware, ...middlewares, property);
            }
        }

        return router;
    }

    private static getRolesMiddlewares(roles: string[]): any {
        if (roles.length === 0) return (req: Request, res: Response, next: NextFunction) => next();

        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) return RouteResponse.unauthorized(res);

                const result = await JWT.decodeToken(token as string);

                if (result?.error) return RouteResponse.badRequest(res, result.errorMessage);
                if (!result || !roles.includes(result?.role)) return RouteResponse.unauthorized(res);
                req.body.authentication = result;
                return next();
            } catch (error: Error | any) {
                return RouteResponse.serverError(error.message, res);
            }
        };
    }
}
