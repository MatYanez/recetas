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

        // animar salida de la bottom bar y luego eliminarla
        animate(bottomBar, { y: ["0%", "100%"], opacity: [1, 0] }, { duration: 0.4 })
          .finished
          .then(() => {
            bottomBar.remove();
          });

        // sacar la vista expandida fija que creamos arriba
        // (el primer div fijo grande: "view")
        view.remove();

        // --- Desaparecer el overlay iOS ---
if (overlay) {
  overlay.style.opacity = "0";
  setTimeout(() => overlay.remove(), 300);
}


        // restaurar header y saludo
        header.style.display = "block";
        saludo.removeAttribute("style");
        animate(saludo, { opacity: [0, 1] }, { duration: 0.5 });

        // volver a dibujar las cards iniciales
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
      const order = ["home", "calendario", "almuerzos", "compras"];
      const currentIndex = order.indexOf(sectionId);
      const previousIndex = order.indexOf(selected);
      const direction = currentIndex > previousIndex ? 1 : -1;
      selected = sectionId;

      // animación de salida del contenido anterior
      animate(
        content,
        { opacity: [1, 0], x: [0, -40 * direction] },
        { duration: 0.25 }
      ).finished.then(() => {

        // =========================
        // ====== CALENDARIO =======
        // =========================
        if (sectionId === "calendario") {
          const today = new Date();
          const monthName = today.toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          });
          const year = today.getFullYear();
          const month = today.getMonth();

          // generar días laborales del mes
          const days = [];
          const date = new Date(year, month, 1);
          while (date.getMonth() === month) {
            const day = date.getDay(); // 0=domingo
            if (day >= 1 && day <= 5) days.push(new Date(date));
            date.setDate(date.getDate() + 1);
          }

          content.innerHTML = `
            <div style="display:flex; flex-direction:column; width:100%;">
              <h2 style="font-size:1.4rem; font-weight:700; margin-bottom:1rem; text-transform:capitalize;">
                ${monthName}
              </h2>

              <div class="scroll-cal" style="
                overflow-x:auto;
                white-space:nowrap;
                scroll-behavior:smooth;
                padding-bottom:1rem;
              ">
                <div style="display:inline-flex; flex-direction:column;">
                  <!-- Encabezado de días -->
                  <div style="display:flex; gap:1rem; justify-content:flex-start; margin-bottom:0.5rem;">
                    ${days.map(d => {
                      const initials = ["D","L","M","X","J","V","S"];
                      return `<div style="min-width:50px; text-align:center; font-weight:600;">
                        ${initials[d.getDay()]}
                      </div>`;
                    }).join("")}
                  </div>

                  <!-- Números -->
                  <div style="display:flex; gap:1rem; justify-content:flex-start;">
                    ${days.map(d => {
                      const isToday = (d.toDateString() === new Date().toDateString());
                      const todayClass = isToday
                        ? "background-color:#000; color:#fff; border-radius:12px;"
                        : "";
                      return `<div style="
                        min-width:50px;
                        height:50px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-weight:600;
                        ${todayClass}">
                        ${d.getDate()}
                      </div>`;
                    }).join("")}
                  </div>
                </div>
              </div>
            </div>

           <!-- Contenido dinámico: título + imagen -->
<!-- Contenido dinámico: título + imagen -->
<div style="
  width:100%;                  /* ✅ usa todo el ancho del content */
  margin-top:1.5rem;
  text-align:left;
">
  <h3 style="
    font-size:1.8rem;
    font-weight:700;
    margin-bottom:0.75rem;
    color:#111;
    line-height:1.2;
    word-wrap:break-word;
  ">
    Carne mongoliana con arroz
  </h3>

  <div style="
    width:100%;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,0.1);
    margin-bottom:1.5rem;
    background-color:#f9f9f9;
  ">
    <img
      src="https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000554%2Fv3%2Frect.jpeg"
      alt="Carne mongoliana con arroz"
      style="
        width:100%;
        height:auto;             /* ✅ deja que ajuste proporcionalmente */
        aspect-ratio:16/9;       /* ✅ mantiene proporción sin distorsión */
        object-fit:cover;
        display:block;
      ">
  </div>
</div>

          `;

          // centrar la semana actual
          const scrollContainer = content.querySelector(".scroll-cal");
          const todayIndex = days.findIndex(
            d => d.toDateString() === new Date().toDateString()
          );
          if (todayIndex !== -1) {
            const scrollPos = todayIndex * 60 - 150;
            scrollContainer.scrollTo({ left: scrollPos, behavior: "instant" });
          }

          // bloquear swipe lateral mientras scrollea el calendario horizontal
          scrollContainer.addEventListener("touchstart", () => (swipeEnabled = false));
          scrollContainer.addEventListener("touchend", () => {
            setTimeout(() => (swipeEnabled = true), 150);
          });
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
        margin-bottom:1rem;
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

  // --- Contenido expandible ---
// body = contenedor colapsable
const body = document.createElement("div");
Object.assign(body.style, {
  overflow: "hidden",
  padding: "0 1.25rem",
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
  // 🧠 1. Ocultamos visualmente antes del cálculo
  body.style.opacity = "0";
  body.style.height = "auto";
  const fullHeight = body.scrollHeight;
  body.style.height = "0px";
  void body.offsetHeight; // reflow

  // 🪄 2. Animación mucho más natural
  animate(
    body,
    { height: [0, fullHeight], opacity: [0, 1] },
    {
      duration: 0.55,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)", // curva tipo iOS spring
    }
  ).finished.then(() => {
    body.style.height = "auto";
    body.style.opacity = "1";
  });

  // 🧭 3. Flecha con transición independiente
  arrow.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
  arrow.style.transform = "rotate(180deg)";
  body.style.paddingBottom = "1rem";
}else {
      // Medimos altura actual antes de cerrar
      const currentHeight = body.scrollHeight;
      body.style.height = `${currentHeight}px`;
      void body.offsetHeight; // reflow

      animate(
        body,
        { height: [currentHeight, 0], opacity: [1, 0] },
        { duration: 0.35, easing: "ease-in" }
      ).finished.then(() => {
        body.style.height = "0";
      });

      arrow.style.transform = "rotate(0deg)";
      body.style.paddingBottom = "0";
    }
  });

  container.appendChild(header);
  container.appendChild(body);
  return container;
}

// --- Ingredientes moderno ---
const ingredientsCardHTML = recipe.ingredients
  .map(el => `
    <div style="
      display:flex;
      align-items:center;
      gap:0.5rem;
      padding:0.4rem 0;
      font-size:1rem;
      border-bottom:1px solid #f2f2f2;
    ">
      <img src="${el.img}" alt="" style="width:22px; height:22px; object-fit:contain;">
      <span>${el.qty} ${el.unit} ${el.name}</span>
    </div>
  `).join("");
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

  const tabsOrder = ["calendario", "almuerzos", "compras"];
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




/* ---------- Inicio ---------- */
render();
