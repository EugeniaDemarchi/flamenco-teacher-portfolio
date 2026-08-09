var e=document.getElementById("form"),o=document.querySelector(".contacto__exito"),m=document.querySelector(".contacto__btnReiniciar");e.addEventListener("submit",function(n){n.preventDefault();let t=new FormData(e),s=t.get("nombre"),a=t.get("mail"),c=t.get("mensaje");console.log(`Formulario enviado por: ${s},
         con mail: ${a} y mensaje: ${c}`),e.classList.add("oculto"),o.classList.add("show"),e.reset()});m.addEventListener("click",()=>{e.classList.remove("oculto"),o.classList.remove("show")});
//# sourceMappingURL=contacto.js.map
