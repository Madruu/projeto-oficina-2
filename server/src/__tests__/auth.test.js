import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { connectDBTest, disconnectDBTest, clearDatabase } from './setup.js';
import { createTestUser } from './helpers.js';
import User from '../models/user.model.js';

describe('Auth Controller', () => {
  beforeAll(async () => {
    await connectDBTest();
  }, 60000);

  afterAll(async () => {
    await disconnectDBTest();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /auth/login - Login', () => {
    it('deve fazer login com sucesso', async () => {
      // Cria um usuário de teste através do registro
      await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          role: 'admin',
        });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('role');
      expect(response.body.role).toBe('admin');
    });

    it('deve retornar erro 400 para usuário não encontrado', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'inexistente@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Usuário não encontrado');
    });

    it('deve retornar erro 400 para senha incorreta', async () => {
      await createTestUser({
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'senha_errada',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Senha incorreta');
    });

    it('deve retornar erro 500 para erro interno', async () => {
      // Mock para forçar erro
      const originalFindOne = User.findOne;
      User.findOne = jest.fn(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');

      // Restaura a função original
      User.findOne = originalFindOne;
    });
  });

  describe('POST /auth/register - Registrar', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'novo@example.com',
          password: 'password123',
          role: 'voluntario',
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Usuário criado com sucesso!');

      // Verifica se o usuário foi criado no banco
      const user = await User.findOne({ email: 'novo@example.com' });
      expect(user).toBeTruthy();
      expect(user.role).toBe('voluntario');
    });

    it('deve registrar um usuário admin', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
        })
        .expect(201);

      const user = await User.findOne({ email: 'admin@example.com' });
      expect(user.role).toBe('admin');
    });

    it('deve retornar erro 400 para email já cadastrado', async () => {
      await createTestUser({
        email: 'existente@example.com',
        password: 'password123',
        role: 'admin',
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'existente@example.com',
          password: 'password123',
          role: 'voluntario',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Email já cadastrado');
    });

    it('deve retornar erro 500 para erro interno', async () => {
      // Mock para forçar erro no save
      const originalSave = User.prototype.save;
      User.prototype.save = jest.fn(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'erro@example.com',
          password: 'password123',
          role: 'voluntario',
        })
        .expect(500);

      expect(response.body).toHaveProperty('error');

      // Restaura a função original
      User.prototype.save = originalSave;
    });
  });
});

