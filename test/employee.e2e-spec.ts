import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let token: string = '';

  const employee = {
    id: expect.any(Number),
    name: expect.any(String),
    email: expect.any(String),
    city: expect.any(String),
    total_commissions: expect.any(Number),
    created_at: expect.stringMatching(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
    ),
    updated_at: expect.stringMatching(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,
    ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        name: 'admin',
        password: 'admin',
      })
      .expect(201)
      .then((res) => {
        expect(res.body.access_token).toBeDefined;
        token = res.body.access_token;
      });
  });

  it('Employee (POST', () => {
    return request(app.getHttpServer())
      .post('/employee')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'NAME',
        email: 'bahaa@gmail.com',
        city: 'basra',
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual(employee);
      });
  });

  it('Employee Filter (GET)', () => {
    return request(app.getHttpServer())
      .get('/employee/filter?city=basra')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(Number),
              name: expect.any(String),
              city: expect.any(String),
            },
          ]),
        );
      });
  });
});
