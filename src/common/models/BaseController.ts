import { Request } from 'express';

export interface IListParams {
    page: number;
    size: number;
    orderBy: 'ASC' | 'DESC';
    order?: string;
}

export class BaseController {
    public baseRoute: string;

    public static getListParams(req: Request): IListParams {
        const { page, size, orderBy, order } = req.query;

        return {
            page: Number(page) || 1,
            size: Number(size) || 10,
            orderBy: (orderBy as 'ASC' | 'DESC') || 'ASC',
            order: order as string | undefined
        };
    }
}
