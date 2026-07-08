import { ShowsEnCartel } from "../types/shows.js";

export const showsEnCartel: ShowsEnCartel[] = [
  {
    categoria: "Tablao flamenco",
    tipo: "recurrente",
    diaSemana: "jueves",
    horario: "21 hs",
    imagen: "/ASSETS/IMAGES/shows/paquito.PNG",
    titulo: "Tablao de Paquito",
    descripcionCorta:
      "Cada jueves esta esquina se convierte en un portal al país del tapeo, con nuestra juerga flamenca. Música que ambienta la noche y nos pone a gozar entre copas, amigos y sabores fuera de lo común.",
    contacto: {
      espacio: "Paquito bar",
      telefono: "1556965636",
      link: "https://www.instagram.com/xpaquitobarx/",
      ubicacion: {
        direccion: "Thames 1999",
        mapsUrl:
          "https://www.google.com/maps/place/Paquito+bar/@-34.5855847,-58.4295765,17z/data=!4m15!1m8!3m7!1s0x95bcb585df705d2d:0x88f695d68f554ac2!2sThames+1999,+C1414DDM+Cdad.+Aut%C3%B3noma+de+Buenos+Aires!3b1!8m2!3d-34.5855847!4d-58.4270016!16s%2Fg%2F11c4vl91s4!3m5!1s0x95bcb54f9d113aa9:0x7641386f65ef36c3!8m2!3d-34.5855844!4d-58.4270015!16s%2Fg%2F11p60kphrc?entry=ttu&g_ep=EgoyMDI2MDcwNS4wIKXMDSoASAFQAw%3D%3D",
        barrio: "Palermo",
      },
    },
    localidadesAgotadas: false,
    artistas: [
      {
        nombre: "Natalia Riopedre",
        rol: "bailarina",
      },
      {
        nombre: "Pedro Gutierrez",
        rol: "guitarra",
      },
      {
        nombre: "Pedro Gutierrez",
        rol: "cante",
      },
    ],
  },
  {
    categoria: "Espectáculo",
    obraRelacionada: "crudo",
    tipo: "puntual",
    fecha: "2026-08-20",
    horario: "21 hs",
    imagen: "/ASSETS/IMAGES/obras/crudo.jpg",
    titulo: "Crudo, un impulso quebrado",
    descripcionCorta:
      "Una pieza que trabaja la fractura como motor de movimiento.",

    contacto: {
      espacio: "Teatro Hasta Trilce",
      telefono: "0111556965636",
      link: "https://paquitobar.meitre.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnU6fcG6Y_S1weyDVS5SPqM96myHuHzZfDgKaVCmX4stYxefU7N-ysrN1TdRw_aem_30zRazJFQ4hxUrSXEdyUbA",
      ubicacion: {
        direccion: "Thames 1999",
        mapsUrl:
          "https://www.google.com/maps/place/Paquito+bar/@-34.5855847,-58.4295765,17z/data=!4m15!1m8!3m7!1s0x95bcb585df705d2d:0x88f695d68f554ac2!2sThames+1999,+C1414DDM+Cdad.+Aut%C3%B3noma+de+Buenos+Aires!3b1!8m2!3d-34.5855847!4d-58.4270016!16s%2Fg%2F11c4vl91s4!3m5!1s0x95bcb54f9d113aa9:0x7641386f65ef36c3!8m2!3d-34.5855844!4d-58.4270015!16s%2Fg%2F11p60kphrc?entry=ttu&g_ep=EgoyMDI2MDcwNS4wIKXMDSoASAFQAw%3D%3D",
        barrio: "Palermo",
      },
    },
    localidadesAgotadas: false,
    artistas: [
      {
        nombre: "Sil Cerri",
        rol: "bailarina",
      },
      {
        nombre: "Pedro Gutierrez",
        rol: "guitarra",
      },
    ],
  },
];
