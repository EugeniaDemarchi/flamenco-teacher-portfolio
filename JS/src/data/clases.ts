import { SeccionClasesInfo } from "../types/clases.js";
import { Clase } from "../types/clases.js";

export const seccionClasesInfo: SeccionClasesInfo = {
  imagenPrincipal: "/ASSETS/IMAGES/clases/candidato_001.webp",
  videoUrl:
    "https://player.vimeo.com/video/1199402157?app_id=122963&autoplay=1",
  descripcionGeneral:
    "Natalia Riopedre concibe la clase como extensión de su propia búsqueda artística. Sus clases cruzan técnica, expresión y entrenamiento corporal, integrando herramientas de distintas disciplinas para potenciar el proceso individual y grupal.",
  imagenMetodologia: "/ASSETS/IMAGES/clases/metodo_clases.jpg",
  metodologia: [
    "Ciclo lectivo anual y cursos de perfeccionamiento",
    "Clases Grupales para todos los niveles",
    "Técnica , coreografía y manejo de elementos                               (Mantón, Abanicos, Castañuelas)",
    "Clases con Músicos en vivo",
    "Clases individuales",
    "Muestras parciales y de fin de año",
  ],
};

export const clases: Clase[] = [
  {
    imagenClase: "ASSETS/IMAGES/clases/alegrias.jpg",
    titulo: "Alegrías",
    nivelClase: "intermedio",

    horarios: [
      { dia: "Lunes", horario: "19 hs" },
      { dia: "Miércoles", horario: "19 hs" },
    ],

    descripcionCorta:
      "Descubrí la elegancia y luminosidad de las alegrías, desarrollando el compás, el movimiento y la expresividad propios de este palo gaditano.",

    descripcionLarga:
      "Clase de nivel intermedio dedicada a las alegrías, uno de los palos más representativos del flamenco por su carácter festivo y elegante. Trabajamos el compás de doce tiempos, el manejo del mantón y las marcaciones, el braceo, el zapateo y la interpretación, desarrollando la musicalidad y la presencia escénica. El objetivo es afianzar la técnica sin perder la frescura y el aire característico de este palo.",

    ubicacion: {
      direccion: "Senillosa 730",
      mapsUrl:
        "https://www.google.com/maps/place/Dance+%26+Art/@-34.6257065,-58.4284088,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcca51fc577147:0xe03bcaf72ea20867!8m2!3d-34.6257065!4d-58.4284088!16s%2Fg%2F1v44g4np?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
      barrio: "Caballito",
    },
  },
  {
    imagenClase: "ASSETS/IMAGES/clases/clase_1.jpg",
    titulo: "Martinete con bastón ",
    nivelClase: "avanzado",

    horarios: [
      { dia: "Lunes", horario: "20 hs" },
      { dia: "Miércoles", horario: "20 hs" },
    ],

    descripcionCorta:
      "Explorá la fuerza y la intensidad del martinete incorporando el trabajo técnico y expresivo del bastón como elemento escénico.",

    descripcionLarga:
      "Clase de nivel avanzado enfocada en el martinete con bastón, un palo de gran intensidad expresiva que exige precisión técnica y presencia escénica. Trabajamos el uso del bastón como extensión del movimiento, la coordinación corporal, los remates, el zapateo y la interpretación, profundizando en el carácter sobrio y contundente propio de este estilo.",
    ubicacion: {
      direccion: "Senillosa 730",
      mapsUrl:
        "https://www.google.com/maps/place/Dance+%26+Art/@-34.6257065,-58.4284088,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcca51fc577147:0xe03bcaf72ea20867!8m2!3d-34.6257065!4d-58.4284088!16s%2Fg%2F1v44g4np?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
      barrio: "Caballito",
    },
  },
  {
    imagenClase: "ASSETS/IMAGES/clases/bulerias.jpg",
    titulo: "Bulerías",
    nivelClase: "intermedio",
    horarios: [{ dia: "Martes", horario: "18 hs" }],
    descripcionCorta:
      "Profundizá en el compás de bulerías desarrollando la improvisación, los remates y la comunicación con el cante y la guitarra.",

    descripcionLarga:
      "Clase de nivel intermedio dedicada a las bulerías, uno de los palos más dinámicos y desafiantes del flamenco. Trabajamos el compás, las llamadas, cierres y remates, además de recursos para improvisar y desenvolverse con soltura en situaciones de cuadro flamenco. La propuesta busca fortalecer la seguridad rítmica y la capacidad de interpretar desde la espontaneidad.",
    ubicacion: {
      direccion: "Tucumán 3378",
      mapsUrl:
        "https://www.google.com/maps/place/Mediterr%C3%A1nea+Caf%C3%A9+Teatro/@-34.600177,-58.4133485,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcca8916aefda1:0xfaf2d315de3a1fc!8m2!3d-34.600177!4d-58.4133485!16s%2Fg%2F1wn_78qd?entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D",
      barrio: "Abasto",
    },
  },
  {
    imagenClase: "ASSETS/IMAGES/clases/farruca.jpg",
    titulo: "Farruca ",
    nivelClase: "avanzado",
    horarios: [{ dia: "Martes", horario: "19 hs" }],

    descripcionCorta:
      "Desarrollá la fuerza, la precisión y el carácter de la farruca mediante el trabajo técnico del zapateo y la expresión corporal.",

    descripcionLarga:
      "Clase de nivel avanzado centrada en la farruca, un palo de gran fuerza y sobriedad que requiere control técnico y musical. Trabajamos la limpieza del zapateo, la coordinación, la colocación corporal y la calidad del movimiento, buscando una interpretación sólida y expresiva. El recorrido pone especial énfasis en la potencia escénica sin perder la elegancia característica de este estilo.",
    ubicacion: {
      direccion: "Tucumán 3378",
      mapsUrl:
        "https://www.google.com/maps/place/Mediterr%C3%A1nea+Caf%C3%A9+Teatro/@-34.600177,-58.4133485,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcca8916aefda1:0xfaf2d315de3a1fc!8m2!3d-34.600177!4d-58.4133485!16s%2Fg%2F1wn_78qd?entry=ttu&g_ep=EgoyMDI2MDcyNi4wIKXMDSoASAFQAw%3D%3D",
      barrio: "Abasto",
    },
  },
];
