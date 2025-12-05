import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest,
} from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { connectDBTest, disconnectDBTest, clearDatabase } from "./setup.js";
import { createTestUser } from "./helpers.js";
import User from "../models/user.model.js";

describe("Auth Controller", () => {
  beforeAll(async () => {
    await connectDBTest();
  }, 60000);

  afterAll(async () => {
    await disconnectDBTest();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /auth/login - Login", () => {
    it("deve fazer login com sucesso", async () => {
      // Cria um usuário de teste através do registro
      await request(app).post("/auth/register").send({
        nome: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "coordenador",
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.role).toBe("coordenador");
    });

    it("deve retornar erro 401 para usuário não encontrado", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "inexistente@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Credenciais inválidas");
    });

    it("deve retornar erro 401 para senha incorreta", async () => {
      await createTestUser({
        nome: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "admin",
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "senha_errada",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Credenciais inválidas");
    });

    it("deve retornar erro 400 para campos obrigatórios faltando", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Email e senha são obrigatórios");
    });

    it("deve retornar erro 500 para erro interno", async () => {
      // Mock para forçar erro
      const originalFindOne = User.findOne;
      User.findOne = jest.fn(() => {
        throw new Error("Database error");
      });

      const response = await request(app)
        .post("/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(500);

      expect(response.body).toHaveProperty("error");

      // Restaura a função original
      User.findOne = originalFindOne;
    });
  });

  describe("POST /auth/register - Registrar", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          nome: "Novo Usuário",
          email: "novo@example.com",
          password: "password123",
          role: "coordenador",
        })
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Usuário criado com sucesso");

      // Verifica se o usuário foi criado no banco
      const user = await User.findOne({ email: "novo@example.com" });
      expect(user).toBeTruthy();
      expect(user.role).toBe("coordenador");
    });

    it("deve registrar um usuário visitante por padrão quando admin tenta se registrar", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          nome: "Admin User",
          email: "admin@example.com",
          password: "password123",
          role: "admin", // Tenta criar admin, mas deve ser convertido para visitante
        })
        .expect(201);

      const user = await User.findOne({ email: "admin@example.com" });
      expect(user.role).toBe("visitante"); // Admin não pode ser criado via registro público
    });

    it("deve retornar erro 400 para email já cadastrado", async () => {
      await createTestUser({
        nome: "Existing User",
        email: "existente@example.com",
        password: "password123",
        role: "admin",
      });

      const response = await request(app)
        .post("/auth/register")
        .send({
          nome: "Outro Usuário",
          email: "existente@example.com",
          password: "password123",
          role: "visitante",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Email já cadastrado");
    });

    it("deve retornar erro 400 para campos obrigatórios faltando", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          email: "teste@example.com",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Nome, email e senha são obrigatórios");
    });
  });

  describe("GET /auth/me - Obter perfil", () => {
    it("deve retornar dados do usuário autenticado", async () => {
      const user = await createTestUser({
        nome: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "admin",
      });

      const { getAuthToken } = await import("./helpers.js");
      const token = getAuthToken(user);

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("nome");
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("role");
      expect(response.body.email).toBe("test@example.com");
    });

    it("deve retornar erro 401 sem token", async () => {
      const response = await request(app).get("/auth/me").expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Token não fornecido");
    });
  });
});
