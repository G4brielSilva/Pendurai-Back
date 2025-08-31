import { Request, Response } from 'express';
import { DeepPartial } from 'typeorm';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { Controller } from '../../../decorators/Controller';
import { Get, Post, Put } from '../../../decorators/Methods';
import { Middlewares } from '../../../decorators/Middlewares';
import { Authentication, User } from '../../../library/entity';
import { AuthenticationRepository, UserRepository } from '../../../library/repository';
import { JWT } from '../../../third-party/Jwt';
import { Email } from '../../../utils/Email';
import { AuthenticationValidator } from './Authentication.validator';
import { Log } from '../../../decorators/Log';

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
     *                 example: 'P@2sword'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/success'
     */
    @Post('/login')
    @Middlewares(AuthenticationValidator.login())
    public async login(req: Request, res: Response): Promise<void> {
        const { authentication } = req.body;
        const {
            id: authId,
            user: { id: userId },
            admin
        } = authentication;

        const role = admin ? EnumRoles.ADMIN : EnumRoles.USER;
        const tokens = JWT.generateAccessAndRefreshToken(userId, authId, role);

        return RouteResponse.success(res, tokens);
    }

    /**
     * @swagger
     * /api/auth/refresh-token:
     *   post:
     *     summary: Gera um novo par de tokens
     *     tags: [Authentication]
     *     description: Gera um novo par de tokens (access e refresh) a partir do refresh token
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *                 example: 'uzsiydfgauikywerv8237r'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/success'
     */
    @Post('/refresh-token')
    @Middlewares(AuthenticationValidator.refreshToken())
    public async refreshToken(req: Request, res: Response): Promise<void> {
        const { refreshToken } = req.body;
        const { authId, userId, admin } = await JWT.decodeToken(refreshToken);

        const role = admin ? EnumRoles.ADMIN : EnumRoles.USER;
        const tokens = JWT.generateAccessAndRefreshToken(userId, authId, role);

        return RouteResponse.success(res, tokens);
    }

    /**
     * @swagger
     * /api/auth/forgot-password:
     *   post:
     *     summary: Envio de email de esqueci minha senha
     *     tags: [Authentication]
     *     description: Solicitação de email de esqueci minha senha
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
     *     responses:
     *       204:
     *         $ref: '#/components/responses/successEmpty'
     */
    @Post('/forgot-password')
    @Log()
    @Middlewares(AuthenticationValidator.forgotPassword())
    public async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        RouteResponse.successEmpty(res);
        await Email.sendForgotPasswordEmail(email);
    }

    /**
     * @swagger
     * /api/auth/verify-recovery-code/{recoveryCode}:
     *   get:
     *     summary: Verificação do código de recuperação
     *     tags: [Authentication]
     *     description: Verifica se o código de recuperação fornecido é válido
     *     parameters:
     *       - in: path
     *         name: recoveryCode
     *         required: true
     *         schema:
     *           type: string
     *         description: O código de recuperação a ser verificado
     *     responses:
     *       204:
     *         $ref: '#/components/responses/successEmpty'
     */
    @Get('/verify-recovery-code/:recoveryCode')
    @Middlewares(AuthenticationValidator.verifyRecoveryCode())
    public async verifyCode(req: Request, res: Response): Promise<void> {
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /api/auth/change-password:
     *   put:
     *     summary: Alteração de senha
     *     tags: [Authentication]
     *     description: Altera a senha do usuário
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
     *               newPassword:
     *                 type: string
     *                 example: 'P@s2w0rd'
     *               recoveryCode:
     *                 type: string
     *                 example: 'a1b2c3'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/success'
     */
    @Put('/change-password')
    @Log()
    @Middlewares(AuthenticationValidator.changePassword())
    public async changePassword(req: Request, res: Response): Promise<void> {
        const { newPassword, authentication } = req.body;

        const changedAuthentication = await new AuthenticationRepository().changePassword(authentication, newPassword);

        return RouteResponse.success(res, changedAuthentication);
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
     *         $ref: '#/components/responses/success'
     */
    @Post('/register')
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
