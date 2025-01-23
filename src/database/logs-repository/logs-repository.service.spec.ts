import { Test, TestingModule } from '@nestjs/testing';
import { LogsRepositoryService } from './logs-repository.service';

describe('LogsRepositoryService', () => {
  let service: LogsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogsRepositoryService],
    }).compile();

    service = module.get<LogsRepositoryService>(LogsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
