import { Router } from "express";
import { obtenerEstado } from "../controllers/health.controller";

const healthRouter = Router();

healthRouter.get("/health", obtenerEstado);

export { healthRouter };
