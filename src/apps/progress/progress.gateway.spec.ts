import { Test, TestingModule } from '@nestjs/testing';
import { ProgressGateway } from './progress.gateway';

describe('ProgressGateway', () => {
  let gateway: ProgressGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgressGateway],
    }).compile();

    gateway = module.get<ProgressGateway>(ProgressGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
