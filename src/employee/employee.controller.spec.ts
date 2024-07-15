import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { mock } from 'node:test';

describe('EmployeeController', () => {
  let controller: EmployeeController;

  const mockEmployeeService = {
    addEmployee: jest.fn().mockImplementation((dto) => {
      return {
        id: 1,
        name: 'name',
        email: 'name@gmail.com',
        city: 'basra',
        total_commissions: 100,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }),
    getByCity: jest.fn().mockImplementation((city) => {
      return [
        {
          id: 1,
          name: 'name',
          city: 'basra',
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [EmployeeService],
    })
      .overrideProvider(EmployeeService)
      .useValue(mockEmployeeService)
      .compile();

    controller = module.get<EmployeeController>(EmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return create and return the created employee', () => {
    const dto = { name: 'name', city: 'basra', email: 'name@gmail.com' };
    expect(controller.addEmployee(dto)).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      city: expect.any(String),
      total_commissions: expect.any(Number),
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
    });
  });

  it('should return the filtered employees by city', () => {
    const city = 'basra';
    expect(controller.getByCity(city)).toEqual([
      {
        id: expect.any(Number),
        name: expect.any(String),
        city: expect.any(String),
      },
    ]);
  });
});
