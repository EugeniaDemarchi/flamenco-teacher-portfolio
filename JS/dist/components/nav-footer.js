export async function getComponent(id, filepath) {
    const response = await fetch(filepath);
    const html = await response.text();
    const container = document.getElementById(id);
    if (!container) {
        throw new Error(`No se encontro el elemento con id ${id}`);
    }
    container.innerHTML = html;
    const hbgBtn = document.querySelector(".hbg-btn");
    const navMenu = document.querySelector(".nav-menu");
    const closeBtn = document.querySelector(".close-btn");
    const links = document.querySelectorAll(".menu-list a");
    const nav = document.querySelector(".nav");
    const footer = document.querySelector(".footer");
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
        hbgBtn.addEventListener("click", toggleNavMenu);
        if (window.location.pathname === "/index.html") {
            nav.classList.add("nav--fixed");
            //  hbgBtn.classList.add("hbg-btn--white");
        }
        closeBtn.addEventListener("click", () => {
            navMenu.classList.remove("open");
        });
    }
    if (id === "footer-container") {
        if (window.location.pathname === "/index.html") {
            footer.classList.add("footer--fixed");
        }
    }
}
//# sourceMappingURL=nav-footer.js.map