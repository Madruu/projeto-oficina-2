import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

describe('Health Route', () => {
  it('GET /health deve retornar status OK', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toEqual({ status: 'OK' });
  });

  it('GET /health deve retornar status 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});

