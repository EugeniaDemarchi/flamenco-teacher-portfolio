import { SeccionClasesInfo, Clase } from "../types/clases.js";
import { clases, seccionClasesInfo } from "../data/clases.js";
import {
  crearDesplegableInfo,
  crearLinkUbicacion,
} from "./componentesComunes.js";
import { crearPictureResponsive } from "../utils/crear-picture.js";

const CARPETA_CLASES = "clases";

// ===== Punto de entrada =====

function initClases() {
  renderIntroClases(seccionClasesInfo);
  renderClases(clases);
}

// ===== Introducción de la sección (enfoque y modalidad) =====

function renderIntroClases(info: SeccionClasesInfo) {
  renderImagenPrincipal(info.imagenPrincipal);
  renderEnfoque(info.descripcionGeneral);
  renderModalidad(info.metodologia);
  renderImagenMetodologia(info.imagenMetodologia);
}

function renderImagenPrincipal(nombreBase: string) {
  const imgActual = document.querySelector(
    ".descripcionClases__img",
  ) as HTMLImageElement;

  const picture = crearPictureResponsive({
    nombreBase,
    carpeta: CARPETA_CLASES,
    alt: "Clase de Natalia Riopedre",
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    className: "descripcionClases__img",
  });
  imgActual.replaceWith(picture);
}

// Los títulos "Enfoque" y "Modalidad" se escriben solo si hay contenido:
// así no queda un título sin texto debajo.
function renderEnfoque(descripcion?: string) {
  if (!descripcion) return;

  const titulo = document.querySelector(
    ".descripcionClases__descGral-titulo",
  ) as HTMLHeadingElement;
  const parrafo = document.querySelector(
    ".descripcionClases__descGral",
  ) as HTMLParagraphElement;

  titulo.textContent = "Enfoque";
  parrafo.textContent = descripcion;
}

function renderModalidad(puntos?: string[]) {
  if (!puntos) return;

  const titulo = document.querySelector(
    ".descripcionClases__descGral-metod",
  ) as HTMLHeadingElement;
  const lista = document.querySelector(
    ".descripcionClases__metodologia",
  ) as HTMLUListElement;

  titulo.textContent = "Modalidad";
  puntos.forEach((punto) => {
    const li = document.createElement("li");
    li.textContent = punto;
    li.className = "descripcionClases__bulletsMetod";
    lista.appendChild(li);
  });
}

function renderImagenMetodologia(nombreBase?: string) {
  if (!nombreBase) return;

  const imgActual = document.querySelector(
    ".descripcionClases__imgMetod",
  ) as HTMLImageElement;

  const picture = crearPictureResponsive({
    nombreBase,
    carpeta: CARPETA_CLASES,
    alt: "Clases de Natalia Riopedre",
    sizes: "100vw",
    loading: "lazy",
    className: "descripcionClases__imgMetod",
  });
  imgActual.replaceWith(picture);
}

// ===== Tarjetas de clases =====

export function renderClases(lista: Clase[]) {
  const contenedor = document.querySelector(".clases__grid") as HTMLDivElement;
  contenedor.innerHTML = "";

  lista.forEach((clase) => contenedor.appendChild(crearTarjetaClase(clase)));
}

/** Una tarjeta = cabecera (imagen, título, nivel) + información (horarios, textos, ubicación). */
function crearTarjetaClase(clase: Clase): HTMLDivElement {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("clases__div");

  tarjeta.appendChild(crearCabeceraClase(clase));
  tarjeta.appendChild(crearInfoClase(clase));
  return tarjeta;
}

function crearCabeceraClase(clase: Clase): HTMLDivElement {
  const cabecera = document.createElement("div");
  cabecera.classList.add("clases__imgWrapper");

  const picture = crearPictureResponsive({
    nombreBase: clase.imagenClase,
    carpeta: CARPETA_CLASES,
    alt: clase.titulo,
    sizes: "(min-width: 1440px) 25vw, (min-width: 768px) 50vw, 100vw",
    loading: "lazy",
    className: "clases__img",
  });

  const titulo = document.createElement("h3");
  titulo.textContent = clase.titulo;
  titulo.classList.add("clases__titulo");

  const nivel = document.createElement("h3");
  nivel.textContent = `Nivel: ${clase.nivelClase}`;
  nivel.classList.add("clases__nivel");

  cabecera.appendChild(picture);
  cabecera.appendChild(titulo);
  cabecera.appendChild(nivel);
  return cabecera;
}

function crearInfoClase(clase: Clase): HTMLDivElement {
  const info = document.createElement("div");
  info.classList.add("clases__infoDiv");

  info.appendChild(crearListaHorarios(clase.horarios));

  // Campos opcionales: si no vienen, no se agrega nada.
  if (clase.descripcionCorta) {
    const descCorta = document.createElement("p");
    descCorta.classList.add("clases__descCorta");
    descCorta.textContent = clase.descripcionCorta;
    info.appendChild(descCorta);
  }

  if (clase.descripcionLarga) {
    const [boton, descripcion] = crearDesplegableInfo(clase.descripcionLarga);
    info.appendChild(boton);
    info.appendChild(descripcion);
  }

  info.appendChild(crearLinkUbicacion(clase.ubicacion, "clases__ubicacion"));
  return info;
}

function crearListaHorarios(horarios: Clase["horarios"]): HTMLUListElement {
  const lista = document.createElement("ul");
  lista.classList.add("clases__horarios");

  horarios.forEach(({ dia, horario }) => {
    const li = document.createElement("li");
    li.textContent = `${dia}, ${horario}`;
    li.classList.add("clases__li");
    lista.appendChild(li);
  });
  return lista;
}

initClases();
