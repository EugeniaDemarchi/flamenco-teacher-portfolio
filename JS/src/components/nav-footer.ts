/* const tituloBio = document.querySelector(
  ".titulo_seccion--bio",
) as HTMLTitleElement; */

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

  const hbgBtn = document.querySelector(".hbg-btn") as HTMLButtonElement;
  const navMenu = document.querySelector(".nav-menu") as HTMLDivElement;
  const closeBtn = document.querySelector(".close-btn") as HTMLButtonElement;
  const links = document.querySelectorAll(
    ".menu-list a",
  ) as NodeListOf<HTMLAnchorElement>;
  const nav = document.querySelector(".nav") as HTMLElement;
  const footer = document.querySelector(".footer") as HTMLElement;

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

    if (
      ["/index.html", "/bio.html", "/clases.html"].includes(
        window.location.pathname,
      )
    ) {
      nav.classList.add("nav--fixed");
      hbgBtn.classList.add("hbg-btn--white");
    }

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        nav.classList.add("nav--oculto");
      } else {
        nav.classList.remove("nav--oculto");
      }
    });

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
