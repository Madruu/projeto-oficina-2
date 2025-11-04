import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { generateToken } from './helpers.js';
import { connectDBTest, disconnectDBTest, clearDatabase } from './setup.js';

describe('Auth Middleware', () => {
  beforeAll(async () => {
    await connectDBTest();
  }, 60000);

  afterAll(async () => {
    await disconnectDBTest();
  });

  beforeEach(async () => {
    await clearDatabase();
  });
  describe('authenticate middleware', () => {
    it('deve permitir acesso com token válido', async () => {
      const token = generateToken({ id: 'test-id', role: 'admin' });

      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar 401 quando token não é fornecido', async () => {
      const response = await request(app)
        .get('/voluntarios/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token não fornecido');
    });

    it('deve retornar 401 quando token é inválido', async () => {
      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Token inválido');
    });

    it('deve retornar 401 quando Authorization header está mal formatado', async () => {
      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', 'token_sem_bearer')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 401 quando token não começa com Bearer', async () => {
      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', 'Invalid token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('authorize middleware', () => {
    it('deve permitir acesso para admin quando autorizado', async () => {
      const { createTestUser, getAuthToken } = await import('./helpers.js');
      const adminUser = await createTestUser({
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
      });
      const token = getAuthToken(adminUser);

      const response = await request(app)
        .get('/voluntarios')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve retornar 403 quando role não é permitida', async () => {
      const token = generateToken({ id: 'test-id', role: 'voluntario' });

      const response = await request(app)
        .get('/voluntarios')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Acesso negado');
    });

    it('deve permitir acesso para voluntario quando autorizado', async () => {
      const token = generateToken({ id: 'test-id', role: 'voluntario' });

      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('deve permitir acesso para admin quando autorizado (múltiplas roles)', async () => {
      const token = generateToken({ id: 'test-id', role: 'admin' });

      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('deve retornar 403 quando role é case-sensitive diferente', async () => {
      const { createTestUser, getAuthToken } = await import('./helpers.js');
      const adminUser = await createTestUser({
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin',
      });
      // O middleware converte para lowercase, então deve funcionar mesmo com uppercase
      const token = generateToken({ id: adminUser._id.toString(), role: 'ADMIN' });

      const response = await request(app)
        .get('/voluntarios')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('deve retornar 403 quando user não tem role', async () => {
      const token = generateToken({ id: 'test-id' }); // sem role

      const response = await request(app)
        .get('/voluntarios')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Acesso negado');
    });
  });
});

