export function scrollToTop(): void {
  const scrollTopBtn = document.getElementById(
    "scrollTopBtn",
  ) as HTMLButtonElement | null;
  if (!scrollTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollTopBtn.classList.add("active");
    } else {
      scrollTopBtn.classList.remove("active");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export function masInfo(descripcion: string): HTMLElement[] {
  const clasesMasInfoBtn = document.createElement("div");
  const clasesMasInfoDesc = document.createElement("div");

  const masInfoBtn = document.createElement("button");
  masInfoBtn.classList.add("mas-info-btn");
  masInfoBtn.textContent = "+ info";

  const parrafo = document.createElement("p");
  parrafo.classList.add("parrafo");
  parrafo.textContent = descripcion;

  let isOpen: boolean = false;
  masInfoBtn.onclick = () => {
    isOpen = !isOpen;
    masInfoBtn.textContent = isOpen ? "- info" : "+ info";
    parrafo.classList.toggle("show");
  };

  clasesMasInfoBtn.appendChild(masInfoBtn);
  clasesMasInfoDesc.appendChild(parrafo);

  return [clasesMasInfoBtn, clasesMasInfoDesc];
}
