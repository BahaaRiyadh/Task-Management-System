import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let token: string = '';

  const commission = {
    name: expect.any(String),
    commissions: expect.any(Number),
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

  it('Commissions Daily (GET)', () => {
    return request(app.getHttpServer())
      .get('/commission/daily?page=1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expect.arrayContaining([commission]));
      });
  });

  it('Commissions Monthly (GET)', () => {
    return request(app.getHttpServer())
      .get('/commission/monthly?page=1')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expect.arrayContaining([commission]));
      });
  });
});
