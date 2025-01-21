import { Global, Module, Provider } from '@nestjs/common';
import { UserRepositoryModule } from './user-repository/user-repository.module';
import { RefreshTokenRepositoryModule } from './refresh-token-repository/refresh-token-repository.module';
import { FileRepositoryModule } from './file-repository/file-repository.module';

const repositories: Provider[] = [
  UserRepositoryModule,
  RefreshTokenRepositoryModule,
  FileRepositoryModule,
];

@Global()
@Module({
  providers: repositories,
  exports: repositories,
})
export class DatabaseModule {}
