import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { JwtGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Commission')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('commission')
export class CommissionController {
  constructor(private commissionService: CommissionService) {}
  @Get('/daily')
  calculateDaily(@Query('page') page: number) {
    return this.commissionService.calculateDaily(page);
  }

  @Get('/monthly')
  calculateMonthly(@Query('page') page: number) {
    return this.commissionService.calculateMonthly(page);
  }
}
