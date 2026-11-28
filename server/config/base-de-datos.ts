import mongoose from "mongoose";

let conexion: Promise<typeof mongoose> | null = null;

export async function conectarBaseDeDatos(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  if (!conexion) {
    conexion = mongoose.connect(uri).catch((error) => {
      conexion = null;
      throw error;
    });
  }
  return conexion;
}

export async function desconectarBaseDeDatos() {
  await mongoose.disconnect();
  conexion = null;
}
