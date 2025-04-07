async function cargarRecetas() {
    const res = await fetch("data/recetas.json");
    return await res.json();
  }
  
  function getImagen(nombre) {
    return `https://source.unsplash.com/80x80/?${encodeURIComponent(nombre)}`;
  }
  
  function getNumeroSemana(fechaStr) {
    const fecha = new Date(fechaStr);
    const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const offset = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;
    return Math.ceil((fecha.getDate() + offset) / 7);
  }
  
  function agruparPorSemana(eventos) {
    const semanas = {};
    eventos.forEach(ev => {
      const semana = getNumeroSemana(ev.start);
      if (!semanas[semana]) semanas[semana] = [];
      semanas[semana].push(ev);
    });
    return semanas;
  }
  
  function renderizarTabs(semanas, callback) {
    const semanaTabs = document.getElementById("semanaTabs");
    semanaTabs.innerHTML = "";
  
    Object.keys(semanas).sort().forEach((semana, idx) => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary semana-btn";
      btn.textContent = `Semana ${semana}`;
      btn.onclick = () => callback(semana);
      semanaTabs.appendChild(btn);
      if (idx === 0) setTimeout(() => callback(semana), 10);
    });
  }
  
  function renderIngredientes(semana, eventos, recetas) {
    const listaIngredientes = document.getElementById("listaIngredientes");
    document.querySelectorAll(".semana-btn").forEach(b => b.classList.remove("active"));
    [...document.getElementById("semanaTabs").children].find(b => b.textContent.includes(`Semana ${semana}`))?.classList.add("active");
  
    const eventosSemana = eventos[semana];
    const ingredientesTotales = {};
  
    eventosSemana.forEach(ev => {
      const receta = recetas.find(r => r.nombre === ev.title);
      if (receta) {
        receta.ingredientes.forEach(ing => {
          const key = `${ing.nombre}_${ing.unidad}`;
          if (!ingredientesTotales[key]) {
            ingredientesTotales[key] = { ...ing };
          } else {
            ingredientesTotales[key].cantidad += ing.cantidad;
          }
        });
      }
    });
  
    listaIngredientes.innerHTML = "";
  
    const lista = Object.values(ingredientesTotales).sort((a, b) => a.nombre.localeCompare(b.nombre));
  
    if (lista.length === 0) {
      listaIngredientes.innerHTML = `<p class="text-center text-muted">No hay recetas asignadas esta semana.</p>`;
      return;
    }
  
    lista.forEach(item => {
      const card = document.createElement("div");
      card.className = "ingrediente-card";
      card.innerHTML = `
        <img src="${getImagen(item.nombre)}" alt="${item.nombre}">
        <div>
          <div class="ingrediente-nombre">${item.nombre}</div>
          <small>${item.cantidad} ${item.unidad}</small>
        </div>
      `;
      listaIngredientes.appendChild(card);
    });
  }
  
  (async () => {
    const recetas = await cargarRecetas();
    let eventos = JSON.parse(localStorage.getItem("recetarioEventos")) || [];
  
    // Si no hay eventos, se usan de prueba
    if (eventos.length === 0) {
      eventos = [
        { title: "Ensalada César", start: "2025-04-01" },
        { title: "Fideos con Tuco", start: "2025-04-04" },
        { title: "Tortilla de Papas", start: "2025-04-10" },
        { title: "Fideos con Tuco", start: "2025-04-17" }
      ];
    }
  
    const semanas = agruparPorSemana(eventos);
    renderizarTabs(semanas, semana => renderIngredientes(semana, semanas, recetas));
  })();
  