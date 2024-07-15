import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AssignDto, FilterDto, TaskDto } from './dto';
import { JwtGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  addTask(@Body() dto: TaskDto) {
    return this.taskService.addTask(dto);
  }

  @Put('/assign/:emp_id')
  assignTask(@Body() dto: AssignDto[], @Param('emp_id') emp_id: string) {
    return this.taskService.assignTask(dto, emp_id);
  }

  @Put('/:task_id/state_done')
  taskDone(@Param('task_id') task_id: string) {
    return this.taskService.taskDone(task_id);
  }

  @Post('/filter')
  filterTasks(@Body() dto: FilterDto) {
    return this.taskService.filterTasks(dto);
  }
}
