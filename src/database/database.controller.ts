import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private databaseService: DatabaseService) {}

  @Get('/setup')
  databaseSetup() {
    return this.databaseService.databaseSetup();
  }
}
