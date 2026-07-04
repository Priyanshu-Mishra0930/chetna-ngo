const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");

  const icon = menuToggle.querySelector("i");

  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-times");
});
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {

    if (
      window.innerWidth <= 768 &&
      link.parentElement.classList.contains("dropdown")
    ) {
      e.preventDefault();
      link.parentElement.classList.toggle("active");
      return;
    }

    navLinks.classList.remove("active");

    const icon = menuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  });
});