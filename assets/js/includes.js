async function loadPartial(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  const file = container.dataset.include;
  if (!file) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`No se pudo cargar ${file}`);
    }

    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

function normalizePath(path) {
  return path
    .replace(/\/+/g, "/")
    .replace(/index\.html$/, "")
    .replace(/\/$/, "") || "/";
}

function setActiveNav() {
  const currentPath = normalizePath(window.location.pathname);
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    const rawHref = link.getAttribute("href");
    if (!rawHref) return;

    const linkPath = normalizePath(
      new URL(rawHref, window.location.origin).pathname
    );

    if (linkPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function initMenuAfterInclude() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  const navLinks = mainNav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

async function initIncludes() {
  await Promise.all([
    loadPartial("#site-header"),
    loadPartial("#site-footer")
  ]);

  setActiveNav();
  initMenuAfterInclude();
  initHeaderScroll();
}

document.addEventListener("DOMContentLoaded", initIncludes);