import * as esbuild from "esbuild";

const jsEntryPoints = [
  "JS/src/main.ts",
  "JS/src/contacto.ts",
  "JS/src/ui/render-clases.ts",
  "JS/src/ui/render-obra-detalle.ts",
  "JS/src/ui/render-obras.ts",
  "JS/src/ui/render-shows.ts",
];

const cssEntryPoints = [
  { in: "CSS/entries/base.entry.css", out: "base" },
  { in: "CSS/entries/components.entry.css", out: "components" },
  { in: "CSS/entries/index.entry.css", out: "index" },
  { in: "CSS/entries/bio.entry.css", out: "bio" },
  { in: "CSS/entries/clases.entry.css", out: "clases" },
  { in: "CSS/entries/contacto.entry.css", out: "contacto" },
  { in: "CSS/entries/obra.entry.css", out: "obras" },
  { in: "CSS/entries/obra-detalle.entry.css", out: "obra-detalle" },
  { in: "CSS/entries/shows.entry.css", out: "shows" },
];

const jsOptions = {
  entryPoints: jsEntryPoints,
  outdir: "JS/dist",
  outbase: "JS/src",
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "esm",
  target: "es2020",
};

const cssOptions = {
  entryPoints: cssEntryPoints,
  outdir: "CSS/dist",
  bundle: true,
  minify: true,
  external: ["/ASSETS/*"],
};

const watch = process.argv.includes("--watch");

if (watch) {
  const jsCtx = await esbuild.context(jsOptions);
  const cssCtx = await esbuild.context(cssOptions);

  await Promise.all([jsCtx.watch(), cssCtx.watch()]);

  console.log("Watching... (Ctrl+C para salir)");
} else {
  await esbuild.build(jsOptions);
  await esbuild.build(cssOptions);

  console.log("Build listo.");
}