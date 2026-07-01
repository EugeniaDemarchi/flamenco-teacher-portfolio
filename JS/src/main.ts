import { getComponent } from "./components/nav-footer.js";
import { scrollToTop } from "./ui/scroll-top-btn.js";

getComponent("nav-container", "/COMPONENTS/nav.html");
getComponent("footer-container", "/COMPONENTS/footer.html");

scrollToTop();
