import { Ubicacion } from "../types/comunes.js";

export function scrollToTop(): void {
  const scrollTopBtn = document.getElementById(
    "scrollTopBtn",
  ) as HTMLButtonElement | null;
  if (!scrollTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollTopBtn.classList.add("active");
    } else {
      scrollTopBtn.classList.remove("active");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Botón "+ info" que muestra u oculta un texto largo.
 * Devuelve [contenedor del botón, contenedor del texto] para ubicarlos por separado.
 */
export function crearDesplegableInfo(
  descripcion: string,
): [HTMLDivElement, HTMLDivElement] {
  const contenedorBoton = document.createElement("div");
  const contenedorTexto = document.createElement("div");

  const boton = document.createElement("button");
  boton.classList.add("btn", "btn--outline", "mas-info-btn");
  boton.textContent = "+ info";
  // aria-expanded le indica a los lectores de pantalla si el texto está visible.
  boton.setAttribute("aria-expanded", "false");

  const parrafo = document.createElement("p");
  parrafo.classList.add("parrafo");
  parrafo.textContent = descripcion;

  let abierto = false;
  boton.addEventListener("click", () => {
    abierto = !abierto;
    boton.textContent = abierto ? "- info" : "+ info";
    boton.setAttribute("aria-expanded", String(abierto));
    parrafo.classList.toggle("show");
  });

  contenedorBoton.appendChild(boton);
  contenedorTexto.appendChild(parrafo);

  return [contenedorBoton, contenedorTexto];
}

/**
 * Texto "📍 dirección, barrio". Si hay link de Google Maps, es un enlace
 * que se abre en otra pestaña. Lo usan Clases y (más adelante) Shows.
 */
export function crearLinkUbicacion(
  ubicacion: Ubicacion,
  className: string,
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.classList.add(className);
  link.textContent = `📍${ubicacion.direccion}, ${ubicacion.barrio}`;

  if (ubicacion.mapsUrl) {
    link.href = ubicacion.mapsUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  return link;
}
