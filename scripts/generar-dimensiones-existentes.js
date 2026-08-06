// scripts/generar-dimensiones-existentes.js
// Genera JS/src/data/imagenes-dimensiones.generated.ts leyendo las
// dimensiones de las imágenes YA procesadas en ASSETS/IMAGES/<carpeta>/
// (usa la variante "-large.jpg" de cada una, que ya está en el proyecto).
// Sirve para backfillear dimensiones sin necesitar los originales.
//
// Uso: node scripts/generar-dimensiones-existentes.js

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAIZ_IMAGENES = path.join(__dirname, "..", "ASSETS", "IMAGES");
const RUTA_DIMENSIONES = path.join(
  __dirname,
  "..",
  "JS",
  "src",
  "data",
  "imagenes-dimensiones.generated.ts",
);

async function procesarCarpeta(nombreCarpeta) {
  const carpeta = path.join(RAIZ_IMAGENES, nombreCarpeta);
  const archivos = fs
    .readdirSync(carpeta)
    .filter((f) => f.endsWith("-large.jpg"));

  const dimensiones = {};

  for (const archivo of archivos) {
    const nombreBase = archivo.replace(/-large\.jpg$/, "");
    const metadata = await sharp(path.join(carpeta, archivo)).metadata();
    dimensiones[nombreBase] = {
      width: metadata.width,
      height: metadata.height,
    };
    console.log(
      `  [${nombreCarpeta}] ${nombreBase}: ${metadata.width}x${metadata.height}`,
    );
  }

  return dimensiones;
}

async function main() {
  const carpetas = fs
    .readdirSync(RAIZ_IMAGENES)
    .filter(
      (f) =>
        f !== "_originales" &&
        fs.statSync(path.join(RAIZ_IMAGENES, f)).isDirectory(),
    );

  const dimensionesTotales = {};

  for (const carpeta of carpetas) {
    dimensionesTotales[carpeta] = await procesarCarpeta(carpeta);
  }

  const contenido = `// AUTO-GENERADO por scripts/generar-dimensiones-existentes.js — no editar a mano.

export const dimensionesImagenes = ${JSON.stringify(dimensionesTotales, null, 2)} as const;
`;

  fs.mkdirSync(path.dirname(RUTA_DIMENSIONES), { recursive: true });
  fs.writeFileSync(RUTA_DIMENSIONES, contenido);
  console.log(`\nDimensiones escritas en ${RUTA_DIMENSIONES}`);
}

main();
