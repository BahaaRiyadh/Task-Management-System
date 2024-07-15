import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let token: string = '';
  const task = {
    id: expect.any(Number),
    title: expect.any(String),
    commission: expect.any(Number),
    state: expect.stringMatching(/(Done|Ongoing)/),
    emp_id: expect.anything(),
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

  it('task (POST', () => {
    return request(app.getHttpServer())
      .post('/task')
      .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'whatever',
        commission: 9,
      })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(Number),
          title: expect.any(String),
          commission: expect.any(Number),
          state: expect.stringMatching(/(Done|Ongoing)/),
        });
      });
  });

  it('task (PUT)', () => {
    return request(app.getHttpServer())
      .put('/task/1/state_done')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(task);
      });
  });

  it('task assign (PUT)', () => {
    return request(app.getHttpServer())
      .put('/task/assign/1')
      .set('Authorization', 'Bearer ' + token)
      .send([{ id: 1 }])
      .expect(200);
  });

  it('task filter (POST)', () => {
    return request(app.getHttpServer())
      .post('/task/filter')
      .set('Authorization', 'Bearer ' + token)
      .send({ state: 'Done' })
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual(expect.arrayContaining([task]));
      });
  });
});
