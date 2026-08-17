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
        "Hubo un problema al enviar el mensaje. Probá de nuevo o escribinos por Instagram.",
      );
    }
  } catch (error) {
    alert(
      "Hubo un problema al enviar el mensaje. Probá de nuevo o escribinos por Instagram.",
    );
  }
});

btnReiniciar.addEventListener("click", () => {
  form.classList.remove("oculto");
  mensajeExito.classList.remove("show");
});
