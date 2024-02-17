/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/ban-types */
import { Express, Router } from 'express';
import { AuthenticationController } from '../endpoints';

export function getEndpointsFromControllers(constructor: Function): Router {
    const router: Router = Router();

    for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
        const property = constructor.prototype[key];

        if (key !== 'constructor' && typeof property === 'function') {
            const middlewares = Reflect.getMetadata('middlewares', property);

            const path = Reflect.getMetadata('path', property);
            const method: string = Reflect.getMetadata('method', property);
            (router[method as keyof Router] as Function)(path, ...middlewares, property);
        }
    }

    return router;
}

export function setupRoutes(app: Express): void {
    const router = Router();
    router.use(new AuthenticationController().baseRoute, getEndpointsFromControllers(AuthenticationController));
    app.use('/api', router);
}
