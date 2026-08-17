const form = document.getElementById("form") as HTMLFormElement;
const mensajeExito = document.querySelector(
  ".contacto__exito",
) as HTMLDivElement;
const btnReiniciar = document.querySelector(
  ".contacto__btnReiniciar",
) as HTMLButtonElement;

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaewpqnv";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const datosFormulario = new FormData(form);

  try {
    const respuesta = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: datosFormulario,
      headers: { Accept: "application/json" },
    });

    if (respuesta.ok) {
      form.classList.add("oculto");
      mensajeExito.classList.add("show");
      form.reset();
    } else {
      alert(
        "Hubo un problema al enviar el mensaje. Probá de nuevo o escribinos directamente.",
      );
    }
  } catch (error) {
    alert(
      "Hubo un problema al enviar el mensaje. Probá de nuevo o escribinos directamente.",
    );
  }
});

btnReiniciar.addEventListener("click", () => {
  form.classList.remove("oculto");
  mensajeExito.classList.remove("show");
});

/* form.addEventListener("submit", function (event) {
  // Evitamos que el formulario recargue la página
  event.preventDefault(); */

// 3. Procesamos los datos (ej. con FormData)
/*   const datosFormulario = new FormData(form);
  const nombre = datosFormulario.get("nombre");
  const mail = datosFormulario.get("mail");
  const mensaje = datosFormulario.get("mensaje");

  console.log(`Formulario enviado por: ${nombre},
         con mail: ${mail} y mensaje: ${mensaje}`);

  form.classList.add("oculto");
  mensajeExito.classList.add("show");
 */
// Aquí puedes realizar peticiones con fetch() o axios
/*fetch("https://tu-backend.railway.app/api/contacto", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, mail, mensaje }),
});

  form.reset();
});
*/
