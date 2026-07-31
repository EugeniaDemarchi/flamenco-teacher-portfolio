import { Obra } from "../types/obras.js";
import { obras } from "../data/obras.js";

export function buscarSlug(lista: Obra[], slug: string) {
  return lista.find((obra) => obra.slugObra === slug);
}

/*MANUAL: "subí tus videos de espectáculos a YouTube y pegá el link acá")*/
function convertirAEmbedYoutube(url: string): string {
  const urlObj = new URL(url);
  let id: string | null;

  if (urlObj.hostname === "youtube.be") {
    id = urlObj.pathname.slice(1);
  } else {
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

export function mostrarError(mensaje: string) {
  const errorMsg = document.createElement("p");
  errorMsg.textContent = mensaje;
  document.body.appendChild(errorMsg);
}

export function renderObraDetalle(obra: Obra) {
  const imgPpal = document.querySelector(
    ".obra-detalle__img-ppal",
  ) as HTMLImageElement;
  imgPpal.src = obra.imgPpal;
  imgPpal.alt = obra.titulo;
  imgPpal.dataset.slug = obra.slugObra;

  const titulo = document.querySelector(
    ".obra-detalle__titulo",
  ) as HTMLTitleElement;
  titulo.innerHTML = obra.titulo;

  const descripcionCorta = document.querySelector(
    ".obra-detalle__descripcion-corta",
  ) as HTMLParagraphElement;
  descripcionCorta.innerHTML = obra.descripcionCorta;

  const galeria = document.querySelector(
    ".obra-detalle__galeria",
  ) as HTMLDivElement;
  galeria.innerHTML = "";

  const modal = document.querySelector(
    ".obra-detalle__modal",
  ) as HTMLDivElement;

  const imgModal = document.querySelector(
    ".obra-detalle__modal-img",
  ) as HTMLImageElement;

  const closeBtnGaleria = document.querySelector(
    ".obra-detalle__close-btn",
  ) as HTMLButtonElement;

  /*"la imagen de imgPpal tiene que estar también, tal cual, dentro de galeria"*/
  const pantallaLaptop = window.matchMedia("(min-width: 1024px)");

  let galeriaARenderizar;

  if (pantallaLaptop.matches) {
    galeriaARenderizar = obra.galeria;
  } else {
    galeriaARenderizar = obra.galeria?.filter(
      (rutaImg) => rutaImg !== obra.imgPpal,
    );
  }

  let indiceActual = 0;

  if (galeriaARenderizar) {
    const listaGaleria = galeriaARenderizar;
    function abrirModal(index: number) {
      indiceActual = index;
      imgModal.src = listaGaleria[indiceActual];
      modal.classList.add("obra-detalle__modal--activo");
      document.body.classList.add("scroll-lock");
    }

    function cerrarModal() {
      modal.classList.remove("obra-detalle__modal--activo");
      document.body.classList.remove("scroll-lock");
    }

    closeBtnGaleria.addEventListener("click", cerrarModal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        cerrarModal();
      }
    });

    galeriaARenderizar.forEach((rutaImg, index) => {
      const img = document.createElement("img");
      const imgWrapper = document.createElement("div");

      imgWrapper.classList.add("obra-detalle__img-wrapper");
      img.src = rutaImg;
      img.alt = obra.titulo;
      imgWrapper.addEventListener("click", () => abrirModal(index));
      imgWrapper.appendChild(img);
      galeria.appendChild(imgWrapper);
    });
  }

  const rol = document.querySelector(
    ".obra-detalle__rol",
  ) as HTMLParagraphElement;
  rol.innerHTML = obra.rol;

  const anio = document.querySelector(
    ".obra-detalle__anio",
  ) as HTMLParagraphElement;
  anio.textContent = String(obra.anio);

  const descripcionLarga = document.querySelector(
    ".obra-detalle__descripcion-larga",
  ) as HTMLParagraphElement;
  if (obra.descripcionLarga) {
    descripcionLarga.textContent = obra.descripcionLarga;
  }

  const videoContainer = document.querySelector(
    ".obra-detalle__video",
  ) as HTMLDivElement;
  if (obra.video) {
    const iframe = document.createElement("iframe");
    iframe.src = convertirAEmbedYoutube(obra.video);
    videoContainer.appendChild(iframe);
  }
}

initObraDetalle();
