import { showsEnCartel } from "../data/shows.js";
const containerShows = document.querySelector(".shows__grid");
export function renderShows(showsEnCartel) {
    containerShows.innerHTML = "";
    showsEnCartel.forEach((show) => {
        const caja = document.createElement("div");
        caja.classList.add("shows__card");
        const tituloShow = document.createElement("h2");
        tituloShow.textContent = show.titulo;
        tituloShow.classList.add("shows__titulo");
        caja.appendChild(tituloShow);
        const imgShow = document.createElement("img");
        imgShow.classList.add("shows__img");
        imgShow.src = show.imagen;
        imgShow.alt = show.titulo;
        caja.appendChild(imgShow);
        const descCorta = document.createElement("p");
        descCorta.classList.add("shows__descCorta");
        if (show.descripcionCorta) {
            descCorta.textContent = show.descripcionCorta;
            caja.appendChild(descCorta);
        }
        const categoriaShow = document.createElement("h3");
        categoriaShow.textContent = show.categoria;
        if (show.categoria === "Espectáculo" && show.obraRelacionada) {
            const obraRelacionada = document.createElement("a");
            obraRelacionada.classList.add("shows__obraRelacionada");
            obraRelacionada.href = `obra-detalle.html?slug=${show.obraRelacionada}`;
            obraRelacionada.textContent = show.titulo;
            caja.appendChild(obraRelacionada);
        }
        caja.appendChild(categoriaShow);
        const artistas = document.createElement("ul");
        artistas.classList.add("shows__artistas");
        show.artistas.forEach((artista) => {
            const li = document.createElement("li");
            li.textContent = `${artista.rol}: ${artista.nombre}`;
            li.classList.add("shows__artistas-li");
            artistas.appendChild(li);
        });
        caja.appendChild(artistas);
        /*     const temporalidad = document.createElement("p"); */
        if (show.tipo === "puntual") {
            const fechaShow = document.createElement("p");
            fechaShow.textContent = show.fecha;
            fechaShow.classList.add("shows__fecha");
            caja.appendChild(fechaShow);
        }
        else {
            const diaSemana = document.createElement("p");
            diaSemana.textContent = `Día: ${show.diaSemana}`;
            diaSemana.classList.add("shows__dia");
            caja.appendChild(diaSemana);
        }
        const horarioShow = document.createElement("p");
        horarioShow.textContent = `Horario: ${show.horario}`;
        horarioShow.classList.add("shows__horario");
        caja.appendChild(horarioShow);
        /*  caja.appendChild(temporalidad); */
        const contacto = document.createElement("ul");
        contacto.classList.add("shows__contacto");
        if (show.contacto.link) {
            const link = document.createElement("a");
            link.classList.add("shows__link");
            link.href = show.contacto.link;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = show.contacto.espacio;
            contacto.appendChild(link);
        }
        if (show.contacto.telefono) {
            const telefono = document.createElement("p");
            telefono.textContent = show.contacto.telefono;
            telefono.classList.add("shows__tel");
            contacto.appendChild(telefono);
        }
        const ubicacion = document.createElement("a");
        ubicacion.textContent = `${show.contacto.ubicacion.direccion}, ${show.contacto.ubicacion.barrio}`;
        ubicacion.classList.add("shows__ubicacion");
        if (show.contacto.ubicacion.mapsUrl) {
            ubicacion.href = show.contacto.ubicacion.mapsUrl;
            ubicacion.target = "_blank";
            ubicacion.rel = "noopener noreferrer";
            contacto.appendChild(ubicacion);
        }
        const localidades = document.createElement("p");
        if (show.localidadesAgotadas === true) {
            localidades.textContent = "Localidades agotadas";
            localidades.classList.add("shows__localidadesAgotadas");
            caja.appendChild(localidades);
        }
        caja.appendChild(contacto);
        caja.appendChild(ubicacion);
        containerShows.appendChild(caja);
    });
}
renderShows(showsEnCartel);
//# sourceMappingURL=render-shows.js.map