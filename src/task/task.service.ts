import { Injectable } from '@nestjs/common';
import { AssignDto, FilterDto, TaskDto } from './dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TaskService {
  constructor(private client: DatabaseService) {}
  async addTask(dto: TaskDto) {
    const query = `INSERT INTO "Tasks" (title, commission) VALUES ($1, $2) RETURNING id, title, commission, state;`;
    try {
      const result = await this.client.query(query, [
        dto.title,
        dto.commission,
      ]);

      return result.rows[0];
    } catch (e) {
      return 'Database Error';
    }
  }

  async assignTask(dto: AssignDto[], emp_id: string) {
    try {
      const tasks = [];
      for (let i = 0; i < dto.length; i++) {
        const check_emp = await this.client.query(
          `SELECT * FROM "Tasks" WHERE id = $1 AND "emp_id" = $2`,
          [dto[i].id, emp_id],
        );
        if (check_emp.rows[0]) {
          return 'The employee has already been assigned';
        }

        const check_task = await this.client.query(
          `SELECT * FROM "Tasks" WHERE id = $1`,
          [dto[i].id],
        );
        if (check_task.rows[0].emp_id) {
          return 'An employee has already done this task';
        }

        const data = await this.client.query(
          `UPDATE "Tasks" SET emp_id = $1 WHERE id = $2 RETURNING *;`,
          [emp_id, dto[i].id],
        );

        await this.client.query(
          `UPDATE "Employees" SET total_commissions = total_commissions + $1,
         updated_at = to_timestamp($2) WHERE id = $3 RETURNING *`,
          [data.rows[0].commission, Date.now() / 1000, emp_id],
        );
        const task = await this.client.query(
          `SELECT 
            t.id AS task_id,
            t.title AS task_title,
            t.commission AS task_commission,
            t.state AS task_state,
            t.updated_at AS task_updated_at,
            e.name AS employee_name
        FROM "Tasks" t
        LEFT JOIN "Employees" e ON t.emp_id = e.id
        WHERE t.id = $1;`,
          [dto[i].id],
        );

        tasks.push(task.rows[0]);
      }
      return tasks;
    } catch (e) {
      console.log(e);
      return 'Wrong task or employee ids';
    }
  }
  async taskDone(task_id: string) {
    const result = await this.client.query(
      `UPDATE "Tasks" SET state = 'Done', updated_at = to_timestamp($1) WHERE id = $2 RETURNING *`,
      [Date.now() / 1000, task_id],
    );
    if (result.rows[0].emp_id) {
      return result.rows[0];
    } else {
      return 'The task is not assigned yet';
    }
  }

  async filterTasks(dto: FilterDto) {
    try {
      if (!dto.state && !dto.commission) {
        return [];
      } else {
        let query = `SELECT * FROM "Tasks" WHERE`;
        let params;
        if (dto.state) {
          query = query + ' State = $1';
          params = [dto.state];
        }
        if (dto.commission && dto.state) {
          query = query + ' AND commission = $2';
          params = [dto.state, dto.commission];
        } else if (dto.commission && !dto.state) {
          query = 'SELECT * FROM "Tasks" WHERE commission = $1';
          params = [dto.commission];
        }
        const result = await this.client.query(query, params);
        return result.rows;
      }
    } catch (e) {
      return 'database connection error';
    }
  }
}
