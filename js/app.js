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

    /* ---------------------------------
       CREAMOS LA VISTA EXPANDIDA COMPLETA
    ----------------------------------*/

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

    // --- Contenido central scrollable ---
    const content = document.createElement("div");
    Object.assign(content.style, {
      backgroundColor: "#fff",
      flex: "1",
      padding: "1.5rem 1.5rem 5rem 1.5rem", // espacio para bottom bar
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
      <div id="indicator"></div>
    `;
    document.body.appendChild(bottomBar);

    // --- Indicador pill detrás del tab activo ---
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

            <!-- Contenido dinámico (la comida del día) -->
            <div style="
              width:100%;
              margin-top:1rem;
              text-align:left;
            ">
              <h3 style="
                font-size:2rem;
                font-weight:700;
                margin-bottom:0.75rem;
                color:#222;
                line-height:1;
              ">
                Carne mongoliana con arroz
              </h3>

              <div style="
                width:100%;
                height:220px;
                border-radius:20px;
                overflow:hidden;
                box-shadow:0 4px 15px rgba(0,0,0,0.1);
                margin-bottom:1rem;
                background-color:#f9f9f9;
                display:flex;
                align-items:center;
                justify-content:center;
              ">
                <img src="https://storage.googleapis.com/fitia_recipe_images/GR-R-V-00000554%2Fv3%2Frect.jpeg"
                  alt="Carne mongoliana con arroz"
                  style="
                    width:100%;
                    height:100%;
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
              time: "30 min"
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
              padding:0.75rem 1.5rem;
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
        let startX = 0;
        let endX = 0;
        let touchStartTime = 0;

        content.ontouchstart = (e) => {
          startX = e.touches[0].clientX;
          touchStartTime = Date.now();
        };
        content.ontouchmove = (e) => {
          endX = e.touches[0].clientX;
        };
        content.ontouchend = () => {
          if (!swipeEnabled) return;
          const delta = endX - startX;
          const tabs = ["calendario", "almuerzos", "compras"];
          const current = tabs.indexOf(sectionId);
          const moved = Math.abs(delta) > 60;
          const holdTime = Date.now() - touchStartTime;

          if (moved && holdTime < 500) {
            if (delta < 0 && current < tabs.length - 1) {
              const next = tabs[current + 1];
              const nextBtn = [...items].find(b => b.dataset.id === next);
              moveIndicatorTo(nextBtn);
              updateView(next);
            } else if (delta > 0 && current > 0) {
              const prev = tabs[current - 1];
              const prevBtn = [...items].find(b => b.dataset.id === prev);
              moveIndicatorTo(prevBtn);
              updateView(prev);
            }
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
