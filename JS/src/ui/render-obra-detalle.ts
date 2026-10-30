import { Obra } from "../types/obras.js";
import { obras } from "../data/obras.js";
import { crearPictureResponsive } from "../utils/crear-picture.js";

const CARPETA_OBRAS = "obras";

// ===== Punto de entrada =====

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

export function buscarSlug(lista: Obra[], slug: string) {
  return lista.find((obra) => obra.slugObra === slug);
}

export function mostrarError(mensaje: string) {
  const errorMsg = document.createElement("p");
  errorMsg.textContent = mensaje;
  document.body.appendChild(errorMsg);
}

// ===== Render de la página: cada sección en su propia función =====

export function renderObraDetalle(obra: Obra) {
  renderBanner(obra);
  renderTextos(obra);
  renderGaleria(obra);
  renderVideo(obra);
}

function renderBanner(obra: Obra) {
  const imgPpalActual = document.querySelector(
    ".obra-detalle__img-ppal",
  ) as HTMLImageElement;

  const pictureNuevo = crearPictureResponsive({
    nombreBase: obra.imgPpal,
    carpeta: CARPETA_OBRAS,
    alt: obra.titulo,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    className: "obra-detalle__img-ppal",
  });

  const imgDentro = pictureNuevo.querySelector("img") as HTMLImageElement;
  imgDentro.dataset.slug = obra.slugObra;

  imgPpalActual.replaceWith(pictureNuevo);
}

function renderTextos(obra: Obra) {
  // Título de la pestaña con el nombre de la obra (en el HTML queda "Obras · ..." como respaldo).
  document.title = `${obra.titulo} · Natalia Riopedre`;

  const titulo = document.querySelector(
    ".obra-detalle__titulo",
  ) as HTMLHeadingElement;
  titulo.textContent = obra.titulo;

  const rol = document.querySelector(
    ".obra-detalle__rol",
  ) as HTMLParagraphElement;
  rol.textContent = obra.rol;

  const descripcionCorta = document.querySelector(
    ".obra-detalle__descripcion-corta",
  ) as HTMLParagraphElement;
  descripcionCorta.textContent = obra.descripcionCorta;

  // Campos opcionales: si no vienen, el elemento queda vacío.
  if (obra.anio) {
    const anio = document.querySelector(
      ".obra-detalle__anio",
    ) as HTMLParagraphElement;
    anio.textContent = String(obra.anio);
  }

  if (obra.descripcionLarga) {
    const descripcionLarga = document.querySelector(
      ".obra-detalle__descripcion-larga",
    ) as HTMLParagraphElement;
    descripcionLarga.textContent = obra.descripcionLarga;
  }
}

// ===== Galería y modal =====

// La galería incluye también imgPpal. En mobile se filtra para no repetir la imagen del banner.
// Esta dependencia se elimina al conectar con la API (ver docs/especificacion-api.md, sección 7.2).
function obtenerGaleriaARenderizar(obra: Obra): string[] {
  if (!obra.galeria) return [];

  const esPantallaLaptop = window.matchMedia("(min-width: 1024px)").matches;
  if (esPantallaLaptop) return obra.galeria;

  return obra.galeria.filter((nombreBase) => nombreBase !== obra.imgPpal);
}

function renderGaleria(obra: Obra) {
  const galeria = document.querySelector(
    ".obra-detalle__galeria",
  ) as HTMLDivElement;
  galeria.innerHTML = "";

  const lista = obtenerGaleriaARenderizar(obra);
  if (lista.length === 0) return;

  const abrirModal = conectarModal(lista, obra.titulo);

  lista.forEach((nombreBase, indice) => {
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("obra-detalle__img-wrapper");

    const picture = crearPictureResponsive({
      nombreBase,
      carpeta: CARPETA_OBRAS,
      alt: obra.titulo,
      sizes: "(min-width: 1024px) 20rem, 100vw",
      loading: "lazy",
    });

    imgWrapper.addEventListener("click", () => abrirModal(indice));
    imgWrapper.appendChild(picture);
    galeria.appendChild(imgWrapper);
  });
}

/**
 * Conecta los eventos del modal de la galería (abrir, cerrar, anterior, siguiente).
 * Devuelve la función `abrirModal`, que recuerda la lista y la imagen actual
 * gracias a una clausura (closure).
 */
function conectarModal(lista: string[], alt: string) {
  const modal = document.querySelector(
    ".obra-detalle__modal",
  ) as HTMLDivElement;
  const btnCerrar = document.querySelector(
    ".obra-detalle__close-btn",
  ) as HTMLButtonElement;
  const btnAnterior = document.querySelector(
    ".obra-detalle__modal-prev",
  ) as HTMLButtonElement;
  const btnSiguiente = document.querySelector(
    ".obra-detalle__modal-next",
  ) as HTMLButtonElement;

  let indiceActual = 0;

  function mostrarImagen(indice: number) {
    indiceActual = indice;

    const pictureActual = document.querySelector(
      ".obra-detalle__modal-picture",
    ) as HTMLPictureElement;

    const pictureNuevo = crearPictureResponsive({
      nombreBase: lista[indiceActual],
      carpeta: CARPETA_OBRAS,
      alt,
      loading: "eager",
      soloLarge: true,
      className: "obra-detalle__modal-img",
    });
    pictureNuevo.classList.add("obra-detalle__modal-picture");

    pictureActual.replaceWith(pictureNuevo);
  }

  function abrirModal(indice: number) {
    mostrarImagen(indice);
    modal.classList.add("obra-detalle__modal--activo");
    document.body.classList.add("scroll-lock");
  }

  function cerrarModal() {
    modal.classList.remove("obra-detalle__modal--activo");
    document.body.classList.remove("scroll-lock");
  }

  // El operador % hace que, al pasar la última imagen, se vuelva a la primera (y al revés).
  btnSiguiente.addEventListener("click", () =>
    mostrarImagen((indiceActual + 1) % lista.length),
  );
  btnAnterior.addEventListener("click", () =>
    mostrarImagen((indiceActual - 1 + lista.length) % lista.length),
  );

  btnCerrar.addEventListener("click", cerrarModal);
  modal.addEventListener("click", (event) => {
    // Cierra solo si el clic fue en el fondo oscuro, no sobre la imagen.
    if (event.target === modal) cerrarModal();
  });

  return abrirModal;
}

// ===== Video (YouTube) =====

function extraerIdYoutube(url: string): string | null {
  const urlObj = new URL(url);
  if (urlObj.hostname === "youtu.be") {
    return urlObj.pathname.slice(1);
  }
  return urlObj.searchParams.get("v");
}

function crearEmbedYoutube(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
}

/**
 * Muestra una miniatura con botón de play ("facade") y carga el iframe de
 * YouTube recién al hacer clic. Así la página no descarga el reproductor
 * completo si nadie mira el video.
 */
function renderVideo(obra: Obra) {
  if (!obra.video) return;

  const id = extraerIdYoutube(obra.video);
  if (!id) return;

  const videoContainer = document.querySelector(
    ".obra-detalle__video",
  ) as HTMLDivElement;

  const facade = document.createElement("div");
  facade.classList.add("obra-detalle__video-facade");

  const thumb = document.createElement("img");
  thumb.src = `/ASSETS/IMAGES/videos/${obra.slugObra}-thumb.jpg`;
  thumb.alt = `Miniatura del video de ${obra.titulo}`;
  thumb.loading = "lazy";
  thumb.classList.add("obra-detalle__video-thumb");

  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.classList.add("obra-detalle__video-play");
  playBtn.setAttribute("aria-label", "Reproducir video");
  playBtn.innerHTML = `<ion-icon name="play-outline" aria-hidden="true"></ion-icon>`;

  facade.appendChild(thumb);
  facade.appendChild(playBtn);

  facade.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.src = crearEmbedYoutube(id);
    iframe.title = `Video de ${obra.titulo}`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.allowFullscreen = true;
    facade.replaceWith(iframe);
  });

  videoContainer.appendChild(facade);
}

initObraDetalle();
