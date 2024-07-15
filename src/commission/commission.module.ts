import { Module } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { DatabaseModule } from '../database/database.module';
import { CommissionController } from './commission.controller';

@Module({
  providers: [CommissionService],
  controllers: [CommissionController],
  imports: [DatabaseModule],
})
export class CommissionModule {}
