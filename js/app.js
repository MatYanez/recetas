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
    margin-left:-23px;
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
      const center = btnRect.left - barRect.left + btnRect.width / 2;
      indicator.style.left = `${center - 23}px`; // 23 = mitad de 46px
    }

    /* ---------------------------------
       CAMBIAR DE SECCIÓN / TABS / HOME
    ----------------------------------*/
    function updateView(sectionId) {
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
  content.innerHTML = renderHabitsScreen();
  attachHabitEvents(content);
  showNavigationBars();

  // 💥 REPARA EL PROBLEMA DE OPACIDAD
  animate(
    content,
    { opacity: [0, 1], x: [40, 0] },
    { duration: 0.35, easing: "ease-out" }
  );

  return;
}


        // =========================
        // ====== CALENDARIO =======
        // =========================
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
  ${weeks
    .map(
      (week) => `
      <div class="week-slide" style="
        min-width:100%;
        scroll-snap-align:center;
        padding:0 0.5rem;
        display:flex;
        flex-direction:column;
        gap:0.5rem;
      ">
        
        <!-- ENCABEZADO Y DÍAS TODO EN EL MISMO BLOQUE -->
        <div style="
          display:grid;
          grid-template-columns:repeat(5, 1fr);
          text-align:center;
          font-weight:600;
          gap:1rem;
        ">
          <span>L</span>
          <span>M</span>
          <span>X</span>
          <span>J</span>
          <span>V</span>
        </div>

        <!-- NÚMEROS ALINEADOS PERFECTAMENTE A LO MISMO -->
        <div style="
          display:grid;
          grid-template-columns:repeat(5, 1fr);
          text-align:center;
                    gap:1rem;
        ">
          ${week
            .map((d) => {
              const isToday =
                d && d.toDateString() === new Date().toDateString();
              return `
                <div style="
                  width:100%;
                  height:50px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  background:${isToday ? "#000" : "#f3f4f6"};
                  color:${isToday ? "#fff" : "#333"};
                  border-radius:12px;
                  font-weight:600;
                ">
                  ${d ? d.getDate() : ""}
                </div>
              `;
            })
            .join("")}
        </div>

      </div>
    `
    )
    .join("")}
</div>
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

  function getWeeksOfMonth(year, month) {
    const weeks = [];
    const date = new Date(year, month, 1);

    while (date.getDay() !== 1) date.setDate(date.getDate() - 1);

    while (true) {
      const start = new Date(date);
      date.setDate(date.getDate() + 4);
      const end = new Date(date);

      weeks.push({ start, end });

      date.setDate(date.getDate() + 3);

      if (date.getMonth() !== month) break;
    }

    return weeks;
  }

  let weeks = getWeeksOfMonth(currentYear, currentMonth);

  const weekCarousel = document.createElement("div");
  weekCarousel.id = "weekSelector";
  Object.assign(weekCarousel.style, {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    gap: "1rem",
    paddingBottom: "1rem",
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
    });

    card.innerHTML = `
      <h3 style="font-size:1.7rem;font-weight:600;">Semana ${i + 1}</h3>
      <p style="font-size:1rem; color:#555;">${start} – ${end}</p>
    `;

    weekCarousel.appendChild(card);
  });

  screen.appendChild(weekCarousel);


  // =====================================================
  // ============ 3 BLOQUES PARA SELECCIONAR COMIDA ======
  // =====================================================

  const mealsContainer = document.createElement("div");
  mealsContainer.style.display = "flex";
  mealsContainer.style.flexDirection = "column";
  mealsContainer.style.gap = "1rem";

  function createMealBlock() {
    const box = document.createElement("div");
    Object.assign(box.style, {
      border: "2px dashed #ccc",
      borderRadius: "14px",
      padding: "1rem",
      height: "70px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      color: "#777",
    });

    box.textContent = "Seleccionar comida";

    box.addEventListener("click", () => openMealSelector(box));

    return box;
  }

  const mealBox1 = createMealBlock();
  const mealBox2 = createMealBlock();
  const mealBox3 = createMealBlock();

  mealsContainer.appendChild(mealBox1);
  mealsContainer.appendChild(mealBox2);
  mealsContainer.appendChild(mealBox3);

  screen.appendChild(mealsContainer);


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
                targetBox.textContent = r.name;
                targetBox.style.color = "#000";
                targetBox.style.border = "2px solid #000";

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
        // =========================
        // ====== ALMUERZOS ========
        // =========================
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
        showRecipeDetail(list[i]);
      });
    });
  }

  // --- Detalle de receta ---
  function showRecipeDetail(recipe) {
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
    backBtn.addEventListener("click", renderRecipes);
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
    Object.assign(info.style, { color: "#555", marginBottom: "1.5rem" , marginTop: "0.5rem"});
    content.appendChild(info);

  

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

  // --- Flecha moderna Font Awesome ---
  const arrow = document.createElement("i");
  arrow.className = "fa-solid fa-chevron-down";
  Object.assign(arrow.style, {
    fontSize: "1rem",
    color: "#555",
    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    transformOrigin: "center center"
  });
  header.appendChild(arrow);

// body = contenedor colapsable
const body = document.createElement("div");
Object.assign(body.style, {
  overflow: "hidden",
  padding: "10px 0px",
});

// innerWrapper = contenido real animable
const innerWrapper = document.createElement("div");
innerWrapper.innerHTML = innerHTML;
Object.assign(innerWrapper.style, {
  transformOrigin: "top center",
  transform: "scaleY(0.6)",
  opacity: "0",
  maxHeight: "0px",
});
body.appendChild(innerWrapper);

  // --- Acción al hacer click ---
header.addEventListener("click", () => {
  const expanded = container.classList.toggle("expanded");

  if (expanded) {
    // Calculamos altura natural del contenido
    // forzamos altura auto para medir
    innerWrapper.style.maxHeight = "none";
    const fullHeight = innerWrapper.scrollHeight;

    // estado inicial para animación
    innerWrapper.style.maxHeight = "0px";
    innerWrapper.style.opacity = "0";
    innerWrapper.style.transform = "scaleY(0.6)";
    void innerWrapper.offsetHeight; // reflow

    // animación de despliegue suave tipo iOS
    animate(
      innerWrapper,
      {
        maxHeight: [`0px`, `${fullHeight}px`],
        opacity: [0, 1],
        transform: ["scaleY(0.6)", "scaleY(1)"],
      },
      {
        duration: 0.28,
        easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
      }
    ).finished.then(() => {
      // fijar estado final estable
      innerWrapper.style.maxHeight = "none";
      innerWrapper.style.opacity = "1";
      innerWrapper.style.transform = "scaleY(1)";
    });

    // flecha rota
    arrow.style.transition = "transform 0.28s cubic-bezier(0.2, 0.8, 0.3, 1)";
    arrow.style.transform = "rotate(180deg)";

    // padding inferior solo cuando está abierto
    body.style.paddingBottom = "1rem";

  } else {
    // volvemos a una altura fija actual para poder animar a 0
    const currentHeight = innerWrapper.scrollHeight;
    innerWrapper.style.maxHeight = `${currentHeight}px`;
    innerWrapper.style.opacity = "1";
    innerWrapper.style.transform = "scaleY(1)";
    void innerWrapper.offsetHeight; // reflow

    // animación de colapso
    animate(
      innerWrapper,
      {
        maxHeight: [`${currentHeight}px`, `0px`],
        opacity: [1, 0],
        transform: ["scaleY(1)", "scaleY(0.6)"],
      },
      {
        duration: 0.22,
        easing: "cubic-bezier(0.4, 0, 0.6, 1)",
      }
    ).finished.then(() => {
      // estado final cerrado
      innerWrapper.style.maxHeight = "0px";
      innerWrapper.style.opacity = "0";
      innerWrapper.style.transform = "scaleY(0.6)";
    });

    arrow.style.transition = "transform 0.22s cubic-bezier(0.4, 0, 0.6, 1)";
    arrow.style.transform = "rotate(0deg)";

    body.style.paddingBottom = "0";
  }
});


  container.appendChild(header);
  container.appendChild(body);
  return container;
}

// --- Ingredientes moderno ---
// --- Ingredientes moderno (2 columnas, imagen + nombre arriba, medida abajo) ---
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
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        "
        onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';"
        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 1px 4px rgba(0,0,0,0.05)';"
        >
          <img src="${el.img}" alt="${el.name}" style="
            width: 30px;
            height: 30px;
            border-radius: 10px;
            object-fit: contain;
            background: white;
            padding: 6px;
          ">
          <div style="display:flex; flex-direction:column; justify-content:center; text-align:left;">
            <span style="
              font-weight:600;
              font-size:1rem;
              color:#222;
              line-height:1.2;
            ">${el.name}</span>
            <span style="
              font-size:0.85rem;
              color:#555;
              margin-top:2px;
            ">${el.qty} ${el.unit}</span>
          </div>
        </div>
      `)
      .join("")}
  </div>
`;

content.appendChild(createExpandable("🧂 Ingredientes", ingredientsCardHTML));

// --- Nutrición moderno ---
const nutritionCardHTML = Object.entries(recipe.nutrition || {})
  .map(([k, v]) => `
    <div style="
      display:flex;
      justify-content:space-between;
      padding:0.4rem 0;
      font-size:1rem;
      border-bottom:1px solid #f2f2f2;
    ">
      <span style="text-transform:capitalize;">${k}</span>
      <strong>${v}</strong>
    </div>
  `).join("");
content.appendChild(createExpandable("⚡ Valores nutricionales", nutritionCardHTML));

    // --- Botón pasos ---
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



// ---------- UTILS ----------
function getToday() {
  return new Date().toISOString().slice(0,10);
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
    const d = day.data;
    let pts = 0;

    if (d.water >= 1.5) pts += 10;
    if (d.sweets === 0) pts += 10;
    if (d.sugarDrinks === 0) pts += 10;
    if (d.energy >= 7) pts += 10;
    if (d.exercise >= 20) pts += 10;

    total += pts;
  });

  const avg = Math.round((total / (7 * 50)) * 100);
  return isNaN(avg) ? 0 : avg;
}

function getScoreColor(score) {
  if (score < 40) return { color: "#ff7676", label: "Deficiente" };
  if (score < 70) return { color: "#ffd76a", label: "Regular" };
  return { color: "#9cff8f", label: "Muy bien" };
}

// ---------- MAIN SCREEN ----------
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
      <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1rem;">Tu puntaje semanal</h3>

      <div style="
        width:120px;
        height:120px;
        margin:0 auto 0.5rem;
        border-radius:999px;
        background:${color};
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        font-weight:700;
      ">
        <span style="font-size:1.8rem;">${score}</span>
        <span style="font-size:0.9rem;">pts</span>
      </div>

      <p style="font-size:1.1rem; font-weight:600; color:#333;">${label}</p>
    </div>

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

      <button class="habit-nav" data-go="goals" style="
        width:100%; text-align:left;
        padding:1rem; border-radius:14px;
        background:#f3f4f6; border:none; font-weight:600;
      ">🎯 Metas personales →</button>

    </div>
  `;
}



// ---------- WEEKLY SUMMARY ----------
function renderWeeklySummary() {
  const week = getLast7Days();

  return `
<div class="habit-header">
  <button id="backHabits" class="habit-back">← Volver</button>
  <h2 class="habit-title">Resumen semanal</h2>
</div>


    ${week
      .map(day => `
        <div style="
          background:#fafafa; padding:1rem;
          border-radius:14px; margin-bottom:0.8rem;
          border:1px solid #eee;
        ">
          <strong>${day.date}</strong><br>
          Agua: ${day.data.water ?? 0} L<br>
          Dulces: ${day.data.sweets ?? 0}<br>
          Bebidas: ${day.data.sugarDrinks ?? 0}<br>
          Energía: ${day.data.energy ?? 0}<br>
          Ejercicio: ${day.data.exercise ?? 0} min
        </div>
      `)
      .join("")}
  `;
}

// ---------- PLACEHOLDERS ----------
function renderTrends() {
  return `
<div class="habit-header">
  <button id="backHabits" class="habit-back">← Volver</button>
  <h2 class="habit-title">Tendencias</h2>
</div>

  `;
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
        return;
      }

      if (go === "goals") {
        hideNavigationBars();
        content.innerHTML = renderGoals();
        attachHabitEvents(content);
        return;
      }
    });
  });

  const backBtn = document.getElementById("backHabits");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showNavigationBars();
      content.innerHTML = renderHabitsScreen();
      attachHabitEvents(content);
    });
  }
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
  { key: "water", label: "💧 Tomé 1.5 L de agua", yes: 10, no: 0 },
  { key: "sweets", label: "🍬 Comí dulces", yes: 0,  no: 10 },
  { key: "sugarDrinks", label: "🥤 Bebida azucarada", yes: 0, no: 10 },
  { key: "energy7", label: "⚡ Energía ≥ 7", yes: 10, no: 0 },
  { key: "exercise20", label: "🏃 Ejercicio ≥ 20 min", yes: 10, no: 0 }
];

function renderDailyHabits() {
  const today = getToday();
  const saved = loadHabitData(today);

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



    <div id="dailyTable" style="display:flex;flex-direction:column;gap:1rem;">
      ${rows}
    </div>

    <div id="dailyScore" style="
      margin-top:1.5rem;
      font-size:1.2rem;
      font-weight:700;
      text-align:center;
    ">
      Puntaje de hoy: 0 / 50
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
  let data = loadHabitData(today);

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
    saveHabitData(today, data);
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

  const el = document.getElementById("dailyScore");
  if (el) el.textContent = `Puntaje de hoy: ${total} / 50`;
}

// ===============================================
// CSS (inject minimal styles)
// ===============================================
const style = document.createElement("style");
style.textContent = `
.habit-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
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
`;
document.head.appendChild(style);














/* ---------- Inicio ---------- */
render();
