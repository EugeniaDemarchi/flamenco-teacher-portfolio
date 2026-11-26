// Códigos de error de la API (especificación, sección 4) y el status HTTP de cada uno.

const STATUS_POR_CODIGO = {
  VALIDACION: 400,
  NO_AUTENTICADO: 401,
  NO_ENCONTRADO: 404,
  CONFLICTO: 409,
  DEMASIADOS_INTENTOS: 429,
  ERROR_INTERNO: 500,
} as const;

export type CodigoError = keyof typeof STATUS_POR_CODIGO;

export interface DetalleError {
  campo: string;
  mensaje: string;
}

// Error "esperado": el servidor sabe qué pasó y cómo contárselo al cliente.
export class ErrorApi extends Error {
  readonly codigo: CodigoError;
  readonly status: number;
  readonly detalles?: DetalleError[];

  constructor(codigo: CodigoError, mensaje: string, detalles?: DetalleError[]) {
    super(mensaje);
    this.name = "ErrorApi";
    this.codigo = codigo;
    this.status = STATUS_POR_CODIGO[codigo];
    this.detalles = detalles;
  }
}
