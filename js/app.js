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
  padding: "1.5rem 1.5rem 8rem 1.5rem",
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
      topBar.innerHTML = `<h2 style="font-size:1.5rem;font-weight:700;">${section.title}</h2>`;
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
          const recipes = [
            {
  name: "Carne mongoliana con arroz",
  img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000554%2Fv3%2Frect.jpeg",
  difficulty: "Fácil",
  time: "30 min",
  ingredients: [
    {
      name: "Carne de res",
      qty: 250,
      unit: "g",
      img: "https://cdn-icons-png.flaticon.com/512/1046/1046769.png"
    },
    {
      name: "Arroz blanco",
      qty: 1,
      unit: "taza",
      img: "https://cdn-icons-png.flaticon.com/512/590/590836.png"
    },
    {
      name: "Salsa de soja",
      qty: 2,
      unit: "cda",
      img: "https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
    },
    {
      name: "Cebollín",
      qty: 1,
      unit: "unidad",
      img: "https://cdn-icons-png.flaticon.com/512/765/765447.png"
    }
  ]
},
            {
              name: "Pollo teriyaki",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000546%2Fv3%2Frect.jpeg",
              difficulty: "Medio",
              time: "40 min"
            },
            {
              name: "Pasta carbonara",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000215%2Fv3%2Frect.jpeg",
              difficulty: "Fácil",
              time: "25 min"
            },
            {
              name: "Salmón con verduras",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000123%2Fv3%2Frect.jpeg",
              difficulty: "Difícil",
              time: "50 min"
            },
            {
              name: "Ensalada César",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000522%2Fv3%2Frect.jpeg",
              difficulty: "Fácil",
              time: "15 min"
            },
            {
              name: "Bowl de quinoa",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000333%2Fv3%2Frect.jpeg",
              difficulty: "Medio",
              time: "35 min"
            },
            {
              name: "Tacos de carne",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000190%2Fv3%2Frect.jpeg",
              difficulty: "Medio",
              time: "30 min"
            },
            {
              name: "Paella tradicional",
              img: "https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000101%2Fv3%2Frect.jpeg",
              difficulty: "Difícil",
              time: "120 min"
            }
          ];

          content.innerHTML = `
            <!-- Buscador -->
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

            <!-- Grilla de recetas -->
            <div id="recipesGrid" style="
              display:grid;
              grid-template-columns:repeat(2, 1fr);
              gap:1rem;
              padding-bottom:2rem;
              height:auto;
            ">
              ${recipes.map(r => `
                <div style="
                  background:#fff;
                  border-radius:18px;
                  box-shadow:0 4px 15px rgba(0,0,0,0.08);
                  overflow:hidden;
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
                    background-color:#f9f9f9;
                  ">
                    <img src="${r.img}" alt="${r.name}" style="
                      width:100%;
                      height:100%;
                      object-fit:cover;
                      display:block;
                    ">
                  </div>
                  <div style="padding:0.75rem 0.75rem 1rem 0.75rem;">
                    <h3 style="
                      font-size:1rem;
                      font-weight:700;
                      color:#222;
                      margin-bottom:0.5rem;
                      height:2.4rem;
                      line-height:1.2rem;
                      overflow:hidden;
                      text-overflow:ellipsis;
                      display:-webkit-box;
                      -webkit-line-clamp:2;
                      -webkit-box-orient:vertical;
                    ">
                      ${r.name}
                    </h3>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="
                        font-size:0.8rem;
                        background-color:#f3f4f6;
                        color:#555;
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

          // búsqueda dinámica
          const searchInput = content.querySelector("#searchInput");
          const recipesGrid = content.querySelector("#recipesGrid");

          searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = recipes.filter(r => r.name.toLowerCase().includes(query));

            recipesGrid.innerHTML = filtered.map(r => `
              <div style="
                background:#fff;
                border-radius:18px;
                box-shadow:0 4px 15px rgba(0,0,0,0.08);
                overflow:hidden;
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
                  background-color:#f9f9f9;
                ">
                  <img src="${r.img}" alt="${r.name}" style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    display:block;
                  ">
                </div>
                <div style="padding:0.75rem 0.75rem 1rem 0.75rem;">
                  <h3 style="
                    font-size:1rem;
                    font-weight:700;
                    color:#222;
                    margin-bottom:0.5rem;
                    height:2.4rem;
                    line-height:1.2rem;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    display:-webkit-box;
                    -webkit-line-clamp:2;
                    -webkit-box-orient:vertical;
                  ">${r.name}</h3>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="
                      font-size:0.8rem;
                      background-color:#f3f4f6;
                      color:#555;
                      padding:3px 8px;
                      border-radius:8px;
                    ">${r.difficulty}</span>
                    <span style="font-size:0.8rem; color:#777;">${r.time}</span>
                  </div>
                </div>
              </div>
            `).join("");
          });
            // --- Abrir detalle de receta ---
  recipesGrid.querySelectorAll("div").forEach((cardEl, i) => {
    cardEl.addEventListener("click", () => {
      const recipe = recipes[i];
      showRecipeDetail(recipe);
    });
  });
        // --- Función para mostrar el detalle de la receta ---
  function showRecipeDetail(recipe) {
    // Limpia el contenido actual
    content.innerHTML = "";
swipeEnabled = false; // 👈 bloquea el swipe lateral mientras estás en el detalle
    // --- Contenedor principal del detalle ---
    const detail = document.createElement("div");
    Object.assign(detail.style, {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "1rem",
      animation: "fadeIn 0.4s ease"
    });

    // --- Botón volver ---
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
backBtn.addEventListener("click", () => {
  swipeEnabled = true; // 👈 reactiva el swipe cuando volvés al listado
  updateView("almuerzos");
});
    detail.appendChild(backBtn);

    // --- Imagen principal ---
    const img = document.createElement("img");
    img.src = recipe.img;
    img.alt = recipe.name;
    Object.assign(img.style, {
      width: "100%",
      borderRadius: "18px",
      objectFit: "cover",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    });
    detail.appendChild(img);

    // --- Nombre del plato ---
    const title = document.createElement("h2");
    title.textContent = recipe.name;
    Object.assign(title.style, {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#111",
      marginTop: "1rem"
    });
    detail.appendChild(title);

    // --- Datos principales ---
    const info = document.createElement("div");
    info.innerHTML = `
      <p><strong>Tiempo total:</strong> 35 minutos</p>
      <p><strong>Tiempo de elaboración:</strong> 15 minutos</p>
      <p><strong>Dificultad:</strong> ${recipe.difficulty}</p>
    `;
    Object.assign(info.style, {
      fontSize: "1rem",
      color: "#444",
      lineHeight: "1.5"
    });
    detail.appendChild(info);


    // --- Estado interno para las porciones ---
    let servings = 1; // default 1 porción

function createSection({ title, bodyBuilder, collapsible = true }) {
  const container = document.createElement("div");
  Object.assign(container.style, {
    width: "100%",
    borderRadius: "14px",
    background: "#f8f8f8",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    overflow: "hidden",
  });

  // Header
  const headerRow = document.createElement("div");
  Object.assign(headerRow.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    fontWeight: "600",
    color: "#111",
    fontSize: "1.1rem",
    userSelect: "none",
    cursor: collapsible ? "pointer" : "default",
    borderRadius: "10px",
    backgroundColor: "#ededed",
  });

  const titleText = document.createElement("span");
  titleText.textContent = title;

  const arrow = document.createElement("span");
  arrow.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
      viewBox="0 0 24 24" stroke-width="2" stroke="#555"
      width="20" height="20">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M6 9l6 6 6-6" />
    </svg>
  `;
  Object.assign(arrow.style, {
    display: "inline-flex",
    transition: "transform 0.25s ease",
  });

  headerRow.appendChild(titleText);
  headerRow.appendChild(arrow);

  const bodyWrap = document.createElement("div");
  Object.assign(bodyWrap.style, {
    maxHeight: collapsible ? "0px" : "none",
    overflow: "hidden",
    transition: collapsible ? "max-height 0.3s ease" : "none",
    marginTop: "0.5rem",
    color: "#333",
    lineHeight: "1.5",
  });

  // bodyBuilder ahora puede devolver una función opcional postRender()
  // que se ejecuta DESPUÉS de que tengamos la sección creada.
  let postRender = null;
  if (typeof bodyBuilder === "function") {
    postRender = bodyBuilder(bodyWrap) || null;
  }

  if (collapsible) {
    headerRow.addEventListener("click", () => {
      const isClosed = bodyWrap.style.maxHeight === "0px" || !bodyWrap.style.maxHeight;
      if (isClosed) {
        bodyWrap.style.maxHeight = bodyWrap.scrollHeight + "px";
        arrow.style.transform = "rotate(180deg)";
      } else {
        bodyWrap.style.maxHeight = "0px";
        arrow.style.transform = "rotate(0deg)";
      }
    });
  } else {
    arrow.style.display = "none";
  }

  container.appendChild(headerRow);
  container.appendChild(bodyWrap);
  detail.appendChild(container);

  return { container, bodyWrap, arrow, headerRow, postRender };
}

// ---------- Sección: Ingredientes ----------
const ingredientesSection = createSection({
  title: "Ingredientes",
  bodyBuilder: (wrapEl) => {
    // construimos DOM local y devolvemos una función postRender()
    // que sabrá quién es ingredientesSection

    // fila selector porciones
    const servingsRow = document.createElement("div");
    Object.assign(servingsRow.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1rem",
      gap: "0.75rem",
      flexWrap: "wrap",
    });

    const servingsLabel = document.createElement("span");
    servingsLabel.textContent = "Porciones:";
    Object.assign(servingsLabel.style, {
      fontSize: "0.95rem",
      fontWeight: "500",
      color: "#444",
    });

    const servingsSelector = document.createElement("div");
    Object.assign(servingsSelector.style, {
      display: "flex",
      gap: "0.5rem",
    });

    // grid contenedor de ingredientes
    const grid = document.createElement("div");
    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0,1fr))",
      gap: "0.75rem 0.75rem",
      width: "100%",
    });

    // agregamos al wrap
    servingsRow.appendChild(servingsLabel);
    servingsRow.appendChild(servingsSelector);
    wrapEl.appendChild(servingsRow);
    wrapEl.appendChild(grid);

    // devolvemos la función postRender que ya puede usar ingredientesSection
    return function postRenderIngredientes() {
      function renderIngredientsGrid() {
        grid.innerHTML = "";

        const list = recipe.ingredients || [];
        list.forEach((ing) => {
          const item = document.createElement("div");
          Object.assign(item.style, {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "0.6rem 0.6rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.03)",
            minHeight: "64px",
          });

          const thumb = document.createElement("img");
          thumb.src = ing.img;
          thumb.alt = ing.name;
          Object.assign(thumb.style, {
            width: "25px",
            height: "25px",
            borderRadius: "10px",
            objectFit: "cover",
            backgroundColor: "#f3f4f6",
            flexShrink: "0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          });

          const textWrap = document.createElement("div");
          Object.assign(textWrap.style, {
            display: "flex",
            flexDirection: "column",
            lineHeight: "1.2",
            flexGrow: "1",
          });

          const nameEl = document.createElement("div");
          nameEl.textContent = ing.name;
          Object.assign(nameEl.style, {
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#111",
            marginBottom: "0.25rem",
          });

          const qtyEl = document.createElement("div");
          const scaledQty = ing.qty * servings;
          qtyEl.textContent = `${scaledQty} ${ing.unit}`;
          Object.assign(qtyEl.style, {
            fontSize: "0.8rem",
            fontWeight: "500",
            color: "#555",
          });

          textWrap.appendChild(nameEl);
          textWrap.appendChild(qtyEl);

          item.appendChild(thumb);
          item.appendChild(textWrap);
          grid.appendChild(item);
        });

        // ahora ingredientesSection ya existe
        const isOpen = ingredientesSection.bodyWrap.style.maxHeight !== "0px";
        if (isOpen) {
          ingredientesSection.bodyWrap.style.maxHeight =
            ingredientesSection.bodyWrap.scrollHeight + "px";
        }
      }

      // armar los botones de porciones AHORA que ya tenemos contexto
      servingsSelector.innerHTML = "";
      for (let i = 1; i <= 4; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        Object.assign(btn.style, {
          minWidth: "2.25rem",
          height: "2.25rem",
          borderRadius: "10px",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.06)",
          backgroundColor: i === servings ? "#111" : "#fff",
          color: i === servings ? "#fff" : "#111",
          fontWeight: "600",
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        });

        btn.addEventListener("click", () => {
          servings = i;
          [...servingsSelector.children].forEach(ch => {
            ch.style.backgroundColor = "#fff";
            ch.style.color = "#111";
          });
          btn.style.backgroundColor = "#111";
          btn.style.color = "#fff";

          renderIngredientsGrid();
        });

        servingsSelector.appendChild(btn);
      }

      // primer render
      renderIngredientsGrid();

      // lo dejo colgado en la sección por si más tarde quieres reusar
      ingredientesSection.renderIngredientsGrid = renderIngredientsGrid;
    }; // end postRenderIngredientes
  },
  collapsible: true,
});

if (typeof ingredientesSection.postRender === "function") {
  ingredientesSection.postRender();
}

    // ---------- Sección: Valores nutricionales ----------
    createSection({
      title: "Valores nutricionales",
      bodyBuilder: (wrapEl) => {
        wrapEl.innerHTML = `
          <p style="font-size:1rem; color:#444; line-height:1.5;">
            Calorías: 520 kcal<br>
            Proteínas: 35 g<br>
            Grasas: 12 g<br>
            Carbohidratos: 55 g
          </p>
        `;
      },
      collapsible: true,
    });

// ---------- Sección: Preparación ----------
const preparacionBtn = document.createElement("button");
preparacionBtn.textContent = "👨‍🍳 Ver preparación paso a paso";
Object.assign(preparacionBtn.style, {
  width: "100%",
  backgroundColor: "#111",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  padding: "1rem",
  fontSize: "1.1rem",
  fontWeight: "600",
  marginTop: "0.5rem",
  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  cursor: "pointer",
  transition: "transform 0.2s ease, background-color 0.3s ease",
});
preparacionBtn.addEventListener("mousedown", () => {
  preparacionBtn.style.transform = "scale(0.97)";
});
preparacionBtn.addEventListener("mouseup", () => {
  preparacionBtn.style.transform = "scale(1)";
});
preparacionBtn.addEventListener("click", () => {
  showStepByStep(recipe);
});

detail.appendChild(preparacionBtn);



    // Añade el bloque completo
    content.appendChild(detail);
  }
  
function showStepByStep(recipe) {
  // limpiamos el content actual
  const content = document.querySelector(".view-content") || document.querySelector("div[style*='overflow-y']");
  if (!content) return;

  // guardamos scroll previo (opcional)
  const previousScroll = content.scrollTop;

  // limpiamos y preparamos pantalla de pasos
  content.innerHTML = "";
  content.scrollTo({ top: 0 });

  // --- Contenedor principal ---
  const stepsView = document.createElement("div");
  Object.assign(stepsView.style, {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    width: "100%",
    padding: "1rem 0.5rem 4rem 0.5rem",
    position: "relative",
    animation: "fadeIn 0.4s ease",
  });

 // --- Barra superior estilo iOS (con blur y botones alineados) ---
const topBar = document.createElement("div");
Object.assign(topBar.style, {
  position: "sticky",
  top: "0",
  zIndex: "15",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75rem 1rem",
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 1px 8px rgba(0,0,0,0.08)",
  borderRadius: "0 0 16px 16px",
});

const backBtn = document.createElement("button");
backBtn.textContent = "← Atrás";
Object.assign(backBtn.style, {
  background: "none",
  border: "none",
  color: "#007AFF",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  padding: "0.4rem 0.75rem",
  borderRadius: "10px",
  transition: "background-color 0.2s ease",
});
backBtn.addEventListener("mouseover", () => {
  backBtn.style.backgroundColor = "rgba(0,0,0,0.05)";
});
backBtn.addEventListener("mouseout", () => {
  backBtn.style.backgroundColor = "transparent";
});
backBtn.addEventListener("click", () => {
  content.innerHTML = "";
  showRecipeDetail(recipe);
  content.scrollTo({ top: previousScroll });
});

const ingredientsBtn = document.createElement("button");
ingredientsBtn.textContent = "🧂 Ingredientes";
Object.assign(ingredientsBtn.style, {
  background: "none",
  border: "none",
  color: "#007AFF",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  padding: "0.4rem 0.75rem",
  borderRadius: "10px",
  transition: "background-color 0.2s ease",
});
ingredientsBtn.addEventListener("mouseover", () => {
  ingredientsBtn.style.backgroundColor = "rgba(0,0,0,0.05)";
});
ingredientsBtn.addEventListener("mouseout", () => {
  ingredientsBtn.style.backgroundColor = "transparent";
});
ingredientsBtn.addEventListener("click", () => {
  showIngredientsOverlay(recipe);
});

topBar.appendChild(backBtn);
topBar.appendChild(ingredientsBtn);
stepsView.appendChild(topBar);


  // --- Lista de pasos ---
  const steps = [
    "Calentar la sartén a fuego medio con una cucharadita de aceite.",
    "Agregar la carne y cocinar por 10 minutos hasta que esté dorada.",
    "Añadir la salsa de soja y cebollín picado, mezclar bien.",
    "Servir con arroz blanco recién hecho.",
  ];

  steps.forEach((text, i) => {
    const stepDiv = document.createElement("div");
    Object.assign(stepDiv.style, {
      padding: "1rem 0.5rem",
      borderBottom: "1px solid #eee",
    });

    const title = document.createElement("h3");
    title.textContent = `Paso ${i + 1}`;
    Object.assign(title.style, {
      fontSize: "3rem",
      fontWeight: "700",
      marginBottom: "0.5rem",
      color: "#111",
      textAlign: "center",    });

    const desc = document.createElement("p");
    desc.textContent = text;
    Object.assign(desc.style, {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: "#444",
    });

    stepDiv.appendChild(title);
    stepDiv.appendChild(desc);
    stepsView.appendChild(stepDiv);

    animate(stepDiv, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: i * 0.1 });
  });

  content.appendChild(stepsView);
}

function showIngredientsOverlay(recipe) {
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "100",
  });

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "#fff",
    borderRadius: "16px",
    width: "85%",
    maxHeight: "80%",
    overflowY: "auto",
    padding: "1.5rem",
    boxShadow: "0 5px 25px rgba(0,0,0,0.3)",
    animation: "fadeInUp 0.3s ease",
  });

  const title = document.createElement("h2");
  title.textContent = "Ingredientes";
  Object.assign(title.style, {
    fontSize: "1.4rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textAlign: "center",
  });

  const list = document.createElement("ul");
  Object.assign(list.style, {
    listStyle: "none",
    padding: "0",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  });

  (recipe.ingredients || []).forEach((ing) => {
    const li = document.createElement("li");
    Object.assign(li.style, {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      background: "#f8f8f8",
      borderRadius: "12px",
      padding: "0.6rem 0.8rem",
    });

    const img = document.createElement("img");
    img.src = ing.img;
    Object.assign(img.style, {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      objectFit: "cover",
    });

    const text = document.createElement("span");
    text.textContent = `${ing.qty} ${ing.unit} ${ing.name}`;
    Object.assign(text.style, {
      fontSize: "1rem",
      color: "#333",
    });

    li.appendChild(img);
    li.appendChild(text);
    list.appendChild(li);
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Cerrar";
  Object.assign(closeBtn.style, {
    marginTop: "1.2rem",
    width: "100%",
    padding: "0.7rem",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  });
  closeBtn.addEventListener("click", () => overlay.remove());

  modal.appendChild(title);
  modal.appendChild(list);
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
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
