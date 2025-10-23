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
    // Expandir
    saludo.style.opacity = 0;
    cardsContainer.style.gap = "0";
    animate(cardsContainer, { opacity: [1, 0] }, { duration: 0.4 });
    body.style.backgroundColor = card.color;

    // Esperar a que se desvanezcan las otras y expandir la seleccionada
    setTimeout(() => {
      app.innerHTML = "";

      const expanded = document.createElement("div");
      expanded.className = "card";
      expanded.style.backgroundColor = card.color;
      expanded.style.height = "100dvh";
      expanded.style.borderRadius = "0";
      expanded.innerHTML = `
        <h2 style="font-size:2rem; font-weight:700; margin-top:2rem;">${card.title}</h2>
        <div class="content-expanded">${card.content}</div>
        <button id="backBtn" style="
          margin-top:2rem; 
          background-color:white; 
          padding:0.75rem 1.5rem; 
          border-radius:12px; 
          font-weight:600;
          box-shadow:0 2px 10px rgba(0,0,0,0.1);
        ">Volver</button>
      `;

      app.appendChild(expanded);

      animate(expanded, { scale: [0.9, 1], opacity: [0, 1] }, { duration: 0.6, easing: "ease-out" });

      document.getElementById("backBtn").addEventListener("click", () => {
        selected = null;
        saludo.style.opacity = 1;
        body.style.backgroundColor = "#fff";
        render();
      });
    }, 400);
  }
}

render();
