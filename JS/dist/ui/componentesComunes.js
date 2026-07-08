export function scrollToTop() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (!scrollTopBtn)
        return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollTopBtn.classList.add("active");
        }
        else {
            scrollTopBtn.classList.remove("active");
        }
    });
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
export function masInfo(descripcion) {
    const clasesMasInfoBtn = document.createElement("div");
    const clasesMasInfoDesc = document.createElement("div");
    const masInfoBtn = document.createElement("button");
    masInfoBtn.classList.add("mas-info-btn");
    masInfoBtn.textContent = "+ info";
    const parrafo = document.createElement("p");
    parrafo.classList.add("parrafo");
    parrafo.textContent = descripcion;
    let isOpen = false;
    masInfoBtn.onclick = () => {
        isOpen = !isOpen;
        masInfoBtn.textContent = isOpen ? "- info" : "+ info";
        parrafo.classList.toggle("show");
    };
    clasesMasInfoBtn.appendChild(masInfoBtn);
    clasesMasInfoDesc.appendChild(parrafo);
    return [clasesMasInfoBtn, clasesMasInfoDesc];
}
//# sourceMappingURL=componentesComunes.js.map