document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");

  if (!header) return;

  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});