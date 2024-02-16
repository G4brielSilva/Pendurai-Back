import { Express, Router } from 'express';
import { authRouter } from './endpoints';

export function setupRoutes(app: Express): void {
    const router = Router();
    router.use('/auth', authRouter);
    app.use('/api', router);
}
