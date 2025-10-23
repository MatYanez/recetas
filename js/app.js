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

  // fade out inicial
  animate(saludo, { opacity: [1, 0] }, { duration: 0.4 });
  animate(app, { opacity: [1, 0] }, { duration: 0.4 });

  setTimeout(() => {
    app.removeAttribute("style");
    app.innerHTML = "";

    /* --- crear topBar y content dinámicos --- */
    const topBar = document.createElement("div");
    const content = document.createElement("div");

    Object.assign(topBar.style, {
      height: "5rem",
      width: "90%",
      margin: "0 auto",
      marginTop: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "1.5rem",
      borderRadius: "20px", // ✅ redondeada completa
      boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
      transition: "background-color 0.3s ease",
    });

    Object.assign(content.style, {
      backgroundColor: "#fff",
      flex: "1",
      padding: "2rem",
      color: "#333",
      height: "calc(100dvh - 12rem)",
      overflowY: "auto",
      transition: "opacity 0.3s ease",
    });

    app.appendChild(topBar);
    app.appendChild(content);

    /* --- barra inferior tipo menú --- */
    const bottomBar = document.createElement("div");
    Object.assign(bottomBar.style, {
      position: "fixed",
      bottom: "1rem", // ✅ margen inferior
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%", // ✅ no ocupa todo el ancho
      height: "4.5rem",
      background: "#f8f8f8",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      borderRadius: "20px", // ✅ bordes redondeados
      boxShadow: "0 -2px 15px rgba(0,0,0,0.1)",
      zIndex: "50",
      border: "1px solid #e5e5e5",
    });

    // ✅ Home va primero ahora
    bottomBar.innerHTML = `
      <button class="tab-item" data-id="home">🏠</button>
      <button class="tab-item" data-id="calendario">📅</button>
      <button class="tab-item" data-id="almuerzos">🍽️</button>
      <button class="tab-item" data-id="compras">🛒</button>
      <div id="indicator"></div>
    `;

    document.body.appendChild(bottomBar);
    animate(bottomBar, { y: ["100%", "0%"], opacity: [0, 1] }, { duration: 0.6 });

    const indicator = bottomBar.querySelector("#indicator");
    Object.assign(indicator.style, {
      position: "absolute",
      bottom: "8px",
      height: "3px",
      width: "20px",
      backgroundColor: "#111",
      borderRadius: "4px",
      transition: "left 0.3s ease",
    });

    const items = bottomBar.querySelectorAll(".tab-item");

    /* --- función: actualizar vista según sección --- */
    function updateView(sectionId) {
      const section = cards.find((c) => c.id === sectionId);

      if (!section) {
        // si tocó Home
        selected = null;
        animate(bottomBar, { y: ["0%", "100%"], opacity: [1, 0] }, { duration: 0.4 }).finished.then(() => bottomBar.remove());
        header.style.display = "block";
        saludo.removeAttribute("style");
        animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });
        body.style.backgroundColor = "#fff";
        render();
        return;
      }

      // actualizar color, título y contenido
      topBar.style.backgroundColor = section.color;
      topBar.innerHTML = `<h2 style="font-size:1.5rem;font-weight:700;">${section.title}</h2>`;
      body.style.backgroundColor = section.color;

      // fade-out del contenido anterior
      animate(content, { opacity: [1, 0] }, { duration: 0.2 }).finished.then(() => {
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
        animate(content, { opacity: [0, 1] }, { duration: 0.3 });

        // evento volver
        document.getElementById("backBtn").addEventListener("click", () => {
          updateView("home");
        });
      });

      // mover el indicador
      const btn = [...items].find((b) => b.dataset.id === sectionId);
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        indicator.style.left = `${center - 10}px`;
      }
    }

    // inicializa la vista según la card que abriste
    updateView(initialCard.id);

    // eventos del menú inferior
    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const sectionId = btn.dataset.id;
        updateView(sectionId);
      });
    });
  }, 400);
}



/* ---------- Inicio ---------- */
render();
