import { NextFunction, Request, Response } from 'express';
import { TObject } from '../common/models/TObject';
import { mongoDataSource } from '../config/database';
import { ActionLog } from '../library/ActionsLog/ActionLog.entity';

export class ActionLoger {
    public static async log(path: string, userId: string, action: 'update' | 'delete', data: TObject | undefined = undefined): Promise<void> {
        await mongoDataSource.initialize();

        await mongoDataSource.getMongoRepository(ActionLog).save({
            path,
            userId,
            data,
            action
        });

        await mongoDataSource.destroy();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static async logByRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        const action = req.method === 'PUT' ? 'update' : 'delete';

        await ActionLoger.log(req.path, req.body.authentication.userId, action);
        next();
    }
}
