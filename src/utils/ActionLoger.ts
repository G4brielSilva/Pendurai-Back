import { DataSource } from 'typeorm';
import { mongoDataSource } from '../config/database';
import { ActionLog } from '../library/ActionsLog/ActionLog.entity';

export class ActionLoger {
    private dataSource: DataSource;

    constructor() {
        this.dataSource = mongoDataSource;
    }

    private async databaseConnect(): Promise<void> {
        await this.dataSource.initialize();
    }

    private async disconnect(): Promise<void> {
        await this.dataSource.destroy();
    }

    public async log(path: string, userId: string, oldValue: object, newValue: object, action: 'update' | 'delete'): Promise<void> {
        await this.databaseConnect();

        await mongoDataSource.getMongoRepository(ActionLog).save({
            path,
            userId,
            oldValue,
            newValue,
            action
        });

        await this.disconnect();
    }
}
