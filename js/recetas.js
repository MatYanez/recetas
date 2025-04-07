async function cargarRecetas() {
    const res = await fetch("data/recetas.json");
    return await res.json();
  }
  
  function crearBotones(tipos, callback) {
    const filtros = document.getElementById("filtros");
    filtros.innerHTML = "";
    tipos.forEach(tipo => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary categoria-btn me-2 mb-2";
      btn.textContent = tipo;
      btn.onclick = () => {
        document.querySelectorAll(".categoria-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        callback(tipo);
      };
      filtros.appendChild(btn);
    });
  }
  
  function mostrarModal(receta) {
    document.getElementById("modalTitulo").textContent = receta.nombre;
    document.getElementById("modalImagen").src = receta.imagen;
    document.getElementById("modalTipo").textContent = receta.tipo;
    document.getElementById("modalTiempo").textContent = receta.tiempo;
    document.getElementById("modalIngredientes").innerHTML =
      receta.ingredientes.map(i => `- ${i.nombre}: ${i.cantidad} ${i.unidad}`).join("<br>");
    document.getElementById("modalPreparacion").innerHTML = receta.preparacion.replace(/\n/g, "<br>");
    new bootstrap.Modal(document.getElementById("modalReceta")).show();
  }
  
  function renderRecetas(recetas, tipoActivo, textoFiltro = "") {
    const contenedor = document.getElementById("contenedor-recetas");
    contenedor.innerHTML = "";
  
    recetas
      .filter(r => (!tipoActivo || r.tipo === tipoActivo) && r.nombre.toLowerCase().includes(textoFiltro))
      .forEach((r) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-4";
        col.innerHTML = `
          <div class="receta-card" onclick="mostrarModalReceta('${r.nombre}')">
            <img src="${r.imagen}" alt="${r.nombre}" class="receta-img">
            <div class="p-3">
              <h6 class="mb-1">${r.nombre}</h6>
              <small class="text-muted">${r.tipo}</small>
            </div>
          </div>
        `;
        contenedor.appendChild(col);
      });
  }
  
  let todasLasRecetas = [];
  let tipoActivo = null;
  
  window.mostrarModalReceta = function (nombre) {
    const receta = todasLasRecetas.find(r => r.nombre === nombre);
    if (receta) mostrarModal(receta);
  };
  
  (async () => {
    todasLasRecetas = await cargarRecetas();
    const tipos = [...new Set(todasLasRecetas.map(r => r.tipo))];
    crearBotones(tipos, tipo => {
      tipoActivo = tipo;
      renderRecetas(todasLasRecetas, tipoActivo, document.getElementById("buscador").value.toLowerCase());
    });
  
    document.getElementById("buscador").addEventListener("input", () => {
      renderRecetas(todasLasRecetas, tipoActivo, document.getElementById("buscador").value.toLowerCase());
    });
  
    tipoActivo = tipos[0];
    renderRecetas(todasLasRecetas, tipoActivo);
  })();
  