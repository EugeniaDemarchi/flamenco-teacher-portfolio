import { Obra } from "../types/obras.js";
import { obras } from "../data/obras.js";
import { crearPictureResponsive } from "../utils/crear-picture.js";

const conatinerObras = document.querySelector(".obras__grid") as HTMLDivElement;

export function renderObras(obras: Obra[]) {
  conatinerObras.innerHTML = "";

  const copiaObras = [...obras].sort((a, b) =>
    a.titulo.localeCompare(b.titulo, "es"),
  );

  copiaObras.forEach((obra, index) => {
    const caja = document.createElement("a");
    caja.classList.add("obras__portada");
    caja.href = `obra-detalle.html?slug=${obra.slugObra}`;

    const picture = crearPictureResponsive({
      nombreBase: obra.imagenPortada,
      carpeta: "obras",
      alt: obra.titulo,
      sizes: "100vw",
      loading: index === 0 ? "eager" : "lazy",
      fetchPriority: index === 0 ? "high" : undefined,
      className: "obras__img",
    });

    const imgDentro = picture.querySelector("img") as HTMLImageElement;
    imgDentro.dataset.slug = obra.slugObra;

    const contenido = document.createElement("div");
    contenido.classList.add("obras__contenido");

    const title = document.createElement("h3");
    title.classList.add("obras__titulo");
    title.textContent = obra.titulo;

    const link = document.createElement("ion-icon");
    link.setAttribute("name", "arrow-forward-outline");
    link.classList.add("obras__flecha");

    contenido.appendChild(title);
    contenido.appendChild(link);
    caja.appendChild(picture);
    caja.appendChild(contenido);
    conatinerObras.appendChild(caja);
  });
}
renderObras(obras);
