import { NextFunction, Request, Response } from 'express';
import { mongoDataSource } from '../../__mocks__/config/database';
import { ActionLoger } from '../../src/utils/ActionLoger';

// Database mock
jest.mock('../../src/config/database.ts', () => {
    return jest.requireActual('../../__mocks__/config/database.ts');
});

describe('ActionLoger', () => {
    const validPath = 'valid/path';
    const userId = 'valid_user_id';
    const action = 'update';

    it('should save actionLog for an Action', async () => {
        const saveActionLogSpy = jest.spyOn(ActionLoger, 'log');

        mongoDataSource.getMongoRepository = jest.fn().mockReturnValue({
            save: jest.fn()
        });

        await ActionLoger.log(validPath, userId, action);

        expect(saveActionLogSpy).toHaveBeenCalledWith(validPath, userId, action);
    });

    it('should save actionLog for an request', async () => {
        const saveActionLogSpy = jest.spyOn(ActionLoger, 'log');

        mongoDataSource.getMongoRepository = jest.fn().mockReturnValue({
            save: jest.fn()
        });

        await ActionLoger.logByRequest({
            path: validPath,
            method: 'PUT',
            body: {
                authentication: {
                    userId
                }
            }
        } as Request, {} as Response, jest.fn() as NextFunction);

        expect(saveActionLogSpy).toHaveBeenCalledWith(validPath, userId, action);
    });
});
