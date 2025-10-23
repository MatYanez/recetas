import { animate, stagger } from "https://cdn.jsdelivr.net/npm/@motionone/dom/dist/motion.mjs";

const cards = [
  { id: "calendario", color: "bg-pink-100", title: "Calendario", content: "Tu calendario semanal de comidas." },
  { id: "almuerzos", color: "bg-blue-100", title: "Almuerzos", content: "Tus almuerzos favoritos y recetas." },
  { id: "compras", color: "bg-green-100", title: "Compras", content: "Lista de compras automática según tus comidas." }
];

const app = document.getElementById("app");
let selected = null;

function render() {
  app.innerHTML = "";

  cards.forEach((card) => {
    const div = document.createElement("div");
    div.className = `card ${card.color}`;
    div.textContent = card.title;

    div.addEventListener("click", () => {
      selected = selected === card.id ? null : card.id;
      render();
    });

    app.appendChild(div);
  });

  const allCards = document.querySelectorAll(".card");

  if (!selected) {
    animate(allCards, { opacity: [0, 1], y: [50, 0] }, { duration: 0.5, delay: stagger(0.1) });
  } else {
    allCards.forEach((card) => {
      if (card.textContent.toLowerCase() === selected) {
        animate(card, { y: ["0", "-200"], scale: [1, 1.05] }, { duration: 0.6, easing: "ease-in-out" });
      } else {
        animate(card, { opacity: [1, 0] }, { duration: 0.4 });
      }
    });

    const content = document.createElement("div");
    content.className = "section-content";
    content.innerHTML = `<p>${cards.find((c) => c.id === selected).content}</p>`;
    app.appendChild(content);
  }
}

render();
