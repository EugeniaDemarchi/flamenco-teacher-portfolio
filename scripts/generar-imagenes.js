// scripts/generar-imagenes.js
// Genera automáticamente las variantes responsive (AVIF/WebP/JPG x 3 medidas)
// de cada imagen dentro de ASSETS/IMAGES/_originales/<carpeta>/,
// preservando la misma carpeta de sección en la salida.
//
// Estructura esperada:
//   ASSETS/IMAGES/_originales/bio/retrato-taller.jpg
//   ASSETS/IMAGES/_originales/obras/obra-01.jpg
//   ...
// Genera en:
//   ASSETS/IMAGES/bio/retrato-taller-small.avif  (+ medium, large, webp, jpg)
//   ASSETS/IMAGES/obras/obra-01-small.avif       (+ ...)
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

  for (const archivo of archivos) {
    const nombreBase = path.parse(archivo).name;
    console.log(`\n  [${nombreCarpeta}] ${archivo}`);
    await procesarImagen(
      path.join(origenCarpeta, archivo),
      salidaCarpeta,
      nombreBase,
    );
  }

  return archivos.length;
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
  for (const carpeta of carpetas) {
    total += await procesarCarpeta(carpeta);
  }

  console.log(
    `\nListo: ${total} imagen(es) procesadas en ${carpetas.length} carpeta(s) x 9 variantes cada una.`,
  );
}

main();
