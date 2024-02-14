import { Request, Response, Router } from 'express';
import { AuthenticationRepository } from '../../library/repository';
import { JWT } from '../../third-party/Jwt';
import { Password } from '../../utils/Password';

const authRouter = Router();

/**
 * @swagger
 * /login:
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/Success200'
 */
authRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const authentication = await new AuthenticationRepository().getHashedPassword(email);
    if (!authentication) return res.status(400).send('Credenciais Inválidas');

    const { password: hashedPassword, salt, user, id: authId } = authentication;

    if (!Password.verifyPassword(password, hashedPassword, salt as string)) return res.status(400).send('Credenciais Inválidas');

    const token = JWT.generateAccessToken(user.id, authId);

    return res.send({ Authorization: `Bearer ${token}` });
});

export { authRouter };
