import { Ubicacion } from "./comunes.js";

export interface SeccionClasesInfo {
  imagenPrincipal: string;
  descripcionGeneral?: string;
  imagenMetodologia?: string;
  metodologia?: string[];
}

export interface Clase {
  imagenClase: string;
  nivelClase:
    | "inicial"
    | "intermedio"
    | "intermedio bajo"
    | "intermedio alto"
    | "avanzado";

  titulo: string;
  horarios: {
    dia: string;
    horario: string;
  }[];
  descripcionCorta?: string;
  descripcionLarga?: string;
  ubicacion: Ubicacion;
}
