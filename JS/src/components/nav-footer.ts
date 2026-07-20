export async function getComponent(
  id: string,
  filepath: string,
): Promise<void> {
  const response = await fetch(filepath);
  const html = await response.text();

  const container = document.getElementById(id);
  if (!container) {
    throw new Error(`No se encontro el elemento con id ${id}`);
  }
  container.innerHTML = html;

  const nav = document.getElementById("nav-container") as HTMLAnchorElement;
  const hbgBtn = document.querySelector(".hbg-btn") as HTMLButtonElement;
  const navMenu = document.querySelector(".nav-menu") as HTMLDivElement;
  const closeBtn = document.querySelector(".close-btn") as HTMLButtonElement;
  const links = document.querySelectorAll(
    ".menu-list a",
  ) as NodeListOf<HTMLAnchorElement>;

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
      } else {
        nav.classList.remove("nav--oculto");
      }
    });

    hbgBtn.addEventListener("click", toggleNavMenu);

    closeBtn.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  }
}
