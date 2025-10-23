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

/* ---------- Dibuja las tarjetas iniciales ---------- */
function render() {
  // siempre visible al iniciar
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

  // animación de aparición
  const allCards = document.querySelectorAll(".card");
  animate(allCards, { opacity: [0, 1], y: [40, 0] }, { duration: 0.6, delay: stagger(0.1) });
}

/* ---------- Expande la tarjeta seleccionada ---------- */
function expandCard(initialCard) {
  const body = document.body;
  header.style.display = "none";

  animate(saludo, { opacity: [1, 0] }, { duration: 0.4 });
  animate(app, { opacity: [1, 0] }, { duration: 0.4 });

  setTimeout(() => {
    app.removeAttribute("style");
    app.innerHTML = "";

    // --- Barra superior ---
    const topBar = document.createElement("div");
    const content = document.createElement("div");

    Object.assign(topBar.style, {
      height: "5rem",
      width: "90%",
      margin: "1rem auto 0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "1.5rem",
      borderRadius: "20px",
      boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
      transition: "background-color 0.3s ease",
    });

    Object.assign(content.style, {
      backgroundColor: "#fff",
      flex: "1",
      padding: "2rem",
      color: "#333",
flex: "1",
height: "calc(100dvh - 11rem)",
overflowY: "hidden",  // 👈 no permite scroll interno
position: "relative",
      transition: "opacity 0.3s ease",
    });

    app.appendChild(topBar);
    app.appendChild(content);

    // --- Barra inferior flotante ---
    const bottomBar = document.createElement("div");
Object.assign(bottomBar.style, {
bottom: "1rem",
left: "50%",
transform: "translateX(-50%)",
width: "90%",
height: "4.5rem",
  background: "rgba(255, 255, 255, 0.6)", // translúcido
  backdropFilter: "blur(12px)",           // efecto frosted glass 🍎
  WebkitBackdropFilter: "blur(12px)",     // compatibilidad Safari/iOS
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderRadius: "20px",
  boxShadow: "0 -2px 20px rgba(0,0,0,0.15)",
  zIndex: "50",
  border: "1px solid rgba(255,255,255,0.4)",
});

    // --- Íconos SVG planos (Heroicons Outline) ---
    bottomBar.innerHTML = `
      <button class="tab-item" data-id="home" title="Inicio">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 9.75L12 3l9 6.75M4.5 10.5V21h15V10.5" />
        </svg>
      </button>

      <button class="tab-item" data-id="calendario" title="Calendario">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 8.25h18M4.5 21h15a1.5 1.5 0 001.5-1.5v-11a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 8.25v11A1.5 1.5 0 004.5 21z" />
        </svg>
      </button>

      <button class="tab-item" data-id="almuerzos" title="Almuerzos">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m-12 4.5V7.5a1.5 1.5 0 011.5-1.5h9a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-9a1.5 1.5 0 01-1.5-1.5z" />
        </svg>
      </button>

      <button class="tab-item" data-id="compras" title="Compras">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.5l1.5 14.25a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5L20.25 3h1.5M8.25 9h7.5M8.25 12h7.5M8.25 15h7.5" />
        </svg>
      </button>

      <div id="indicator"></div>
    `;

    document.body.appendChild(bottomBar);
    animate(bottomBar, { y: ["100%", "0%"], opacity: [0, 1] }, { duration: 0.6 });

    // --- Fondo indicador (ya no línea) ---
    const indicator = bottomBar.querySelector("#indicator");
Object.assign(indicator.style, {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: "46px",
  height: "46px",
  backgroundColor: "rgb(237 237 237)",
  borderRadius: "12px",
  transition: "left 0.3s ease, transform 0.3s ease",
  zIndex: "-1", // 👈 debajo de los íconos, visible pero no tapa
});



    const items = bottomBar.querySelectorAll(".tab-item");

function moveIndicatorTo(el) {
  const rect = el.getBoundingClientRect();
  const center = rect.left + rect.width / 2;
  indicator.style.left = `${center - 23}px`;
}

    // --- Actualizar vista según sección ---
    function updateView(sectionId) {
      const section = cards.find((c) => c.id === sectionId);

      if (!section) {
        // Home
        selected = null;
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
      body.style.backgroundColor = section.color;

// Detectar dirección del swipe (izquierda/derecha) según el orden del menú
const order = ["home", "calendario", "almuerzos", "compras"];
const currentIndex = order.indexOf(sectionId);
const previousIndex = order.indexOf(selected);
const direction = currentIndex > previousIndex ? 1 : -1;
selected = sectionId;

// Salida lateral
animate(content, { opacity: [1, 0], x: [0, -50 * direction] }, { duration: 0.25 }).finished.then(() => {
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
  // Entrada lateral opuesta
  animate(content, { opacity: [0, 1], x: [50 * direction, 0] }, { duration: 0.35, easing: "ease-out" });

  document.getElementById("backBtn").addEventListener("click", () => {
    updateView("home");
  });
});


      moveIndicatorTo([...items].find((b) => b.dataset.id === sectionId));
      content.scrollTo({ top: 0, behavior: "instant" });
    }

    // Inicializar
    updateView(initialCard.id);
    setTimeout(() => moveIndicatorTo(items[0]), 50);

    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        items.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        moveIndicatorTo(btn);
        updateView(btn.dataset.id);
      });
    });
  }, 400);
}



/* ---------- Inicio ---------- */
render();
