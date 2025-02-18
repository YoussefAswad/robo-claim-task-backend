import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../user-repository/user.entity';
import { FileStatus } from './types/file-status.type';
import { LogEntity } from '../logs-repository/logs.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int4' })
  userId: number;

  @Column({ type: 'text' })
  originalName: string;

  @Column({ type: 'text' })
  mimeType: string;

  @Column({ type: 'float' })
  size: number;

  @ManyToOne(() => UserEntity, (user) => user.files)
  user: UserEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  status: FileStatus;

  @Column({ type: 'text' })
  hash: string;

  @Column({ type: 'text', nullable: true })
  failedReason?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @Column({ type: 'text', nullable: true })
  dataSnippet: string | null;

  @OneToMany(() => LogEntity, (log) => log.file)
  logs: LogEntity[];
}
