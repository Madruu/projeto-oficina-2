import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import { generateToken, createTestUser, getAuthToken } from "./helpers.js";
import { connectDBTest, disconnectDBTest, clearDatabase } from "./setup.js";

describe("Auth Middleware", () => {
  beforeAll(async () => {
    await connectDBTest();
  }, 60000);

  afterAll(async () => {
    await disconnectDBTest();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("authenticate middleware", () => {
    it("deve permitir acesso com token válido", async () => {
      const user = await createTestUser({
        nome: "Test User",
        email: "test@test.com",
        password: "password123",
        role: "admin",
      });
      const token = getAuthToken(user);

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email");
    });

    it("deve retornar 401 quando token não é fornecido", async () => {
      const response = await request(app).get("/auth/me").expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Token não fornecido");
    });

    it("deve retornar 401 quando token é inválido", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer token_invalido")
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Token inválido");
    });

    it("deve retornar 401 quando Authorization header está mal formatado", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "token_sem_bearer")
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });

    it("deve retornar 401 quando token não começa com Bearer", async () => {
      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Invalid token")
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("authorize middleware", () => {
    it("deve permitir acesso para admin quando autorizado", async () => {
      const adminUser = await createTestUser({
        nome: "Admin User",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      });
      const token = getAuthToken(adminUser);

      const response = await request(app)
        .get("/voluntarios")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve permitir acesso para coordenador quando autorizado", async () => {
      const coordUser = await createTestUser({
        nome: "Coordenador User",
        email: "coord@test.com",
        password: "password123",
        role: "coordenador",
      });
      const token = getAuthToken(coordUser);

      const response = await request(app)
        .get("/voluntarios")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve permitir acesso para visitante em rotas de leitura", async () => {
      const visitanteUser = await createTestUser({
        nome: "Visitante User",
        email: "visitante@test.com",
        password: "password123",
        role: "visitante",
      });
      const token = getAuthToken(visitanteUser);

      const response = await request(app)
        .get("/voluntarios")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("deve retornar 403 quando visitante tenta criar", async () => {
      const visitanteUser = await createTestUser({
        nome: "Visitante User",
        email: "visitante@test.com",
        password: "password123",
        role: "visitante",
      });
      const token = getAuthToken(visitanteUser);

      const response = await request(app)
        .post("/voluntarios")
        .set("Authorization", `Bearer ${token}`)
        .send({ nomeCompleto: "Teste" })
        .expect(403);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Acesso negado. Permissão insuficiente.");
    });

    it("deve retornar 403 quando coordenador tenta deletar", async () => {
      const coordUser = await createTestUser({
        nome: "Coordenador User",
        email: "coord@test.com",
        password: "password123",
        role: "coordenador",
      });
      const token = getAuthToken(coordUser);

      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .delete(`/voluntarios/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body).toHaveProperty("error");
    });

    it("deve retornar 401 quando user não existe mais no banco", async () => {
      const token = generateToken({ id: "507f1f77bcf86cd799439011", role: "admin" });

      const response = await request(app)
        .get("/voluntarios")
        .set("Authorization", `Bearer ${token}`)
        .expect(401);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Usuário não encontrado");
    });
  });
});
