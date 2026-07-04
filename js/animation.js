const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  },
);

const hiddenElements = document.querySelectorAll(".hidden");

hiddenElements.forEach((el) => {
  observer.observe(el);
});

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);

        let count = 0;
        const increment = Math.max(1, target / 80);

        const updateCounter = () => {
          if (count < target) {
            count += increment;

            counter.innerText = Math.ceil(count).toLocaleString();

            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target.toLocaleString() + "+";
          }
        };

        updateCounter();

        counterObserver.unobserve(counter);
      }
    });
  },
  {
    threshold: 0.5,
  },
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

const sCards = document.querySelectorAll(".s-c");

const sObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.parentElement.querySelectorAll(".s-c");

        cards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("show");
          }, index * 150);
        });
      }
    });
  },
  {
    threshold: 0.2,
  },
);

sCards.forEach((card) => {
  sObserver.observe(card);
});
const contactBtns = document.querySelectorAll(".contact-btn");

contactBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const info = btn.nextElementSibling;

    info.classList.toggle("active");

    if (info.classList.contains("active")) {
      btn.textContent = "Hide Contact";
    } else {
      btn.textContent = "Contact";
    }
  });
});
const viewBtns =
document.querySelectorAll(".view-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".intern-card");

    const logsSection = card.querySelector(".logs-section");

    logsSection.classList.toggle("active");

    if (logsSection.classList.contains("active")) {
      btn.textContent = "Hide Logs";
    } else {
      btn.textContent = "View Logs";
    }
  });
});
document.querySelectorAll(".edit-btn")
.forEach((btn) => {

  btn.addEventListener("click", () => {

    const card =
      btn.closest(".intern-card");

    const editSection =
      card.querySelector(".edit-section");

    editSection.classList.toggle("active");

    if(editSection.classList.contains("active")){
      btn.textContent = "Close Edit";
    }

    else{
      btn.textContent = "Edit Details";
    }

  });

});
document.querySelectorAll(".hours-btn").forEach((btn) => {

  btn.addEventListener("click", () => {

    const card = btn.closest(".intern-card");

    const hoursSection =
      card.querySelector(".hours-section");

    card.querySelectorAll(
      ".logs-section, .edit-section"
    ).forEach((section) => {

      section.classList.remove("active");

    });

    hoursSection.classList.toggle("active");

  });

});
const menuBtn =
document.querySelector(".admin-menu-btn");

const sidebar =
document.querySelector(".admin-sidebar");

if(menuBtn && sidebar){

    menuBtn.addEventListener("click",()=>{

        sidebar.classList.toggle("active");

    });

}