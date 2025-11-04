import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { connectDBTest, disconnectDBTest, clearDatabase } from './setup.js';
import { createTestUser, getAuthToken } from './helpers.js';
import Voluntario from '../models/voluntario.model.js';
import User from '../models/user.model.js';
import Oficina from '../models/oficina.model.js';

describe('Voluntário CRUD', () => {
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

  describe('POST /voluntarios - Criar voluntário', () => {
    it('deve criar um voluntário com sucesso (admin)', async () => {
      const voluntarioData = {
        nomeCompleto: 'João Silva',
        cpf: '12345678900',
        email: 'joao@example.com',
        telefone: '11999999999',
      };

      const response = await request(app)
        .post('/voluntarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(voluntarioData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.nomeCompleto).toBe(voluntarioData.nomeCompleto);
      expect(response.body.cpf).toBe(voluntarioData.cpf);
    });

    it('não deve criar voluntário sem autenticação', async () => {
      const voluntarioData = {
        nomeCompleto: 'João Silva',
        cpf: '12345678900',
      };

      await request(app)
        .post('/voluntarios')
        .send(voluntarioData)
        .expect(401);
    });

    it('não deve criar voluntário sem autorização (voluntario role)', async () => {
      const voluntarioData = {
        nomeCompleto: 'João Silva',
        cpf: '12345678900',
      };

      await request(app)
        .post('/voluntarios')
        .set('Authorization', `Bearer ${voluntarioToken}`)
        .send(voluntarioData)
        .expect(403);
    });

    it('não deve criar voluntário com CPF duplicado', async () => {
      const voluntarioData = {
        nomeCompleto: 'João Silva',
        cpf: '12345678900',
      };

      // Cria primeiro voluntário
      await request(app)
        .post('/voluntarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(voluntarioData)
        .expect(201);

      // Tenta criar segundo com mesmo CPF
      const response = await request(app)
        .post('/voluntarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(voluntarioData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /voluntarios - Listar voluntários', () => {
    it('deve listar todos os voluntários (admin)', async () => {
      // Cria alguns voluntários
      const v1 = new Voluntario({
        nomeCompleto: 'Voluntário 1',
        cpf: '11111111111',
      });
      const v2 = new Voluntario({
        nomeCompleto: 'Voluntário 2',
        cpf: '22222222222',
      });
      await v1.save();
      await v2.save();

      const response = await request(app)
        .get('/voluntarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('não deve listar voluntários sem autenticação', async () => {
      await request(app)
        .get('/voluntarios')
        .expect(401);
    });

    it('não deve listar voluntários sem autorização (voluntario role)', async () => {
      await request(app)
        .get('/voluntarios')
        .set('Authorization', `Bearer ${voluntarioToken}`)
        .expect(403);
    });
  });

  describe('GET /voluntarios/:id - Obter voluntário por ID', () => {
    it('deve retornar um voluntário específico (admin)', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      const response = await request(app)
        .get(`/voluntarios/${voluntario._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body._id).toBe(voluntario._id.toString());
      expect(response.body.nomeCompleto).toBe('Voluntário Teste');
    });

    it('deve retornar 404 para voluntário inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/voluntarios/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/voluntarios/invalid-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /voluntarios/me - Obter próprio perfil', () => {
    it('deve retornar perfil para admin', async () => {
      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('userId');
    });

    it('deve retornar perfil para voluntario', async () => {
      const response = await request(app)
        .get('/voluntarios/me')
        .set('Authorization', `Bearer ${voluntarioToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /voluntarios/:id - Atualizar voluntário', () => {
    it('deve atualizar um voluntário com sucesso (admin)', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Original',
        cpf: '12345678900',
        telefone: '11999999999',
      });
      await voluntario.save();

      const updateData = {
        nomeCompleto: 'Voluntário Atualizado',
        telefone: '11888888888',
      };

      const response = await request(app)
        .put(`/voluntarios/${voluntario._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nomeCompleto).toBe('Voluntário Atualizado');
      expect(response.body.telefone).toBe('11888888888');
    });

    it('deve desativar voluntário quando dataSaida é inserida', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Ativo',
        cpf: '12345678900',
        ativo: true,
      });
      await voluntario.save();

      const updateData = {
        dataSaida: new Date(),
      };

      const response = await request(app)
        .put(`/voluntarios/${voluntario._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.ativo).toBe(false);
      expect(response.body.dataSaida).toBeDefined();
    });

    it('deve retornar 404 para voluntário inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .put(`/voluntarios/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nomeCompleto: 'Teste' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('não deve atualizar sem autenticação', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      await request(app)
        .put(`/voluntarios/${voluntario._id}`)
        .send({ nomeCompleto: 'Atualizado' })
        .expect(401);
    });
  });

  describe('DELETE /voluntarios/:id - Deletar voluntário', () => {
    it('deve deletar um voluntário com sucesso (admin)', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário para Deletar',
        cpf: '12345678900',
      });
      await voluntario.save();

      const response = await request(app)
        .delete(`/voluntarios/${voluntario._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');

      // Verifica se foi deletado
      const deleted = await Voluntario.findById(voluntario._id);
      expect(deleted).toBeNull();
    });

    it('deve retornar 404 para voluntário inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/voluntarios/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });

    it('não deve deletar sem autenticação', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      await request(app)
        .delete(`/voluntarios/${voluntario._id}`)
        .expect(401);
    });

    it('não deve deletar sem autorização (voluntario role)', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      await request(app)
        .delete(`/voluntarios/${voluntario._id}`)
        .set('Authorization', `Bearer ${voluntarioToken}`)
        .expect(403);
    });
  });

  describe('POST /voluntarios/:id/assign - Associar oficina a voluntário', () => {
    it('deve associar uma oficina a um voluntário com sucesso', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      const oficina = new Oficina({
        titulo: 'Oficina Teste',
        descricao: 'Descrição teste',
      });
      await oficina.save();

      const response = await request(app)
        .post(`/voluntarios/${voluntario._id}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ oficinaId: oficina._id.toString() })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Oficina associada com sucesso');
      expect(response.body).toHaveProperty('voluntario');
      expect(response.body.voluntario.oficinaId).toContainEqual(
        expect.objectContaining({ _id: oficina._id.toString() })
      );
    });

    it('não deve associar oficina sem informar oficinaId', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      const response = await request(app)
        .post(`/voluntarios/${voluntario._id}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Informe o ID da oficina');
    });

    it('não deve associar oficina a voluntário inexistente', async () => {
      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .post(`/voluntarios/${fakeId}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ oficinaId: oficina._id.toString() })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Voluntário não encontrado');
    });

    it('não deve associar oficina duplicada', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
        oficinaId: [],
      });
      await voluntario.save();

      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      // Primeira associação
      await request(app)
        .post(`/voluntarios/${voluntario._id}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ oficinaId: oficina._id.toString() })
        .expect(200);

      // Segunda associação (não deve dar erro, mas não deve duplicar)
      const response = await request(app)
        .post(`/voluntarios/${voluntario._id}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ oficinaId: oficina._id.toString() })
        .expect(200);

      expect(response.body.message).toBe('Oficina associada com sucesso');
    });

    it('não deve associar oficina sem autenticação', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      await request(app)
        .post(`/voluntarios/${voluntario._id}/assign`)
        .send({ oficinaId: oficina._id.toString() })
        .expect(401);
    });

    it('deve retornar erro 500 em caso de erro no banco', async () => {
      const voluntario = new Voluntario({
        nomeCompleto: 'Voluntário Teste',
        cpf: '12345678900',
      });
      await voluntario.save();

      const oficina = new Oficina({
        titulo: 'Oficina Teste',
      });
      await oficina.save();

      // Mock para forçar erro
      const originalFindById = Voluntario.findById;
      Voluntario.findById = jest.fn(() => {
        throw new Error('Database error');
      });

      const response = await request(app)
        .post(`/voluntarios/${voluntario._id}/assign`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ oficinaId: oficina._id.toString() })
        .expect(500);

      expect(response.body).toHaveProperty('error');

      // Restaura a função original
      Voluntario.findById = originalFindById;
    });
  });
});

