import { NextFunction, Request, Response } from 'express';

/* eslint-disable @typescript-eslint/no-unused-vars */
export class ActionLoger {
    public static async log(path: string, userId: string, oldValue: object, newValue: object, action: 'update' | 'delete'): Promise<void> {
        return Promise.resolve();
    }

    public static async logByRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        Promise.resolve();
        next();
    }
}
