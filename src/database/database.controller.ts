import { Controller, Get, UseGuards } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { JwtGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  @Get('/setup')
  databaseSetup() {
    return this.databaseService.databaseSetup();
  }
}
