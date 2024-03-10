import { Request, Response } from 'express';
import { BaseController } from '../../../common/models/BaseController';
import { RouteResponse } from '../../../common/models/RouteResponse';
import { EnumRoles } from '../../../common/models/enum/EnumRoles';
import { Controller } from '../../../decorators/Controller';
import { Post, Put } from '../../../decorators/Methods';
import { Middlewares } from '../../../decorators/Middlewares';
import { Roles } from '../../../decorators/Roles';
import { ProductRepository } from '../../../library/repository';
import { StoreValidator } from '../store/Store.validator';
import { ProductValidator } from './Product.validator';

@Controller('/store/:storeId/product')
export class ProductController extends BaseController {
    /**
     * @swagger
     * /api/store/{storeId}/product:
     *   post:
     *     summary: Criando um produto
     *     tags: [Product]
     *     description: Criando um produto vinculado a uma loja
     *     security:
     *      - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: storeId
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: 'product_name'
     *               description:
     *                 type: string
     *                 example: 'An product description'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Post()
    @Roles(EnumRoles.USER, EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, ProductValidator.productData())
    public async createProduct(req: Request, res: Response): Promise<void> {
        const { storeId: store, name, description } = req.body;

        const product = await new ProductRepository().create({ store, name, description });

        return RouteResponse.success(res, product);
    }

    /**
     * @swagger
     * /api/store/{storeId}/product/{productId}:
     *   put:
     *     summary: Editando um produto
     *     tags: [Product]
     *     description: Editando um produto vinculado a uma loja
     *     security:
     *      - BearerAuth: []
     *     parameters:
     *     - in: path
     *       name: storeId
     *       required: true
     *       schema:
     *         type: string
     *     - in: path
     *       name: productId
     *       required: true
     *       schema:
     *         type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: 'product_name'
     *               description:
     *                 type: string
     *                 example: 'An product description'
     *     responses:
     *       200:
     *         $ref: '#/components/responses/Success200'
     */
    @Put('/:productId')
    @Roles(EnumRoles.USER, EnumRoles.ADMIN)
    @Middlewares(StoreValidator.onlyId, ProductValidator.onlyId, ProductValidator.productData())
    public async updateProduct(req: Request, res: Response): Promise<void> {
        const { productId, name, description } = req.body;

        const product = await new ProductRepository().update(productId, { name, description });
        const { store } = product;

        const parsedProduct = { ...product, store: { ...store, owner: undefined } };
        return RouteResponse.success(res, parsedProduct);
    }
}
