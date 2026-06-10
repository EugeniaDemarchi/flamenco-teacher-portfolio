async function getComponent(id, filepath) {
  const response = await fetch(filepath);
  const html = await response.text();

  document.getElementById(id).innerHTML = html;

  const hbgBtn = document.querySelector(".hbg-btn");
  const navMenu = document.querySelector(".nav-menu");
  const closeBtn = document.querySelector(".close-btn");

  if (id === "nav-container") {
    function toggleNavMenu() {
      const isOpening = !navMenu.classList.contains("open");
      navMenu.classList.toggle("open");
      document.body.style.overflow = isOpening ? "hidden" : "";
    }
    if (hbgBtn) {
      hbgBtn.addEventListener("click", toggleNavMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    }
  }
}

getComponent("nav-container", "/COMPONENTS/nav.html");
getComponent("footer-container", "/COMPONENTS/footer.html");
