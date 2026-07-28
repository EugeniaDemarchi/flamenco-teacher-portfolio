import { showsEnCartel } from "../data/shows.js";
import { obras } from "../data/obras.js";
const containerShows = document.querySelector(".shows__grid");
const containerMsgNoShow = document.querySelector(".shows__empty-state");
if (showsEnCartel.length === 0) {
    const msgNoShow = document.createElement("h4");
    msgNoShow.textContent =
        "No hay funciones programadas por ahora. Nuevas fechas, próximamente.";
    containerMsgNoShow.appendChild(msgNoShow);
    msgNoShow.classList.add("shows__empty-msg");
}
showsEnCartel.forEach((show) => {
    const caja = document.createElement("div");
    caja.classList.add("shows__card");
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("shows__imgWrapper");
    const tituloShow = document.createElement("h3");
    tituloShow.textContent = show.titulo;
    tituloShow.classList.add("shows__titulo");
    imgWrapper.appendChild(tituloShow);
    const imgShow = document.createElement("img");
    imgShow.classList.add("shows__img");
    imgShow.src = show.imagen;
    imgShow.alt = show.titulo;
    imgWrapper.appendChild(imgShow);
    const funcionContainer = document.createElement("div");
    funcionContainer.classList.add("shows__funcionDatos");
    if (show.tipo === "puntual") {
        const fechaShow = document.createElement("p");
        fechaShow.textContent = show.fecha;
        fechaShow.classList.add("shows__fecha");
        funcionContainer.appendChild(fechaShow);
    }
    else {
        const diaSemana = document.createElement("p");
        diaSemana.textContent = `Días: ${show.diaSemana}`;
        diaSemana.classList.add("shows__dia");
        funcionContainer.appendChild(diaSemana);
    }
    const horarioShow = document.createElement("p");
    horarioShow.textContent = `Horario: ${show.horario}`;
    horarioShow.classList.add("shows__horario");
    funcionContainer.appendChild(horarioShow);
    imgWrapper.appendChild(funcionContainer);
    caja.appendChild(imgWrapper);
    // --- FIN del wrapper ---
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("shows__info");
    const descCorta = document.createElement("p");
    descCorta.classList.add("shows__descCorta");
    if (show.descripcionCorta) {
        descCorta.textContent = show.descripcionCorta;
        infoContainer.appendChild(descCorta);
    }
    if (show.categoria === "Espectáculo" && show.obraRelacionada) {
        const slugHallado = obras.find((obra) => obra.slugObra === show.obraRelacionada);
        if (slugHallado) {
            const obraRelacionada = document.createElement("a");
            obraRelacionada.classList.add("shows__obraRelacionada");
            obraRelacionada.href = `obra-detalle.html?slug=${show.obraRelacionada}`;
            obraRelacionada.textContent = show.titulo;
            infoContainer.appendChild(obraRelacionada);
        }
    }
    const artistas = document.createElement("div");
    artistas.classList.add("shows__artistas");
    show.artistas.forEach((artista) => {
        const datosArtista = document.createElement("div");
        datosArtista.classList.add("shows__datosArtista");
        const rol = document.createElement("p");
        rol.classList.add("shows__rol");
        rol.textContent = `${artista.rol}:`;
        const nombre = document.createElement("p");
        nombre.textContent = artista.nombre;
        datosArtista.appendChild(rol);
        datosArtista.appendChild(nombre);
        artistas.appendChild(datosArtista);
    });
    infoContainer.appendChild(artistas);
    const contacto = document.createElement("ul");
    contacto.classList.add("shows__contacto");
    if (show.contacto.link) {
        const link = document.createElement("a");
        link.classList.add("shows__link");
        link.href = show.contacto.link;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `🏠${show.contacto.espacio}`;
        contacto.appendChild(link);
    }
    if (show.contacto.telefono) {
        const telefono = document.createElement("p");
        telefono.textContent = `📞${show.contacto.telefono}`;
        telefono.classList.add("shows__tel");
        contacto.appendChild(telefono);
    }
    const ubicacion = document.createElement("a");
    ubicacion.textContent = `📍${show.contacto.ubicacion.direccion}, ${show.contacto.ubicacion.barrio}`;
    ubicacion.classList.add("shows__ubicacion");
    if (show.contacto.ubicacion.mapsUrl) {
        ubicacion.href = show.contacto.ubicacion.mapsUrl;
        ubicacion.target = "_blank";
        ubicacion.rel = "noopener noreferrer";
    }
    contacto.appendChild(ubicacion);
    infoContainer.appendChild(contacto);
    const localidades = document.createElement("h3");
    if (show.localidadesAgotadas === true) {
        localidades.textContent = "Localidades agotadas";
        localidades.classList.add("shows__localidadesAgotadas");
        infoContainer.appendChild(localidades);
    }
    if (show.entradas) {
        const entradas = document.createElement("a");
        entradas.classList.add("shows__entradas");
        entradas.textContent = "🎫 Entradas";
        entradas.href = show.entradas;
        entradas.target = "_blank";
        entradas.rel = "noopener noreferrer";
        infoContainer.appendChild(entradas);
    }
    caja.appendChild(infoContainer);
    containerShows.appendChild(caja);
});
//# sourceMappingURL=render-shows.js.map