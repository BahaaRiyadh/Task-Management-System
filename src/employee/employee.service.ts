import { Injectable } from '@nestjs/common';
import { EmployeeDto } from './dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class EmployeeService {
  constructor(private client: DatabaseService) {}
  async addEmployee(dto: EmployeeDto) {
    try {
      const query = `INSERT INTO "Employees" (name, email, city, total_commissions ,updated_at)
         VALUES ($1, $2, $3, $4, to_timestamp($5)) RETURNING *`;

      const result = await this.client.query(query, [
        dto.name,
        dto.email,
        dto.city,
        0,
        Date.now() / 1000,
      ]);

      return result.rows[0];
    } catch (e) {
      console.log(e);
      return 'database connection failure';
    }
  }

  async getByCity(city: string) {
    const result = await this.client.query(
      `SELECT id, name, city FROM "Employees" WHERE city = $1`,
      [city],
    );
    return result.rows;
  }
}
