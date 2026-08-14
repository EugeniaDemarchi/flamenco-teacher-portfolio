# Natalia Riopedre — Flamenco Artist Portfolio

A multi-page static portfolio website for Natalia Riopedre, a flamenco performer, choreographer, and teacher based in Buenos Aires, Argentina. Built as a fast, content-driven site showcasing her works ("obras"), upcoming shows, classes, and biography.

**Live site:** https://nataliariopedre.netlify.app/
**Repository:** https://github.com/EugeniaDemarchi/flamenco-teacher-portfolio

## Tech Stack

- **TypeScript** — all client-side logic, written in strict mode and bundled with esbuild
- **esbuild** — bundles and minifies both TS and CSS, with a custom watch mode (`scripts/build.mjs`) for local development
- **Vanilla DOM APIs** — no frontend framework; each page imports its typed data module directly and renders markup by manipulating the DOM. Shared nav/footer markup is the exception: it's fetched at runtime from static HTML partials in `COMPONENTS/` and injected into the page
- **CSS** — custom, organized with BEM-style component classes plus a small set of shared utility classes (e.g. a reusable `.grid-cards` layout and a `.btn` base + modifier system)
- **sharp** — generates responsive image variants (AVIF/WebP/JPEG, in three widths) from source images, via a standalone Node script (not part of the esbuild pipeline)
- **Ionicons** — icon set for nav, buttons, and gallery controls, loaded from a CDN (`unpkg.com`), not an npm dependency
- **Netlify** — hosting and deployment

`package.json` currently declares no runtime dependencies — `esbuild` and `sharp` are the only two `devDependencies`. Ionicons is the one other third-party asset the site pulls in, and it's loaded via `<script>` tags in each HTML file rather than installed.

## Pages

- **Home** (`index.html`) — full-bleed hero image and site entry point
- **Obras** (`obra.html` + `obra-detalle.html`) — listing page for all works, plus a detail page per work with an image gallery and lightbox modal
- **Shows** (`shows.html`) — upcoming performances ("Shows en cartel")
- **Clases** (`clases.html`) — flamenco classes offered, with schedules and methodology
- **Bio** (`bio.html`) — biography and trajectory
- **Contacto** (`contacto.html`) — contact form (front-end only for now — see [Content Management](#content-management))

## Features

- Responsive, mobile-first layout across all pages
- Responsive images (AVIF/WebP with JPEG fallback) served via `<picture>`, generated automatically from source files
- Self-hosted web fonts with `font-display: swap` to avoid layout shift and third-party font-loading overhead
- Lightbox gallery on work detail pages, with arrow-button navigation between images (enabled from laptop viewport widths up)
- Data-driven content: pages are rendered from typed TypeScript data modules, so adding a new work/show/class doesn't require touching HTML
- Privacy-conscious video embeds (`youtube-nocookie.com`) to minimize third-party cookies

## Performance

Actively audited and optimized with Lighthouse (mobile, tested against the production Netlify deployment). Scores aren't tracked in this repo yet — a full pass across all pages is still in progress (see [Roadmap](#roadmap)).

Key optimizations applied:

- Removed unused preconnect hints
- Self-hosted fonts with `font-display: swap`
- Responsive, next-gen image formats generated at build time
- Third-party cookie reduction on embedded video

## Getting Started

```
npm install

npm run build   # one-off production build (JS/dist, CSS/dist)

npm run watch   # rebuilds automatically on file changes during development

npm run typecheck   # runs `tsc --noEmit` to type-check without emitting files
```

While `npm run watch` is running, serve the project with any static file server (this project is developed using VS Code's Live Server extension) and open the relevant `.html` file.

`npm run typecheck` is a type-safety check only — actual JS output always comes from `esbuild` via `npm run build` / `npm run watch`, not from `tsc`.

## Project Structure

```
JS/
  src/
    components/    # nav-footer.ts — fetches and injects the shared nav/footer partials
    data/           # typed content: obras.ts, shows.ts, clases.ts + the generated image-dimensions file
    types/          # shared TypeScript interfaces (Obra, ShowsEnCartel, Clase, Ubicacion, ...)
    ui/             # per-page render functions (render-obras.ts, render-obra-detalle.ts, render-shows.ts, render-clases.ts, componentesComunes.ts)
    utils/          # shared helpers (crear-picture.ts — builds responsive <picture> markup)
    main.ts         # injects the shared nav/footer on every page
    contacto.ts     # contact form handling (front-end only — see Content Management)
  dist/             # esbuild output (generated, not edited by hand)

CSS/
  entries/        # one entry stylesheet per page/bundle, fed to esbuild
  dist/           # esbuild output (generated, not edited by hand)

COMPONENTS/
  nav.html        # shared nav markup, fetched at runtime into #nav-container
  footer.html     # shared footer markup, fetched at runtime into #footer-container

ASSETS/
  IMAGES/
    _originales/    # source images by section — input for the image-generation script
    <section>/      # generated AVIF/WebP/JPEG variants (small/medium/large) per image
  FONTS/
  FAVICON/

scripts/
  build.mjs                          # esbuild build/watch script
  generar-imagenes.js                # generates responsive image variants + the dimensions file from _originales/
  generar-dimensiones-existentes.js  # backfills the dimensions file from already-generated images, without needing the originals

*.html              # one static HTML shell per page (index, bio, obra, obra-detalle, clases, shows, contacto)
```

> Note: `CSS/` also still contains a handful of top-level `.css` files (`style.css`, `layout.css`, `bio.css`, etc.) left over from before the esbuild migration. They're commented out in every HTML `<link>` tag and superseded by `CSS/entries/` + `CSS/dist/`; they're safe to ignore (and eventually delete).

## Content Management

Content is currently **developer-managed**: works, shows, classes, and their text all live in typed TypeScript data files under `JS/src/data/` (`obras.ts`, `shows.ts`, `clases.ts`), and are updated directly in code by the developer based on material Natalia provides. There is no backend and no admin interface today — adding a new work, updating a show date, or swapping an image requires a developer to edit the data files (and, for images, run the image-generation script), then rebuild and redeploy.

A **backend with an admin panel is planned as the next phase** of this project, so Natalia can eventually log in and manage select content herself — most likely gallery images, banner image positioning/cropping, and text fields — without needing a developer involved for every change.

## Roadmap

1. **Backend + admin panel** — so Natalia can self-manage select content (gallery images, banner image positioning/cropping, text fields) without a developer editing code for every change. This is the next major phase of the project, not yet started.
2. Lazy-loaded ("facade pattern") video embeds to eliminate remaining third-party cookies
3. Contact form backend (or a lightweight form service as a stopgap) — the form currently only runs client-side: it shows a success message but doesn't send the message anywhere yet
4. Full Lighthouse pass across all remaining pages

## Author

**Eugenia Demarchi** — [Portfolio](https://portfolio-demarchi.netlify.app/) · [GitHub](https://github.com/EugeniaDemarchi)
