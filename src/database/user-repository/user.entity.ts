import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RefreshTokenEntity } from '../refresh-token-repository/refresh-token.entity';
import { FileEntity } from '../file-repository/file.entity';
import { LogEntity } from '../logs-repository/logs.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];

  @OneToMany(() => FileEntity, (file) => file.user)
  files: FileEntity[];

  @OneToMany(() => LogEntity, (log) => log.user)
  logs: LogEntity[];
}
