import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { connectDBTest, disconnectDBTest, clearDatabase } from './setup.js';
import { createTestUser, getAuthToken } from './helpers.js';
import Oficina from '../models/oficina.model.js';
import User from '../models/user.model.js';

describe('Oficina', () => {
  let adminToken;
  let voluntarioToken;
  let adminUser;
  let voluntarioUser;

  beforeAll(async () => {
    await connectDBTest();
  }, 60000); // 60 segundos para permitir download do MongoDB na primeira execução

  afterAll(async () => {
    await disconnectDBTest();
  });

  beforeEach(async () => {
    await clearDatabase();

    // Cria usuários de teste
    adminUser = await createTestUser({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin',
    });

    voluntarioUser = await createTestUser({
      email: 'voluntario@test.com',
      password: 'password123',
      role: 'voluntario',
    });

    adminToken = getAuthToken(adminUser);
    voluntarioToken = getAuthToken(voluntarioUser);
  });

  describe('POST /oficinas - Criar oficina', () => {
    it('deve criar uma oficina com sucesso (admin)', async () => {
      const oficinaData = {
        titulo: 'Oficina de Programação',
        descricao: 'Aprenda a programar em JavaScript',
        data: new Date('2024-12-31'),
        local: 'Sala 101',
        responsavel: 'João Silva',
      };

      const response = await request(app)
        .post('/oficinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(oficinaData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.titulo).toBe(oficinaData.titulo);
      expect(response.body.descricao).toBe(oficinaData.descricao);
      expect(response.body.local).toBe(oficinaData.local);
      expect(response.body.responsavel).toBe(oficinaData.responsavel);
    });

    it('não deve criar oficina sem autenticação', async () => {
      const oficinaData = {
        titulo: 'Oficina Teste',
        descricao: 'Descrição teste',
      };

      await request(app)
        .post('/oficinas')
        .send(oficinaData)
        .expect(401);
    });

    it('não deve criar oficina sem título (campo obrigatório)', async () => {
      const oficinaData = {
        descricao: 'Descrição sem título',
      };

      const response = await request(app)
        .post('/oficinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(oficinaData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /oficinas - Listar oficinas', () => {
    it('deve listar todas as oficinas (admin)', async () => {
      // Cria algumas oficinas
      const o1 = new Oficina({
        titulo: 'Oficina 1',
        descricao: 'Descrição 1',
      });
      const o2 = new Oficina({
        titulo: 'Oficina 2',
        descricao: 'Descrição 2',
      });
      await o1.save();
      await o2.save();

      const response = await request(app)
        .get('/oficinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('não deve listar oficinas sem autenticação', async () => {
      await request(app)
        .get('/oficinas')
        .expect(401);
    });

    it('não deve listar oficinas sem autorização (voluntario role)', async () => {
      await request(app)
        .get('/oficinas')
        .set('Authorization', `Bearer ${voluntarioToken}`)
        .expect(403);
    });

    it('deve retornar erro 500 em caso de erro no banco', async () => {
      // Mock para forçar erro
      const originalFind = Oficina.find;
      Oficina.find = jest.fn(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .get('/oficinas')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(500);

      expect(response.body).toHaveProperty('error');

      // Restaura a função original
      Oficina.find = originalFind;
    });
  });

  describe('GET /oficinas/:id - Obter oficina por ID', () => {
    it('deve retornar uma oficina específica (admin)', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
        descricao: 'Descrição teste',
      });
      await oficina.save();

      const response = await request(app)
        .get(`/oficinas/${oficina._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body._id).toBe(oficina._id.toString());
      expect(response.body.titulo).toBe('Oficina Teste');
    });

    it('deve retornar 404 para oficina inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/oficinas/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Oficina não encontrada');
    });

    it('deve retornar 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/oficinas/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ID inválido');
    });

    it('não deve obter oficina sem autenticação', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      await request(app)
        .get(`/oficinas/${oficina._id}`)
        .expect(401);
    });
  });

  describe('PUT /oficinas/:id - Atualizar oficina', () => {
    it('deve atualizar uma oficina com sucesso (admin)', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Original',
        descricao: 'Descrição original',
      });
      await oficina.save();

      const updateData = {
        titulo: 'Oficina Atualizada',
        descricao: 'Nova descrição',
      };

      const response = await request(app)
        .put(`/oficinas/${oficina._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.titulo).toBe('Oficina Atualizada');
      expect(response.body.descricao).toBe('Nova descrição');
    });

    it('deve retornar 404 para oficina inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/oficinas/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: 'Atualizado' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Oficina não encontrada');
    });

    it('deve retornar 400 para erro de validação', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      // Tenta atualizar com dados inválidos (sem título)
      const response = await request(app)
        .put(`/oficinas/${oficina._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ titulo: '' }) // Título vazio pode causar erro
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('não deve atualizar sem autenticação', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      await request(app)
        .put(`/oficinas/${oficina._id}`)
        .send({ titulo: 'Atualizado' })
        .expect(401);
    });
  });

  describe('DELETE /oficinas/:id - Deletar oficina', () => {
    it('deve deletar uma oficina com sucesso (admin)', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina para Deletar',
        descricao: 'Descrição',
      });
      await oficina.save();

      const response = await request(app)
        .delete(`/oficinas/${oficina._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Oficina removida');

      // Verifica se foi deletado
      const deleted = await Oficina.findById(oficina._id);
      expect(deleted).toBeNull();
    });

    it('deve retornar 404 para oficina inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/oficinas/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Oficina não encontrada');
    });

    it('deve retornar 400 para ID inválido', async () => {
      const response = await request(app)
        .delete('/oficinas/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ID inválido');
    });

    it('não deve deletar sem autenticação', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      await request(app)
        .delete(`/oficinas/${oficina._id}`)
        .expect(401);
    });

    it('não deve deletar sem autorização (voluntario role)', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      await request(app)
        .delete(`/oficinas/${oficina._id}`)
        .set('Authorization', `Bearer ${voluntarioToken}`)
        .expect(403);
    });
  });
});

