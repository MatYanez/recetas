import { animate, stagger } from "https://cdn.jsdelivr.net/npm/@motionone/dom/+esm";

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

  // tras el fade, construye la vista de detalle
  setTimeout(() => {
    app.removeAttribute("style"); // limpia estilos de animaciones previas
    app.innerHTML = "";

    // barra superior de color
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

    // contenido blanco con texto y botón
    const content = document.createElement("div");
    Object.assign(content.style, {
      backgroundColor: "#fff",
      flex: "1",
      padding: "2rem",
      color: "#333",
      height: "calc(100dvh - 5rem)",
      overflowY: "auto",
    });
    content.innerHTML = `
      <p style="font-size:1.1rem;line-height:1.6;">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non eros ac urna pulvinar aliquet.
        Praesent eget libero a sapien ultrices imperdiet. Nullam id augue a nisi luctus tempor.
        Duis et lorem nec erat tempor ultricies sed a augue. Sed vel enim eu mi bibendum dignissim.
      </p>
      <button id="backBtn" style="
        margin-top:2rem;
        background-color:${card.color};
        padding:0.75rem 1.5rem;
        border-radius:12px;
        font-weight:600;
        box-shadow:0 2px 10px rgba(0,0,0,0.1);
      ">Volver</button>
    `;

    app.appendChild(topBar);
    app.appendChild(content);

    // anima la entrada de los nuevos bloques
    animate(topBar, { y: ["-100%", "0%"], opacity: [0, 1] }, { duration: 0.6 });
    animate(content, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: 0.2 });

    // botón volver
    document.getElementById("backBtn").addEventListener("click", () => {
      selected = null;
      body.style.backgroundColor = "#fff";
      saludo.removeAttribute("style");
      animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });
      render();
    });
  }, 400);
}

/* ---------- Inicio ---------- */
render();
