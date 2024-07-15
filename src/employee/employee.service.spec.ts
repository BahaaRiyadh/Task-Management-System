import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

describe('EmployeeService', () => {
  let service: EmployeeService;
  const mockClient = {
    query: jest.fn((query, values) => {
      if (query.includes('INSERT')) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              name: 'name',
              email: 'name@gmail.com',
              city: 'basra',
              total_commissions: 0,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ],
          rowCount: 1,
        });
      } else if (query.includes('SELECT')) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              name: 'name',
              city: 'basra',
            },
          ],
          rowCount: 1,
        });
      }

      return Promise.resolve({ rows: [], rowCount: 0 });
    }),
  };

  class databaseModule {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
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

    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return the created employee', async () => {
    const dto = { name: 'name', city: 'basra', email: 'name@gmail.com' };
    expect(await service.addEmployee(dto)).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      city: expect.any(String),
      total_commissions: expect.any(Number),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });

  it('should return the filtered employees by city', async () => {
    const city = 'basra';
    expect(await service.getByCity(city)).toEqual([
      {
        id: expect.any(Number),
        name: expect.any(String),
        city: expect.any(String),
      },
    ]);
  });
});
