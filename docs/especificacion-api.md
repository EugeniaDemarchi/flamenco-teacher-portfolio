# Especificación de la API — Web Natalia Riopedre

> Documento vivo. Se escribe **antes** de implementar cada parte y se actualiza
> cuando cambia una decisión. Si el código y este documento no coinciden, uno
> de los dos tiene un error.

---

## 1. Principios del proyecto

1. **Claridad ante todo.** El código tiene que poder entenderlo otra persona
   desarrolladora que llegue sin contexto. Nombres descriptivos, una
   responsabilidad por archivo, y comentarios que explican el *por qué*, no el *qué*.
2. **Las reglas viven en el código, no en comentarios.** Si los datos tienen que
   cumplir una condición, la valida el backend. Nunca depende de que quien cargue
   los datos "se acuerde".
3. **Simple para Natalia.** El panel pide lo mínimo indispensable. Lo que se
   puede completar automáticamente, se completa automáticamente.
4. **Seguro por defecto.** Ningún endpoint que modifica datos llega a producción
   sin protección.
5. **Cada regla de este documento tiene un test.** Los criterios de aceptación
   de cada endpoint se convierten en tests automáticos.

---

## 2. Decisiones de arquitectura

| Tema | Decisión | Motivo |
|---|---|---|
| Servidor | Netlify Functions + Express (vía `serverless-http`) | Gratis, mismo lugar que el frontend, sin "despertar lento". Express mantiene el código portable a un servidor tradicional. |
| Base de datos | MongoDB Atlas (cluster gratuito) | Los datos tienen estructuras anidadas (horarios, artistas, ubicación). |
| Imágenes | Cloudinary | Natalia sube fotos desde el panel; Cloudinary genera tamaños y formatos. No consume ancho de banda de Netlify. |
| Envío de emails | A definir (Resend o Brevo) | Avisos de Contacto y recuperación de contraseña. |
| Lenguaje | TypeScript en frontend y backend | Tipos compartidos y errores detectados antes de ejecutar. |
| Cuentas | Todas a nombre de Natalia (Netlify, MongoDB Atlas, Cloudinary, email) | Titularidad de los datos y separación de responsabilidades con la desarrolladora. |

### Límite a tener en cuenta: Netlify plan gratuito
300 créditos por mes. Si se agotan, se pausan **todos** los sitios de la cuenta.
Cada deploy a producción consume 15 créditos. Por eso:
- Se desarrolla en ramas; a `main` solo llega trabajo terminado.
- Las ediciones de Natalia desde el panel **no** generan deploys (los datos viven en la base).

---

## 3. Alcance

**MVP (fase 1):** Obras, Clases, Shows en cartel (CRUD completo), Contacto,
usuario administrador con login.

**Fase 2 (mejora futura):** edición de Bio y de la introducción de Clases
(`seccionClasesInfo`). Ambas se modelan como **documento único**: Natalia puede
editarlas, pero no crearlas ni borrarlas.

---

## 4. Convenciones de la API

- Todas las rutas empiezan con `/api`.
- Se envía y recibe JSON.
- Fechas en formato ISO 8601: `YYYY-MM-DD`.
- Formato único de error:

  ```json
  {
    "error": {
      "codigo": "VALIDACION",
      "mensaje": "Hay campos inválidos.",
      "detalles": [{ "campo": "titulo", "mensaje": "Es obligatorio." }]
    }
  }
  ```

| Código HTTP | Cuándo |
|---|---|
| 200 | Lectura o edición correcta |
| 201 | Creación correcta |
| 204 | Borrado correcto (sin contenido en la respuesta) |
| 400 | Datos inválidos |
| 401 | Falta iniciar sesión o la sesión venció |
| 404 | No existe el recurso |
| 409 | Conflicto (ej.: slug repetido) |
| 429 | Demasiados intentos |
| 500 | Error inesperado del servidor (sin detalles internos en la respuesta) |

---

## 5. Seguridad

- **Lectura pública:** todos los `GET` de Obras, Clases y Shows.
- **Escritura protegida:** todos los `POST`, `PUT` y `DELETE` requieren sesión iniciada.
- **Un solo usuario** (Natalia), creado con un script. No existe registro público.
- La contraseña se guarda como **hash** (bcrypt o argon2), nunca en texto plano.
- La sesión es un **JWT en cookie** `httpOnly`, `Secure` y `SameSite`.
- **Límite de intentos** en el login.
- Las claves y contraseñas viven en variables de entorno (`.env`), que **nunca** se suben al repositorio.
- Pendiente de definir: recuperación de contraseña por email.

---

## 6. Modelo compartido: Imagen

Toda imagen que se guarda en la base tiene esta forma:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `url` | texto | sí | URL de Cloudinary |
| `publicId` | texto | sí | Identificador en Cloudinary (para borrarla o reemplazarla) |
| `ancho` | número | sí | En píxeles. Se reserva el espacio en pantalla y se evita CLS |
| `alto` | número | sí | En píxeles |
| `alt` | texto | no | Texto alternativo. **Si queda vacío, se usa el título del elemento.** |

---

## 7. Obras

### 7.1 Modelo

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `_id` | ID de MongoDB | automático | — |
| `titulo` | texto | sí | 1 a 120 caracteres |
| `slug` | texto | automático | Se genera **desde el título al crear** y **no cambia después** (ver 7.2). Único. |
| `rol` | texto | sí | 1 a 80 caracteres. Ej.: "Directora e intérprete" |
| `descripcionCorta` | texto | sí | 1 a 300 caracteres |
| `descripcionLarga` | texto | no | Hasta 5000 caracteres |
| `imagenPortada` | Imagen | sí | Se muestra en la grilla de Obras |
| `imgPpal` | Imagen | no | Banner de la página de detalle. **Si falta, se usa `imagenPortada`.** |
| `galeria` | lista de Imagen | no | Solo imágenes **adicionales**. No incluye `imgPpal` (ver 7.2). Máximo 12. |
| `video` | texto (URL) | no | Debe ser una URL de YouTube válida |
| `anio` | número entero | no | Entre 1990 y el año actual + 1 |
| `createdAt` / `updatedAt` | fecha | automático | Los completa MongoDB |

### 7.2 Decisiones y su motivo

- **Slug fijo.** Si cambiara con el título, se romperían los links a la obra ya
  compartidos en redes. Si Natalia corrige un título, la URL se mantiene.
- **La galería no repite la imagen principal.** En el frontend actual existía una
  regla escrita solo en un comentario: *"la imagen de imgPpal tiene que estar
  también dentro de galeria"*. Natalia no la conocería al cargar desde el panel.
  Se elimina: la galería guarda solo imágenes extra y **el frontend arma lo que
  muestra** — en computadora `[imgPpal, ...galeria]`, en celular solo `galeria`.
  *(Requiere ajustar `render-obra-detalle.ts` al conectar con la API.)*
- **`imgPpal` opcional.** En la mayoría de las obras es la misma imagen que la
  portada: Natalia sube una sola imagen salvo que quiera un banner distinto.
- **Orden del listado: alfabético por título**, igual que en el frontend actual
  (`localeCompare` con idioma `"es"`, que ordena bien acentos y la ñ). El orden
  lo resuelve el backend, así el frontend recibe la lista ya ordenada.

### 7.3 Endpoints

| Método | Ruta | Acceso | Uso |
|---|---|---|---|
| `GET` | `/api/obras` | público | Grilla de Obras |
| `GET` | `/api/obras/:slug` | público | Página de detalle (`obra-detalle.html?slug=...`) |
| `POST` | `/api/obras` | protegido | Crear obra desde el panel |
| `PUT` | `/api/obras/:id` | protegido | Editar obra desde el panel |
| `DELETE` | `/api/obras/:id` | protegido | Borrar obra desde el panel |

> Las rutas públicas usan `slug` (es lo que aparece en la URL del sitio).
> Las rutas del panel usan `id` (no cambia nunca y no depende del título).

### 7.4 Criterios de aceptación (→ tests)

**`GET /api/obras`**
- Devuelve `200` con la lista ordenada según 7.2.
- Si no hay obras, devuelve `200` con lista vacía (no es un error).

**`GET /api/obras/:slug`**
- Devuelve `200` con la obra si el slug existe.
- Devuelve `404` si no existe.

**`POST /api/obras`**
- Sin sesión → `401`, y no se crea nada.
- Faltan campos obligatorios o no cumplen las reglas → `400` con el detalle de cada campo.
- `video` que no es de YouTube → `400`.
- Datos válidos → `201` con la obra creada, incluido el `slug` generado.
- Dos obras con el mismo título → la segunda recibe un slug distinto
  (ej.: `apariciones-2`), no un error.

**`PUT /api/obras/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Datos inválidos → `400`.
- Cambiar el título **no** cambia el slug.
- Datos válidos → `200` con la obra actualizada.

**`DELETE /api/obras/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Correcto → `204`, y las imágenes de la obra se borran de Cloudinary.

---

## 8. Pendientes de especificar

- [ ] Clases
- [ ] Shows en cartel (fechas pasan a ISO: hoy hay `"7/8/2026"` en `shows.ts`)
- [ ] Contacto (guardado en base + aviso por email + anti-spam)
- [ ] Autenticación: endpoints de login, logout y recuperación de contraseña
- [ ] Servicio de email: Resend o Brevo
