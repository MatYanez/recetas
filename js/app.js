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
function expandCard(card) {
  const body = document.body;

  // Desvanece saludo y tarjetas
  animate(saludo, { opacity: [1, 0] }, { duration: 0.4 });
  animate(app, { opacity: [1, 0] }, { duration: 0.4 });
  header.style.display = "none";

  setTimeout(() => {
    app.removeAttribute("style");
    app.innerHTML = "";

    // --- barra superior de color ---
    const topBar = document.createElement("div");
    Object.assign(topBar.style, {
      backgroundColor: card.color,
      height: "5rem",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: "1.5rem",
      borderBottomLeftRadius: "20px",
      borderBottomRightRadius: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    });
    topBar.innerHTML = `<h2 style="font-size:1.5rem;font-weight:700;">${card.title}</h2>`;

    // --- contenedor de contenido dinámico ---
    const content = document.createElement("div");
    Object.assign(content.style, {
      backgroundColor: "#fff",
      flex: "1",
      padding: "2rem",
      color: "#333",
      height: "calc(100dvh - 10rem)",
      overflowY: "auto",
    });
    app.appendChild(topBar);
    app.appendChild(content);

    // --- barra inferior tipo menú ---
    const bottomBar = document.createElement("div");
    Object.assign(bottomBar.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      height: "5rem",
      background: "#f8f8f8",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      borderTop: "1px solid #e5e5e5",
      boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      zIndex: "50",
    });

    bottomBar.innerHTML = `
      <button class="tab-item active" data-id="home">🏠</button>
      <button class="tab-item" data-id="calendario">📅</button>
      <button class="tab-item" data-id="almuerzos">🍽️</button>
      <button class="tab-item" data-id="compras">🛒</button>
      <div id="indicator"></div>
    `;

    // estilos del indicador
    const style = document.createElement("style");
    style.textContent = `
      .tab-item {
        font-size: 1.5rem;
        border: none;
        background: transparent;
        outline: none;
        position: relative;
        z-index: 2;
        transition: color 0.3s;
      }
      .tab-item.active { color: #111; }
      #indicator {
        position: absolute;
        bottom: 8px;
        height: 3px;
        width: 20px;
        background-color: #111;
        border-radius: 4px;
        z-index: 1;
        transition: left 0.3s ease;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(bottomBar);
    animate(bottomBar, { y: ["100%", "0%"], opacity: [0, 1] }, { duration: 0.6 });

    // --- comportamiento del indicador ---
    const indicator = bottomBar.querySelector("#indicator");
    const items = bottomBar.querySelectorAll(".tab-item");

    function moveIndicatorTo(el) {
      const rect = el.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      indicator.style.left = `${center - 10}px`;
    }
    setTimeout(() => moveIndicatorTo(items[0]), 50);

    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        items.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        moveIndicatorTo(btn);

        const target = btn.dataset.id;
        updateContent(target);
      });
    });

    // --- función que actualiza el contenido central ---
    function updateContent(section) {
      if (section === "home") {
        // salir al home
        selected = null;
        animate(bottomBar, { y: ["0%", "100%"], opacity: [1, 0] }, { duration: 0.4 }).finished.then(() => bottomBar.remove());
        body.style.backgroundColor = "#fff";
        saludo.removeAttribute("style");
        header.style.display = "block";
        animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });
        render();
        return;
      }

      let html = "";
      switch (section) {
        case "calendario":
          html = `
            <h3 style="font-weight:600;">📅 Calendario</h3>
            <p style="margin-top:1rem;">Aquí puedes ver tu planificación semanal y agregar nuevas comidas.</p>
          `;
          break;
        case "almuerzos":
          html = `
            <h3 style="font-weight:600;">🍽️ Almuerzos</h3>
            <p style="margin-top:1rem;">Recetas, ideas y sugerencias para tus almuerzos diarios.</p>
          `;
          break;
        case "compras":
          html = `
            <h3 style="font-weight:600;">🛒 Compras</h3>
            <p style="margin-top:1rem;">Lista automática de compras basada en tus comidas planificadas.</p>
          `;
          break;
      }

      animate(content, { opacity: [1, 0], y: [0, 20] }, { duration: 0.2 }).finished.then(() => {
        content.innerHTML = html;
        animate(content, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4 });
      });
    }

    // botón volver
    const backBtn = document.createElement("button");
    backBtn.id = "backBtn";
    backBtn.textContent = "Volver";
    Object.assign(backBtn.style, {
      marginTop: "2rem",
      backgroundColor: card.color,
      padding: "0.75rem 1.5rem",
      borderRadius: "12px",
      fontWeight: "600",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    });
    content.appendChild(backBtn);

    backBtn.addEventListener("click", () => {
      updateContent("home");
    });
  }, 400);
}



/* ---------- Inicio ---------- */
render();
