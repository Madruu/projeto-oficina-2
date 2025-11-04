import request from "supertest";
import app from "../src/server.js";

describe("Testes das rotas principais", () => {
  it("Deve responder na rota GET /health com status 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("Deve retornar erro 404 para rota inexistente", async () => {
    const res = await request(app).get("/naoexiste");
    expect(res.status).toBe(404);
  });
});
