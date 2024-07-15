import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './dto';
import { JwtGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Employee')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Post()
  addEmployee(@Body() dto: EmployeeDto) {
    return this.employeeService.addEmployee(dto);
  }

  @Get('/filter')
  getByCity(@Query('city') city: string) {
    return this.employeeService.getByCity(city);
  }
}
