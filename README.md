# Natalia Riopedre · Flamenco Artist Portfolio

A multi-page static portfolio website for Natalia Riopedre, a flamenco performer, choreographer, and teacher based in Buenos Aires, Argentina. Built as a fast, content-driven site showcasing her works ("obras"), upcoming shows, classes, and biography.

**Live site:** https://nataliariopedre.netlify.app/
**Repository:** https://github.com/EugeniaDemarchi/flamenco-teacher-portfolio

## Tech Stack

- **TypeScript**: all client-side logic, written in strict mode and bundled with esbuild
- **esbuild**: bundles and minifies both TS and CSS, with a custom watch mode (`scripts/build.mjs`) for local development
- **Vanilla DOM APIs**: no frontend framework; each page imports its typed data module directly and renders markup by manipulating the DOM. Shared nav/footer markup is the exception: it's fetched at runtime from static HTML partials in `COMPONENTS/` and injected into the page
- **CSS**: custom, organized with BEM-style component classes plus a small set of shared utility classes (e.g. a reusable `.grid-cards` layout and a `.btn` base + modifier system)
- **sharp**: generates responsive image variants (AVIF/WebP/JPEG, in three widths) from source images, via a standalone Node script (not part of the esbuild pipeline)
- **Ionicons**: icon set for nav, buttons, and gallery controls, loaded from a CDN (`unpkg.com`), not an npm dependency
- **Netlify**: hosting and deployment

`package.json` currently declares no runtime dependencies: `esbuild` and `sharp` are the only two `devDependencies`. Ionicons is the one other third-party asset the site pulls in, and it's loaded via `<script>` tags in each HTML file rather than installed.

## Pages

- **Home** (`index.html`): full-bleed hero image and site entry point
- **Obras** (`obra.html` + `obra-detalle.html`): listing page for all works, plus a detail page per work with an image gallery and lightbox modal
- **Shows** (`shows.html`): upcoming performances ("Shows en cartel")
- **Clases** (`clases.html`): flamenco classes offered, with schedules and methodology
- **Bio** (`bio.html`): biography and trajectory
- **Contacto** (`contacto.html`): contact form, currently sent through [Formspree](https://formspree.io/) (to be replaced by the project's own backend, see [Roadmap](#roadmap))

## Features

- Responsive, mobile-first layout across all pages
- Responsive images (AVIF/WebP with JPEG fallback) served via `<picture>`, generated automatically from source files
- Self-hosted web font (Abel) with a `sans-serif` fallback. Body text uses `font-display: swap` so it is readable immediately; the site title uses `font-display: block` so it never flashes in a fallback font
- Lightbox gallery on work detail pages, with arrow-button navigation between images (enabled from laptop viewport widths up)
- Data-driven content: pages are rendered from typed TypeScript data modules, so adding a new work/show/class doesn't require touching HTML
- YouTube videos load behind a thumbnail (facade pattern): the player and its cookies are only loaded when the visitor clicks play, through `youtube-nocookie.com`

## Performance

Actively audited and optimized with Lighthouse (mobile, tested against the production Netlify deployment). Scores aren't tracked in this repo yet; a full pass across all pages is still in progress (see [Roadmap](#roadmap)).

Key optimizations applied:

- Removed unused preconnect hints
- Self-hosted font, preloaded, with `swap` for body text and `block` for the site title
- Responsive, next-gen image formats generated at build time
- Facade pattern for embedded video (no YouTube player or cookies until the visitor clicks play)

## Getting Started

```
npm install

npm run build   # one-off production build (JS/dist, CSS/dist)

npm run watch   # rebuilds automatically on file changes during development

npm run typecheck   # runs `tsc --noEmit` to type-check without emitting files
```

While `npm run watch` is running, serve the project with any static file server (this project is developed using VS Code's Live Server extension) and open the relevant `.html` file.

`npm run typecheck` is a type-safety check only. Actual JS output always comes from `esbuild` via `npm run build` / `npm run watch`, not from `tsc`.

## Project Structure

```
JS/
  src/
    components/    # nav-footer.ts: fetches and injects the shared nav/footer partials
    data/           # typed content: obras.ts, shows.ts, clases.ts + the generated image-dimensions file
    types/          # shared TypeScript interfaces (Obra, ShowsEnCartel, Clase, Ubicacion, ...)
    ui/             # per-page render functions (render-obras.ts, render-obra-detalle.ts, render-shows.ts, render-clases.ts, componentesComunes.ts)
    utils/          # shared helpers (crear-picture.ts: builds responsive <picture> markup)
    main.ts         # injects the shared nav/footer on every page
    contacto.ts     # contact form handling (currently sent through Formspree)
  dist/             # esbuild output (generated, not edited by hand)

CSS/
  *.css           # source stylesheets, one per page or concern. These are the files you edit
  entries/        # one entry file per bundle; each @imports the source stylesheets it needs
  dist/           # esbuild output linked by the HTML (generated, not edited by hand)

COMPONENTS/
  nav.html        # shared nav markup, fetched at runtime into #nav-container
  footer.html     # shared footer markup, fetched at runtime into #footer-container

ASSETS/
  IMAGES/
    _originales/    # source images by section, input for the image-generation script
    <section>/      # generated AVIF/WebP/JPEG variants (small/medium/large) per image
  FONTS/
  FAVICON/

scripts/
  build.mjs                          # esbuild build/watch script
  generar-imagenes.js                # generates responsive image variants + the dimensions file from _originales/
  generar-dimensiones-existentes.js  # backfills the dimensions file from already-generated images, without needing the originals

docs/
  especificacion-api.md  # API specification for the backend phase (written before implementing)

*.html              # one static HTML shell per page (index, bio, obra, obra-detalle, clases, shows, contacto)
```

> **How the CSS is built:** the HTML pages only link the bundles in `CSS/dist/`. Those bundles are generated by esbuild from `CSS/entries/`, and each entry file `@import`s the source stylesheets in `CSS/` (e.g. `entries/base.entry.css` imports `layout.css` and `style.css`). Same idea as `JS/src` → `JS/dist`: **edit the files in `CSS/`, never the ones in `CSS/dist/`**, and run `npm run build` (or keep `npm run watch` running).

## Code Conventions

Function and variable names are in Spanish, matching the domain (obras, clases, shows). Every function name starts with a verb that tells what kind of work it does:

| Prefix | What it does | Touches the page? | Examples |
|---|---|---|---|
| `init…` | Entry point of a page module. Reads what it needs (e.g. the `slug` from the URL) and calls the functions below. One per module, called once at the bottom of the file. | Indirectly | `initObraDetalle`, `initClases` |
| `render…` | Fills elements that **already exist** in the HTML shell (text, images, containers). | Yes | `renderBanner`, `renderTextos`, `renderClases` |
| `crear…` | Builds a new element and **returns** it without inserting it. The caller decides where it goes. | No | `crearTarjetaClase`, `crearLinkUbicacion`, `crearPictureResponsive` |
| `conectar…` | Attaches event listeners to existing elements. May return a function to control the behavior. | Yes (events) | `conectarModal` |
| `obtener…` / `buscar…` / `extraer…` | Pure functions: data in, data out. No DOM access, so they are the easiest to test. | No | `obtenerGaleriaARenderizar`, `buscarSlug`, `extraerIdYoutube` |

Other rules followed across the code:

- **One responsibility per function.** A page's main function reads like an index, e.g.:
  ```ts
  export function renderObraDetalle(obra: Obra) {
    renderBanner(obra);
    renderTextos(obra);
    renderGaleria(obra);
    renderVideo(obra);
  }
  ```
- **Guard clauses for optional fields.** If an optional field is missing, the function returns early and the element is left empty or not created at all.
- **Content is inserted with `textContent`, never `innerHTML`.** Once content comes from the admin panel, `innerHTML` would allow script injection (XSS). `innerHTML` is only used to empty a container or with fixed markup written in the code.
- **Repeated values live in one constant** (e.g. `CARPETA_OBRAS`, `CARPETA_CLASES`).
- **Comments explain *why*, not *what*.** Business rules belong in code, not in comments: a rule that only lives in a comment will eventually be broken by someone who never read it.
- **Old code is deleted, not commented out.** Git keeps the history.

## Content Management

Content is currently **developer-managed**: works, shows, classes, and their text all live in typed TypeScript data files under `JS/src/data/` (`obras.ts`, `shows.ts`, `clases.ts`), and are updated directly in code by the developer based on material Natalia provides. There is no backend and no admin interface today: adding a new work, updating a show date, or swapping an image requires a developer to edit the data files (and, for images, run the image-generation script), then rebuild and redeploy.

A **backend with an admin panel is the next phase**, so Natalia can log in and manage **Obras, Clases and Shows** herself (create, edit, delete), and read the messages sent through the contact form. Planned stack: Express running on Netlify Functions, MongoDB Atlas, and Cloudinary for images. All decisions, data models and endpoints are documented in [`docs/especificacion-api.md`](docs/especificacion-api.md), written before implementation.

## Roadmap

1. **Backend + admin panel**: Natalia manages Obras, Clases and Shows herself. Specification in progress: [`docs/especificacion-api.md`](docs/especificacion-api.md).
2. **Contact form through the project's own backend**: messages stored in the database and an email notice to Natalia, replacing Formspree.
3. **Full Lighthouse pass** across all pages, with scores recorded in this README.
4. **Phase 2**: editable Bio and Clases introduction.

## Author

**Eugenia Demarchi** · [Portfolio](https://portfolio-demarchi.netlify.app/) · [GitHub](https://github.com/EugeniaDemarchi)
