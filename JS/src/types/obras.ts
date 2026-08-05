export interface Obra {
  titulo: string;
  imagenPortada: string;
  slugObra: string;
  imgPpal: string;
  descripcionCorta: string;
  rol: string;
  descripcionLarga?: string;
  galeria?: string[];
  video?: string;
  anio?: number;
}
