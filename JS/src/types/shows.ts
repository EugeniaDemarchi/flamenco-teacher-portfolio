import { Ubicacion } from "./comunes.js";

export interface Artista {
  nombre: string;
  rol: string;
}

export type Categoria =
  | { categoria: "Espectáculo"; obraRelacionada?: string }
  | { categoria: "Tablao flamenco" };

export type Temporalidad =
  | { tipo: "puntual"; fecha: string; horario: string }
  | { tipo: "recurrente"; diaSemana: string; horario: string };

export type ShowsEnCartel = Categoria &
  Temporalidad & {
    imagen: string;
    titulo: string;
    descripcionCorta?: string;
    contacto: {
      espacio: string;
      telefono?: string;
      link?: string;
      ubicacion: Ubicacion;
    };
    localidadesAgotadas?: boolean;
    artistas: Artista[];
  };
