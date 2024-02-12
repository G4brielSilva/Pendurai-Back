import { Router } from 'express';
import { authRouter } from './endpoints';

const routes = Router();

routes.use('/', authRouter);

export { routes };
