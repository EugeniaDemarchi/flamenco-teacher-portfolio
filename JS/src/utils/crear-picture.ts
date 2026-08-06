import { dimensionesImagenes } from "../data/imagenes-dimensiones.generated.js";
interface OpcionesPicture {
  nombreBase: string;
  carpeta: string;
  alt: string;
  sizes?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "auto";
  soloLarge?: boolean; // para el modal: sin srcset de 3 tamaños, un solo archivo grande
  className?: string;
}

export function crearPictureResponsive(
  opciones: OpcionesPicture,
): HTMLPictureElement {
  const {
    nombreBase,
    carpeta,
    alt,
    sizes = "100vw",
    loading = "lazy",
    fetchPriority,
    soloLarge = false,
    className,
  } = opciones;

  const medidas = soloLarge
    ? [{ nombre: "large", ancho: 1920 }]
    : [
        { nombre: "small", ancho: 768 },
        { nombre: "medium", ancho: 1440 },
        { nombre: "large", ancho: 1920 },
      ];

  const picture = document.createElement("picture");

  (["avif", "webp"] as const).forEach((ext) => {
    const source = document.createElement("source");
    source.type = `image/${ext}`;
    source.srcset = medidas
      .map(
        (m) =>
          `/ASSETS/IMAGES/${carpeta}/${nombreBase}-${m.nombre}.${ext} ${m.ancho}w`,
      )
      .join(", ");
    if (!soloLarge) source.sizes = sizes;
    picture.appendChild(source);
  });

  const img = document.createElement("img");
  const archivoDefault = soloLarge ? "large" : "small";
  img.src = `/ASSETS/IMAGES/${carpeta}/${nombreBase}-${archivoDefault}.jpg`;
  img.srcset = medidas
    .map(
      (m) =>
        `/ASSETS/IMAGES/${carpeta}/${nombreBase}-${m.nombre}.jpg ${m.ancho}w`,
    )
    .join(", ");
  if (!soloLarge) img.sizes = sizes;
  img.alt = alt;
  img.loading = loading;
  img.decoding = "async";
  if (fetchPriority) img.fetchPriority = fetchPriority;
  if (className) img.classList.add(className);

  const dims = (dimensionesImagenes as any)[carpeta]?.[nombreBase];
  if (dims) {
    img.width = dims.width;
    img.height = dims.height;
  }

  picture.appendChild(img);
  return picture;
}
