import { Obra } from "../types/obras.js";
import { obras } from "../data/obras.js";

const conatinerObras = document.querySelector(".obras__grid") as HTMLDivElement;

export function renderObras(obras: Obra[]) {
  conatinerObras.innerHTML = "";

  const copiaObras = [...obras].sort((a, b) => b.anio - a.anio);

  copiaObras.forEach((obra) => {
    const caja = document.createElement("a");
    caja.classList.add("obras__portada");
    caja.href = `obra-detalle.html?slug=${obra.slugObra}`;

    const img = document.createElement("img");
    img.classList.add("obras__img");

    img.src = obra.imagenPortada;
    img.alt = obra.titulo;

    const contenido = document.createElement("div");
    contenido.classList.add("obras__contenido");

    const title = document.createElement("h4");
    title.classList.add("obras__titulo");
    title.textContent = obra.titulo;

    const link = document.createElement("ion-icon");
    link.setAttribute("name", "arrow-forward-outline");
    link.classList.add("obras__flecha");

    contenido.appendChild(title);
    contenido.appendChild(link);
    caja.appendChild(img);
    caja.appendChild(contenido);
    conatinerObras.appendChild(caja);
  });
}
renderObras(obras);
