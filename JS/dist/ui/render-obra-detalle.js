import { obras } from "../data/obras.js";
export function buscarSlug(lista, slug) {
    return lista.find((obra) => obra.slugObra === slug);
}
/*MANUAL: "subí tus videos de espectáculos a YouTube y pegá el link acá")*/
function convertirAEmbedYoutube(url) {
    const urlObj = new URL(url);
    let id;
    if (urlObj.hostname === "youtube.be") {
        id = urlObj.pathname.slice(1);
    }
    else {
        id = urlObj.searchParams.get("v");
    }
    return `https://www.youtube.com/embed/${id}`;
}
function initObraDetalle() {
    const parametros = new URLSearchParams(window.location.search);
    const slug = parametros.get("slug");
    if (!slug) {
        mostrarError("Pagina no encontrada");
        return;
    }
    const encontrado = buscarSlug(obras, slug);
    if (!encontrado) {
        mostrarError("Pagina no encontrada");
        return;
    }
    renderObraDetalle(encontrado);
}
function mostrarError(mensaje) {
    const errorMsg = document.createElement("p");
    errorMsg.textContent = mensaje;
    document.body.appendChild(errorMsg);
}
export function renderObraDetalle(obra) {
    const imgPpal = document.querySelector(".obra-detalle__img-ppal");
    imgPpal.src = obra.imgPpal;
    imgPpal.alt = obra.titulo;
    const titulo = document.querySelector(".obra-detalle__titulo");
    titulo.innerHTML = obra.titulo;
    const descripcionCorta = document.querySelector(".obra-detalle__descripcion-corta");
    descripcionCorta.innerHTML = obra.descripcionCorta;
    const galeria = document.querySelector(".obra-detalle__galeria");
    galeria.innerHTML = "";
    obra.galeria?.forEach((rutaImg) => {
        const img = document.createElement("img");
        img.src = rutaImg;
        img.alt = obra.titulo;
        galeria.appendChild(img);
    });
    const rol = document.querySelector(".obra-detalle__rol");
    rol.innerHTML = obra.rol;
    const descripcionLarga = document.querySelector(".obra-detalle__descripcion-larga");
    if (obra.descripcionLarga) {
        descripcionLarga.textContent = obra.descripcionLarga;
    }
    const videoContainer = document.querySelector(".obra-detalle__video");
    if (obra.video) {
        const iframe = document.createElement("iframe");
        iframe.src = convertirAEmbedYoutube(obra.video);
        videoContainer.appendChild(iframe);
    }
}
initObraDetalle();
//# sourceMappingURL=render-obra-detalle.js.map