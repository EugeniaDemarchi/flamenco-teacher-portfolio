export async function getComponent(id, filepath) {
    const response = await fetch(filepath);
    const html = await response.text();
    const container = document.getElementById(id);
    if (!container) {
        throw new Error(`No se encontro el elemento con id ${id}`);
    }
    container.innerHTML = html;
    const nav = document.getElementById("nav-container");
    const hbgBtn = document.querySelector(".hbg-btn");
    const navMenu = document.querySelector(".nav-menu");
    const closeBtn = document.querySelector(".close-btn");
    const links = document.querySelectorAll(".menu-list a");
    if (id === "nav-container") {
        function toggleNavMenu() {
            const isOpening = !navMenu.classList.contains("open");
            navMenu.classList.toggle("open");
            document.body.style.overflow = isOpening ? "hidden" : "";
        }
        links.forEach((link) => {
            if (link.getAttribute("href") === window.location.pathname) {
                link.classList.add("active");
            }
        });
        window.addEventListener("scroll", () => {
            if (window.scrollY > 0) {
                nav.classList.add("nav--oculto");
            }
            else {
                nav.classList.remove("nav--oculto");
            }
        });
        hbgBtn.addEventListener("click", toggleNavMenu);
        closeBtn.addEventListener("click", () => {
            navMenu.classList.remove("open");
        });
    }
}
//# sourceMappingURL=nav-footer.js.map