// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { join } from 'path';
import * as express from 'express';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const publicPath = join(__dirname, '..', 'public');
    app.use(express.static(publicPath));
    await app.init();
  });

  it('/chat (GET) should return index.html', async () => {
    const res = await request(app.getHttpServer()).get('/chat');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
  });

  afterAll(async () => {
    await app.close();
  });
});
