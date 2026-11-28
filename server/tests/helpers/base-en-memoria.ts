import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  conectarBaseDeDatos,
  desconectarBaseDeDatos,
} from "../../config/base-de-datos";

let servidor: MongoMemoryServer;

export async function iniciarBaseEnMemoria() {
  servidor = await MongoMemoryServer.create();
  await conectarBaseDeDatos(servidor.getUri());
}

export async function vaciarBaseEnMemoria() {
  const colecciones = Object.values(mongoose.connection.collections);
  await Promise.all(colecciones.map((coleccion) => coleccion.deleteMany({})));
}

export async function detenerBaseEnMemoria() {
  await desconectarBaseDeDatos();
  await servidor.stop();
}
