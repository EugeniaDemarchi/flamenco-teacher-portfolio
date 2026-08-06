
// scripts/generar-imagenes.js
// Genera automáticamente las variantes responsive (AVIF/WebP/JPG x 3 medidas)
// de cada imagen dentro de ASSETS/IMAGES/_originales/<carpeta>/,
// preservando la misma carpeta de sección en la salida.
// Además captura el ancho/alto real de cada imagen original y genera
// JS/src/data/imagenes-dimensiones.generated.ts, para poder setear
// width/height en los <img> y evitar layout shift (CLS).
//
// Uso: node scripts/generar-imagenes.js

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAIZ_ORIGENES = path.join(
  __dirname,
  "..",
  "ASSETS",
  "IMAGES",
  "_originales",
);
const RAIZ_SALIDA = path.join(__dirname, "..", "ASSETS", "IMAGES");
const RUTA_DIMENSIONES = path.join(
  __dirname,
  "..",
  "JS",
  "src",
  "data",
  "imagenes-dimensiones.generated.ts",
);

const MEDIDAS = [
  { nombre: "small", ancho: 768 },
  { nombre: "medium", ancho: 1440 },
  { nombre: "large", ancho: 1920 },
];

const FORMATOS = [
  { ext: "avif", metodo: "avif", opciones: { quality: 55 } },
  { ext: "webp", metodo: "webp", opciones: { quality: 72 } },
  { ext: "jpg", metodo: "jpeg", opciones: { quality: 78, mozjpeg: true } },
];

async function procesarImagen(rutaOrigen, carpetaSalida, nombreBase) {
  const metadata = await sharp(rutaOrigen).metadata();

  for (const medida of MEDIDAS) {
    for (const formato of FORMATOS) {
      const nombreSalida = `${nombreBase}-${medida.nombre}.${formato.ext}`;
      const rutaSalida = path.join(carpetaSalida, nombreSalida);

      await sharp(rutaOrigen)
        .resize({ width: medida.ancho })
        [formato.metodo](formato.opciones)
        .toFile(rutaSalida);

      const { size } = fs.statSync(rutaSalida);
      console.log(`    ${nombreSalida} — ${(size / 1024).toFixed(0)} KB`);
    }
  }

  return { width: metadata.width, height: metadata.height };
}

async function procesarCarpeta(nombreCarpeta) {
  const origenCarpeta = path.join(RAIZ_ORIGENES, nombreCarpeta);
  const salidaCarpeta = path.join(RAIZ_SALIDA, nombreCarpeta);

  if (!fs.existsSync(salidaCarpeta)) {
    fs.mkdirSync(salidaCarpeta, { recursive: true });
  }

  const archivos = fs
    .readdirSync(origenCarpeta)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  const dimensionesCarpeta = {};

  for (const archivo of archivos) {
    const nombreBase = path.parse(archivo).name;
    console.log(`\n  [${nombreCarpeta}] ${archivo}`);
    dimensionesCarpeta[nombreBase] = await procesarImagen(
      path.join(origenCarpeta, archivo),
      salidaCarpeta,
      nombreBase,
    );
  }

  return { cantidad: archivos.length, dimensiones: dimensionesCarpeta };
}

function escribirDimensiones(dimensiones) {
  const contenido = `// AUTO-GENERADO por scripts/generar-imagenes.js — no editar a mano.
// Corré "node scripts/generar-imagenes.js" para regenerar este archivo.

export const dimensionesImagenes = ${JSON.stringify(dimensiones, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(RUTA_DIMENSIONES), { recursive: true });
  fs.writeFileSync(RUTA_DIMENSIONES, contenido);
  console.log(`\nDimensiones escritas en ${RUTA_DIMENSIONES}`);
}

async function main() {
  if (!fs.existsSync(RAIZ_ORIGENES)) {
    console.error(`No existe la carpeta: ${RAIZ_ORIGENES}`);
    console.error(
      "Creala con subcarpetas por sección (bio, clases, obras, etc.) y poné ahí los originales.",
    );
    process.exit(1);
  }

  const carpetas = fs
    .readdirSync(RAIZ_ORIGENES)
    .filter((f) => fs.statSync(path.join(RAIZ_ORIGENES, f)).isDirectory());

  if (carpetas.length === 0) {
    console.log(
      "No hay subcarpetas dentro de _originales. Creá una por sección (bio, clases, obras...).",
    );
    return;
  }

  let total = 0;
  const dimensionesTotales = {};

  for (const carpeta of carpetas) {
    const { cantidad, dimensiones } = await procesarCarpeta(carpeta);
    total += cantidad;
    dimensionesTotales[carpeta] = dimensiones;
  }

  escribirDimensiones(dimensionesTotales);

  console.log(
    `\nListo: ${total} imagen(es) procesadas en ${carpetas.length} carpeta(s) x 9 variantes cada una.`,
  );
}

main();