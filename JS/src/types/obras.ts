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
}

/*function convertirAEmbedYoutube(url: string): string {
  // extraer el ID del video de la URL completa
  // devolver `https://www.youtube.com/embed/${id}`
}*/
