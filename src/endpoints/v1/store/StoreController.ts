import { Request, Response } from 'express';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { Controller } from '../../../decorators/Controller';
import { Get, Post } from '../../../decorators/Methods';
import { Middlewares } from '../../../decorators/Middlewares';
import { Roles } from '../../../decorators/Roles';
import { StoreRepository } from '../../../library/repository';
import { StoreValidator } from './Store.validator';

@Controller('/store')
export class StoreController extends BaseController {
    /**
     * @swagger
     * /api/store:
     *   post:
     *     summary: Criar de Loja no banco
     *     tags: [Store]
     *     description: Criação de Registro de Loja no banco vinculado ao usuário criador
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: 'store_name'
     *               cnpj:
     *                 type: string
     *                 example: '62781317000160'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Post()
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.createStore())
    public async createStore(req: Request, res: Response): Promise<void> {
        const {
            name,
            cnpj,
            authentication: { userId: owner }
        } = req.body;
        const store = await new StoreRepository().insert({ name, cnpj, owner });
        return RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store:
     *   get:
     *     summary: Criar de Loja no banco
     *     tags: [Store]
     *     description: Criação de Registro de Loja no banco vinculado ao usuário criador
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/page'
     *       - $ref: '#/components/parameters/size'
     *       - $ref: '#/components/parameters/order'
     *       - $ref: '#/components/parameters/orderBy'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get()
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    public async listStores(req: Request, res: Response): Promise<void> {
        const {
            authentication: { role, userId: owner }
        } = req.body;

        const rows = await new StoreRepository().list(owner, role, StoreController.getListParams(req));
        return RouteResponse.success(res, rows);
    }
}
