function sendEmail(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();

  const email = document.getElementById("email").value.trim();

  const subject = document.getElementById("subject").value.trim();

  const message = document.getElementById("message").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Please fill all fields.");

    return;
  }

  const body = `Name: ${name}
  
  Email: ${email}
  
  --------------------------------
  
  ${message}`;

  window.location.href = `mailto:chetnatrust1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// const canvas = document.getElementById("particle-canvas");

// if (canvas) {

//     const ctx = canvas.getContext("2d");

//     let particles = [];

//     const mouse = {

//         x: null,
//         y: null,
//         radius: 150

//     };

//     function resizeCanvas() {

//         canvas.width = canvas.offsetWidth;

//         canvas.height = canvas.offsetHeight;

//     }

//     resizeCanvas();

//     window.addEventListener("resize", () => {

//         resizeCanvas();

//         createParticles();

//     });

//     class Particle {

//         constructor() {

//             this.x = Math.random() * canvas.width;

//             this.y = Math.random() * canvas.height;

//             this.vx = (Math.random() - 0.5) * 0.8;

//             this.vy = (Math.random() - 0.5) * 0.8;

//             this.size = 2 + Math.random() * 2;

//         }

//         update() {

//             this.x += this.vx;

//             this.y += this.vy;

//             if (this.x < 0 || this.x > canvas.width)
//                 this.vx *= -1;

//             if (this.y < 0 || this.y > canvas.height)
//                 this.vy *= -1;

//             if (mouse.x !== null) {

//                 const dx = mouse.x - this.x;

//                 const dy = mouse.y - this.y;

//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < mouse.radius) {

//                     this.x -= dx * -0.01;

//                     this.y -= dy * -0.01;

//                 }

//             }

//         }

//         draw() {

//             ctx.beginPath();

//             ctx.arc(

//                 this.x,

//                 this.y,

//                 this.size,

//                 0,

//                 Math.PI * 2

//             );

//             ctx.fillStyle = "#f4a825";

//             ctx.fill();

//         }

//     }

//     function createParticles() {

//         particles = [];

//         const count = window.innerWidth < 768 ? 60 : 100;

//         for (let i = 0; i < count; i++) {

//             particles.push(new Particle());

//         }

//     }

//     createParticles();

//     function connectParticles() {

//         for (let i = 0; i < particles.length; i++) {

//             for (let j = i + 1; j < particles.length; j++) {

//                 const dx = particles[i].x - particles[j].x;

//                 const dy = particles[i].y - particles[j].y;

//                 const distance = Math.sqrt(dx * dx + dy * dy);

//                 if (distance < 120) {

//                     ctx.beginPath();

//                     ctx.moveTo(

//                         particles[i].x,

//                         particles[i].y

//                     );

//                     ctx.lineTo(

//                         particles[j].x,

//                         particles[j].y

//                     );

//                     ctx.strokeStyle =
//                         `rgba(244,168,37,${
//                             1 - distance / 120
//                         })`;

//                     ctx.lineWidth = 1;

//                     ctx.stroke();

//                 }

//             }

//         }

//     }

//     function animate() {

//         ctx.clearRect(

//             0,

//             0,

//             canvas.width,

//             canvas.height

//         );

//         connectParticles();

//         particles.forEach((particle) => {

//             particle.update();

//             particle.draw();

//         });

//         requestAnimationFrame(animate);

//     }

//     animate();

//     window.addEventListener("mousemove", (e) => {

//         const rect = canvas.getBoundingClientRect();

//         mouse.x = e.clientX - rect.left;

//         mouse.y = e.clientY - rect.top;

//     });

//     window.addEventListener("mouseleave", () => {

//         mouse.x = null;

//         mouse.y = null;

//     });

// }

// const cursorGlow =
//     document.querySelector(".cursor-glow");

// const mouse = {

//     x: window.innerWidth / 2,

//     y: window.innerHeight / 2

// };
// const floatingContainer = document.getElementById("floating-icons");

// if (floatingContainer) {

//     const icons = [

//         "fa-envelope",
//         "fa-phone",
//         "fa-location-dot",
//         "fa-handshake",
//         "fa-paper-plane"

//     ];

//     const floatingIcons = [];

//     const iconCount =
//         window.innerWidth < 768 ? 12 : 20;

//     for (let i = 0; i < iconCount; i++) {

//         const icon = document.createElement("i");

//         const randomIcon =
//             icons[
//                 Math.floor(
//                     Math.random() * icons.length
//                 )
//             ];

//         icon.className =
//             `fas ${randomIcon} contact-icon`;

//         icon.style.left =
//             Math.random() * 100 + "%";

//         icon.style.top =
//             Math.random() * 100 + "%";

//         icon.dataset.x =
//             parseFloat(icon.style.left);

//         icon.dataset.y =
//             parseFloat(icon.style.top);

//         icon.dataset.dx =
//             (Math.random() - .5) * .05;

//         icon.dataset.dy =
//             (Math.random() - .5) * .05;

//         icon.dataset.rotate =
//             Math.random() * 360;

//         floatingContainer.appendChild(icon);

//         floatingIcons.push(icon);

//     }

//     function animateIcons() {

//         floatingIcons.forEach(icon => {

//             let x =
//                 parseFloat(icon.dataset.x);

//             let y =
//                 parseFloat(icon.dataset.y);

//             let dx =
//                 parseFloat(icon.dataset.dx);

//             let dy =
//                 parseFloat(icon.dataset.dy);

//             let rotate =
//                 parseFloat(icon.dataset.rotate);

//             x += dx;

//             y += dy;

//             if (x < 2 || x > 98)
//                 dx *= -1;

//             if (y < 5 || y > 95)
//                 dy *= -1;

//             rotate += .08;

//             icon.dataset.x = x;
//             icon.dataset.y = y;
//             icon.dataset.dx = dx;
//             icon.dataset.dy = dy;
//             icon.dataset.rotate = rotate;

//             icon.style.left = x + "%";
//             icon.style.top = y + "%";
//             const rect =
//     floatingContainer.getBoundingClientRect();

// const iconX =
//     rect.width * x / 100;

// const iconY =
//     rect.height * y / 100;

// const dxMouse =
//     mouse.x - iconX;

// const dyMouse =
//     mouse.y - iconY;

// const distance =
//     Math.sqrt(
//         dxMouse * dxMouse +
//         dyMouse * dyMouse
//     );

// let scale = 1;

// if(distance < 180){

//     x += dxMouse * 0.0008;

//     y += dyMouse * 0.0008;

//     scale = 1.45;

//     icon.style.opacity = ".8";

// }else{

//     icon.style.opacity = ".18";

// }
//             icon.style.transform =
// `
// translate(-50%,-50%)
// rotate(${rotate}deg)
// scale(${scale})
// `;

//         });

//         requestAnimationFrame(
//             animateIcons
//         );

//     }

//     animateIcons();

// }

// window.addEventListener(

//     "mousemove",

//     (e)=>{

//         const rect =
//             floatingContainer.getBoundingClientRect();

//         mouse.x =
//             e.clientX - rect.left;

//         mouse.y =
//             e.clientY - rect.top;

//         if(cursorGlow){

//             cursorGlow.style.left =
//                 mouse.x + "px";

//             cursorGlow.style.top =
//                 mouse.y + "px";

//         }

//     }

// );

const floatingContainer = document.getElementById("floating-icons");
const cursorGlow = document.querySelector(".cursor-glow");

if (floatingContainer) {
  const icons = [
    "fa-envelope",
    "fa-phone",
    "fa-location-dot",
    "fa-handshake",
    "fa-paper-plane",
  ];

  const colors = ["#22c55e", "#f4a825", "#60a5fa"];

  const mouse = {
    x: -999,
    y: -999,
  };

  const nodes = [];

  const total = window.innerWidth < 768 ? 12 : 20;

  for (let i = 0; i < total; i++) {
    const icon = document.createElement("i");

    icon.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} contact-icon`;

    icon.style.color = colors[Math.floor(Math.random() * colors.length)];

    icon.style.fontSize = 18 + Math.random() * 18 + "px";

    icon.style.opacity = 0.08 + Math.random() * 0.18;

    floatingContainer.appendChild(icon);

    nodes.push({
      el: icon,

      x: Math.random() * 100,

      y: Math.random() * 100,

      vx: (Math.random() - 0.5) * 0.03,

      vy: (Math.random() - 0.5) * 0.03,

      angle: Math.random() * 360,

      rotate: (Math.random() - 0.5) * 0.3,
    });
  }

  function animate() {
    const lineCanvas = document.getElementById("network-lines");

    const ctx = lineCanvas.getContext("2d");

    function resizeCanvas() {
      lineCanvas.width = floatingContainer.offsetWidth;

      lineCanvas.height = floatingContainer.offsetHeight;
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const rect = floatingContainer.getBoundingClientRect();
    ctx.clearRect(
      0,

      0,

      lineCanvas.width,

      lineCanvas.height,
    );

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const ax = (lineCanvas.width * nodes[i].x) / 100;

        const ay = (lineCanvas.height * nodes[i].y) / 100;

        const bx = (lineCanvas.width * nodes[j].x) / 100;

        const by = (lineCanvas.height * nodes[j].y) / 100;

        const dx = ax - bx;

        const dy = ay - by;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          let alpha = 1 - dist / 180;

          ctx.beginPath();

          ctx.moveTo(ax, ay);

          ctx.lineTo(bx, by);

          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.18})`;

          ctx.lineWidth = 1;

          ctx.stroke();
        }
      }
    }
    nodes.forEach((node) => {
      node.x += node.vx;

      node.y += node.vy;

      if (node.x < 2 || node.x > 98) node.vx *= -1;

      if (node.y < 5 || node.y > 95) node.vy *= -1;

      node.angle += node.rotate;

      const px = (rect.width * node.x) / 100;

      const py = (rect.height * node.y) / 100;

      const dx = mouse.x - px;

      const dy = mouse.y - py;

      const distance = Math.sqrt(dx * dx + dy * dy);

      let scale = 1;

      if (distance < 170) {
        node.x += dx * 0.0009;

        node.y += dy * 0.0009;

        scale = 1.5;

        node.el.style.opacity = ".9";

        node.el.style.filter = `
drop-shadow(
0 0 14px
currentColor
)
brightness(1.4)
`;
      } else {
        node.el.style.filter = "none";
      }

      node.el.style.left = node.x + "%";

      node.el.style.top = node.y + "%";

      node.el.style.transform = `translate(-50%,-50%)
                 rotate(${node.angle}deg)
                 scale(${scale})`;
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("mousemove", (e) => {
    const rect = floatingContainer.getBoundingClientRect();

    mouse.x = e.clientX - rect.left;

    mouse.y = e.clientY - rect.top;

    if (cursorGlow) {
      cursorGlow.style.left = mouse.x + "px";

      cursorGlow.style.top = mouse.y + "px";
    }
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -999;

    mouse.y = -999;
  });
}
