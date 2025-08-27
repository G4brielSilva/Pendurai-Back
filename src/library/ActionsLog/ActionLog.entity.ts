import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class ActionLog {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    path: string;

    @Column()
    userId: string;

    @Column()
    data: object;

    @Column()
    action: 'update' | 'delete';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
