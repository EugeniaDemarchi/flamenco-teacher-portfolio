const form = document.getElementById("form") as HTMLFormElement;

form.addEventListener("submit", function (event) {
  // Evitamos que el formulario recargue la página
  event.preventDefault();

  // 3. Procesamos los datos (ej. con FormData)
  const datosFormulario = new FormData(form);
  const nombre = datosFormulario.get("nombre");
  const mail = datosFormulario.get("mail");
  const mensaje = datosFormulario.get("mensaje");

  console.log(`Formulario enviado por: ${nombre},
         con mail: ${mail} y mensaje: ${mensaje}`);

  // Aquí puedes realizar peticiones con fetch() o axios
  /*fetch("https://tu-backend.railway.app/api/contacto", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, mail, mensaje }),
});*/
});
