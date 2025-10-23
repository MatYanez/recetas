import { animate, stagger } from "https://cdn.jsdelivr.net/npm/@motionone/dom/+esm";

const header = document.querySelector(".header");
const cards = [
  {
    id: "calendario",
    color: "#fce7f3",
    title: "Calendario",
    content: "Aquí puedes planificar tus comidas semanales de manera visual y ordenada."
  },
  {
    id: "almuerzos",
    color: "#dbeafe",
    title: "Almuerzos",
    content: "Encuentra ideas rápidas y saludables para tus almuerzos diarios."
  },
  {
    id: "compras",
    color: "#dcfce7",
    title: "Compras",
    content: "Tu lista dinámica de compras basada en tu planificación semanal."
  }
];

const app = document.getElementById("app");
const saludo = document.getElementById("saludo");
let selected = null;

/* ---------- Render inicial ---------- */
function render() {
  app.removeAttribute("style");
  app.innerHTML = "";

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.backgroundColor = card.color;
    div.textContent = card.title;

    div.addEventListener("click", () => {
      selected = card.id;
      expandCard(card);
    });

    app.appendChild(div);
  });

  const allCards = document.querySelectorAll(".card");
  animate(allCards, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6, delay: stagger(0.1) });
}

/* ---------- Expandir tarjeta ---------- */
function expandCard(initialCard) {
  let swipeEnabled = true;
  const body = document.body;
  body.style.overflow = "hidden"; // bloquea scroll global
  header.style.display = "none";

  animate(saludo, { opacity: [1, 0] }, { duration: 0.3 });
  animate(app, { opacity: [1, 0] }, { duration: 0.3 });

  setTimeout(() => {
    app.innerHTML = "";

    // --- Contenedor principal de vista ---
    const view = document.createElement("div");
    Object.assign(view.style, {
      position: "fixed",
      inset: "0",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: "10",
    });
    document.body.appendChild(view);

    // --- Barra superior ---
    const topBar = document.createElement("div");
    Object.assign(topBar.style, {
      height: "5rem",
      width: "90%",
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "1.5rem",
      borderRadius: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      transition: "background-color 0.3s ease",
      backgroundColor: initialCard.color,
    });
    view.appendChild(topBar);

    // --- Contenido central ---
    const content = document.createElement("div");
    Object.assign(content.style, {
      flex: "1",
      width: "100%",
      overflow: "hidden",
      padding: "2rem",
      color: "#333",
      textAlign: "left",
      backgroundColor: "#fff",
      position: "relative",
    });
    view.appendChild(content);

    // --- Barra inferior fija ---
    const bottomBar = document.createElement("div");
    Object.assign(bottomBar.style, {
      position: "fixed",
      bottom: "1rem",
      left: "0",
      right: "0",
      width: "90%",
      margin: "0 auto",
      height: "4.5rem",
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      borderRadius: "20px",
      boxShadow: "0 -2px 20px rgba(0,0,0,0.15)",
      border: "1px solid rgba(255,255,255,0.4)",
      zIndex: "50",
    });
    bottomBar.innerHTML = `
      <button class="tab-item" data-id="home">🏠</button>
      <button class="tab-item" data-id="calendario">📅</button>
      <button class="tab-item" data-id="almuerzos">🍽️</button>
      <button class="tab-item" data-id="compras">🛒</button>
      <div id="indicator"></div>
    `;
    document.body.appendChild(bottomBar);

    // --- Indicador ---
    const indicator = bottomBar.querySelector("#indicator");
Object.assign(indicator.style, {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "46px",
  height: "46px",
  backgroundColor: "rgb(237 237 237)",
  borderRadius: "12px",
  transition: "left 0.25s ease, transform 0.3s ease",
  zIndex: "-1",
});


    const items = bottomBar.querySelectorAll(".tab-item");

    function moveIndicatorTo(el) {
  const barRect = bottomBar.getBoundingClientRect();
  const btnRect = el.getBoundingClientRect();

  // centro del botón dentro del bottomBar
  const center = btnRect.left - barRect.left + btnRect.width / 2;

  // resta la mitad del tamaño del cuadrado (46 / 2)
  indicator.style.left = `${center - 23}px`;
}

    
    // --- función de actualización de vista ---
function updateView(sectionId) {
  const section = cards.find((c) => c.id === sectionId);

  if (!section) {
    // Volver al home
    selected = null;
    body.style.overflow = "auto";
    animate(bottomBar, { y: ["0%", "100%"], opacity: [1, 0] }, { duration: 0.4 }).finished.then(() => bottomBar.remove());
    header.style.display = "block";
    saludo.removeAttribute("style");
    animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });
    body.style.backgroundColor = "#fff";
    render();
    return;
  }

  topBar.style.backgroundColor = section.color;
  topBar.innerHTML = `<h2 style="font-size:1.5rem;font-weight:700;">${section.title}</h2>`;
  body.style.backgroundColor = "#fff"; // fondo siempre blanco

  // Detectar dirección del swipe lateral
  const order = ["home", "calendario", "almuerzos", "compras"];
  const currentIndex = order.indexOf(sectionId);
  const previousIndex = order.indexOf(selected);
  const direction = currentIndex > previousIndex ? 1 : -1;
  selected = sectionId;

  // --- Animación de salida ---
  animate(content, { opacity: [1, 0], x: [0, -40 * direction] }, { duration: 0.25 }).finished.then(() => {

   // --- ALMUERZOS ---




    // --- CALENDARIO ---
    if (sectionId === "calendario") {
      const today = new Date();
      const monthName = today.toLocaleString("es-ES", { month: "long", year: "numeric" });
      const year = today.getFullYear();
      const month = today.getMonth();

      // generar los días del mes (solo L–V)
      const days = [];
      const date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        const day = date.getDay(); // 0=domingo, 1=lunes...
        if (day >= 1 && day <= 5) days.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }

      content.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%;">
          <h2 style="font-size:1.4rem; font-weight:700; margin-bottom:1rem; text-transform:capitalize;">
            ${monthName}
          </h2>

          <div class="scroll-cal" style="
            overflow-x:auto;
            white-space:nowrap;
            scroll-behavior:smooth;
            padding-bottom:1rem;
          ">
            <div style="display:inline-flex; flex-direction:column;">
              <!-- Encabezado de días -->
              <div style="display:flex; gap:1rem; justify-content:flex-start; margin-bottom:0.5rem;">
                ${days.map(d => {
                  const initials = ["D","L","M","X","J","V","S"];
                  return `<div style="min-width:50px; text-align:center; font-weight:600;">
                    ${initials[d.getDay()]}
                  </div>`;
                }).join("")}
              </div>
              <!-- Números -->
              <div style="display:flex; gap:1rem; justify-content:flex-start;">
                ${days.map(d => {
                  const todayClass = (d.toDateString() === new Date().toDateString())
                    ? "background-color:#000; color:#fff; border-radius:12px;"
                    : "";
                  return `<div style="
                    min-width:50px;
                    height:50px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-weight:600;
                    ${todayClass}">
                    ${d.getDate()}
                  </div>`;
                }).join("")}
              </div>
            </div>
</div>
</div>

<!-- Contenido dinámico: título + imagen -->
<div style="
  width:100%;
  margin-top:1rem;
  text-align:left;
">
  <h3 style="
    font-size:2rem;
    font-weight:700;
    margin-bottom:0.75rem;
    color:#222;
        line-height: 1;
  ">
    Carne mongoliana con arroz
  </h3>

  <div style="
    width:100%;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,0.1);
  ">
    <img src="https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000554%2Fv3%2Frect.jpeg"
      alt="Carne mongoliana con arroz"
      style="width:100%; height:auto; display:block;">
  </div>
</div>
      `;


      

      // Centrar semana actual al cargar
      const scrollContainer = content.querySelector(".scroll-cal");
      const todayIndex = days.findIndex(d => d.toDateString() === new Date().toDateString());
      if (todayIndex !== -1) {
        const scrollPos = todayIndex * 60 - 150;
        scrollContainer.scrollTo({ left: scrollPos, behavior: "instant" });
      }

      // Bloquear swipe lateral mientras se hace scroll horizontal
      scrollContainer.addEventListener("touchstart", () => (swipeEnabled = false));
      scrollContainer.addEventListener("touchend", () => setTimeout(() => (swipeEnabled = true), 150));

    } 
    
    else if (sectionId === "almuerzos") {
  const recipes = [
    {
      name: "Carne mongoliana con arroz",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000554%2Fv3%2Frect.jpeg",
      difficulty: "Fácil",
      time: "30 min"
    },
    {
      name: "Pollo teriyaki",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000546%2Fv3%2Frect.jpeg",
      difficulty: "Medio",
      time: "40 min"
    },
    {
      name: "Pasta carbonara",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000215%2Fv3%2Frect.jpeg",
      difficulty: "Fácil",
      time: "25 min"
    },
    {
      name: "Salmón con verduras",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000123%2Fv3%2Frect.jpeg",
      difficulty: "Difícil",
      time: "50 min"
    },
    {
      name: "Ensalada César",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000522%2Fv3%2Frect.jpeg",
      difficulty: "Fácil",
      time: "15 min"
    },
    {
      name: "Bowl de quinoa",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000333%2Fv3%2Frect.jpeg",
      difficulty: "Medio",
      time: "35 min"
    },
    {
      name: "Tacos de carne",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000190%2Fv3%2Frect.jpeg",
      difficulty: "Medio",
      time: "30 min"
    },
    {
      name: "Paella tradicional",
      img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000101%2Fv3%2Frect.jpeg",
      difficulty: "Difícil",
      time: "120 min"
    }
  ];

  // render de grilla
  content.innerHTML = `
    <div style="
      display:grid;
      grid-template-columns:repeat(2, 1fr);
      gap:1rem;
      padding-bottom:2rem;
      overflow-y:auto;
      height:100%;
    ">
      ${recipes.map(r => `
        <div style="
          background:#fff;
          border-radius:18px;
          box-shadow:0 4px 15px rgba(0,0,0,0.08);
          overflow:hidden;
          display:flex;
          flex-direction:column;
        ">
<div style="
  width:100%;
  height:180px;               /* 👈 altura fija */
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color:#f9f9f9;   /* 👈 por si la imagen tarda en cargar */
">
  <img src="${r.img}" alt="${r.name}" style="
    width:100%;
    height:100%;
    object-fit:cover;          /* 👈 recorta y rellena perfectamente */
    display:block;
  ">
</div>
          <div style="padding:0.75rem 0.75rem 1rem 0.75rem;">
<h3 style="
  font-size:1rem;
  font-weight:700;
  color:#222;
  margin-bottom:0.5rem;
  height:2.4rem;              /* 👈 altura fija del bloque de título */
  line-height:1.2rem;
  overflow:hidden;
  text-overflow:ellipsis;
  display:-webkit-box;
  -webkit-line-clamp:2;       /* 👈 máximo 2 líneas visibles */
  -webkit-box-orient:vertical;
">
  ${r.name}
</h3>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="
                font-size:0.8rem;
                background-color:#f3f4f6;
                color:#555;
                padding:3px 8px;
                border-radius:8px;
              ">${r.difficulty}</span>
              <span style="font-size:0.8rem; color:#777;">${r.time}</span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}


    else {
      // --- CONTENIDO GENERAL ---
      content.innerHTML = `
        <p style="font-size:1.1rem; line-height:1.6;">
          ${section.content}
        </p>
        <button id="backBtn" style="
          margin-top:2rem;
          background-color:${section.color};
          padding:0.75rem 1.5rem;
          border-radius:12px;
          font-weight:600;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">Volver</button>
      `;
    }

    // --- Animación de entrada ---
    animate(content, { opacity: [0, 1], x: [40 * direction, 0] }, { duration: 0.35, easing: "ease-out" });

    // botón volver
    const backBtn = content.querySelector("#backBtn");
    if (backBtn) backBtn.addEventListener("click", () => updateView("home"));

  });

  // mover el indicador del tab activo
  moveIndicatorTo([...items].find((b) => b.dataset.id === sectionId));
  content.scrollTo({ top: 0, behavior: "instant" });

  // --- SWIPE LATERAL ENTRE TABS ---
let startX = 0;
let endX = 0;
let touchStartTime = 0;

content.ontouchstart = (e) => {
  startX = e.touches[0].clientX;
  touchStartTime = Date.now();
};
  content.ontouchstart = (e) => { startX = e.touches[0].clientX; };
  content.ontouchmove = (e) => { endX = e.touches[0].clientX; };
  content.ontouchend = () => {
    if (!swipeEnabled) return; // 👈 bloquea si el calendario está siendo tocado
    const delta = endX - startX;
    const tabs = ["calendario", "almuerzos", "compras"];
    const current = tabs.indexOf(sectionId);
   const moved = Math.abs(delta) > 60; // más de 60px reales
const holdTime = Date.now() - touchStartTime;
if (moved && holdTime < 500) {
      if (delta < 0 && current < tabs.length - 1) {
        const next = tabs[current + 1];
        const nextBtn = [...items].find(b => b.dataset.id === next);
        moveIndicatorTo(nextBtn);
        updateView(next);
      } else if (delta > 0 && current > 0) {
        const prev = tabs[current - 1];
        const prevBtn = [...items].find(b => b.dataset.id === prev);
        moveIndicatorTo(prevBtn);
        updateView(prev);
      }
    }
  };
}


    // --- inicializar vista ---
    updateView(initialCard.id);
// encuentra el botón correspondiente al card inicial
const activeBtn = [...items].find((b) => b.dataset.id === initialCard.id);
setTimeout(() => {
  moveIndicatorTo(activeBtn);
  activeBtn.classList.add("active");
}, 50);

    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        items.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        moveIndicatorTo(btn);
        updateView(btn.dataset.id);
      });
    });
  }, 300);
}



/* ---------- Inicio ---------- */
render();
