import crypto from 'crypto';
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Authentication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 60 })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'varchar', nullable: true })
    salt: string | null;

    @Column({ type: 'boolean', default: false })
    admin: boolean;

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(this.password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    }
}
