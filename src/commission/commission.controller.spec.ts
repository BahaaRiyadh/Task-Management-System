import { Test, TestingModule } from '@nestjs/testing';
import { CommissionController } from './commission.controller';
import { CommissionService } from './commission.service';

describe('CommissionController', () => {
  let controller: CommissionController;

  const mockCommissionService = {
    calculateDaily: jest.fn().mockImplementation((page) => {
      return {
        name: 'name',
        commissions: 100,
      };
    }),
    calculateMonthly: jest.fn().mockImplementation((page) => {
      return {
        name: 'name',
        commissions: 100,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionController],
      providers: [CommissionService],
    })
      .overrideProvider(CommissionService)
      .useValue(mockCommissionService)
      .compile();

    controller = module.get<CommissionController>(CommissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should calculate a daily commission', () => {
    const page = 1;
    expect(controller.calculateDaily(page)).toEqual({
      name: expect.any(String),
      commissions: expect.any(Number),
    });
  });

  it('should calculate a monthly commission', () => {
    const page = 1;
    expect(controller.calculateMonthly(page)).toEqual({
      name: expect.any(String),
      commissions: expect.any(Number),
    });
  });
});
