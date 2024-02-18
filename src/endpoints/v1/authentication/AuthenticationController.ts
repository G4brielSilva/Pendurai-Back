import { Request, Response } from 'express';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { Controller } from '../../../decorators/Contoller';
import { Middlewares } from '../../../decorators/Middlewares';
import { POST } from '../../../decorators/methods';
import { AuthenticationRepository } from '../../../library/repository';
import { JWT } from '../../../third-party/Jwt';
import { Password } from '../../../utils/Password';
import { AuthenticationValidator } from './Authentication.validator';

@Controller('/auth')
export class AuthenticationController extends BaseController {
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Login de usuário
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
        const { email, password } = req.body;

        const authentication = await new AuthenticationRepository().getHashedPassword(email);
        if (!authentication || authentication.user.deletedAt) return RouteResponse.badRequest(res, 'Credenciais Inválidas');

        const { password: hashedPassword, salt, user, id: authId } = authentication;

        if (!Password.verifyPassword(password, hashedPassword, salt as string)) return RouteResponse.badRequest(res, 'Credenciais Inválidas');

        const token = JWT.generateAccessToken(user.id, authId);

        return RouteResponse.success(res, { Authorization: `Bearer ${token}` });
    }
}
