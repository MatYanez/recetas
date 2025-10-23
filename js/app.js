import { animate, stagger } from "https://cdn.jsdelivr.net/npm/@motionone/dom/+esm";

const cards = [
  {
    id: "calendario",
    color: "#fce7f3", // bg-pink-100
    title: "Calendario",
    content: "Aquí puedes planificar tus comidas semanales de manera visual y ordenada."
  },
  {
    id: "almuerzos",
    color: "#dbeafe", // bg-blue-100
    title: "Almuerzos",
    content: "Encuentra ideas rápidas y saludables para tus almuerzos diarios."
  },
  {
    id: "compras",
    color: "#dcfce7", // bg-green-100
    title: "Compras",
    content: "Tu lista dinámica de compras basada en tu planificación semanal."
  }
];

const app = document.getElementById("app");
const saludo = document.getElementById("saludo");
let selected = null;

function render() {
  app.innerHTML = "";

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.backgroundColor = card.color;
    div.textContent = card.title;

    div.addEventListener("click", () => {
      selected = selected === card.id ? null : card.id;
      expandCard(card, div);
    });

    app.appendChild(div);
  });

  // Animación inicial
  const allCards = document.querySelectorAll(".card");
  animate(allCards, { opacity: [0, 1], y: [50, 0] }, { duration: 0.5, delay: stagger(0.1) });
}

function expandCard(card, element) {
  const body = document.body;
  const cardsContainer = document.querySelector(".cards-container");

  if (selected === card.id) {
    // 1️⃣ Desvanecer saludo y tarjetas
    animate(saludo, { opacity: [1, 0] }, { duration: 0.4 });
    animate(cardsContainer, { opacity: [1, 0] }, { duration: 0.4 });
    body.style.backgroundColor = card.color;

    // Espera el fade-out
    setTimeout(() => {
      app.innerHTML = "";

      // 2️⃣ Crear bloque superior
      const topBar = document.createElement("div");
      topBar.style.backgroundColor = card.color;
      topBar.style.height = "5rem";
      topBar.style.width = "100%";
      topBar.style.display = "flex";
      topBar.style.alignItems = "center";
      topBar.style.justifyContent = "flex-start";
      topBar.style.paddingLeft = "1.5rem";
      topBar.style.borderBottomLeftRadius = "20px";
      topBar.style.borderBottomRightRadius = "20px";
      topBar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      topBar.innerHTML = `
        <h2 style="font-size:1.5rem; font-weight:700;">${card.title}</h2>
      `;

      // 3️⃣ Contenido blanco con texto
      const content = document.createElement("div");
      content.style.backgroundColor = "#fff";
      content.style.flex = "1";
      content.style.padding = "2rem";
      content.style.color = "#333";
      content.style.height = "calc(100dvh - 5rem)";
      content.style.overflowY = "auto";
      content.innerHTML = `
        <p style="font-size:1.1rem; line-height:1.6;">
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

      // 4️⃣ Insertar elementos
      body.style.backgroundColor = "#fff";
      app.appendChild(topBar);
      app.appendChild(content);

      // 5️⃣ Animaciones de entrada
      animate(topBar, { y: ["-100%", "0%"], opacity: [0, 1] }, { duration: 0.6, easing: "ease-out" });
      animate(content, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, delay: 0.2 });

      // 6️⃣ Botón volver
      document.getElementById("backBtn").addEventListener("click", () => {
        selected = null;
        body.style.backgroundColor = "#fff";

        // limpiar estilos inline de #saludo y hacerlo reaparecer
        saludo.removeAttribute("style");
        animate(saludo, { opacity: [0, 1] }, { duration: 0.5, easing: "ease-out" });

        render();
      });
    }, 400);
  }
}


render();
