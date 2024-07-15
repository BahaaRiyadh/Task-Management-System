import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { DatabaseModule } from '../database/database.module';
import { TaskService } from './task.service';
@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [DatabaseModule],
})
export class TaskModule {}
