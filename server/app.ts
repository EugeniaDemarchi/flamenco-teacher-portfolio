import express from "express";
import { healthRouter } from "./routes/health.routes";
import {
  manejarErrores,
  rutaNoEncontrada,
} from "./middlewares/manejador-errores";

export const app = express();

app.use(express.json());

app.use("/api", healthRouter);

app.use(rutaNoEncontrada);
app.use(manejarErrores);
