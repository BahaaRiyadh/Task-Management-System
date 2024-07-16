import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  constructor(private config: ConfigService) {}

  async onModuleInit() {
    this.client = new Client({
      user: await this.config.get('db_username'),
      host: await this.config.get('db_host'),
      database: await this.config.get('db_name'),
      password: await this.config.get('db_password'),
      port: await this.config.get<number>('db_port'),
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.end();
  }

  async query(queryText: string, params?: any[]): Promise<any> {
    return this.client.query(queryText, params);
  }
  async databaseSetup() {
    try {
      await this.client.query(
        `CREATE TABLE "Admin" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
        );`,
      );
      await this.client.query(
        `ALTER TABLE "Admin" ADD CONSTRAINT "unique_name" UNIQUE ("name");`,
      );
    } catch (e) {}

    try {
      const hash = await argon.hash('admin');
      await this.client.query(
        `
        INSERT INTO "Admin" (name, password) VALUES ('admin', $1)
      `,
        [hash],
      );
    } catch (e) {}
    try {
      await this.client.query(
        `CREATE TABLE "Employees" (
         "id" SERIAL NOT NULL,
         "name" TEXT NOT NULL,
         "email" TEXT NOT NULL,
         "city" TEXT NOT NULL,
         "total_commissions" INTEGER NOT NULL,
         "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
         "updated_at" TIMESTAMP(3) NOT NULL,
         CONSTRAINT "Employees_pkey" PRIMARY KEY ("id")
        );`,
      );
    } catch (e) {}

    try {
      await this.client.query(
        `CREATE TABLE "Tasks" (
        "id" SERIAL NOT NULL, 
        "title" TEXT NOT NULL, 
        "commission" INTEGER NOT NULL,
        "state" TEXT NOT NULL DEFAULT 'Ongoing',
        "emp_id" INTEGER,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id"));`,
      );
    } catch (e) {}

    try {
      await this.client.query(
        `ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_emp_id_fkey" FOREIGN KEY ("emp_id") REFERENCES
         "Employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;`,
      );
    } catch (e) {}

    return 'database updated successfully';
  }
}
