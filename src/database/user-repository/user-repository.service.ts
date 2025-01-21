import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

type UserOptions = FindOneOptions<UserEntity>;

const userSerializer: UserOptions['relations'] = {
  refreshTokens: true,
};

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({ relations: userSerializer });
  }

  async findOne(where: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne({
      where,
      relations: userSerializer,
    });
  }

  async create(user: DeepPartial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.save(user);
  }
}
