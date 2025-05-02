import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { join } from 'path';
import { RootController } from './controller';

describe('RootController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RootController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/chat (GET) should return index.html', async () => {
    const res = await request(app.getHttpServer()).get('/chat');
    expect(res.status).toBe(200);
    expect(res.type).toBe('text/html');
    expect(res.text).toContain('<!DOCTYPE html>');
  });

  afterAll(async () => {
    await app.close();
  });
});
