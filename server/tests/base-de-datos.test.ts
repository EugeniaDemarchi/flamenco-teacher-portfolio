import { afterAll, beforeAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import { conectarBaseDeDatos } from "../config/base-de-datos";
import {
  detenerBaseEnMemoria,
  iniciarBaseEnMemoria,
} from "./helpers/base-en-memoria";

describe("conexion a la base de datos", () => {
  //120 segundos: la primera vez descarga MongoDB ( 100 MB)
  beforeAll(iniciarBaseEnMemoria, 120_000);
  afterAll(detenerBaseEnMemoria);

  it("se conecta a la base en memoria", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("falla con un mensaje claro si falta MONGODB_URI", async () => {
    await expect(conectarBaseDeDatos("")).rejects.toThrow("MONGODB_URI");
  });
});
