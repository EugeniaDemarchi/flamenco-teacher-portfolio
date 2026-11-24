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

## 6. Modelos compartidos

### 6.1 Imagen

Toda imagen que se guarda en la base tiene esta forma:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `url` | texto | sí | URL de Cloudinary |
| `publicId` | texto | sí | Identificador en Cloudinary (para borrarla o reemplazarla) |
| `ancho` | número | sí | En píxeles. Se reserva el espacio en pantalla y se evita CLS |
| `alto` | número | sí | En píxeles |
| `alt` | texto | no | Texto alternativo. **Si queda vacío, se usa el título del elemento.** |

### 6.2 Ubicación

La usan Clases y Shows.

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `direccion` | texto | sí | 1 a 120 caracteres. Ej.: "Senillosa 730" |
| `barrio` | texto | sí | 1 a 60 caracteres. Ej.: "Caballito" |
| `localidad` | texto | sí | 1 a 80 caracteres. **Valor por defecto: "Ciudad Autónoma de Buenos Aires".** |
| `mapsUrl` | texto (URL) | no | Link de Google Maps pegado por Natalia. Debe empezar con `https://www.google.com/maps` o `https://maps.app.goo.gl`. |

**Link de Maps:** la API **siempre** devuelve un `mapsUrl`.
- Si Natalia pegó uno, se usa tal cual.
- Si no, el servidor lo genera con la dirección completa, para que Maps no la
  confunda con una calle igual en otra ciudad:
  `https://www.google.com/maps/search/?api=1&query=<direccion>, <barrio>, <localidad>, Argentina`
  (con los espacios y acentos codificados para URL).

El link generado **no se guarda**: se calcula en cada respuesta. Así, si Natalia
corrige la dirección, el link se corrige solo.

En el panel, al lado de la dirección, un botón **"Ver en Maps"** abre el link en
otra pestaña para que Natalia lo verifique antes de guardar. Si cambia la
dirección de algo que ya tiene un link pegado, el panel le avisa que lo revise.

**Sugerencias en el panel:** `GET /api/ubicaciones` (protegido) devuelve las
ubicaciones distintas que ya usan Clases y Shows, sin repetidos, para elegirlas
en lugar de reescribirlas (ver 8.2).

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

## 8. Clases

### 8.1 Modelo

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `_id` | ID de MongoDB | automático | — |
| `titulo` | texto | sí | 1 a 80 caracteres. Se quitan los espacios al principio y al final. Ej.: "Alegrías" |
| `nivel` | opción | sí | Una de: `inicial`, `intermedio bajo`, `intermedio`, `intermedio alto`, `avanzado`, `todos los niveles` |
| `horarios` | lista de Horario | sí | Entre 1 y 7. No se repite el mismo día y hora dentro de una clase. |
| `descripcionCorta` | texto | no | Hasta 300 caracteres |
| `descripcionLarga` | texto | no | Hasta 2000 caracteres |
| `imagen` | Imagen | sí | Foto de la tarjeta |
| `ubicacion` | Ubicación | sí | Ver 6.2 |
| `createdAt` / `updatedAt` | fecha | automático | Los completa MongoDB |

**Horario**

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `dia` | opción | sí | Una de: `Lunes`, `Martes`, `Miércoles`, `Jueves`, `Viernes`, `Sábado`, `Domingo`. En el panel se elige de una lista. |
| `horaInicio` | texto | sí | Formato `HH:mm` de 24 horas, entre `00:00` y `23:59`. Ej.: `19:00` |

### 8.2 Decisiones y su motivo

- **Cada clase guarda su ubicación, y el panel sugiere las ya usadas.** Se evaluaron
  dos opciones: (A) dirección dentro de cada clase, o (B) una lista de sedes aparte,
  elegida desde un desplegable. Se eligió un punto intermedio: el dato vive en la
  clase, como en A (sin una sección "Sedes" con su propio CRUD, y igual que en Shows),
  y el panel ofrece las ubicaciones ya cargadas para no reescribirlas, que era la
  ventaja de B. Costo aceptado: si una sede cambia de dirección, se corrige clase
  por clase. Son pocas sedes y cambian poco.
- **Solo hora de inicio.** Natalia lo prefiere así y es lo que muestra el diseño
  actual. Se guarda como `19:00` (no como texto libre "19 hs") porque un formato
  fijo se puede validar y ordenar. El frontend la muestra como "19 hs", o
  "19:30 hs" si tiene minutos, así el diseño no cambia.
- **Orden del listado: por día y hora.** Lunes primero. Si una clase tiene varios
  días, cuenta el primero de la semana. Si dos clases empatan en día y hora, van
  en orden alfabético por título (`localeCompare` con idioma `"es"`). El orden lo
  resuelve el backend.
- **Se agrega el nivel "todos los niveles"**, que no existía en el frontend.
- **Sin slug ni página de detalle.** Las clases se ven completas en su tarjeta
  (la descripción larga va en un desplegable), así que no necesitan URL propia.

### 8.3 Endpoints

| Método | Ruta | Acceso | Uso |
|---|---|---|---|
| `GET` | `/api/clases` | público | Página de Clases |
| `POST` | `/api/clases` | protegido | Crear clase |
| `PUT` | `/api/clases/:id` | protegido | Editar clase |
| `DELETE` | `/api/clases/:id` | protegido | Borrar clase |

### 8.4 Criterios de aceptación (→ tests)

**`GET /api/clases`**
- Devuelve `200` con la lista ordenada según 8.2. Ej.: una clase de martes 18:00
  aparece antes que una de martes 19:00, y las dos después de una de lunes.
- Una clase con lunes y miércoles se ordena por el lunes.
- Si no hay clases, devuelve `200` con lista vacía.
- Cada clase incluye `ubicacion.mapsUrl`: el pegado por Natalia si existe, o el
  generado según 6.2. El generado contiene la dirección, el barrio, la localidad
  y "Argentina".

**`POST /api/clases`**
- Sin sesión → `401`, y no se crea nada.
- Faltan campos obligatorios o no cumplen las reglas → `400` con el detalle de cada campo.
- `nivel` que no está en la lista → `400`.
- Sin horarios, o con más de 7 → `400`.
- `dia` que no está en la lista → `400`.
- `horaInicio` con otro formato (ej.: "19 hs" o "25:00") → `400`.
- El mismo día y hora repetidos en una clase → `400`.
- `mapsUrl` que no es de Google Maps → `400`.
- Sin `localidad` → se guarda "Ciudad Autónoma de Buenos Aires".
- Título con espacios al final → se guarda sin ellos.
- Datos válidos → `201` con la clase creada.

**`PUT /api/clases/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Datos inválidos → `400`, con las mismas reglas que `POST`.
- Datos válidos → `200` con la clase actualizada.

**`DELETE /api/clases/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Correcto → `204`, y la imagen de la clase se borra de Cloudinary.

---

## 9. Shows en cartel

### 9.1 Modelo

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `_id` | ID de MongoDB | automático | — |
| `titulo` | texto | sí | 1 a 120 caracteres. Se quitan los espacios al principio y al final. |
| `categoria` | texto | sí | 1 a 40 caracteres. Texto libre con sugerencias (ver 9.2). Ej.: "Espectáculo", "Tablao flamenco" |
| `obraRelacionada` | ID de Obra | no | Debe ser una obra existente. En el panel se elige de un desplegable. |
| `descripcionCorta` | texto | no | Hasta 300 caracteres |
| `imagen` | Imagen | sí | Foto de la tarjeta |
| `artistas` | lista de Artista | sí | Entre 1 y 20 |
| `espacio` | Espacio | sí | Dónde es el show |
| `entradas` | texto (URL) | no | Link de venta de entradas. Debe empezar con `https://` |
| `tipo` | opción | sí | `puntual` o `recurrente`. Decide qué otros campos lleva (ver abajo). |
| `createdAt` / `updatedAt` | fecha | automático | Los completa MongoDB |

**Si `tipo` es `puntual`:**

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `funciones` | lista de Función | sí | Entre 1 y 30. No se repite la misma fecha y hora. |

**Función**

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `fecha` | texto | sí | Formato `YYYY-MM-DD`. Ej.: `2026-08-20` |
| `horaInicio` | texto | sí | Formato `HH:mm` de 24 horas. Ej.: `21:00` |
| `agotada` | sí/no | no | Por defecto `false`. Se marca por función: puede agotarse una sola fecha. |

**Si `tipo` es `recurrente`:**

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `diaSemana` | opción | sí | `Lunes` a `Domingo`, igual que en Clases |
| `horaInicio` | texto | sí | Formato `HH:mm` |
| `hasta` | texto | no | Formato `YYYY-MM-DD`. Último día en que se muestra. Si falta, se muestra hasta que Natalia lo borre. |

**Artista**

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `rol` | texto | sí | 1 a 40 caracteres. Ej.: "Baile", "Cante", "Guitarra" |
| `nombres` | lista de texto | sí | Entre 1 y 10 nombres, de 1 a 80 caracteres cada uno |

**Espacio**

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `nombre` | texto | sí | 1 a 80 caracteres. Ej.: "Teatro Hasta Trilce" |
| `telefono` | texto | no | 6 a 20 caracteres: solo números, espacios, `+` y `-` |
| `link` | texto (URL) | no | Web o red social del espacio. Debe empezar con `https://` |
| `ubicacion` | Ubicación | sí | Ver 6.2 |

### 9.2 Decisiones y su motivo

- **Un show puntual tiene una lista de funciones.** Si una obra tiene tres fechas,
  Natalia la carga una vez y la web muestra una sola tarjeta con las tres. "Agotado"
  se marca por función. Se descartó cargar cada función como un show aparte:
  obligaba a repetir los datos y mostraba tarjetas duplicadas.
- **Categoría libre con sugerencias.** No se sabe de antemano qué tipos de show va
  a publicar Natalia (espectáculo, tablao, festival, peña…). En vez de una lista
  fija, escribe la categoría y el panel le sugiere las que ya usó
  (`GET /api/shows/categorias`), para que no queden variantes como "Tablao" y
  "Tablao flamenco". La vinculación con una obra deja de depender de la categoría:
  cualquier show puede tener `obraRelacionada`.
- **Los shows pasados se ocultan solos, pero no se borran.** Natalia no tiene que
  acordarse de borrarlos. Quedan en la base, marcados como pasados en el panel,
  como historial (podría servir para una futura sección "Trayectoria").
- **Reglas de vigencia.** Se calculan con la fecha de Argentina
  (`America/Argentina/Buenos_Aires`). "Hoy" cuenta como vigente: un show se oculta
  **al día siguiente** de su última función.
  - Una **función** está vigente si su fecha es hoy o posterior.
  - Un show **puntual** está vigente si tiene al menos una función vigente. La web
    muestra solo sus funciones vigentes.
  - Un show **recurrente** está vigente si no tiene `hasta`, o si `hasta` es hoy o posterior.
- **Orden del listado: por próxima función**, lo más cercano primero.
  - Puntual: la primera función vigente.
  - Recurrente: el próximo `diaSemana` desde hoy (si es hoy, cuenta hoy), con su hora.
  - Si dos shows empatan, van en orden alfabético por título.
- **La obra relacionada se elige de un desplegable**, no escribiendo el slug a mano.
  La API devuelve su `slug` y su `titulo` para armar el link. Si la obra se borra,
  el show sigue existiendo y el link deja de mostrarse.
- **Horarios con formato fijo** (`21:00`), como en Clases. La web los sigue
  mostrando como "21 hs".
- **Cambio de nombres respecto del frontend:** `contacto` pasa a `espacio` (con
  `nombre` en lugar de `espacio`), `nombre` de Artista pasa a `nombres` (es una
  lista), `horario` pasa a `horaInicio` y `localidadesAgotadas` pasa a `agotada`
  dentro de cada función. *(Requiere ajustar `render-shows.ts` al conectar con la API.)*

### 9.3 Endpoints

| Método | Ruta | Acceso | Uso |
|---|---|---|---|
| `GET` | `/api/shows` | público | Página de Shows: solo los vigentes, en orden |
| `GET` | `/api/shows/todos` | protegido | Panel: todos, incluidos los pasados, cada uno con `estado`: `vigente` o `pasado` |
| `GET` | `/api/shows/categorias` | protegido | Sugerencias de categoría en el panel |
| `POST` | `/api/shows` | protegido | Crear show |
| `PUT` | `/api/shows/:id` | protegido | Editar show |
| `DELETE` | `/api/shows/:id` | protegido | Borrar show |

### 9.4 Criterios de aceptación (→ tests)

Los tests fijan la fecha de "hoy" para que el resultado no dependa del día en que se corren.

**`GET /api/shows`**
- Devuelve `200` solo con los shows vigentes, ordenados según 9.2.
- Un show puntual con funciones el 10 y el 20, consultado el 15 → aparece solo con la del 20.
- Un show puntual cuya última función fue ayer → no aparece.
- Un show puntual con función hoy → aparece, aunque ya haya pasado la hora.
- Un recurrente con `hasta` de ayer → no aparece. Sin `hasta` → aparece.
- Un recurrente de los viernes, consultado un miércoles → se ordena por el viernes
  de esa semana: después de un puntual del jueves y antes de uno del sábado.
- Si no hay shows vigentes, devuelve `200` con lista vacía. La web muestra
  "No hay funciones programadas por ahora".
- Si tiene obra relacionada existente → incluye su `slug` y su `titulo`. Si la obra
  fue borrada → `obraRelacionada` es `null`.
- Cada show incluye `espacio.ubicacion.mapsUrl` según 6.2.

**`GET /api/shows/todos`** y **`GET /api/shows/categorias`**
- Sin sesión → `401`.
- `/todos` devuelve también los pasados, con `estado: "pasado"`.
- `/categorias` devuelve las categorías distintas ya usadas, sin repetidos.

**`POST /api/shows`**
- Sin sesión → `401`, y no se crea nada.
- Faltan campos obligatorios o no cumplen las reglas → `400` con el detalle de cada campo.
- `tipo: "puntual"` sin funciones, o con más de 30 → `400`.
- `tipo: "recurrente"` sin `diaSemana` u `horaInicio` → `400`.
- Campos del otro tipo (ej.: `funciones` en un recurrente) → `400`.
- `fecha` o `hasta` que no es `YYYY-MM-DD` o no existe (ej.: `2026-02-30`) → `400`.
- `horaInicio` con otro formato (ej.: "22.30 hs") → `400`.
- La misma fecha y hora repetidas en un show → `400`.
- `obraRelacionada` que no existe → `400`.
- `entradas` o `espacio.link` sin `https://` → `400`.
- Datos válidos → `201` con el show creado. Se puede crear un show con fechas
  pasadas (por ejemplo, para cargar historial): se guarda, pero no aparece en la web.

**`PUT /api/shows/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Datos inválidos → `400`, con las mismas reglas que `POST`.
- Cambiar de `puntual` a `recurrente` reemplaza los campos de un tipo por los del otro.
- Datos válidos → `200` con el show actualizado.

**`DELETE /api/shows/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Correcto → `204`, y la imagen del show se borra de Cloudinary.

---

## 10. Contacto

Reemplaza a Formspree. El mensaje se **guarda en la base** y se le **avisa a
Natalia por mail**. Si el mail falla, el mensaje no se pierde.

### 10.1 Modelo: Mensaje

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `_id` | ID de MongoDB | automático | — |
| `nombre` | texto | sí | 1 a 80 caracteres. Se quitan los espacios al principio y al final. |
| `mail` | texto | sí | Dirección de mail válida, hasta 254 caracteres |
| `telefono` | texto | no | 6 a 20 caracteres: solo números, espacios, `+` y `-` |
| `motivo` | opción | no | Una de: `Clases`, `Contratación de shows`, `Prensa`, `Otro` |
| `mensaje` | texto | sí | 10 a 3000 caracteres |
| `leido` | sí/no | automático | `false` al crearse. Natalia lo cambia desde el panel. |
| `avisoEnviado` | sí/no | automático | `true` si el mail a Natalia se envió bien |
| `createdAt` | fecha | automático | Lo completa MongoDB. Se usa para el borrado automático. |

El formulario envía además dos campos de control que **no se guardan** (ver 10.2):
`sitioWeb` (campo trampa) y `cargadoEn` (momento en que se cargó la página).

### 10.2 Decisiones y su motivo

- **Backend propio en lugar de Formspree.** Los mensajes quedan guardados y son
  de Natalia, no dependen del límite de un servicio externo y se pueden leer
  desde el panel.
- **Motivo y teléfono opcionales.** El motivo le permite a Natalia saber de qué
  se trata antes de abrir el mensaje, y va en el asunto del mail.
- **Aviso por mail a Natalia, con "responder a" el mail del visitante.** Natalia
  aprieta "Responder" en su correo y le contesta directo. La dirección de destino
  vive en una variable de entorno, no en el código.
- **Sin mail automático al visitante.** El mensaje de éxito en pantalla cumple esa
  función, sin costo extra ni riesgo de que el dominio quede marcado como spam.
- **Si el mail falla, el mensaje igual se guarda** con `avisoEnviado: false`, y el
  panel lo muestra. El visitante ve el mensaje de éxito, porque su consulta llegó.
- **Anti-spam sin captcha.** Un captcha molesta a las personas y los más usados
  rastrean al visitante. Se usan tres medidas habituales en sitios chicos:
  - **Campo trampa** (`sitioWeb`): invisible para las personas, también para los
    lectores de pantalla (`aria-hidden`, `tabindex="-1"`, `autocomplete="off"`).
    Los bots lo completan. Si viene con algo, el mensaje se descarta.
  - **Tiempo mínimo:** si el formulario se envía menos de 3 segundos después de
    cargar la página, es un bot y se descarta.
  - **Límite de envíos:** hasta 3 mensajes cada 10 minutos por conexión (IP). El
    contador vive en la base con vencimiento automático, porque en Netlify
    Functions la memoria no se comparte entre ejecuciones. La IP se guarda
    cifrada con un hash, nunca en texto plano, y no se asocia al mensaje.

  A un mensaje descartado por la trampa o por el tiempo **se le responde como si
  hubiera salido bien**, para que el bot no aprenda a esquivar la regla. Si con
  el tiempo igual llega spam, se evalúa agregar un captcha liviano.
- **Privacidad (Ley 25.326).** Natalia es la responsable de los datos. Debajo del
  formulario se muestra: *"Tus datos (nombre, mail y teléfono) se usan solo para
  responder tu consulta. Podés pedir que se borren escribiendo a Natalia."*
- **Borrado automático a los 2 años** desde la creación del mensaje, con un
  índice de vencimiento (TTL) de MongoDB. Es lo habitual para consultas (entre 1 y
  2 años) y alcanza para que Natalia tenga el historial de alumnas y contrataciones.
  **Propuesta a validar con Natalia y a confirmar con el abogado (NR-50).**
- **Errores en pantalla, no en `alert()`.** Si el envío falla, el formulario
  muestra el error debajo del botón y no borra lo que la persona escribió.
- **Panel:** lista de mensajes del más nuevo al más viejo, marca de leído / no
  leído, borrar, **contador de no leídos** en el menú ("Mensajes (2)") y botón
  **"Responder por mail"**, que abre el correo de Natalia con el destinatario y el
  asunto completos (`Re: <motivo>`). No se responde desde el panel.

### 10.3 Endpoints

| Método | Ruta | Acceso | Uso |
|---|---|---|---|
| `POST` | `/api/contacto` | público | Enviar un mensaje desde el formulario |
| `GET` | `/api/mensajes` | protegido | Bandeja del panel, del más nuevo al más viejo |
| `GET` | `/api/mensajes/no-leidos` | protegido | Contador del menú: `{ "cantidad": 2 }` |
| `PATCH` | `/api/mensajes/:id` | protegido | Marcar como leído o no leído: `{ "leido": true }` |
| `DELETE` | `/api/mensajes/:id` | protegido | Borrar un mensaje |

> `PATCH` cambia solo una parte del recurso. Se usa acá porque desde el panel
> solo se modifica `leido`: el contenido de un mensaje nunca se edita.

### 10.4 Criterios de aceptación (→ tests)

**`POST /api/contacto`**
- Datos válidos → `201`. El mensaje queda guardado con `leido: false` y se le
  envía a Natalia un mail con el motivo en el asunto y "responder a" el mail del visitante.
- Faltan campos obligatorios o no cumplen las reglas → `400` con el detalle de cada campo.
- `mail` inválido → `400`.
- `motivo` que no está en la lista → `400`.
- `sitioWeb` con contenido → `201`, pero **no** se guarda nada ni se envía mail.
- Enviado menos de 3 segundos después de `cargadoEn` → `201`, pero **no** se guarda nada.
- Cuarto mensaje desde la misma IP en 10 minutos → `429`, y no se guarda.
- El servicio de mail falla → `201`, el mensaje queda guardado con `avisoEnviado: false`.
- La IP no aparece en el mensaje guardado.

**`GET /api/mensajes`** y **`GET /api/mensajes/no-leidos`**
- Sin sesión → `401`.
- `/mensajes` devuelve `200` con los mensajes, del más nuevo al más viejo.
- `/no-leidos` devuelve la cantidad de mensajes con `leido: false`.

**`PATCH /api/mensajes/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Un campo distinto de `leido`, o `leido` que no es sí/no → `400`.
- Correcto → `200` con el mensaje actualizado.

**`DELETE /api/mensajes/:id`**
- Sin sesión → `401`.
- `id` inexistente → `404`.
- Correcto → `204`.

**Borrado automático**
- La colección tiene un índice TTL sobre `createdAt` de 2 años (730 días).

---

## 11. Pendientes de especificar

- [ ] Autenticación: endpoints de login, logout y recuperación de contraseña
- [ ] Servicio de email: Resend o Brevo. Requiere verificar el dominio en GoDaddy para enviar desde `@nataliariopedre.com`.
- [ ] Validar con Natalia: plazo de conservación de los mensajes (propuesta: 2 años) y texto de privacidad.
