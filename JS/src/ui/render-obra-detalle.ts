import { Obra } from "../types/obras.js";
import { obras } from "../data/obras.js";
import { crearPictureResponsive } from "../utils/crear-picture.js";

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
  const imgPpalActual = document.querySelector(
    ".obra-detalle__img-ppal",
  ) as HTMLImageElement;

  const pictureNuevo = crearPictureResponsive({
    nombreBase: obra.imgPpal,
    carpeta: "obras",
    alt: obra.titulo,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    className: "obra-detalle__img-ppal",
  });

  const imgDentro = pictureNuevo.querySelector("img") as HTMLImageElement;
  imgDentro.dataset.slug = obra.slugObra;

  imgPpalActual.replaceWith(pictureNuevo);

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

  const closeBtnGaleria = document.querySelector(
    ".obra-detalle__close-btn",
  ) as HTMLButtonElement;

  /*"MANUAL: la imagen de imgPpal tiene que estar también, tal cual, dentro de galeria"*/
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
    function actualizarImagenModal(nombreBase: string, alt: string) {
      const pictureActual = document.querySelector(
        ".obra-detalle__modal-picture",
      ) as HTMLPictureElement;

      const pictureNuevo = crearPictureResponsive({
        nombreBase,
        carpeta: "obras",
        alt,
        loading: "eager",
        soloLarge: true,
        className: "obra-detalle__modal-img",
      });

      pictureNuevo.classList.add("obra-detalle__modal-picture");

      pictureActual.replaceWith(pictureNuevo);
    }

    function abrirModal(index: number) {
      indiceActual = index;
      actualizarImagenModal(listaGaleria[indiceActual], obra.titulo);
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

    galeriaARenderizar.forEach((nombreBase, index) => {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("obra-detalle__img-wrapper");

      const picture = crearPictureResponsive({
        nombreBase,
        carpeta: "obras",
        alt: obra.titulo,
        sizes: "(min-width: 1024px) 20rem, 100vw",
        loading: "lazy",
      });

      imgWrapper.addEventListener("click", () => abrirModal(index));
      imgWrapper.appendChild(picture);
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
  if (obra.anio) {
    anio.textContent = String(obra.anio);
  }

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
