import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../user-repository/user.entity';
import { FileEntity } from '../file-repository/file.entity';

@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'int4' })
  userId: number;

  @Column({ type: 'uuid', nullable: true })
  fileId?: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'enum', enum: ['info', 'error', 'warning'] })
  type: string;

  @ManyToOne(() => FileEntity, (file) => file.logs, {
    onDelete: 'CASCADE',
  })
  file?: FileEntity;

  @ManyToOne(() => UserEntity, (user) => user.logs)
  user: UserEntity;
}
