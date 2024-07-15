import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

describe('TaskService', () => {
  let service: TaskService;
  const task = {
    id: expect.any(Number),
    title: expect.any(String),
    commission: expect.any(Number),
    state: expect.stringMatching(/(Done|Ongoing)/),
    emp_id: expect.any(Number) || null,
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };

  const mockClient = {
    query: jest.fn().mockImplementation((query, params) => {
      if (query.includes('SELECT t.id AS task_id')) {
        return Promise.resolve({
          rows: [
            {
              task_id: 1,
              task_title: 'Task Title',
              task_commission: 8,
              task_state: 'Ongoing',
              task_updated_at: new Date(),
              employee_name: 'John Doe',
            },
          ],
          rowCount: 1,
          command: 'SELECT',
        });
      } else {
        {
          return Promise.resolve({
            rows: [
              {
                id: 1,
                title: 'Task Title',
                commission: 8,
                state: 'Ongoing',
                emp_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
              },
            ],
          });
        }
      }
    }),
  };

  class mockDatabaseModule {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: DatabaseService,
          useValue: mockClient,
        },
        ConfigService,
      ],
      imports: [DatabaseModule],
    })
      .overrideModule(DatabaseModule)
      .useModule(mockDatabaseModule)
      .compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return the created task', async () => {
    const dto = {
      title: 'title',
      commission: 8,
    };

    expect(await service.addTask(dto)).toEqual(task);
  });

  it('should assign and return the assigned tasks data', async () => {
    const dto = [{ id: 1 }, { id: 2 }];
    const emp_id = '3';
    try {
      expect(await service.assignTask(dto, emp_id)).toEqual([
        {
          task_id: expect.any(Number),
          task_title: expect.any(String),
          task_commission: expect.any(Number),
          task_state: expect.stringMatching(/(Done|Ongoing)/),
          task_updated_at: expect.any(Date),
          employee_name: expect.any(String),
        },
      ]);
    } catch (error) {
      expect(await service.assignTask(dto, emp_id)).toEqual(
        'The employee has already been assigned',
      );
    }
  });

  it('should mark the task as done and return the task', async () => {
    const task_id = '1';
    expect(await service.taskDone(task_id)).toEqual(task);
  });

  it('should filter the tasks by commissions or state and return the filtered tasks', async () => {
    const dto = { commission: 8, state: 'Done' };
    expect(await service.filterTasks(dto)).toEqual([task]);
  });
});
