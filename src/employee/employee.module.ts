import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [DatabaseModule],
})
export class EmployeeModule {}
