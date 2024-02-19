import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { Controller } from '../../../decorators/Contoller';
import { Middlewares } from '../../../decorators/Middlewares';
import { POST } from '../../../decorators/methods';
import { Authentication, User } from '../../../library/entity';
import { AuthenticationRepository, UserRepository } from '../../../library/repository';
import { JWT } from '../../../third-party/Jwt';
import { AuthenticationValidator } from './Authentication.validator';

@Controller('/auth')
export class AuthenticationController extends BaseController {
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Login de usuário
     *     tags: [Authentication]
     *     description: Faz o login do usuário e retorna um token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: 'email@email.com'
     *               password:
     *                 type: string
     *                 example: 'password'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @POST('/login')
    @Middlewares(AuthenticationValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const { authentication } = req.body;
        const {
            id: authId,
            user: { id: userId }
        } = authentication;

        const token = JWT.generateAccessToken(userId, authId);

        return RouteResponse.success(res, { Authorization: `Bearer ${token}` });
    }

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Cadastro de usuário
     *     tags: [Authentication]
     *     description: Faz o cadastro do usuário e retorna um token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: 'email@email.com'
     *               password:
     *                 type: string
     *                 example: 'P@2sword'
     *               passwordConfirmation:
     *                 type: string
     *                 example: 'P@2sword'
     *               name:
     *                 type: string
     *                 example: 'name'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @POST('/register')
    @Middlewares(AuthenticationValidator.register())
    public async register(req: Request, res: Response): Promise<void> {
        const { email, password, name } = req.body;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userData: DeepPartial<User> = {
            name
        };

        const user = await new UserRepository().insert(userData);

        const authenticationData: DeepPartial<Authentication> = {
            email,
            password,
            user
        };

        const authentication = await new AuthenticationRepository().insert(authenticationData);

        return RouteResponse.success(res, authentication);
    }
}
