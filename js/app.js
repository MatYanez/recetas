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
        body.style.overflow = "auto";
        bottomBar.remove();
        view.remove();
        header.style.display = "block";
        animate(saludo, { opacity: [0, 1] }, { duration: 0.4 });
        render();
        return;
      }

      topBar.style.backgroundColor = section.color;
      topBar.innerHTML = `<h2 style="font-size:1.5rem;font-weight:700;">${section.title}</h2>`;

      // swipe lateral controlado sin layout shift
      const order = ["home", "calendario", "almuerzos", "compras"];
      const currentIndex = order.indexOf(sectionId);
      const previousIndex = order.indexOf(selected);
      const direction = currentIndex > previousIndex ? 1 : -1;
      selected = sectionId;

      animate(content, { opacity: [1, 0], x: [0, -40 * direction] }, { duration: 0.25 }).finished.then(() => {
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
        animate(content, { opacity: [0, 1], x: [40 * direction, 0] }, { duration: 0.3, easing: "ease-out" });
        document.getElementById("backBtn").addEventListener("click", () => updateView("home"));
      });

      moveIndicatorTo([...items].find((b) => b.dataset.id === sectionId));
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
