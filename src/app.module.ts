import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { TaskModule } from './task/task.module';
import { CommissionModule } from './commission/commission.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EmployeeModule,
    TaskModule,
    CommissionModule,
    AuthModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule {}
