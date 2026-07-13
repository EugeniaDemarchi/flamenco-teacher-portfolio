import { SeccionClasesInfo } from "../types/clases.js";
import { Clase } from "../types/clases.js";
import { clases, seccionClasesInfo } from "../data/clases.js";
import { masInfo } from "./componentesComunes.js";

const containerClases = document.querySelector(
  ".clases__grid",
) as HTMLDivElement;

export function renderDescripcionClases(seccionClasesInfo: SeccionClasesInfo) {
  const imgPpal = document.querySelector(
    ".descripcionClases__img",
  ) as HTMLImageElement;
  imgPpal.src = seccionClasesInfo.imagenPrincipal;
  imgPpal.alt = "Clase de Natlia Riopedre";

  const descGral = document.querySelector(
    ".descripcionClases__descGral",
  ) as HTMLParagraphElement;
  if (seccionClasesInfo.descripcionGeneral) {
    descGral.textContent = seccionClasesInfo.descripcionGeneral;
  }

  const imgMetodologia = document.querySelector(
    ".descripcionClases__imgMetod",
  ) as HTMLImageElement;
  if (seccionClasesInfo.imagenMetodologia) {
    imgMetodologia.src = seccionClasesInfo.imagenMetodologia;
    imgMetodologia.alt = "Clases de Natalia Riopedre";
  }

  const metodologia = document.querySelector(
    ".descripcionClases__metodologia",
  ) as HTMLUListElement;
  if (seccionClasesInfo.metodologia) {
    seccionClasesInfo.metodologia.forEach((punto) => {
      const li = document.createElement("li");
      li.textContent = punto;
      li.className = "descripcionClases__bulletsMetod";
      metodologia.appendChild(li);
    });
  }
}

export function renderClases(clases: Clase[]) {
  containerClases.innerHTML = "";

  clases.forEach((clase) => {
    const clasesDiv = document.createElement("div");
    clasesDiv.classList.add("clases__div");

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("clases__imgWrapper");

    const titulo = document.createElement("h2") as HTMLParagraphElement;
    titulo.textContent = clase.titulo;
    titulo.classList.add("clases__titulo");

    const imgClase = document.createElement("img") as HTMLImageElement;
    imgClase.src = clase.imagenClase;
    imgClase.alt = clase.titulo;
    imgClase.classList.add("clases__img");

    const nivel = document.createElement("h3") as HTMLParagraphElement;
    nivel.textContent = `Nivel: ${clase.nivelClase}`;
    nivel.classList.add("clases__nivel");

    imgWrapper.appendChild(imgClase);
    imgWrapper.appendChild(titulo);
    imgWrapper.appendChild(nivel);

    const clasesInfoDiv = document.createElement("div");
    clasesInfoDiv.classList.add("clases__infoDiv");

    const horarios = document.createElement("ul");
    horarios.classList.add("clases__horarios");
    clase.horarios.forEach((dia) => {
      const li = document.createElement("li");
      li.textContent = `${dia.dia}, ${dia.horario}`;
      li.classList.add("clases__li");
      horarios.appendChild(li);
    });

    clasesDiv.appendChild(imgWrapper);

    clasesInfoDiv.appendChild(horarios);

    const descCorta = document.createElement("p") as HTMLParagraphElement;
    descCorta.classList.add("clases__descCorta");
    if (clase.descripcionCorta) {
      descCorta.textContent = clase.descripcionCorta;
      clasesInfoDiv.appendChild(descCorta);
    }

    const descLarga = document.createElement("p") as HTMLParagraphElement;
    descLarga.classList.add("clases__descLarga");
    if (clase.descripcionLarga) {
      const [botonDiv, descDiv] = masInfo(clase.descripcionLarga);
      clasesInfoDiv.appendChild(botonDiv);
      clasesInfoDiv.appendChild(descDiv);
    }

    const ubicacion = document.createElement("a");
    ubicacion.classList.add("clases__ubicacion");
    ubicacion.textContent = `📍${clase.ubicacion.direccion}, ${clase.ubicacion.barrio}`;
    if (clase.ubicacion.mapsUrl) {
      ubicacion.href = clase.ubicacion.mapsUrl;
      ubicacion.target = "_blank";
      ubicacion.rel = "noopener noreferrer";
    }
    clasesInfoDiv.appendChild(ubicacion);

    clasesDiv.appendChild(clasesInfoDiv);
    containerClases.appendChild(clasesDiv);
  });
}

renderDescripcionClases(seccionClasesInfo);
renderClases(clases);
