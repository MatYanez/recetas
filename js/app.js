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
    saludo.style.opacity = 0;
    cardsContainer.style.gap = "0";
    animate(cardsContainer, { opacity: [1, 0] }, { duration: 0.4 });
    body.style.backgroundColor = card.color;

    // Esperar animación
    setTimeout(() => {
      app.innerHTML = "";

      // Bloque expandido inicial
      const expanded = document.createElement("div");
      expanded.className = "card";
      expanded.style.backgroundColor = card.color;
      expanded.style.height = "100dvh";
      expanded.style.borderRadius = "0";
      expanded.style.display = "flex";
      expanded.style.flexDirection = "column";
      expanded.style.justifyContent = "center";
      expanded.style.alignItems = "center";

      expanded.innerHTML = `
        <h2 style="font-size:2rem; font-weight:700; margin-top:2rem;">${card.title}</h2>
      `;
      app.appendChild(expanded);

      animate(expanded, { scale: [0.9, 1], opacity: [0, 1] }, { duration: 0.6, easing: "ease-out" });

      // Segunda fase: retraer hacia arriba
      setTimeout(() => {
        animate(
          expanded,
          { height: ["100dvh", "5rem"], borderRadius: ["0", "0 0 20px 20px"] },
          { duration: 0.6, easing: "ease-in-out" }
        );

        expanded.style.justifyContent = "center";
        expanded.style.alignItems = "flex-start";
        expanded.style.paddingLeft = "1.5rem";

        // Añadir contenido blanco debajo
        const content = document.createElement("div");
        content.style.backgroundColor = "#fff";
        content.style.flex = "1";
        content.style.padding = "2rem";
        content.style.color = "#333";
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

        // Insertar el contenido debajo del bloque superior
        body.style.backgroundColor = "#fff";
        app.appendChild(content);

        // Evento para volver atrás
        document.getElementById("backBtn").addEventListener("click", () => {
          selected = null;
          saludo.style.opacity = 1;
          body.style.backgroundColor = "#fff";
          render();
        });
      }, 1000);
    }, 400);
  }
}

render();
