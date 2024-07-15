import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  const task = {
    id: expect.any(Number),
    title: expect.any(String),
    commission: expect.any(Number),
    state: expect.stringMatching(/(Done|Ongoing)/),
    emp_id: expect.any(Number) || null,
    created_at: expect.any(Date),
    updated_at: expect.any(Date),
  };

  const mockTaskService = {
    addTask: jest.fn().mockImplementation((dto) => {
      return {
        ...dto,
        id: 8,
        state: 'Done',
        emp_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }),
    assignTask: jest.fn().mockImplementation((dto, emp_id) => {
      return [
        {
          task_id: 10,
          task_title: 'title',
          task_commission: 9,
          task_state: 'Ongoing',
          task_updated_at: new Date(),
          employee_name: 'name',
        },
      ];
    }),
    taskDone: jest.fn().mockImplementation((task_id) => {
      return {
        id: 8,
        title: 'title',
        commission: 8,
        state: 'Done',
        emp_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }),
    filterTasks: jest.fn().mockImplementation((dto) => {
      return [
        {
          id: 8,
          title: 'title',
          commission: 8,
          state: 'Done',
          emp_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create and return the created task', () => {
    const dto = {
      title: 'title',
      commission: 8,
    };

    expect(controller.addTask(dto)).toEqual(task);
  });

  it('should assign and return the assigned tasks data', () => {
    const dto = [{ id: 1 }, { id: 2 }];
    const emp_id = '1';
    expect(controller.assignTask(dto, emp_id)).toEqual([
      {
        task_id: expect.any(Number),
        task_title: expect.any(String),
        task_commission: expect.any(Number),
        task_state: 'Ongoing' || 'Done',
        task_updated_at: expect.any(Date),
        employee_name: expect.any(String),
      },
    ]);
  });

  it('should mark the task as done and return the task', () => {
    const task_id = '1';
    expect(controller.taskDone(task_id)).toEqual(task);
  });

  it('should filter the tasks by commissions or state and return the filtered tasks', () => {
    const dto = { commission: 8, state: 'Done' };
    expect(controller.filterTasks(dto)).toEqual([task]);
  });
});
