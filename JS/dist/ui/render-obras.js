import { obras } from "../data/obras.js";
const conatinerObras = document.querySelector(".obras__grid");
export function renderObras(obras) {
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
        const title = document.createElement("h2");
        title.classList.add("obras__titulo");
        title.textContent = obra.titulo;
        const link = document.createElement("ion-icon");
        link.setAttribute("name", "arrow-forward-outline");
        link.classList.add("obras__flecha");
        caja.appendChild(img);
        caja.appendChild(title);
        caja.appendChild(link);
        conatinerObras.appendChild(caja);
    });
}
renderObras(obras);
//# sourceMappingURL=render-obras.js.map