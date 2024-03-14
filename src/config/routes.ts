/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-types */
import { Router } from 'express';

export class RoutesSetup {
    public static getEndpointsFromControllers(constructor: Function): Router {
        const router: Router = Router();

        for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
            const property = constructor.prototype[key];

            if (key !== 'constructor' && typeof property === 'function') {
                const middlewares = Reflect.getMetadata('middlewares', property) || [];

                const path = Reflect.getMetadata('path', property);
                const method: string = Reflect.getMetadata('method', property);

                (router[method as keyof Router] as Function)(constructor.prototype.baseRoute + path, ...middlewares, property);
            }
        }

        return router;
    }
}
