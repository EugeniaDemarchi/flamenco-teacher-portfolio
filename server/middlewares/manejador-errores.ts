import type { ErrorRequestHandler, RequestHandler } from "express";
import { ErrorApi } from "../errors/error-api";

// Se monta después de todas las rutas: si ninguna respondió, la ruta no existe.
export const rutaNoEncontrada: RequestHandler = (_req, _res, next) => {
  next(new ErrorApi("NO_ENCONTRADO", "La ruta no existe."));
};

// Express lo reconoce como manejador de errores porque recibe 4 parámetros.
export const manejarErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ErrorApi) {
    res.status(err.status).json({
      error: {
        codigo: err.codigo,
        mensaje: err.message,
        ...(err.detalles && { detalles: err.detalles }),
      },
    });
    return;
  }

  // express.json() marca así un cuerpo que no es JSON válido.
  if (err.type === "entity.parse.failed") {
    res.status(400).json({
      error: {
        codigo: "VALIDACION",
        mensaje: "El cuerpo del pedido no es un JSON válido.",
      },
    });
    return;
  }

  // Error inesperado: se registra para la desarrolladora, pero el cliente no ve detalles.
  console.error(err);
  res.status(500).json({
    error: { codigo: "ERROR_INTERNO", mensaje: "Ocurrió un error inesperado." },
  });
};
