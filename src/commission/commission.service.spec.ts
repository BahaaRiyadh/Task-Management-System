import { Test, TestingModule } from '@nestjs/testing';
import { CommissionService } from './commission.service';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigService } from '@nestjs/config';
import { QueryResult } from 'pg';

describe('CommissionService', () => {
  let service: CommissionService;
  const mockClient = {
    query: jest.fn().mockResolvedValue({
      rows: [{ name: 'John Doe', commission: [1] }],
      rowCount: 1,
      command: 'SELECT',
    }),
  };

  class databaseModule {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommissionService,
        {
          provide: DatabaseService,
          useValue: mockClient,
        },
        ConfigService,
      ],
      imports: [DatabaseModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(databaseModule)
      .compile();

    service = module.get<CommissionService>(CommissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate the daily commissions', async () => {
    const page = 1;
    expect(await service.calculateDaily(page)).toEqual([
      {
        name: expect.any(String),
        commissions: expect.any(Number),
      },
    ]);
  });

  it('should calculate the monthly commissions', async () => {
    const page = 1;
    expect(await service.calculateMonthly(page)).toEqual([
      {
        name: expect.any(String),
        commissions: expect.any(Number),
      },
    ]);
  });
});
