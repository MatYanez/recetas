import { animate, stagger } from "https://cdn.jsdelivr.net/npm/@motionone/dom/+esm";
const USER_HEIGHT = 1.65; 
const header = document.querySelector(".header");
const MEDALS = [
  {
    key: "firstGoodDay",
    title: "Primer día bueno",
    emoji: "🥉",
    description: "Obtén 700 puntos en un día.",
    required: 700,
    type: "daily-score"
  },
  {
    key: "weekDisciplined",
    title: "Semana disciplinada",
    emoji: "🥈",
    description: "Promedio semanal mayor a 700 puntos.",
    required: 700,
    type: "weekly-score"
  },
  {
    key: "weekPerfect",
    title: "Semana perfecta",
    emoji: "🥇",
    description: "Promedio semanal mayor a 900 puntos.",
    required: 900,
    type: "weekly-score"
  },
  {
    key: "waterStreak",
    title: "Hidratado",
    emoji: "💧",
    description: "Toma agua 5 días seguidos.",
    required: 5,
    type: "streak",
    habit: "water"
  },
  {
    key: "noSweets",
    title: "Anti-dulces",
    emoji: "🍬",
    description: "Evita dulces 5 días seguidos.",
    required: 5,
    type: "streak",
    habit: "sweets"
  },
  {
    key: "noSugarDrinks",
    title: "Cero azúcar líquida",
    emoji: "🥤",
    description: "Evita bebidas azucaradas 5 días seguidos.",
    required: 5,
    type: "streak",
    habit: "sugarDrinks"
  },
  {
    key: "stepsMaster",
    title: "Caminante",
    emoji: "🚶",
    description: "7 días completando 8000 pasos.",
    required: 7,
    type: "streak",
    habit: "steps8000"
  },
  {
    key: "trainer",
    title: "Entrenador",
    emoji: "🏋️",
    description: "7 días entrenando.",
    required: 7,
    type: "streak",
    habit: "exercise20"
  },
  {
    key: "veggie",
    title: "Veggie Master",
    emoji: "🥦",
    description: "Come ensalada 7 veces.",
    required: 7,
    type: "count",
    habit: "salad"
  },
  {
    key: "noNegative10",
    title: "Racha 10",
    emoji: "🔥",
    description: "10 días sin puntos negativos.",
    required: 10,
    type: "streak-nonegative"
  }
];
const ACCUMULATION_MEDALS = [
  { key: "collector_5",  title: "Coleccionista Nivel 1", emoji: "🏆", required: 5 },
  { key: "collector_10", title: "Coleccionista Nivel 2", emoji: "🏆", required: 10 },
  { key: "collector_15", title: "Coleccionista Nivel 3", emoji: "🏆", required: 15 },
  { key: "collector_20", title: "Coleccionista Nivel 4", emoji: "🏆", required: 20 },
];

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
  },
    { 
    id: "habitos",
    color: "#fef3c7",
    title: "Hábitos",
    content: "Registra agua, dulces, bebidas, energía y actividad diaria."
  }
];

const app = document.getElementById("app");
const saludo = document.getElementById("saludo");
let selected = null;
let selectedDate = null;

function drawLineChart(canvas, data, options = {}) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const padding = 30;
  const points = data;
  if (points.length < 2) return;

  const max = Math.max(...points);
  const min = Math.min(...points);

  ctx.lineWidth = 2;
  ctx.strokeStyle = options.color || "#000";

  // Mapear puntos
  const mapped = points.map((v, i) => {
    const x = padding + (i / (points.length - 1)) * (w - padding * 2);
    const y = h - padding - ((v - min) / (max - min || 1)) * (h - padding * 2);
    return { x, y };
  });

  // Línea suavizada
  ctx.beginPath();
  ctx.moveTo(mapped[0].x, mapped[0].y);
  for (let i = 1; i < mapped.length; i++) {
    const prev = mapped[i - 1];
    const curr = mapped[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
  }
  ctx.stroke();
}



/* ---------- GLOBAL NAV HELPERS ---------- */
function hideNavigationBars() {
  const topBar = document.querySelector("[data-topbar]");
  const bottomBar = document.querySelector("[data-bottombar]");

  if (topBar) topBar.style.display = "none";
  if (bottomBar) bottomBar.style.display = "none";
}

function showNavigationBars() {
  const topBar = document.querySelector("[data-topbar]");
  const bottomBar = document.querySelector("[data-bottombar]");

  if (topBar) topBar.style.display = "flex";
  if (bottomBar) bottomBar.style.display = "flex";
}



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

  // fade out del saludo y de las cards iniciales antes de crear la vista nueva
  Promise.all([
    animate(saludo, { opacity: [1, 0], y: [0, -20] }, { duration: 0.3 }).finished,
    animate(app,    { opacity: [1, 0], y: [0,  30] }, { duration: 0.3 }).finished
  ]).then(() => {
    // ya terminó la animación → limpiamos el home
    header.style.display = "none";
    app.innerHTML = "";
    app.style.opacity = "0";
    app.style.pointerEvents = "none";
app.style.height = "0";
app.style.overflow = "hidden";

    /* ---------------------------------
       CREAMOS LA VISTA EXPANDIDA COMPLETA
    ----------------------------------*/


// --- Overlay tipo blur iOS ---
const overlay = document.createElement("div");
Object.assign(overlay.style, {
  position: "fixed",
  inset: "0",
background: "rgba(250,250,250,0.4)",
backdropFilter: "blur(18px)",
WebkitBackdropFilter: "blur(18px)",
border: "1px solid rgba(255,255,255,0.5)",
boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
opacity: "0",
zIndex: "5",
transition: "opacity 0.4s ease"

});
document.body.appendChild(overlay);

// animar la aparición del overlay
requestAnimationFrame(() => {
  overlay.style.opacity = "1";
});


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
    // --- Animación de entrada tipo iOS (slide-up suave) ---
view.style.opacity = "0";
view.style.transform = "translateY(40px)";
animate(view, { opacity: [0, 1], y: [40, 0] }, { duration: 0.45, easing: "ease-out" });

    document.body.appendChild(view);

    // --- Barra superior ---
const topBar = document.createElement("div");
topBar.setAttribute("data-topbar", "true");

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

    // --- Contenido central scrollable ---
const content = document.createElement("div");
content.setAttribute("data-content", "true");   // 👈 AÑADIR ESTO
Object.assign(content.style, {
  backgroundColor: "#fff",
  flex: "1 1 0%",
  width: "100%",                    // ✅ fuerza ancho total
  padding: "0rem 1.5rem 8rem 1.5rem",
  color: "#333",
  position: "relative",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  transition: "opacity 0.3s ease",
});
view.appendChild(content);

    // --- Barra inferior fija (tabs tipo iOS) ---
const bottomBar = document.createElement("div");
bottomBar.setAttribute("data-bottombar", "true");

Object.assign(bottomBar.style, {
  position: "fixed",
  bottom: "1rem",
  left: "50%",
  transform: "translateX(-50%)",
  width: "90%",
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
  <button class="tab-item" data-id="habitos">🌱</button>
  <div id="indicator" style="
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:45px;
    height:45px;
    border-radius:12px;
    background-color:rgb(237 237 237);
    left:50%;
    transition:left 0.25s ease, transform 0.3s ease;
    z-index:-1;
  "></div>
`;

    document.body.appendChild(bottomBar);

    // --- Indicador pill detrás del tab activo ---
const indicator = bottomBar.querySelector("#indicator");

    const items = bottomBar.querySelectorAll(".tab-item");

function moveIndicatorTo(el) {
  const barRect = bottomBar.getBoundingClientRect();
  const btnRect = el.getBoundingClientRect();

  // Centro real del botón dentro del bottom bar
  const centerX = btnRect.left - barRect.left + (btnRect.width / 2);

  // 23px es la mitad del indicador (45px/2)
  indicator.style.left = `${centerX - 23}px`;
}

function removeOrganizeButton() {
  const b = document.getElementById("organizeBtn");
  if (b) b.remove();

  const s = document.getElementById("organizeScreen");
  if (s) s.remove();
}


    /* ---------------------------------
       CAMBIAR DE SECCIÓN / TABS / HOME
    ----------------------------------*/
    function updateView(sectionId) {
      removeOrganizeButton();
      // ========== HOME ==========
if (sectionId === "home") {
  selected = null;
  body.style.overflow = "auto";

  showNavigationBars(); // 👈 RESTAURAR BARRAS

  animate(bottomBar, { y: ["0%", "100%"], opacity: [1, 0] }, { duration: 0.4 })
    .finished.then(() => bottomBar.remove());

  view.remove();

  if (overlay) {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  }

  header.style.display = "block";
  saludo.removeAttribute("style");
  animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });

  render();
  return;
}


      // buscamos la card que corresponde
      const section = cards.find((c) => c.id === sectionId);

      // fallback raro, por si sectionId no existe
      if (!section) {
        selected = null;
        body.style.overflow = "auto";

        animate(bottomBar, { y: ["0%", "100%"], opacity: [1, 0] }, { duration: 0.4 })
          .finished.then(() => bottomBar.remove());

        view.remove();

        header.style.display = "block";
        saludo.removeAttribute("style");
        animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });

        render();
        return;
      }

      // setup visual para esta sección
      topBar.style.backgroundColor = section.color;
      topBar.innerHTML = `<h2 style="font-size:1.5rem;font-weight:700;line-height: 1.3;">${section.title}</h2>`;
      body.style.backgroundColor = "#fff"; // fondo siempre blanco

      // detectar dirección swipe (para la animación horizontal)
const order = ["home", "calendario", "almuerzos", "compras", "habitos"];
      const currentIndex = order.indexOf(sectionId);
      const previousIndex = order.indexOf(selected);
      const direction = currentIndex > previousIndex ? 1 : -1;
      selected = sectionId;

      // animación de salida del contenido anterior
 // animación de salida del contenido anterior
animate(content, { opacity: [1, 0], x: [0, -40 * direction] }, { duration: 0.25 })
  .finished.then(() => {

    // =========================
    // ====== HABITOS ==========
    // =========================
if (sectionId === "habitos") {

  // 🧹 LIMPIAR CUALQUIER HTML PREVIO QUE SE QUEDÓ PEGADO
  content.innerHTML = "";
  content.replaceChildren(); // <= limpia todo completamente

  // 🔥 RENDER REAL (tu versión sin círculo)
  const html = renderHabitsScreen();
  content.innerHTML = html;

  // 🔌 Re-activar eventos
  attachHabitEvents(content);
  showNavigationBars();

  // 🎬 Animación de entrada
  animate(
    content,
    { opacity: [0, 1], x: [40, 0] },
    { duration: 0.35, easing: "ease-out" }
  );

  return;
}




        // ====== CALENDARIO =======

        if (sectionId === "calendario") {
          const today = new Date();
           const year = today.getFullYear();
           const month = today.getMonth();
          const monthName = today.toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          });
// Generar todos los días laborales del mes
const days = [];
let d = new Date(year, month, 1);
while (d.getMonth() === month) {
  const day = d.getDay();
  if (day >= 1 && day <= 5) {
    days.push(new Date(d));
  }
  d.setDate(d.getDate() + 1);
}

// Dividir en semanas de 5 días
const weeks = [];
for (let i = 0; i < days.length; i += 5) {
  const slice = days.slice(i, i + 5);

  while (slice.length < 5) slice.push(null);

  weeks.push(slice);
}

content.innerHTML = `
  <div style="width:100%;">

    <h2 style="
      font-size:1.4rem;
      font-weight:700;
      margin:1rem;
      text-transform:capitalize;
    ">
      ${monthName}
    </h2>

    <!-- Carrusel -->
    <div id="weekCarousel" style="
      display:flex;
      overflow-x:auto;
      scroll-snap-type:x mandatory;
      gap:1rem;
      padding-bottom:1rem;
      -webkit-overflow-scrolling:touch;
    ">
      ${weeks.map(week => `
        <div class="week-slide" style="
          min-width:100%;
          scroll-snap-align:center;
          padding:0 0.5rem;
          display:flex;
          flex-direction:column;
          gap:0.5rem;
        ">

          <div style="
            display:grid;
            grid-template-columns:repeat(5,1fr);
            text-align:center;
            font-weight:600;
            gap:1rem;
          ">
            <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span>
          </div>

          <div class="daysRow" style="
            display:grid;
            grid-template-columns:repeat(5,1fr);
            text-align:center;
            gap:1rem;
          ">
${week.map((d, index) => {

  if (!d) return `<div></div>`;

  // Detectar si es hoy
  const isToday = d.toDateString() === new Date().toDateString();

  // Detectar si es el día seleccionado
  const isSelected =
    selectedDate && selectedDate.toDateString() === d.toDateString();

  // Colores según prioridad
  let bg = "#f3f4f6";    // normal
  let color = "#333";     // normal

  if (isToday) bg = "#ccc";           // hoy
  if (isSelected) {                   // seleccionado (manda)
    bg = "#000";
    color = "#fff";
  }

  // Obtener datos del almuerzo
  const weekStart = new Date(d);
  const dow = weekStart.getDay() || 7;
  if (dow !== 1) weekStart.setDate(weekStart.getDate() - (dow - 1));
  const weekKey = weekStart.toISOString().slice(0,10);

  const saved = JSON.parse(localStorage.getItem("meals-" + weekKey) || "{}");

  const dist = saved.distribution || {
    lunes:"meal1", martes:"meal2", miercoles:"meal1",
    jueves:"meal2", viernes:"meal3"
  };

  const names = ["lunes","martes","miercoles","jueves","viernes"];
  const dayKey = names[index];
  const slot = dist[dayKey];

  return `
    <div class="calendar-day"
      data-date="${d.toISOString()}"
      data-weekkey="${weekKey}"
      data-slot="${slot}"
      style="
        width:100%;
        min-height:50px;
        background:${bg};
        color:${color};
        border-radius:12px;
        font-weight:600;
        padding:6px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:4px;
        cursor:pointer;
        transition:0.25s;
      ">
      <div>${d.getDate()}</div>
    </div>
  `;
}).join("")}

          </div>

        </div>
      `).join("")}
    </div>

    <!-- CONTENEDOR NUEVO PARA CARD DE COMIDA -->
    <div id="dayMealPreview" style="
      margin-top:1rem;
      width:100%;
      display:none;
      flex-direction:column;
      gap:1rem;
    "></div>

  </div>
`;


// Animación iOS del carrusel
const weekCarousel = content.querySelector("#weekCarousel");
weekCarousel.addEventListener("touchstart", () => {
  swipeEnabled = false;
});

weekCarousel.addEventListener("touchend", () => {
  setTimeout(() => (swipeEnabled = true), 120);
});


animate(
  weekCarousel,
  { opacity: [0, 1], x: [40, 0] },
  { duration: 0.45, easing: "ease-out" }
);

const todayIndex = days.findIndex(
  d => d && d.toDateString() === new Date().toDateString()
);

if (todayIndex !== -1) {
  const weekNumber = Math.floor(todayIndex / 5);
  weekCarousel.scrollTo({
    left: weekNumber * weekCarousel.clientWidth,
    behavior: "instant"
  });
}

if (todayIndex !== -1) {
  const weekNumber = Math.floor(todayIndex / 5);
  weekCarousel.scrollTo({
    left: weekNumber * weekCarousel.clientWidth,
    behavior: "instant"
  });
}

// ====================================================
// ⬇️ AQUI PEGAS EL BLOQUE 2 ENTERO  (EVENTO CLICK EN DÍA)
// ====================================================

/*  BLOQUE 2 COMIENZA AQUÍ  */
content.querySelectorAll(".calendar-day").forEach(day => {
  day.addEventListener("click", () => {

    // Guardar selección
    selectedDate = new Date(day.dataset.date);

    // Solo actualizar colores, NO reconstruir pantalla
    refreshCalendarDayStyles();

    // >>> TU LÓGICA EXISTENTE PARA MOSTRAR PREVIEW <<<
    const date = new Date(day.dataset.date);
    const weekKey = day.dataset.weekkey;
    const slot = day.dataset.slot;

    const saved = JSON.parse(localStorage.getItem("meals-" + weekKey) || "{}");
    const name = saved[slot] || "";
    const img = saved[slot+"Img"] || "";

    const preview = content.querySelector("#dayMealPreview");

    if (!name) {
      preview.style.display = "none";
      preview.innerHTML = "";
      return;
    }

    preview.style.display = "flex";
    preview.innerHTML = `
      <div class="meal-preview-card" style="
        background:#fff;
        border-radius:16px;
        box-shadow:0 4px 12px rgba(0,0,0,0.08);
        padding:1rem;
        display:flex;
        align-items:center;
        gap:1rem;
        cursor:pointer;
      ">
        <img src="${img}" style="
          width:75px;height:75px;border-radius:16px;object-fit:cover;
        ">
        <div style="flex:1;">
          <h3 style="font-weight:700;font-size:1.1rem;margin:0;">${name}</h3>
          <p style="font-size:0.8rem;color:#666;margin:0;">Toque para ver receta</p>
        </div>
      </div>
    `;

    preview.querySelector(".meal-preview-card").addEventListener("click", () => {
      fetch("./data/recetas.json")
        .then(r => r.json())
        .then(list => {
          const found = list.find(x => x.name === name);
          if (found) showRecipeDetail(found);
        });
    });
  });
});


/*  BLOQUE 2 TERMINA AQUÍ  */

// ====================================================
// BOTÓN "ORGANIZAR" SOLO EN LA PANTALLA DEL CALENDARIO
// ====================================================

// ====================================================
// BOTÓN "ORGANIZAR" SOLO EN LA PANTALLA DEL CALENDARIO
// ====================================================

// borrar botón previo si existe
const oldOrganize = document.getElementById("organizeBtn");
if (oldOrganize) oldOrganize.remove();

// crear el botón
const organizeBtn = document.createElement("button");
organizeBtn.id = "organizeBtn";
organizeBtn.textContent = "Organizar";

// TU ESTILO EXACTO
Object.assign(organizeBtn.style, {
  position: "fixed",
  bottom: "7rem",
  left: "50%",
  transform: "translateX(-50%)",
  width: "80%",
  background: "#000",
  color: "#fff",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: "0.9rem 1.3rem",
  borderRadius: "14px",
  border: "1px solid rgba(0,0,0,0.1)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  fontWeight: "600",
  fontSize: "1rem",
  zIndex: "200",
  cursor: "pointer"
});

document.body.appendChild(organizeBtn);


// ====================================================
// PANTALLA ORGANIZAR
// ====================================================
function openOrganizeScreen() {
  
  const screen = document.createElement("div");
  screen.id = "organizeScreen";

  Object.assign(screen.style, {
    position: "fixed",
    inset: "0",
    background: "#fff",
    zIndex: "400",
    transform: "translateY(100%)",
    display: "flex",
    flexDirection: "column",
    padding: "1.4rem"
  });

  animate(
    screen,
    { y: ["100%", "0%"], opacity: [0, 1] },
    { duration: 0.45, easing: "ease-out" }
  );

  const back = document.createElement("button");
  back.textContent = "← Volver";
  Object.assign(back.style, {
    background: "none",
    border: "none",
    color: "#007AFF",
    fontWeight: "600",
    fontSize: "1.2rem",
    marginBottom: "1rem",
    cursor: "pointer",
    width: "fit-content"
  });
  back.addEventListener("click", closeOrganizeScreen);

  const title = document.createElement("h2");
  title.textContent = "Organizar semana";
  title.style.fontSize = "1.8rem";
  title.style.fontWeight = "700";
  title.style.marginBottom = "1rem";

  screen.appendChild(back);
  screen.appendChild(title);
    // =====================================================
  // =============== CARRUSEL DE SEMANAS ==================
  // =====================================================

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentWeekIndex = 0;
let selectedWeekKey = "";
  

function getWeeksOfMonth(year, month) {
  const weeks = [];

  function collectWeeks(y, m) {
    const arr = [];
    const date = new Date(y, m, 1);

    // mover hasta el lunes previo
    while (date.getDay() !== 1) date.setDate(date.getDate() - 1);

    while (true) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      arr.push({
        start,
        end,
        weekKey: start.toISOString().slice(0,10)
      });

      date.setDate(date.getDate() + 7);
      if (date.getMonth() !== m) break;
    }

    return arr;
  }

  // mes anterior
  const prevM = month === 0 ? 11 : month - 1;
  const prevY = month === 0 ? year - 1 : year;

  // mes siguiente
  const nextM = month === 11 ? 0 : month + 1;
  const nextY = month === 11 ? year + 1 : year;

  weeks.push(...collectWeeks(prevY, prevM));
  weeks.push(...collectWeeks(year, month));
  weeks.push(...collectWeeks(nextY, nextM));

  return weeks;
}





// Detectar semana actual
const today = new Date();
let weeks = getWeeksOfMonth(currentYear, currentMonth);

// Encontrar la semana actual dentro de semanas extendidas
currentWeekIndex = weeks.findIndex(w => today >= w.start && today <= w.end);

 
    // Crear carrusel nuevo para ORGANIZAR (NO usar weekCarousel)
  const organizeCarousel = document.createElement("div");
  organizeCarousel.id = "organizeWeekSelector";

  Object.assign(organizeCarousel.style, {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    gap: "1rem",
    paddingBottom: "1rem",
    paddingTop: "1rem",
    marginBottom: "2rem",
    WebkitOverflowScrolling: "touch",
  });
weeks.forEach((w, i) => {
  const start = w.start.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  const end = w.end.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });

  const card = document.createElement("div");
  Object.assign(card.style, {
    minWidth: "60%",
    background: "#ededed",
    padding: "1rem",
    borderRadius: "16px",
    scrollSnapAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "0.25s",
  });

  if (i === currentWeekIndex) {
    card.style.background = "#000";
    card.style.color = "#fff";
    card.style.transform = "scale(1.05)";
  }

  card.innerHTML = `
    <h3 style="font-size:1.7rem;font-weight:600;">Semana ${i + 1}</h3>
    <p style="font-size:1rem; color:#555;">${start} – ${end}</p>
  `;

  // Evento seleccionar semana
  card.addEventListener("click", () => {
    // resetear todas las cards
    Array.from(organizeCarousel.children).forEach(c => {
      c.style.background = "#ededed";
      c.style.color = "#000";
      c.style.transform = "scale(1)";
    });

    // marcar card seleccionada
    card.style.background = "#000";
    card.style.color = "#fff";
    card.style.transform = "scale(1.05)";

    // cargar comidas de esa semana
    loadWeekMeals(w.weekKey);
  });

  organizeCarousel.appendChild(card);
});

 

  screen.appendChild(organizeCarousel);

  // AUTO-SCROLL hacia la semana actual
setTimeout(() => {
  const cards = organizeCarousel.children;
  if (cards[currentWeekIndex]) {
    cards[currentWeekIndex].scrollIntoView({
      behavior: "instant",
      inline: "center"
    });
  }
}, 150);



  // =====================================================
  // ============ 3 BLOQUES PARA SELECCIONAR COMIDA ======
  // =====================================================

  const mealsContainer = document.createElement("div");
  mealsContainer.style.display = "flex";
  mealsContainer.style.flexDirection = "column";
  mealsContainer.style.gap = "1rem";
let selectedMeals = {
  weekKey: "",
  meal1: "",
  meal2: "",
  meal3: ""
};


function loadWeekMeals(weekKey) {
  screen.dataset.weekKey = weekKey;

  let saved = JSON.parse(localStorage.getItem("meals-" + weekKey) || "{}");

  // Si NO existe distribución, generarla automáticamente
  if (!saved.distribution) {
    saved.distribution = {
      lunes: "meal1",
      martes: "meal2",
      miercoles: "meal1",
      jueves: "meal2",
      viernes: "meal3"
    };
  }

  // ---------- MEAL 1 ----------
  if (saved.meal1) {
    mealBox1._label.textContent = saved.meal1;
    mealBox1._image.src = saved.meal1Img || "";
    mealBox1._image.style.display = saved.meal1Img ? "block" : "none";
  } else {
    mealBox1._label.textContent = "Seleccionar comida";
    mealBox1._image.style.display = "none";
  }

  // ---------- MEAL 2 ----------
  if (saved.meal2) {
    mealBox2._label.textContent = saved.meal2;
    mealBox2._image.src = saved.meal2Img || "";
    mealBox2._image.style.display = saved.meal2Img ? "block" : "none";
  } else {
    mealBox2._label.textContent = "Seleccionar comida";
    mealBox2._image.style.display = "none";
  }

  // ---------- MEAL 3 ----------
  if (saved.meal3) {
    mealBox3._label.textContent = saved.meal3;
    mealBox3._image.src = saved.meal3Img || "";
    mealBox3._image.style.display = saved.meal3Img ? "block" : "none";
  } else {
    mealBox3._label.textContent = "Seleccionar comida";
    mealBox3._image.style.display = "none";
  }

  // Guardar de nuevo (por si agregamos distribución)
  localStorage.setItem("meals-" + weekKey, JSON.stringify(saved));
}





function createMealBlock() {
  const box = document.createElement("div");
  Object.assign(box.style, {
    border: "2px dashed #ccc",
    borderRadius: "14px",
    padding: "1rem",
    height: "70px",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#777",
    overflow: "hidden",
  });

  // Imagen (oculta por defecto)
  const img = document.createElement("img");
  Object.assign(img.style, {
    width: "55px",
    height: "55px",
    borderRadius: "12px",
    objectFit: "cover",
    display: "none",
  });

  // Texto
  const label = document.createElement("span");
  label.textContent = "Seleccionar comida";

  // Insertar en el bloque
  box.appendChild(img);
  box.appendChild(label);

  // Guardar referencia interna
  box._image = img;
  box._label = label;

  box.addEventListener("click", () => openMealSelector(box));

  return box;
}

// Crear los 3 bloques con etiquetas para distribuir
const mealBox1 = createMealBlock();
mealBox1.dataset.slot = "meal1";

const mealBox2 = createMealBlock();
mealBox2.dataset.slot = "meal2";

const mealBox3 = createMealBlock();
mealBox3.dataset.slot = "meal3";

mealsContainer.appendChild(mealBox1);
mealsContainer.appendChild(mealBox2);
mealsContainer.appendChild(mealBox3);

screen.appendChild(mealsContainer);

// ===========================
// Cargar comidas de la semana actual
// ===========================
const week = weeks[currentWeekIndex];
const weekKey = week.start.toISOString().slice(0, 10);
loadWeekMeals(weekKey);


// === BOTÓN GUARDAR SEMANA ===
const saveBtn = document.createElement("button");
saveBtn.textContent = "Guardar semana";

Object.assign(saveBtn.style, {
  marginTop: "1.3rem",
  width: "100%",
  background: "#000",
  color: "#fff",
  padding: "1rem",
  borderRadius: "14px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer"
});

saveBtn.addEventListener("click", () => {
  const weekKey = screen.dataset.weekKey;

const data = {
  meal1: mealBox1._label.textContent !== "Seleccionar comida" ? mealBox1._label.textContent : "",
  meal1Img: mealBox1._image.src || "",

  meal2: mealBox2._label.textContent !== "Seleccionar comida" ? mealBox2._label.textContent : "",
  meal2Img: mealBox2._image.src || "",

  meal3: mealBox3._label.textContent !== "Seleccionar comida" ? mealBox3._label.textContent : "",
  meal3Img: mealBox3._image.src || ""
};


  localStorage.setItem("meals-" + weekKey, JSON.stringify(data));
  animateAlert("Semana guardada");
});

screen.appendChild(saveBtn);



  // =====================================================
  // =============== MODAL PARA ELEGIR COMIDA =============
  // =====================================================
  function openMealSelector(targetBox) {
    const modal = document.createElement("div");
    modal.id = "mealSelector";
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "#fff",
      zIndex: "999",
      padding: "1.5rem",
      overflowY: "auto",
      transform: "translateY(100%)"
    });

    animate(modal, { y: ["100%", "0%"] }, { duration: 0.35 });

    const back = document.createElement("button");
    back.textContent = "← Cerrar";
    Object.assign(back.style, {
      background: "none", border: "none",
      color: "#007AFF", fontSize: "1.2rem",
      fontWeight: "600", marginBottom: "1rem",
      cursor: "pointer"
    });
    back.addEventListener("click", () => {
      animate(modal, { y: ["0%", "100%"] }, { duration: 0.35 })
        .finished.then(() => modal.remove());
    });

    const input = document.createElement("input");
    Object.assign(input.style, {
      width: "100%", padding: "0.8rem",
      borderRadius: "12px",
      border: "1px solid #ddd",
      marginBottom: "1rem"
    });
    input.placeholder = "Buscar comida...";

    const list = document.createElement("div");
    list.style.display = "flex";
    list.style.flexDirection = "column";
    list.style.gap = "1rem";

    fetch("./data/recetas.json")
      .then(res => res.json())
      .then(data => {
        function renderList(q = "") {
          list.innerHTML = "";
          data
            .filter(r => r.name.toLowerCase().includes(q.toLowerCase()))
            .forEach(r => {
              const item = document.createElement("div");
              Object.assign(item.style, {
                padding: "1rem",
                borderRadius: "12px",
                background: "#f5f5f5",
                cursor: "pointer",
                display: "flex",
                gap: "1rem",
                alignItems: "center"
              });

              item.innerHTML = `
                <img src="${r.img}" style="width:55px;height:55px;border-radius:12px;object-fit:cover;">
                <span style="font-size:1rem;font-weight:600;">${r.name}</span>
              `;

            item.addEventListener("click", () => {
  // Mostrar texto
  targetBox._label.textContent = r.name;
  targetBox._label.style.color = "#000";

  // Mostrar imagen
  targetBox._image.src = r.img;
  targetBox._image.style.display = "block";

  // Estilo seleccionado
  targetBox.style.border = "2px solid #000";

  // Cerrar modal
  animate(modal, { y: ["0%", "100%"] }, { duration: 0.35 })
    .finished.then(() => modal.remove());
});


              list.appendChild(item);
            });
        }

        renderList();

        input.addEventListener("input", (e) => renderList(e.target.value));
      });

    modal.appendChild(back);
    modal.appendChild(input);
    modal.appendChild(list);
    document.body.appendChild(modal);
  }

  document.body.appendChild(screen);

}

function closeOrganizeScreen() {
  const screen = document.getElementById("organizeScreen");
  if (!screen) return;

  animate(
    screen,
    { y: ["0%", "100%"], opacity: [1, 0] },
    { duration: 0.35, easing: "ease-in" }
  ).finished.then(() => screen.remove());
}

organizeBtn.addEventListener("click", openOrganizeScreen);


        }


        // ====== ALMUERZOS ========

else if (sectionId === "almuerzos") {

  let recipes = [];

  // --- Cargar recetas desde JSON ---
  fetch("./data/recetas.json")
    .then(res => res.json())
    .then(data => {
      recipes = data;
      renderRecipes();
    })
    .catch(err => {
      console.error("Error al cargar recetas:", err);
      content.innerHTML = "<p>Error al cargar recetas.</p>";
    });

  // --- Render listado ---
  function renderRecipes() {
    content.innerHTML = `
      <div style="
        width:100%;
        display:flex;
        align-items:center;
        gap:0.5rem;
        background:#f3f4f6;
        border-radius:14px;
        padding:0.6rem 1rem;
        margin:1rem 0rem;
        box-shadow:0 2px 6px rgba(0,0,0,0.05);
      ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          style="width:20px;height:20px;color:#888;">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input id="searchInput" type="text" placeholder="Buscar almuerzo..."
          style="
            width:100%;
            border:none;
            background:transparent;
            outline:none;
            font-size:1rem;
            color:#333;
          ">
      </div>

      <div id="recipesGrid" style="
        display:grid;
        grid-template-columns:repeat(2, 1fr);
        gap:1rem;
        padding-bottom:2rem;
      ">
        ${recipes.map(r => `
          <div class="recipe-card" style="
            background:#fff;
            border-radius:18px;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);
            overflow:hidden;
            cursor:pointer;
            display:flex;
            flex-direction:column;
          ">
            <div style="
              width:100%;
              height:180px;
              overflow:hidden;
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <img src="${r.img}" alt="${r.name}" style="
                width:100%;
                height:100%;
                object-fit:cover;
              ">
            </div>
            <div style="padding:0.75rem;">
              <h3 style="
                font-size:1rem;
                font-weight:700;
                color:#222;
                margin-bottom:0.5rem;
                overflow:hidden;
                text-overflow:ellipsis;
                display:-webkit-box;
                -webkit-line-clamp:2;
                -webkit-box-orient:vertical;
              ">${r.name}</h3>
              <div style="display:flex; justify-content:space-between;">
                <span style="
                  font-size:0.8rem;
                  background-color:#f3f4f6;
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

    attachCardEvents(recipes);

    const searchInput = content.querySelector("#searchInput");
    const recipesGrid = content.querySelector("#recipesGrid");
    searchInput.addEventListener("input", e => {
      const q = e.target.value.toLowerCase();
      const filtered = recipes.filter(r => r.name.toLowerCase().includes(q));
      recipesGrid.innerHTML = filtered.map(r => `
        <div class="recipe-card" style="background:#fff;border-radius:18px;box-shadow:0 4px 15px rgba(0,0,0,0.08);overflow:hidden;cursor:pointer;display:flex;flex-direction:column;">
          <div style="width:100%;height:180px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
            <img src="${r.img}" alt="${r.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div style="padding:0.75rem;">
            <h3 style="font-size:1rem;font-weight:700;color:#222;margin-bottom:0.5rem;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${r.name}</h3>
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:0.8rem;background-color:#f3f4f6;padding:3px 8px;border-radius:8px;">${r.difficulty}</span>
              <span style="font-size:0.8rem;color:#777;">${r.time}</span>
            </div>
          </div>
        </div>
      `).join("");
      attachCardEvents(filtered);
    });
  }

  // --- Click en tarjeta ---
  function attachCardEvents(list) {
    const cards = content.querySelectorAll(".recipe-card");
    cards.forEach((card, i) => {
      card.addEventListener("click", () => {
  loadWeekMeals(i);
});
      card.addEventListener("click", () => {
window.lastRecipeListRender = renderRecipes;
showRecipeDetail(list[i]);
      });
    });
  }


  // --- Pasos ---
  function showSteps(recipe) {
    content.innerHTML = "";
    const back = document.createElement("button");
    back.textContent = "← Atrás";
    Object.assign(back.style, {
      background: "none",
      border: "none",
      color: "#007AFF",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      marginBottom: "0.5rem"
    });
    back.addEventListener("click", () => showRecipeDetail(recipe));
    content.appendChild(back);

    (recipe.steps || []).forEach((step, i) => {
      const div = document.createElement("div");
      div.innerHTML = `<h3>Paso ${i + 1}</h3><p>${step}</p>`;
      Object.assign(div.style, {
        marginBottom: "1rem",
        padding: "0.5rem",
        borderBottom: "1px solid #eee"
      });
      content.appendChild(div);
    });
  }
}


        // =========================
        // ====== DEFAULT / OTRAS ==
        // =========================
        else {
          content.innerHTML = `
            <p style="font-size:1.1rem; line-height:1.6;">
              ${section.content}
            </p>
            <button id="backBtn" style="
              margin-top:2rem;
              background-color:${section.color};
              padding:0.75rem 0rem;
              border-radius:12px;
              font-weight:600;
              box-shadow:0 2px 10px rgba(0,0,0,0.1);
            ">Volver</button>
          `;

          // botón volver -> home
          const backBtn = content.querySelector("#backBtn");
          if (backBtn) {
            backBtn.addEventListener("click", () => updateView("home"));
          }
        }

        // animación de entrada para el nuevo contenido
        animate(
          content,
          { opacity: [0, 1], x: [40 * direction, 0] },
          { duration: 0.35, easing: "ease-out" }
        );

        // --- SWIPE LATERAL ENTRE TABS ---
// --- SWIPE LATERAL ENTRE TABS (con protección anti clics) ---
// --- SWIPE LATERAL ENTRE TABS (iOS-like) ---
// Reinicia handlers viejos por seguridad
content.ontouchstart = null;
content.ontouchmove = null;
content.ontouchend = null;

let startX = 0;
let endX = 0;
let touchStartTime = 0;
let startTarget = null;

content.ontouchstart = (e) => {
  startX = e.touches[0].clientX;
  endX = startX;
  touchStartTime = Date.now();
  startTarget = e.target;
};

content.ontouchmove = (e) => {
  endX = e.touches[0].clientX;
};

content.ontouchend = () => {
  if (!swipeEnabled) return; // bloqueado en pantallas tipo "detalle receta"

  // Evitar swipe si tocaste UI interactiva
  const interactiveTags = ["INPUT", "BUTTON", "IMG", "A", "TEXTAREA"];
  if (interactiveTags.includes(startTarget.tagName)) return;

  const deltaX = endX - startX;
  const distance = Math.abs(deltaX);
  const holdTime = Date.now() - touchStartTime;

  // Gesto válido = movimiento lateral rápido y corto
  if (distance < 60 || holdTime > 400) return;

const tabsOrder = ["calendario", "almuerzos", "compras", "habitos"];
  const current = tabsOrder.indexOf(sectionId);

  // Swipe izquierda → siguiente tab
  if (deltaX < 0 && current < tabsOrder.length - 1) {
    const next = tabsOrder[current + 1];
    const nextBtn = [...items].find(b => b.dataset.id === next);
    moveIndicatorTo(nextBtn);
    updateView(next);
    return;
  }

  // Swipe derecha → tab anterior
  if (deltaX > 0 && current > 0) {
    const prev = tabsOrder[current - 1];
    const prevBtn = [...items].find(b => b.dataset.id === prev);
    moveIndicatorTo(prevBtn);
    updateView(prev);
    return;
  }
};

      }); // fin .finished.then() del animate(content)
      
      // mover el indicador al botón activo actual
      moveIndicatorTo([...items].find((b) => b.dataset.id === sectionId));
      content.scrollTo({ top: 0, behavior: "instant" });

if (sectionId !== "calendario") {
  const b = document.getElementById("organizeBtn");
  if (b) b.remove();

  const s = document.getElementById("organizeScreen");
  if (s) s.remove();
}

    } // fin updateView


    /* ---------------------------------
       INICIALIZAMOS LA VISTA
    ----------------------------------*/
    updateView(initialCard.id);

    // marcar botón activo e indicator
    const activeBtn = [...items].find((b) => b.dataset.id === initialCard.id);
    setTimeout(() => {
      moveIndicatorTo(activeBtn);
      activeBtn.classList.add("active");
    }, 50);

    // listeners de cada tab en la bottom bar
    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        items.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        moveIndicatorTo(btn);
        updateView(btn.dataset.id);
      });
    });
  }); // fin Promise.all
}




// =========================
// HABITS MODULE (NEW STRUCTURE)
// =========================









function getTrendData() {
  const last30 = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    last30.push(loadHabitData(key));
  }

  // Invertir para que vaya de más antiguo → más reciente
  last30.reverse();

  const habitTrends = {};

  HABITS.forEach(h => {
    const values = last30.map(day => {
      const v = day[h.key];
      return v === 1 ? 1 : 0;
    });
    habitTrends[h.key] = values;
  });

  return habitTrends;
}

function getWeightTrend() {
  const logs = loadWeightLog().slice().reverse(); // más antiguo → más nuevo
  return logs.map(l => l.weight);
}

function analyzeTrend(values) {
  if (values.length < 5) return "No hay datos suficientes.";

  const first = values[0];
  const last = values[values.length - 1];

  const diff = last - first;

  if (diff > 0.2) return "Tendencia a la baja 👇⚠️";
  if (diff < -0.2) return "Tendencia positiva 👍🔥";
  return "Estable ✔️";
}



// === FECHA SELECCIONADA PARA HABITOS ===
let currentHabitDate = getToday();


// ---------- UTILS ----------
function getToday() {
  return new Date().toISOString().slice(0,10);
}
function getAllWeeks() {
  const weeks = [];
  const today = new Date();

  // Encontrar el lunes de esta semana
  const currentMonday = new Date(today);
  const day = today.getDay() === 0 ? 7 : today.getDay(); // Sunday fix
  currentMonday.setDate(today.getDate() - (day - 1));

  // Generar semanas hacia atrás hasta no tener datos
  for (let w = 0; w < 20; w++) {
    const start = new Date(currentMonday);
    start.setDate(currentMonday.getDate() - (7 * w));

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Recolectar la data de cada día de la semana
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0,10);
      days.push({
        date: key,
        data: loadHabitData(key),
        score: calculateDailyPoints(loadHabitData(key))
      });
    }

    weeks.push({
      id: w,
      start,
      end,
      days
    });
  }

  return weeks;
}

function calculateWeekScore(week) {
  let sum = 0;
  week.days.forEach(d => {
    sum += d.score;
  });
  return sum;
}


// ---------- LOAD & SAVE ----------
function loadHabitData(date) {
  const raw = localStorage.getItem("habits-" + date);
  return raw ? JSON.parse(raw) : {};
}

function saveHabitData(date, data) {
  localStorage.setItem("habits-" + date, JSON.stringify(data));
}

// ---------- WEEK CALC ----------
function getLast7Days() {
  const out = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0,10);
    out.push({
      date: key,
      data: loadHabitData(key)
    });
  }
  return out;
}

function calculateWeeklyPoints() {
  const week = getLast7Days();
  let total = 0;

  week.forEach(day => {
    const data = day.data;
    HABITS.forEach(h => {
      const val = data[h.key];
      if (val === 1) total += h.yes;
      if (val === 0) total += h.no;
    });
  });

  // Total máximo 7000 puntos
  total = Math.max(0, Math.min(7000, total));

  // Convertimos a porcentaje (0–100)
  const percent = Math.round((total / 7000) * 100);
  return percent;
}


function getScoreColor(score) {
  if (score < 40) return { color: "#ff7676", label: "Deficiente" };
  if (score < 70) return { color: "#ffd76a", label: "Regular" };
  return { color: "#9cff8f", label: "Muy bien" };
}

function renderHabitsScreen() {
  const score = calculateWeeklyPoints();
  const { color, label } = getScoreColor(score);

  return `
    <!-- SCORE CARD -->
    <div style="
      width:100%;
      padding:1.3rem;
      background:#fff;
      border-radius:18px;
      box-shadow:0 3px 12px rgba(0,0,0,0.07);
      margin-bottom:1.5rem;
      text-align:center;
    ">
      <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">
        Tu puntaje semanal
      </h3>

      <!-- SOLO NÚMERO SIN CÍRCULO -->
      <div style="
        font-size:2.9rem;
        font-weight:800;
        color:${color};
        margin-bottom:0.3rem;
      ">
        ${score}
      </div>

      <p style="font-size:1.1rem; font-weight:600; color:#333;">
        ${label}
      </p>
    </div>


<button id="viewAchievements" style="
  margin-top:1rem;
  width:100%;
  background:#f5f5f5;
  border:1px solid #ddd;
  border-radius:12px;
  padding:0.9rem;
  font-weight:600;
  font-size:1rem;
  cursor:pointer;
">
  ⭐ Ver logros
</button>


<button id="viewMedals" style="
  margin-top:0.7rem;
  width:100%;
  background:#fff7d4;
  border:1px solid #eedc9a;
  border-radius:12px;
  padding:0.9rem;
  font-weight:600;
  font-size:1rem;
  cursor:pointer;
">
  🏅 Ver medallas
</button>



    <!-- NAV BUTTONS -->
    <div style="display:flex; flex-direction:column; gap:1rem;">

      <button class="habit-nav" data-go="daily" style="
        width:100%; text-align:left;
        padding:1rem; border-radius:14px;
        background:#f3f4f6; border:none; font-weight:600;
      ">📋 Registrar hábitos diarios →</button>

      <button class="habit-nav" data-go="weekly" style="
        width:100%; text-align:left;
        padding:1rem; border-radius:14px;
        background:#f3f4f6; border:none; font-weight:600;
      ">📅 Resumen semanal →</button>

      <button class="habit-nav" data-go="trends" style="
        width:100%; text-align:left;
        padding:1rem; border-radius:14px;
        background:#f3f4f6; border:none; font-weight:600;
      ">📈 Tendencias →</button>

      <button class="habit-nav" data-go="registro" style="
        width:100%; text-align:left;
        padding:1rem; border-radius:14px;
        background:#f3f4f6; border:none; font-weight:600;
      ">⚖️ Registro personal →</button>

    </div>
  `;
}

function analyzeHabitProgress() {
  const today = new Date();

  const getDateKey = (d) => d.toISOString().slice(0,10);

  // === Semana actual (0–6 días)
  const currentWeek = [];
  for (let i=0;i<7;i++){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    currentWeek.push(loadHabitData(getDateKey(d)));
  }

  // === Semana pasada (7–13 días atrás)
  const prevWeek = [];
  for (let i=7;i<14;i++){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    prevWeek.push(loadHabitData(getDateKey(d)));
  }

  // === Últimos 30 días
  const last30 = [];
  for (let i=0;i<30;i++){
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last30.push(loadHabitData(getDateKey(d)));
  }

  const avg = (arr, key) => {
    const vals = arr.map(v => v[key]).filter(v => v !== undefined && v !== null);
    return vals.length ? vals.reduce((a,b)=>a+b,0) / vals.length : 0;
  };

  const result = {};

  HABITS.forEach(h => {
    const cw = avg(currentWeek, h.key);   // semana actual
    const pw = avg(prevWeek, h.key);      // semana pasada
    const m  = avg(last30, h.key);        // mes

    let trendWeek = "";
    let trendMonth = "";

    // — Semana
    if (cw > pw) trendWeek = "Mejoraste respecto a la semana pasada 👏";
    else if (cw < pw) trendWeek = "Disminuiste respecto a la semana pasada 👀";
    else trendWeek = "Te mantuviste igual que la semana pasada.";

    // — Mes
    if (cw > m) trendMonth = "Tu promedio mensual va en alza 🔥";
    else if (cw < m) trendMonth = "Estás por debajo de tu nivel mensual 😬";
    else trendMonth = "Mantienes tu promedio mensual.";

    result[h.key] = {
      label: h.label,
      week: trendWeek,
      month: trendMonth,
      current: cw,
      previous: pw,
      monthly: m
    };
  });

  return result;
}

function renderAchievements() {
  const analysis = analyzeHabitProgress();

  let html = `
    <div class="habit-header">
      <button id="backAchievements" class="habit-back">← Volver</button>
      <h2 class="habit-title">Tus logros</h2>
    </div>

    <p style="color:#555; margin-bottom:1rem; text-align:center;">
      Comparativo semanal y mensual
    </p>
  `;

  Object.values(analysis).forEach(a => {
    html += `
      <div style="
        background:#fafafa;
        padding:1rem;
        margin-bottom:1rem;
        border-radius:14px;
        border:1px solid #eee;
      ">
        <strong style="font-size:1.1rem; display:block; margin-bottom:0.5rem;">
          ${a.label}
        </strong>

        <p style="margin:0.3rem 0;">
          <strong>Esta semana:</strong> ${a.week}
        </p>

        <p style="margin:0.3rem 0;">
          <strong>Últimos 30 días:</strong> ${a.month}
        </p>
      </div>
    `;
  });

  return html;
}

function attachAchievementEvents(content) {
  const back = document.getElementById("backAchievements");
  if (back) {
    back.addEventListener("click", () => {
      showNavigationBars();
      content.innerHTML = renderHabitsScreen();
      attachHabitEvents(content);
    });
  }
}





// ---------- WEEKLY SUMMARY ----------
function renderWeeklySummary() {
  const weeks = getAllWeeks();

  let html = `
  <div class="habit-header">
    <button id="backHabits" class="habit-back">← Volver</button>
    <h2 class="habit-title">Resumen semanal</h2>
  </div>
  `;

  weeks.forEach((week, i) => {
    const total = calculateWeekScore(week);

    let arrow = "";
    if (i === 0) {
      arrow = ""; // no hay semana previa
    } else {
      const prevTotal = calculateWeekScore(weeks[i-1]);
      arrow = total > prevTotal
        ? `<span style="color:#00c853;font-weight:700;">↑</span>`
        : `<span style="color:#ff5252;font-weight:700;">↓</span>`;
    }

    const range = `${week.start.toLocaleDateString("es-ES")} - ${week.end.toLocaleDateString("es-ES")}`;

    html += `
      <div class="week-card" data-week="${week.id}" style="
        background:#fff;
        padding:1rem;
        border-radius:16px;
        border:1px solid #eee;
        margin-bottom:1rem;
        cursor:pointer;
      ">
        <strong>Semana ${i+1}</strong><br>
        <small>${range}</small>

        <div style="margin-top:8px;font-size:1.1rem;font-weight:700;">
          ${total} / 7000 ${arrow}
        </div>
      </div>
    `;
  });

  return html;
}


function renderTrends() {
  const habitTrends = getTrendData();
  const weightTrend = getWeightTrend();

  let html = `
    <div class="habit-header">
      <button id="backHabits" class="habit-back">← Volver</button>
      <h2 class="habit-title">Tendencias</h2>
    </div>
  `;

  // Tarjeta de PESO
  html += `
    <div class="trend-card">
      <h3 class="trend-title">⚖️ Peso</h3>
      <canvas id="chartWeight" width="300" height="90" class="trend-chart"></canvas>
      <p class="trend-desc">${analyzeTrend(weightTrend)}</p>
    </div>
  `;

  // Tarjetas de HÁBITOS
  HABITS.forEach(h => {
    const values = habitTrends[h.key];
    html += `
      <div class="trend-card">
        <h3 class="trend-title">${h.label}</h3>
        <canvas id="chart_${h.key}" width="300" height="90" class="trend-chart"></canvas>
        <p class="trend-desc">${analyzeTrend(values)}</p>
      </div>
    `;
  });

  return html;
}



function renderGoals() {
  return `
<div class="habit-header">
  <button id="backHabits" class="habit-back">← Volver</button>
  <h2 class="habit-title">Metas personales</h2>
</div>

  `;
}


function attachHabitEvents(content) {

  document.querySelectorAll(".week-card").forEach(card => {
  card.addEventListener("click", () => {
    const id = Number(card.dataset.week);
    hideNavigationBars();
    content.innerHTML = renderWeeklyDetail(id);
    attachWeeklyDetailEvents(content);
  });
});


  // === evento para VER LOGROS ===
  const btnAchievements = document.getElementById("viewAchievements");
  if (btnAchievements) {
    btnAchievements.addEventListener("click", () => {
      hideNavigationBars();
      content.innerHTML = renderAchievements();
      attachAchievementEvents(content);
    });
  }

  // === Botón VER MEDALLAS ===  ⬅⬅ AQUI VA TU CÓDIGO
  const btnMedals = document.getElementById("viewMedals");
  if (btnMedals) {
    btnMedals.addEventListener("click", () => {
      hideNavigationBars();
      content.innerHTML = renderMedalsScreen();
      attachAchievementEvents(content);
    });
  }


  // === eventos de navegación ===
  document.querySelectorAll(".habit-nav").forEach(btn => {
    btn.addEventListener("click", () => {
      const go = btn.dataset.go;

      if (go === "daily") {
        hideNavigationBars();
        content.innerHTML = renderDailyHabits();
        attachDailyEvents(content);
        return;
      }

      if (go === "weekly") {
        hideNavigationBars();
        content.innerHTML = renderWeeklySummary();
        attachHabitEvents(content);
        return;
      }

if (go === "trends") {
  hideNavigationBars();
  content.innerHTML = renderTrends();
  attachHabitEvents(content);

  setTimeout(() => {
    // pintar gráfico de peso
    drawLineChart(
      document.getElementById("chartWeight"),
      getWeightTrend(),
      { color: "#000" }
    );

    // pintar gráficos de hábitos
    const trendData = getTrendData();
    HABITS.forEach(h => {
      drawLineChart(
        document.getElementById("chart_" + h.key),
        trendData[h.key],
        { color: "#007AFF" }
      );
    });
  }, 50);

  return;
}


if (go === "registro") {
  hideNavigationBars();
  content.innerHTML = renderRegistro();
  attachRegistroEvents(content);
  return;
}
    });
  });

  // === botón volver a hábitos ===
  const backBtn = document.getElementById("backHabits");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showNavigationBars();
      content.innerHTML = renderHabitsScreen();
      attachHabitEvents(content);
    });
  }
}


function renderMedalsScreen() {
  const { earned, progress } = calculateMedals();

  // Mezclar medallas normales + medallas de acumulación
  const allMedals = [...MEDALS, ...ACCUMULATION_MEDALS];

  // Ordenar → primero las ganadas (mayor count), luego las bloqueadas
  const sortedMedals = allMedals.sort((a, b) => {
    const ea = earned[a.key] || 0;
    const eb = earned[b.key] || 0;
    return eb - ea; // mayor a menor
  });

  let html = `
  <div class="habit-header">
    <button id="backAchievements" class="habit-back">← Volver</button>
    <h2 class="habit-title">Mis Medallas</h2>
  </div>

  <p style="text-align:center;color:#555;margin-bottom:1rem;">
    Logros obtenidos y progreso hacia nuevas medallas
  </p>
  `;

  sortedMedals.forEach(m => {
    const count = earned[m.key] || 0;
    const pct = Math.min(100, Math.round(((progress[m.key] || 0) * 100)));

    const unlocked = count > 0;
    const displayEmoji = unlocked ? m.emoji : "🔒";

    html += `
      <div style="
        background:#fff;
        padding:1rem;
        border-radius:16px;
        margin-bottom:1rem;
        border:1px solid #eee;
        opacity:${unlocked ? "1" : "0.5"};
        transition:0.3s;
      ">
        <div style="display:flex; gap:1rem; align-items:center;">
          <div style="font-size:2rem; min-width:48px; text-align:center;">
            ${displayEmoji}
          </div>

          <div style="flex:1;">
            <strong style="font-size:1.1rem;">${m.title}</strong><br>
            <small style="color:#666;">${m.description || ""}</small>
            ${count > 1 ? `<div style="margin-top:4px;font-weight:700;">×${count}</div>` : ""}
          </div>
        </div>

        <div style="margin-top:0.8rem;width:100%;background:#eee;height:6px;border-radius:6px;">
          <div style="
            width:${pct}%;
            height:6px;
            background:${unlocked ? "#00c853" : "#999"};
            border-radius:6px;
            transition:width 0.4s;
          "></div>
        </div>

        <p style="font-size:0.85rem;margin-top:0.4rem;color:#666;">
          ${unlocked ? `Ganada ${count} vez(es)` : `Progreso: ${pct}%`}
        </p>
      </div>
    `;
  });

  return html;
}


// ---------- SMALL ALERT ----------
function animateAlert() {
  const div = document.createElement("div");
  div.textContent = "✔ Guardado";
  Object.assign(div.style, {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#111",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    borderRadius: "12px",
    opacity: "0",
    transition: "opacity 0.3s ease",
    zIndex: "999"
  });

  document.body.appendChild(div);
  requestAnimationFrame(() => (div.style.opacity = 1));

  setTimeout(() => {
    div.style.opacity = 0;
    setTimeout(() => div.remove(), 300);
  }, 1400);
}


// ===============================================
//  DAILY HABITS SCREEN (INTERACTIVE TABLE)
// ===============================================

const HABITS = [
  { key: "water",        label: "💧 Tomé 1.5 L de agua",         yes: 100, no: -20 },
  { key: "sweets",       label: "🍬 Evité dulces",               yes: 250, no: -50 },
  { key: "sugarDrinks",  label: "🥤 Evité bebidas azucaradas",   yes: 250, no: -50 },
  { key: "steps8000",    label: "🚶 Hice 8000 pasos",            yes: 200, no: -40 },
  { key: "exercise20",   label: "🏋️ Entrené 20 min",            yes: 150, no: -30 },
  { key: "salad",        label: "🥦 Comí ensalada",              yes: 50,  no: -10 },
];


function renderDailyHabits() {
  const saved = loadHabitData(currentHabitDate);

  const rows = HABITS.map(h => {
    const val = saved[h.key] ?? null;

    const yesActive = val === 1 ? "selected" : "";
    const noActive = val === 0 ? "selected" : "";

    return `
      <div class="habit-row" data-key="${h.key}">
        <span class="habit-label">${h.label}</span>

        <div class="habit-options">
          <div class="habit-opt yes ${yesActive}" data-val="1">Sí</div>
          <div class="habit-opt no ${noActive}" data-val="0">No</div>
        </div>
      </div>
    `;
  }).join("");

  return `
<div class="habit-header">
  <button id="backHabits" class="habit-back">← Volver</button>
  <h2 class="habit-title">Registrar hábitos de hoy</h2>
</div>

<div id="habitCalendarContainer" style="width:100%; margin-bottom:1.5rem;"></div>

<div id="dailyTable" style="display:flex;flex-direction:column;gap:1rem;">
  ${rows}
</div>

<div id="dailyScore" style="
  margin-top:1.5rem;
  font-size:1.2rem;
  font-weight:700;
  text-align:center;
">
  Puntaje de hoy: 0 / 1000
</div>

<button id="saveHabits" style="
  width:100%; padding:1rem; background:#111;
  color:white; border:none; border-radius:12px; font-weight:600;
  margin-top:1.5rem;
">Guardar</button>
`;
}


// ===============================================
// EVENTS FOR DAILY INTERACTIONS
// ===============================================
function attachDailyEvents(content) {
  const today = getToday();
let data = loadHabitData(currentHabitDate);

  const calContainer = document.getElementById("habitCalendarContainer");

setupHabitCalendar(calContainer, (selectedDate) => {
  const dateStr = selectedDate.toISOString().slice(0,10);

  data = loadHabitData(dateStr);
  currentHabitDate = dateStr;

  document.querySelectorAll(".habit-row").forEach(row => {
    const key = row.dataset.key;
    const val = data[key];

    row.querySelectorAll(".habit-opt").forEach(o => o.classList.remove("selected"));

    if (val === 1) row.querySelector(".yes").classList.add("selected");
    if (val === 0) row.querySelector(".no").classList.add("selected");
  });

  updateDailyScore(data);
});


  document.querySelectorAll(".habit-opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".habit-row");
      const key = parent.dataset.key;
      const val = Number(btn.dataset.val);

      parent.querySelectorAll(".habit-opt").forEach(o => o.classList.remove("selected"));
      btn.classList.add("selected");

      data[key] = val;
      updateDailyScore(data);
    });
  });

  const saveBtn = document.getElementById("saveHabits");
  saveBtn.addEventListener("click", () => {
saveHabitData(currentHabitDate, data);
    animateAlert("guardado");
  });

  const backBtn = document.getElementById("backHabits");
  backBtn.addEventListener("click", () => {
    showNavigationBars();
    content.innerHTML = renderHabitsScreen();
    attachHabitEvents(content);
  });

  updateDailyScore(data);
}



function calculateDailyPoints(data) {
  let total = 0;

  HABITS.forEach(h => {
    const val = data[h.key];
    if (val === 1) total += h.yes;
    if (val === 0) total += h.no;
  });

  // Limitar entre 0 y 1000
  return Math.max(0, Math.min(1000, total));
}



// ===============================================
// SCORE CALCULATION FOR TODAY
// ===============================================
function updateDailyScore(data) {
  let total = 0;

  HABITS.forEach(h => {
    const val = data[h.key];

    if (val === 1) total += h.yes;
    if (val === 0) total += h.no;
  });

  // Limites
  total = Math.max(0, Math.min(1000, total));

  const el = document.getElementById("dailyScore");
  if (el) el.textContent = `Puntaje de hoy: ${total} / 1000`;
}



// === CALENDARIO PRO PARA HABITOS ===
function setupHabitCalendar(container, onDateSelected) {

  const monthLabel = document.createElement("div");
  monthLabel.style.textAlign = "center";
  monthLabel.style.fontWeight = "700";
  monthLabel.style.fontSize = "1.1rem";
  monthLabel.style.marginBottom = "0.5rem";
  container.appendChild(monthLabel);

  const weekCarousel = document.createElement("div");
  weekCarousel.style.cssText = `
    display:flex;
    overflow-x:auto;
    scroll-snap-type:x mandatory;
    gap:1rem;
    padding-bottom:1rem;
    -webkit-overflow-scrolling:touch;
  `;
  container.appendChild(weekCarousel);

  let current = new Date();

  function renderMonth() {
    const year = current.getFullYear();
    const month = current.getMonth();

    monthLabel.textContent = current.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric"
    });

    weekCarousel.innerHTML = "";
    const weeks = getWeeksOfMonth(year, month);

    weeks.forEach(week => {
      const slide = document.createElement("div");
      slide.style.cssText = `
        min-width:100%;
        scroll-snap-align:center;
        padding:0 0.5rem;
        display:flex;
        flex-direction:column;
        gap:0.5rem;
      `;

      slide.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(5,1fr);text-align:center;font-weight:600;">
          <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span>
        </div>
      `;

      const daysRow = document.createElement("div");
      daysRow.style.cssText = `
        display:grid;
        grid-template-columns:repeat(5,1fr);
        text-align:center;
        gap:0.5rem;
      `;

      week.forEach(day => {

        // crear el div (ESTO FALTABA EN TU CÓDIGO)
        const div = document.createElement("div");

        const isSelected =
          day && day.toISOString().slice(0,10) === currentHabitDate;

        div.style.cssText = `
          height:50px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:12px;
          background:${isSelected ? "#000" : "#f3f4f6"};
          color:${isSelected ? "#fff" : "#333"};
          font-weight:600;
          cursor:pointer;
          transition:background .25s, color .25s;
        `;

        div.textContent = day ? day.getDate() : "";

        if (day) {
          div.addEventListener("click", () => {

            // actualizamos fecha seleccionada
            currentHabitDate = day.toISOString().slice(0,10);

            // refresca el calendario (mueve highlight)
            renderMonth();

            // notifica al formulario
            onDateSelected(day);
          });
        }

        daysRow.appendChild(div);
      });

      slide.appendChild(daysRow);
      weekCarousel.appendChild(slide);
    });


    // === AUTO-SCROLL A LA SEMANA ACTUAL ===
setTimeout(() => {
  const slides = weekCarousel.children;

  for (let i = 0; i < weeks.length; i++) {
    const week = weeks[i];

    // si la semana contiene el día seleccionado
    if (week.some(d => d && d.toISOString().slice(0,10) === currentHabitDate)) {
      weekCarousel.scrollTo({
        left: slides[i].offsetLeft,
        behavior: "instant"
      });
      break;
    }
  }
}, 10);

  }

  // ---- Generar semanas del mes ----
function getWeeksOfMonthExtended(year, month) {
  const weeks = [];

  function collectWeeks(y, m) {
    const monthWeeks = [];
    const date = new Date(y, m, 1);

    // retroceder al lunes anterior
    while (date.getDay() !== 1) date.setDate(date.getDate() - 1);

    while (true) {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      monthWeeks.push({
        start,
        end,
        weekKey: start.toISOString().slice(0, 10)
      });

      date.setDate(date.getDate() + 7);
      if (date.getMonth() !== m) break;
    }

    return monthWeeks;
  }

  // Mes anterior
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  // Mes siguiente
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  weeks.push(...collectWeeks(prevYear, prevMonth));
  weeks.push(...collectWeeks(year, month));
  weeks.push(...collectWeeks(nextYear, nextMonth));

  return weeks;
}





  // ---- Swipe vertical para cambiar mes ----
  let startY = 0;
  container.addEventListener("touchstart", e => startY = e.touches[0].clientY);
  container.addEventListener("touchend", e => {
    const delta = e.changedTouches[0].clientY - startY;
    if (delta < -80) current.setMonth(current.getMonth() + 1);
    if (delta > 80)  current.setMonth(current.getMonth() - 1);
    renderMonth();
  });

  renderMonth();
}



// ==============================================
// CSS (inject minimal styles)
// ==============================================
const style = document.createElement("style");
style.textContent = `
.habit-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0rem;
}

.habit-back {
  background: none;
  border: none;
  color: #007AFF;
  font-weight: 600;
  font-size: 1rem;
  padding: 0;
  cursor: pointer;
}

.habit-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
}

  .habit-row {
    background:#fafafa;
    border:1px solid #eee;
    padding:1rem;
    border-radius:14px;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }

  .habit-label {
    font-size:1rem;
    font-weight:600;
  }

  .habit-options {
    display:flex;
    align-items:center;
    gap:0.5rem;
  }

  .habit-opt {
    padding:0.4rem 0.8rem;
    border-radius:12px;
    border:1px solid #ddd;
    font-weight:600;
    cursor:pointer;
    transition:transform .15s ease, background .2s;
  }

  .habit-opt.selected {
    background:#111;
    color:white;
    transform:scale(1.05);
  }

  .habit-opt:not(.selected):active {
    transform:scale(0.95);
    opacity:0.7;
  }
    .trend-card {
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.05);
}

.trend-title {
  margin: 0 0 0.6rem 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #333;
}

.trend-chart {
  width: 100%;
  display: block;
  margin-bottom: 0.6rem;
}

.trend-desc {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}

`;
document.head.appendChild(style);




function calculateMedals() {
  const last30 = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    last30.push({ date: key, data: loadHabitData(key) });
  }

  let earned = JSON.parse(localStorage.getItem("earned-medals") || "{}");
  const progress = {};

  MEDALS.forEach(m => {
    if (!earned[m.key]) earned[m.key] = 0; // contador inicial

    if (m.type === "daily-score") {
      const todayScore = calculateDailyPoints(last30[0].data);
      progress[m.key] = todayScore / m.required;

      if (todayScore >= m.required) {
        earned[m.key] += 1;
      }
    }

    if (m.type === "weekly-score") {
      const weekly = calculateWeeklyPoints();
      progress[m.key] = weekly / m.required;

      if (weekly >= m.required) {
        earned[m.key] += 1;
      }
    }

    if (m.type === "streak") {
      let streak = 0;
      last30.forEach(day => {
        if (day.data[m.habit] === 1) streak++;
        else streak = 0;
      });

      progress[m.key] = streak / m.required;

      if (streak >= m.required) {
        earned[m.key] += 1;
      }
    }

    if (m.type === "count") {
      let count = 0;
      last30.forEach(day => {
        if (day.data[m.habit] === 1) count++;
      });

      progress[m.key] = count / m.required;

      if (count >= m.required) {
        earned[m.key] += 1;
      }
    }

    if (m.type === "streak-nonegative") {
      let streak = 0;
      last30.forEach(day => {
        const p = calculateDailyPoints(day.data);
        if (p >= 0) streak++;
        else streak = 0;
      });

      progress[m.key] = streak / m.required;

      if (streak >= m.required) {
        earned[m.key] += 1;
      }
    }
  });

// MEDALLAS DE ACUMULACIÓN
const totalWon = Object.values(earned).reduce((a,b) => a + b, 0);

ACCUMULATION_MEDALS.forEach(m => {
  if (!earned[m.key]) earned[m.key] = 0;

  if (totalWon >= m.required) {
    earned[m.key] = 1; // solo 1 vez
  }
});

  // Guardar cambios
  localStorage.setItem("earned-medals", JSON.stringify(earned));

  return { earned, progress };
}


function renderWeeklyDetail(weekId) {
  const weeks = getAllWeeks();
  const week = weeks.find(w => w.id === weekId);

  const total = calculateWeekScore(week);
  const avg = Math.round(total / 7);

  // Mejor día
  const bestDay = week.days.reduce((a,b) => a.score > b.score ? a : b);
  const bestDayName = new Date(bestDay.date).toLocaleDateString("es-ES", { weekday:"long" });

  // Mejoras / empeoras (vs semana anterior)
  let improved = [];
  let worsened = [];

  if (weekId < weeks.length - 1) {
    const prev = weeks[weekId+1];

    HABITS.forEach(h => {
      let currentCount = 0;
      let prevCount = 0;

      week.days.forEach(d => {
        if (d.data[h.key] === 1) currentCount++;
      });
      prev.days.forEach(d => {
        if (d.data[h.key] === 1) prevCount++;
      });

      if (currentCount > prevCount) improved.push(h.label);
      else if (currentCount < prevCount) worsened.push(h.label);
    });
  }

  // ================= TABLE =================
  let table = `
    <table style="width:100%;margin-top:1rem;border-collapse:collapse;">
      <tr>
        <th style="padding:6px;"></th>
        ${week.days.map(d => `
          <th style="padding:6px;font-size:0.85rem;">${new Date(d.date).toLocaleDateString("es-ES",{weekday:"short"})}</th>
        `).join("")}
      </tr>
  `;

  HABITS.forEach(h => {
    table += `
      <tr>
        <td style="padding:6px;font-weight:600;font-size:0.9rem;">${h.label}</td>
        ${week.days.map(d => {
          const v = d.data[h.key];
          if (v === 1)
            return `<td style="padding:6px;background:#c8ffc8;">✔</td>`;
          if (v === 0)
            return `<td style="padding:6px;background:#ffc8c8;">✖</td>`;
          return `<td style="padding:6px;background:#e0e0e0;">—</td>`;
        }).join("")}
      </tr>
    `;
  });

  table += `</table>`;

  // ================= HTML FINAL =================
  return `
  <div class="habit-header">
    <button id="backWeekList" class="habit-back">← Volver</button>
    <h2 class="habit-title">Semana ${weekId + 1}</h2>
  </div>

  <div style="background:#fff;padding:1rem;border-radius:16px;margin-bottom:1rem;border:1px solid #eee;">
    <p>Puntos totales: <strong>${total} / 7000</strong></p>
    <p>Promedio diario: <strong>${avg} pts</strong></p>
    <p>Racha positiva: <strong>${countPositiveStreak(week)} días</strong></p>
    <p>Mejor día: <strong>${bestDayName} (${bestDay.score} pts)</strong></p>

    <p style="margin-top:1rem;"><strong>Mejoraste:</strong> ${improved.length ? improved.join(", ") : "—"}</p>
    <p><strong>Empeoraste:</strong> ${worsened.length ? worsened.join(", ") : "—"}</p>
  </div>

  ${table}
  `;
}


function countPositiveStreak(week) {
  let streak = 0;
  week.days.forEach(d => {
    if (d.score > 0) streak++;
  });
  return streak;
}

function attachWeeklyDetailEvents(content) {
  const back = document.getElementById("backWeekList");
  if (back) {
    back.addEventListener("click", () => {
      showNavigationBars();
      content.innerHTML = renderWeeklySummary();
      attachHabitEvents(content);
    });
  }
}


function getWeekKey(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  return d.toISOString().slice(0,10); // lunes
}

function saveWeeklyWeight(weight) {
  const monday = getWeekKey();
  const logs = loadWeightLog();

  const imc = calculateIMC(weight);

  const existing = logs.findIndex(l => l.week === monday);
  const entry = { week: monday, weight, imc };

  if (existing >= 0) logs[existing] = entry;
  else logs.unshift(entry);

  localStorage.setItem("weightLog", JSON.stringify(logs));
}


function loadWeightLog() {
  return JSON.parse(localStorage.getItem("weightLog") || "[]");
}

function calculateIMC(weight) {
  return (weight / (USER_HEIGHT * USER_HEIGHT)).toFixed(1);
}

function classifyIMC(imc) {
  if (imc < 18.5) return { label: "Bajo peso", color: "#4fc3f7" };
  if (imc < 25)   return { label: "Normal", color: "#81c784" };
  if (imc < 30)   return { label: "Sobrepeso", color: "#ffb74d" };
  return { label: "Obesidad", color: "#e57373" };
}


function renderRegistro() {
  const logs = loadWeightLog();
  const last = logs.length ? logs[0] : null;
  const imcInfo = last ? classifyIMC(last.imc) : null;

  // Calcular variación respecto a semana pasada
  let diffHTML = "";
  if (logs.length >= 2) {
    const prev = logs[1].weight;
    const curr = logs[0].weight;
    const diff = (curr - prev).toFixed(1);

    diffHTML = `
      <p style="margin-top:0.3rem;font-weight:600;">
        ${
          diff < 0
            ? `<span style="color:#00c853;">↓ ${Math.abs(diff)} kg (bajaste)</span>`
            : diff > 0
              ? `<span style="color:#d32f2f;">↑ ${diff} kg (subiste)</span>`
              : `<span style="color:#616161;">= te mantuviste</span>`
        }
      </p>
    `;
  }

  return `
    <div class="habit-header">
      <button id="backHabits" class="habit-back">← Volver</button>
      <h2 class="habit-title">Registro personal</h2>
    </div>

    <!-- Último registro -->
    <div style="
      background:#fff;padding:1rem;border-radius:16px;
      border:1px solid #eee;margin-bottom:1rem;text-align:center;
    ">
      <h3 style="margin:0;font-size:1.3rem;">Último registro</h3>

      <p style="font-size:2rem;font-weight:700;margin:0.4rem 0;">
        ${last ? last.weight : "—"} kg
      </p>

      ${
        last
          ? `<p style="
              margin:0.5rem 0;
              font-size:1.1rem;
              font-weight:600;
              color:${imcInfo.color};
            ">
              IMC: ${last.imc} — ${imcInfo.label}
            </p>`
          : ""
      }

      ${diffHTML}
    </div>

    <!-- Registrar peso semanal -->
    <div style="
      background:#fafafa;
      padding:1rem;
      border-radius:16px;
      border:1px solid #eee;
      margin-bottom:1.5rem;
    ">
      <label style="font-weight:600;">Peso de esta semana (kg):</label>
      <input id="weightInput" type="number" step="0.1" style="
        width:100%;padding:0.8rem;border-radius:12px;
        border:1px solid #ddd;margin-top:0.5rem;
      ">
      <button id="saveWeight" style="
        width:100%;margin-top:1rem;padding:1rem;
        background:#111;color:#fff;border-radius:12px;font-weight:600;
      ">Guardar</button>
    </div>

    <h3 style="font-weight:700;margin-bottom:0.5rem;">Historial semanal</h3>

    <div>
      ${logs.map(l => {
        const imcI = classifyIMC(l.imc);
        return `
          <div style="
            padding:0.8rem;
            border-bottom:1px solid #eee;
            display:flex;
            justify-content:space-between;
          ">
            <div>
              <strong>${l.week}</strong><br>
              <span style="color:#666;">${l.weight} kg</span>
            </div>

            <div style="color:${imcI.color}; font-weight:600;">
              IMC ${l.imc}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}



function attachRegistroEvents(content) {
  const saveBtn = document.getElementById("saveWeight");
  const input = document.getElementById("weightInput");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const weight = Number(input.value);
      if (!weight) return alert("Ingresa un peso válido");

      saveWeeklyWeight(weight);
      animateAlert("Peso guardado");

      content.innerHTML = renderRegistro();
      attachRegistroEvents(content);
    });
  }

  const backBtn = document.getElementById("backHabits");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showNavigationBars();
      content.innerHTML = renderHabitsScreen();
      attachHabitEvents(content);
    });
  }
}


function refreshCalendarDayStyles() {
  document.querySelectorAll(".calendar-day").forEach(div => {
    const d = new Date(div.dataset.date);

    const isToday = d.toDateString() === new Date().toDateString();
    const isSelected =
      selectedDate && d.toDateString() === selectedDate.toDateString();

    let bg = "#f3f4f6";
    let color = "#333";

    if (isToday) bg = "#ccc";
    if (isSelected) { bg = "#000"; color = "#fff"; }

    div.style.background = bg;
    div.style.color = color;
  });
}



// --------------------------------------------
//    FUNCIÓN GLOBAL showRecipeDetail()
// --------------------------------------------
function showRecipeDetail(recipe) {
window.currentRecipeContent = document.querySelector("[data-content]");
const content = window.currentRecipeContent;
    if (!content) return alert("ERROR: No se encontró el contenedor.");

    content.innerHTML = "";

    const backBtn = document.createElement("button");
    backBtn.textContent = "← Volver";
    Object.assign(backBtn.style, {
      background: "none",
      border: "none",
      color: "#007AFF",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      marginBottom: "0.5rem"
    });

    // 🔥 VOLVER AL LISTADO CORRECTO (almuerzos o búsqueda)
    backBtn.addEventListener("click", () => {
        if (window.lastRecipeListRender) {
            window.lastRecipeListRender();
        }
    });

    content.appendChild(backBtn);

    const img = document.createElement("img");
    img.src = recipe.img;
    Object.assign(img.style, { width: "100%", borderRadius: "18px", marginBottom: "1rem" });
    content.appendChild(img);

    const title = document.createElement("h2");
    title.textContent = recipe.name;
    Object.assign(title.style, { fontSize: "1.8rem", fontWeight: "700", lineHeight: "1.4" });
    content.appendChild(title);

    const info = document.createElement("p");
    info.textContent = `${recipe.difficulty} - ${recipe.time}`;
    Object.assign(info.style, { color: "#555", marginBottom: "1.5rem", marginTop: "0.5rem" });
    content.appendChild(info);

    // ======================
    //   createExpandable()
    // ======================
    function createExpandable(title, innerHTML) {
        const container = document.createElement("div");
        container.className = "expandable-card";
        Object.assign(container.style, {
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
            marginBottom: "1rem",
            transition: "background 0.3s ease",
        });

        const header = document.createElement("div");
        Object.assign(header.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.25rem",
            fontWeight: "600",
            fontSize: "1.1rem",
            cursor: "pointer",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent"
        });

        const label = document.createElement("span");
        label.textContent = title;
        header.appendChild(label);

        const arrow = document.createElement("i");
        arrow.className = "fa-solid fa-chevron-down";
        Object.assign(arrow.style, {
            fontSize: "1rem",
            color: "#555",
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "center center"
        });
        header.appendChild(arrow);

        const body = document.createElement("div");
        Object.assign(body.style, {
            overflow: "hidden",
            padding: "10px 0px",
        });

        const innerWrapper = document.createElement("div");
        innerWrapper.innerHTML = innerHTML;
        Object.assign(innerWrapper.style, {
            transformOrigin: "top center",
            transform: "scaleY(0.6)",
            opacity: "0",
            maxHeight: "0px",
        });
        body.appendChild(innerWrapper);

        header.addEventListener("click", () => {
            const expanded = container.classList.toggle("expanded");

            if (expanded) {
                innerWrapper.style.maxHeight = "none";
                const fullHeight = innerWrapper.scrollHeight;

                innerWrapper.style.maxHeight = "0px";
                innerWrapper.style.opacity = "0";
                innerWrapper.style.transform = "scaleY(0.6)";
                void innerWrapper.offsetHeight;

                animate(innerWrapper,
                    {
                        maxHeight: [`0px`, `${fullHeight}px`],
                        opacity: [0, 1],
                        transform: ["scaleY(0.6)", "scaleY(1)"],
                    },
                    { duration: 0.28, easing: "cubic-bezier(0.2, 0.8, 0.3, 1)" }
                ).finished.then(() => {
                    innerWrapper.style.maxHeight = "none";
                    innerWrapper.style.opacity = "1";
                    innerWrapper.style.transform = "scaleY(1)";
                });

                arrow.style.transform = "rotate(180deg)";
                body.style.paddingBottom = "1rem";
            } else {
                const currentHeight = innerWrapper.scrollHeight;
                innerWrapper.style.maxHeight = `${currentHeight}px`;
                innerWrapper.style.opacity = "1";
                innerWrapper.style.transform = "scaleY(1)";
                void innerWrapper.offsetHeight;

                animate(innerWrapper,
                    {
                        maxHeight: [`${currentHeight}px`, `0px`],
                        opacity: [1, 0],
                        transform: ["scaleY(1)", "scaleY(0.6)"],
                    },
                    { duration: 0.22, easing: "cubic-bezier(0.4, 0, 0.6, 1)" }
                ).finished.then(() => {
                    innerWrapper.style.maxHeight = "0px";
                    innerWrapper.style.opacity = "0";
                    innerWrapper.style.transform = "scaleY(0.6)";
                });

                arrow.style.transform = "rotate(0deg)";
                body.style.paddingBottom = "0";
            }
        });

        container.appendChild(header);
        container.appendChild(body);
        return container;
    }

    // --- Ingredientes ---
    const ingredientsCardHTML = `
      <div style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25rem;
      ">
        ${recipe.ingredients
          .map(el => `
            <div style="
              background: #fafafa;
              border-radius: 14px;
              padding: 0.25rem;
              box-shadow: 0 1px 4px rgba(0,0,0,0.05);
              display: flex;
              align-items: center;
              gap: 0.75rem;
            ">
              <img src="${el.img}" style="
                width: 30px;
                height: 30px;
                border-radius: 10px;
                object-fit: contain;
                background: white;
                padding: 6px;
              ">
              <div style="text-align:left;">
                <span style="font-weight:600;font-size:1rem;">${el.name}</span>
                <span style="font-size:0.85rem;color:#555;">${el.qty} ${el.unit}</span>
              </div>
            </div>
          `).join("")}
      </div>
    `;
    content.appendChild(createExpandable("🧂 Ingredientes", ingredientsCardHTML));

    // --- Nutrición ---
    const nutritionCardHTML = Object.entries(recipe.nutrition || {})
      .map(([k, v]) => `
        <div style="
          display:flex;
          justify-content:space-between;
          padding:0.4rem 0;
          font-size:1rem;
          border-bottom:1px solid #f2f2f2;">
          <span>${k}</span>
          <strong>${v}</strong>
        </div>
      `).join("");
    content.appendChild(createExpandable("⚡ Valores nutricionales", nutritionCardHTML));

    // --- Pasos ---
    const btn = document.createElement("button");
    btn.textContent = "👨‍🍳 Ver preparación paso a paso";
    Object.assign(btn.style, {
      width: "100%",
      backgroundColor: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "1rem",
      marginTop: "1rem",
      cursor: "pointer",
      fontWeight: "600"
    });
    btn.addEventListener("click", () => showSteps(recipe));
    content.appendChild(btn);
}


  function showSteps(recipe) {
    content.innerHTML = "";
    const back = document.createElement("button");
    back.textContent = "← Atrás";
    Object.assign(back.style, {
      background: "none",
      border: "none",
      color: "#007AFF",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      marginBottom: "0.5rem"
    });
    back.addEventListener("click", () => showRecipeDetail(recipe));
    content.appendChild(back);

    (recipe.steps || []).forEach((step, i) => {
      const div = document.createElement("div");
      div.innerHTML = `<h3>Paso ${i + 1}</h3><p>${step}</p>`;
      Object.assign(div.style, {
        marginBottom: "1rem",
        padding: "0.5rem",
        borderBottom: "1px solid #eee"
      });
      content.appendChild(div);
    });
  }




/* ---------- Inicio ---------- */
render();


//v2