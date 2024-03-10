import { Request, Response } from 'express';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { Controller } from '../../../decorators/Controller';
import { Delete, Get, Post, Put } from '../../../decorators/Methods';
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
    @Middlewares(StoreValidator.storeData())
    public async createStore(req: Request, res: Response): Promise<void> {
        const {
            name,
            cnpj,
            authentication: { userId: owner }
        } = req.body;

        const store = await new StoreRepository().create({ name, cnpj, owner });
        return RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store/{storeId}:
     *   put:
     *     summary: Edição de dados de uma Loja
     *     tags: [Store]
     *     description: Edição de dados de uma Loja vinculada ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *         description: Id da loja a ser listada
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
    @Put('/:storeId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId, StoreValidator.storeData())
    public async updateStore(req: Request, res: Response): Promise<void> {
        const { storeId, cnpj, name } = req.body;

        const store = await new StoreRepository().update(storeId, { name, cnpj });
        RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store/{storeId}:
     *   get:
     *     summary: Listagem de uma Loja específica
     *     tags: [Store]
     *     description: Listagem de uma Loja específica vinculadas ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *         description: Id da loja a ser listada
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Get('/:storeId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId)
    public async onlyId(req: Request, res: Response): Promise<void> {
        const { authentication, storeId } = req.body;

        const store = await new StoreRepository().findStoreById(authentication, storeId);
        return RouteResponse.success(res, store);
    }

    /**
     * @swagger
     * /api/store:
     *   get:
     *     summary: Listagem de Lojas
     *     tags: [Store]
     *     description: Lista Lojas vinculadas ao usuário
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
        const { authentication } = req.body;
        const [rows, count] = await new StoreRepository().findStores(authentication, StoreController.getListParams(req));
        return RouteResponse.success(res, { rows, count });
    }

    /**
     * @swagger
     * /api/store/{storeId}:
     *   delete:
     *     summary: Deleção de Lojas
     *     tags: [Store]
     *     description: Deleção de Loja vinculada ao usuário
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *         description: Id da loja a ser listada
     *     responses:
     *       204:
     *         $ref: '#/components/responses/SuccessEmpty204'
     */
    @Delete('/:storeId')
    @Roles(EnumRoles.ADMIN, EnumRoles.USER)
    @Middlewares(StoreValidator.onlyId)
    public async softDeleteStore(req: Request, res: Response): Promise<void> {
        const { storeId } = req.body;

        await new StoreRepository().softDelete(storeId);
        RouteResponse.successEmpty(res);
    }
}
