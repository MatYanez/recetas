document.addEventListener("DOMContentLoaded", function () {
  const calendario = document.getElementById("calendario");
  const mesSelect = document.getElementById("mes");
  const anioSelect = document.getElementById("anio");
  const seleccionarReceta = document.getElementById("seleccionar-receta");
  const fechaSeleccionada = document.getElementById("fecha-seleccionada");
  const guardarAsignacion = document.getElementById("guardar-asignacion");
  const modalElement = document.getElementById("diaModal");
  const bootstrapModal = new bootstrap.Modal(modalElement);

  let recetas = [];
  let asignaciones = JSON.parse(localStorage.getItem("asignaciones")) || {};
  const feriadosFalsos = ["2025-4-1", "2025-4-25"]; // YYYY-M-D

  function init() {
    // llenar selects de mes/año
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril",
      "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    meses.forEach((m, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = m;
      mesSelect.appendChild(opt);
    });

    const actual = new Date();
    for (let a = 2023; a <= 2026; a++) {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      anioSelect.appendChild(opt);
    }

    mesSelect.value = actual.getMonth();
    anioSelect.value = actual.getFullYear();

    mesSelect.addEventListener("change", renderCalendario);
    anioSelect.addEventListener("change", renderCalendario);

    guardarAsignacion.onclick = () => {
      const fecha = fechaSeleccionada.textContent;
      const receta = seleccionarReceta.value;
      if (receta) {
        asignaciones[fecha] = receta;
        localStorage.setItem("asignaciones", JSON.stringify(asignaciones));
        bootstrapModal.hide();
        renderCalendario(); // refrescar
      }
    };

    fetch("./data/recetas.json")
      .then(res => res.json())
      .then(data => {
        recetas = data;
        recetas.forEach(r => {
          const opt = document.createElement("option");
          opt.value = r.nombre;
          opt.textContent = r.nombre;
          seleccionarReceta.appendChild(opt);
        });
        renderCalendario();
        console.log("Calendario generado con", diasMes, "días.");
      });
  }

  function renderCalendario() {
    calendario.innerHTML = "";

    const mes = parseInt(mesSelect.value);
    const anio = parseInt(anioSelect.value);

    // Cabecera de días
    const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    diasSemana.forEach(dia => {
      const div = document.createElement("div");
      div.classList.add("text-center", "fw-bold");
      div.textContent = dia;
      calendario.appendChild(div);
    });

    const primerDia = new Date(anio, mes, 1).getDay(); // 0 = domingo
    const offset = primerDia === 0 ? 6 : primerDia - 1; // lunes como inicio
    const diasMes = new Date(anio, mes + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("div");
      empty.classList.add("dia", "border");
      calendario.appendChild(empty);
    }

    for (let d = 1; d <= diasMes; d++) {
      const fechaStr = `${anio}-${mes + 1}-${d}`;
      const div = document.createElement("div");
      div.classList.add("dia", "border", "p-2");

      const fecha = new Date(anio, mes, d);
      const diaSemana = fecha.getDay();
      if (diaSemana === 0 || diaSemana === 6) div.classList.add("bg-light");
      if (feriadosFalsos.includes(fechaStr)) div.classList.add("bg-warning-subtle");

      const header = document.createElement("strong");
      header.textContent = d;
      div.appendChild(header);

      if (asignaciones[fechaStr]) {
        const recetaAsignada = recetas.find(r => r.nombre === asignaciones[fechaStr]);
        if (recetaAsignada) {
          const img = document.createElement("img");
          img.src = recetaAsignada.imagen;
          img.alt = recetaAsignada.nombre;
          img.classList.add("img-fluid", "my-2");
          img.style.height = "60px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "5px";
          div.appendChild(img);

          const label = document.createElement("div");
          label.textContent = recetaAsignada.nombre;
          label.style.fontSize = "0.8rem";
          div.appendChild(label);
        }
      }

      div.addEventListener("click", () => {
        fechaSeleccionada.textContent = fechaStr;
        bootstrapModal.show();
      });

      calendario.appendChild(div);
    }
  }

  init();
});
