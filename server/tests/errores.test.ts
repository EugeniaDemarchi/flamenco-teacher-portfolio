import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";
import { app } from "../app";
import { ErrorApi } from "../errors/error-api";
import { manejarErrores } from "../middlewares/manejador-errores";

const appDePrueba = express();
appDePrueba.get("/error-conocido", () => {
  throw new ErrorApi("NO_ENCONTRADO", "La obra no existe.");
});

appDePrueba.get("/error-inesperado", () => {
  throw new Error("detalle interno secreto");
});

appDePrueba.use(manejarErrores);

describe("Manejador central de errores", () => {
  it("convierte un ErrorApi al formato de la especificación", async () => {
    const respuesta = await request(appDePrueba).get("/error-conocido");

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      error: { codigo: "NO_ENCONTRADO", mensaje: "La obra no existe." },
    });
  });

  it("responde 500 sin mostrar detalles internos ante un error inesperado", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const respuesta = await request(appDePrueba).get("/error-inesperado");

    expect(respuesta.status).toBe(500);
    expect(respuesta.body.error.codigo).toBe("ERROR_INTERNO");
    expect(JSON.stringify(respuesta.body)).not.toContain("secreto");
  });

  it("responde 404 con el formato de la especificación si la ruta no existe", async () => {
    const respuesta = await request(app).get("/api/no-existe");

    expect(respuesta.status).toBe(404);
    expect(respuesta.body.error.codigo).toBe("NO_ENCONTRADO");
  });

  it("responde 400 si el cuerpo no es un JSON válido", async () => {
    const respuesta = await request(app)
      .post("/api/health")
      .set("Content-Type", "application/json")
      .send("{ esto no es json");

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.error.codigo).toBe("VALIDACION");
  });
});
