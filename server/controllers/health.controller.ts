import type { Request, Response } from "express";

export function obtenerEstado(_req: Request, res: Response) {
  res.status(200).json({ status: "ok" });
}
