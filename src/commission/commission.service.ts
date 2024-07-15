import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommissionService {
  constructor(private client: DatabaseService) {}

  async calculateDaily(page: number) {
    try {
      const end = Date.now();
      let start = new Date();
      start.setUTCHours(0, 0, 0, 0);

      const offset = (page - 1) * 2;
      const data = await this.client.query(
        `SELECT e.id, e.name, array_agg(t.commission) as "commission"
        FROM "Employees" e
        JOIN "Tasks" t ON t.emp_id = e.id
        WHERE t.updated_at BETWEEN to_timestamp($1) AND to_timestamp($2)
        GROUP BY e.id, e.name
        LIMIT 2 OFFSET $3`,
        [start.getTime() / 1000, end / 1000, offset],
      );

      return data.rows.map((emp) => {
        return {
          name: emp.name,
          commissions: emp.commission.reduce(
            (acc, commission) => (acc += commission),
            0,
          ),
        };
      });
    } catch (e) {
      console.log(e);
      return { msg: 'No data found' };
    }
  }
  async calculateMonthly(page: number) {
    try {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const month = today.setDate(today.getDate() - 30);

      const offset = (page - 1) * 3;
      const data = await this.client.query(
        `SELECT e.id, e.name, array_agg(t.commission) as "commission"
        FROM "Employees" e
        JOIN "Tasks" t ON t.emp_id = e.id
        WHERE t.updated_at BETWEEN to_timestamp($1) AND to_timestamp($2)
        GROUP BY e.id, e.name
        LIMIT 3 OFFSET $3`,
        [month / 1000, Date.now() / 1000, offset],
      );

      console.log(data.rows);
      const results = data.rows.map((emp) => {
        return {
          name: emp.name,
          commissions: emp.commission.reduce(
            (acc, commission) => (acc += commission),
            0,
          ),
        };
      });

      return results;
    } catch (e) {
      return { msg: 'no data found' };
    }
  }
}
