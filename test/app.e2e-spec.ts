import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ReportsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/reports/professors-hours (GET) should require API key', () => {
    return request(app.getHttpServer())
      .get('/reports/professors-hours')
      .expect(401);
  });

  it('/reports/professors-hours (GET) with API key', () => {
    return request(app.getHttpServer())
      .get('/reports/professors-hours')
      .set('x-api-key', process.env.API_KEY || 'changeme123')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();
      });
  });

  it('/reports/rooms (GET) should require API key', () => {
    return request(app.getHttpServer())
      .get('/reports/rooms?dayOfWeek=1')
      .expect(401);
  });

  it('/reports/rooms (GET) with API key and dayOfWeek should return 200 and an array', () => {
    return request(app.getHttpServer())
      .get('/reports/rooms')
      .query({ dayOfWeek: '1' })
      .set('x-api-key', process.env.API_KEY || 'changeme123')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBeTruthy();

        if (res.body.length > 0) {
          const item = res.body[0];
          expect(item).toHaveProperty('roomId');
          expect(item).toHaveProperty('roomName');
          expect(item).toHaveProperty('occupied');
          expect(item).toHaveProperty('free');
          expect(Array.isArray(item.occupied)).toBeTruthy();
          expect(Array.isArray(item.free)).toBeTruthy();
        }
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
