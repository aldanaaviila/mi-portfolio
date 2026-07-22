
/* ==========================================================
   PORTFOLIO — ALDANA AVILA
   Archivo: script.js
   Descripción: Toda la interactividad del portfolio.

   CONTENIDO:
   1. NAV    → sombra al hacer scroll + menú hamburguesa
   2. REVEAL → animación de aparición al hacer scroll
   3. FILTER → filtro de proyectos por categoría
   4. MODAL  → ventana emergente con detalles de proyectos
   5. FORM   → validación y envío del formulario
========================================================== */


/* ──────────────────────────────────────────────
   1. NAV — Barra de navegación
────────────────────────────────────────────────*/

/*
  Escucha el evento "scroll" en la ventana.
  Cuando el usuario baja más de 20px, agrega la clase "scrolled"
  al nav, que en CSS agrega una sombra.
  classList.toggle(clase, condición) agrega o quita la clase
  según si la condición es true o false.
*/
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle(
    'scrolled',
    window.scrollY > 20  // true si scrolleamos más de 20px
  );
});

/*
  Función para abrir/cerrar el menú en mobile.
  Se llama desde el onclick del hamburguesa en el HTML.
  classList.toggle() agrega "open" si no está, lo quita si está.
*/
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

/*
  Cierra el menú al hacer click en cualquier link de la nav.
  document.querySelectorAll() devuelve todos los elementos
  que coinciden con el selector CSS (como querySelectorAll en el DOM).
  .forEach() itera sobre cada uno y le agrega el evento.
*/
document.querySelectorAll('.nav-links a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});


/* ──────────────────────────────────────────────
   2. REVEAL — Animación de aparición al hacer scroll
   
   Usamos IntersectionObserver: una API del navegador que
   "observa" elementos y avisa cuando entran en el viewport.
   Es mucho más eficiente que escuchar el evento scroll.
────────────────────────────────────────────────*/

/*
  Creamos el observer con una función callback que se ejecuta
  cada vez que un elemento observado entra o sale del viewport.
  threshold: 0.1 significa "avisame cuando el 10% del elemento
  sea visible"
*/
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // El elemento es visible — leer el delay del dataset
      const delay = entry.target.dataset.delay || 0;
     
      /*
        setTimeout ejecuta algo después de un delay (en ms).
        Usamos el delay para escalonar la animación cuando hay
        varios elementos juntos (aparecen de a uno, no todos juntos).
      */
      setTimeout(() => {
        entry.target.classList.add('visible');
        // 'visible' activa la transición CSS definida en style.css
      }, Number(delay));
    }
  });
}, { threshold: 0.1 });

/*
  Encontramos todos los elementos con clase "reveal" y:
  1. Les asignamos un delay escalonado según su posición
  2. Los "observamos" con el IntersectionObserver
 
  El delay escalonado: i % 5 da valores 0,1,2,3,4,0,1,2...
  Multiplicado por 70ms da: 0, 70, 140, 210, 280ms
  Esto crea el efecto de que los elementos aparecen de a uno.
*/
document.querySelectorAll('.reveal').forEach((elemento, indice) => {
  elemento.dataset.delay = (indice % 5) * 70;
  observer.observe(elemento);
});


/* ──────────────────────────────────────────────
   3. FILTER — Filtro de proyectos por categoría
────────────────────────────────────────────────*/

/*
  Se llama desde los onclick de los botones de filtro en el HTML.
  Recibe:
  - cat: la categoría a mostrar ('all', 'bi', 'sql', 'auto')
  - btn: el botón que se clickeó (para marcar como activo)
*/
function filterProjects(cat, btn) {
 
  // 1. Quitar la clase "active" de todos los botones
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
  });
 
  // 2. Marcar como activo el botón clickeado
  btn.classList.add('active');

  // 3. Mostrar u ocultar cada tarjeta según su data-cat
  document.querySelectorAll('.project-card').forEach(card => {
   
    /*
      Cada tarjeta tiene data-cat="bi" o data-cat="bi sql" etc.
      (definido en el HTML como atributo data-cat)
      card.dataset.cat lee ese atributo.
    */
    const categorias = card.dataset.cat || '';
   
    /*
      classList.toggle(clase, condición):
      - Si condición es true → agrega 'hidden'
      - Si condición es false → quita 'hidden'
     
      La condición: ocultar si NO es 'all' Y la categoría
      no está incluida en el data-cat de la tarjeta.
      includes() busca el string dentro de otro string.
    */
    card.classList.toggle(
      'hidden',
      cat !== 'all' && !categorias.includes(cat)
    );
  });
}


/* ──────────────────────────────────────────────
   4. MODAL — Ventana emergente de proyectos
   
   Los datos de cada proyecto están en el objeto "projects".
   Cuando se hace click en una tarjeta, openModal(id) busca
   los datos y genera el HTML del modal dinámicamente.
   
   PARA AGREGAR UN PROYECTO NUEVO:
   1. Agregar una tarjeta en el HTML (index.html, sección #projects)
      con onclick="openModal('p7')" y data-cat="..."
   2. Agregar 'p7: { ... }' al objeto projects abajo
      con todos los campos requeridos
────────────────────────────────────────────────*/

/*
  Objeto con los datos de cada proyecto.
  La clave (p1, p2...) debe coincidir con el onclick del HTML.
 
  Campos:
  - emoji    → ícono de la portada
  - color    → gradiente CSS de la portada
  - title    → título del proyecto
  - problem  → descripción del problema que resuelve
  - dataset  → descripción de los datos usados
  - techs    → array de tecnologías usadas
  - objective → objetivo del proyecto
  - kpis     → array de { val, label } para mostrar en grilla
  - learnings → array de strings con lo aprendido
  - status   → "Completado", "En desarrollo", "Próximamente", etc.
*/
const projects = {

  p1: {
    emoji: '🚚',
    image: 'images/dashboard-logistica.png', // ← poné acá el nombre real del archivo
    color: 'linear-gradient(135deg,#3D52A0,#7091E6)',
    title: 'Dashboard Logística — DELTACOM',
    problem: 'Empresa de logística sin visibilidad centralizada sobre KPIs críticos: estado de flota, vencimientos de VTV, consumo de combustible y eficiencia de servicios',
    dataset: 'Datos reales de operación de DELTACOM SA: registros de unidades, consumos, controles técnicos y datos de personal. Procesados en Google Sheets y visualizados en Looker Studio.',
    techs: ['Looker Studio', 'Google Sheets', 'Google Apps Script'],
    objective: 'Centralizar KPIs operativos en dashboards interactivos accesibles para gerencia, reemplazando el seguimiento manual en planillas.',
    kpis: [
      { val: 'VTV',   label: 'Alertas de vencimiento' },
      { val: 'L/km',  label: 'Consumo combustible' },
      { val: '% OK',  label: 'Estado de flota' },
    ],
    learnings: [
      'Diseño de dashboards para audiencias gerenciales no técnicas',
      'Integración de múltiples fuentes de datos en Looker Studio',
      'KPIs operativos de logística y transporte',
      'Automatización de actualización de datos con Apps Script'
    ],
    status: 'Completado'
  },

  p2: {
    emoji: '✉️',
    color: 'linear-gradient(135deg,#101726,#3D52A0)',
    title: 'Automatización de Avisos por Mail',
    problem: 'KPIs críticos en dashboards que el equipo no revisaba a tiempo. Vencimientos de VTV y desvíos de consumo se detectaban tarde, generando costos evitables.',
    dataset: 'Google Sheets con datos operativos de DELTACOM SA, conectado a triggers de Apps Script para envío automático según condiciones.',
    techs: ['Google Apps Script', 'JavaScript', 'Gmail API', 'Google Sheets', 'Looker Studio'],
    objective: 'Eliminar el seguimiento manual enviando alertas automáticas cuando un KPI supera umbrales definidos.',
    kpis: [
      { val: '0h',    label: 'Intervención manual' },
      { val: 'Auto',  label: 'Envío por condición' },
      { val: 'Multi', label: 'Destinatarios' },
      { val: 'Real',  label: 'Datos en tiempo real' }
    ],
    learnings: [
      'Desarrollo de scripts en Apps Script (JavaScript)',
      'Triggers temporales y por evento en Google Workspace',
      'Integración Sheets + Gmail para alertas operativas',
      'Automatización de procesos de reporte en empresa real'
    ],
    status: 'Completado'
  },

  p3: {
    emoji: '🫔',
    image: 'images/dashboard-empandas.png',
    color: 'linear-gradient(135deg,#3D52A0,#8697C4)',
    title: 'Dashboard de Emprendimiento — Empanadas',
    problem: 'Emprendimiento gastronómico sin visibilidad sobre sus números: sin forma de saber qué productos eran más rentables, cuándo vendía más ni si los costos crecían.',
    dataset: 'Dataset ficticio con 12 meses de ventas simuladas: productos, cantidades, precios, costos de insumos y canales de venta.',
    techs: ['Power BI', 'Power Query', 'Excel', 'DAX'],
    objective: 'Sistema completo de análisis de ventas y rentabilidad que permita tomar decisiones de negocio basadas en datos.',
    kpis: [
      { val: '12m',    label: 'Evolución temporal' },
      { val: 'Top 5',  label: 'Productos rentables' },
      { val: 'Margen', label: 'Por producto' },
      { val: 'Ticket', label: 'Promedio' }
    ],
    learnings: [
      'Modelado de datos en Power BI (tablas de hechos y dimensiones)',
      'Medidas DAX para KPIs de rentabilidad',
      'Power Query para transformación y limpieza de datos',
      'Diseño de dashboards orientados a decisiones de negocio'
    ],
    status: 'En desarrollo'
  },

  p4: {
    emoji: '🗄️',
    color: 'linear-gradient(135deg,#101726,#7091E6)',
    title: 'Proyecto SQL — Base de Datos Relacional',
    problem: 'Proyecto académico de CoderHouse para demostrar dominio de bases de datos relacionales: desde el modelo hasta las consultas analíticas.',
    dataset: 'Base de datos relacional diseñada desde cero con múltiples tablas relacionadas mediante claves primarias y foráneas, normalizada hasta 3FN.',
    techs: ['SQL', 'MySQL', 'DBeaver'],
    objective: 'Diseñar y consultar una base de datos relacional completa que resuelva preguntas de negocio con SQL avanzado.',
    kpis: [
      { val: '3FN',   label: 'Normalización' },
      { val: 'JOINs', label: 'Multi-tabla' },
      { val: 'Sub-q', label: 'Subconsultas' },
      { val: 'Views', label: 'Vistas analíticas' }
    ],
    learnings: [
      'Diseño de modelos relacionales normalizados',
      'Consultas con JOINs, subconsultas y funciones de ventana',
      'Traducción de preguntas de negocio a queries SQL',
      'Optimización básica con índices'
    ],
    status: 'Completado'
  },

  p5: {
    emoji: '💰',
    image: 'images/dashboard-finanzas.png', // ← poné acá el nombre real del archivo
    color: 'linear-gradient(135deg,#8697C4,#ADBBDA)',
    title: 'Finanzas Personales — Dashboard',
    problem: 'Dificultad para entender el flujo real del dinero mensual, sin visibilidad sobre deudas ni proyecciones de ahorro.',
    dataset: 'Dataset de ingresos, gastos por categoría, deudas y proyecciones mensuales.',
    techs: ['Power BI', 'Excel', 'Power Query'],
    objective: 'Herramienta visual de control financiero personal con proyecciones y categorización de gastos.',
    kpis: [
      { val: 'Flujo',  label: 'Ingreso vs Egreso' },
      { val: 'Deuda',  label: '% del ingreso' },
      { val: 'Ahorro', label: 'Proyectado' },
      { val: 'Top',    label: 'Categorías de gasto' }
    ],
    learnings: [
      'Modelado temporal para series de tiempo',
      'Proyecciones con DAX',
      'Diseño centrado en usuario no técnico',
      'ETL de datos financieros personales'
    ],
    status: 'En curso'
  },

  p6: {
    emoji: '💊',
    color: 'linear-gradient(135deg,#7091E6,#3D52A0)',
    title: 'Logística Farmacéutica — Modelo Relacional',
    problem: 'Necesidad de demostrar capacidad de diseñar un sistema de información completo para logística de distribución farmacéutica con trazabilidad real.',
    dataset: 'Base de datos relacional diseñada para una empresa tipo Andreani: envíos, rutas, unidades, conductores y controles de calidad.',
    techs: ['SQL', 'Looker Studio', 'Google Sheets'],
    objective: 'Modelo relacional que centralice la operación logística y exponga KPIs de trazabilidad y estado de flota en dashboard.',
    kpis: [
      { val: 'Traz.',  label: 'Envíos en tiempo' },
      { val: 'Flota',  label: '% operativa' },
      { val: 'Rutas',  label: 'Análisis' },
      { val: 'KPIs',   label: 'Operativos' }
    ],
    learnings: [
      'Modelado relacional para logística de distribución',
      'KPIs de trazabilidad en supply chain',
      'Integración SQL → Looker Studio',
      'Diseño orientado a operaciones reales'
    ],
    status: 'En desarrollo'
  },

  p7: {
    emoji: '👥',
    image: 'images/dashboard-rrhh.png', 
    color: 'linear-gradient(135deg,#7091E6,#8697C4)',
    title: 'Dashboard RRHH — DELTACOM',
    problem: 'Falta de visibilidad centralizada sobre indicadores de RRHH: movimientos de personal, horas extra y ausentismo dispersos en múltiples planillas mensuales.',
    dataset: 'Datos reales de RRHH de DELTACOM SA consolidados desde varias planillas de Google Sheets mediante IMPORTRANGE, con tablas auxiliares para cálculos de headcount y ausentismo.',
    techs: ['Looker Studio', 'Google Sheets', 'IMPORTRANGE'],
    objective: 'Centralizar los KPIs de RRHH en un dashboard interactivo para seguimiento gerencial, evitando el cruce manual de planillas.',
    kpis: [
      { val: 'Headcount', label: 'Movimientos de personal' },
      { val: '% Ausent.', label: 'Ausentismo' },
      { val: 'Hs. extra', label: 'Consumo por período' },
    ],
    learnings: [
      'Consolidación de múltiples fuentes con IMPORTRANGE',
      'Tablas auxiliares con COUNTIFS para movimientos de headcount',
      'Cálculo de porcentajes sin soporte nativo de PARTITION BY en Looker Studio',
      'Diseño de dashboards de RRHH para audiencias gerenciales'
    ],
    status: 'En producción'
  }

};


/*
  openModal(id) — abre el modal y lo llena con los datos del proyecto.
  Se llama desde onclick="openModal('p1')" en el HTML.
 
  Pasos:
  1. Busca el proyecto por id en el objeto projects
  2. Genera el HTML del header y body usando template literals (``)
  3. Lo inserta en el modal
  4. Muestra el modal (agrega clase 'open')
  5. Bloquea el scroll del fondo (body overflow hidden)
*/
function openModal(id) {
  const proyecto = projects[id];

  /*
    Template literals (`` con ${}) permiten escribir HTML
    con variables de JS adentro — mucho más cómodo que concatenar strings.
  */
  document.getElementById('modalHeader').innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>
    <div style="display:flex;align-items:center;gap:1rem;margin-top:.5rem;">
      <div style="
        width:52px; height:52px;
        background:${proyecto.color};
        border-radius:12px;
        display:flex; align-items:center; justify-content:center;
        font-size:1.6rem; flex-shrink:0;
      ">${proyecto.emoji}</div>
      <div>
        <div style="font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--indigo);margin-bottom:.2rem;">
          Proyecto
        </div>
        <div style="font-family:'DM Serif Display',serif;font-size:1.3rem;color:var(--navy);line-height:1.2;">
          ${proyecto.title}
        </div>
      </div>
    </div>
  `;

  /*
    .map() transforma un array en otro.
    Acá lo usamos para convertir el array de kpis/techs/learnings
    en strings de HTML, y luego .join('') los une sin separadores.
  */
  document.getElementById('modalBody').innerHTML = `
    ${proyecto.image ? `
    <div class="modal-section">
      <img src="${proyecto.image}" alt="${proyecto.title}" style="width:100%;border-radius:var(--radius-sm);display:block;">
    </div>
    ` : ''}

    <div class="modal-section">
      <div class="modal-section-title">El problema</div>
      <p>${proyecto.problem}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Dataset</div>
      <p>${proyecto.dataset}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Objetivo</div>
      <p>${proyecto.objective}</p>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">KPIs principales</div>
      <div class="modal-kpi-grid">
        ${proyecto.kpis.map(kpi => `
          <div class="modal-kpi">
            <div class="modal-kpi-val">${kpi.val}</div>
            <div class="modal-kpi-label">${kpi.label}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Tecnologías</div>
      <div class="modal-tech-list">
        ${proyecto.techs.map(tech => `
          <span class="modal-tech">${tech}</span>
        `).join('')}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Aprendizajes</div>
      <ul class="modal-learnings">
        ${proyecto.learnings.map(item => `
          <li>${item}</li>
        `).join('')}
      </ul>
    </div>
  `;

  // Mostrar el modal
  document.getElementById('modalOverlay').classList.add('open');

  // Bloquear scroll del fondo mientras el modal está abierto
  document.body.style.overflow = 'hidden';
}

/*
  closeModal() — cierra el modal.
  Se llama desde:
  - El botón ✕ dentro del modal
  - closeModalOutside() al hacer click fuera
  - El evento keydown (tecla Escape)
*/
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = ''; // restaura el scroll
}

/*
  closeModalOutside(event) — cierra el modal si se clickea el overlay
  (el fondo oscuro), pero NO si se clickea dentro del modal.
 
  e.target es el elemento que recibió el click.
  Solo cerramos si el click fue exactamente en el overlay,
  no en un elemento hijo (el modal en sí).
*/
function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}

/*
  Cierra el modal con la tecla Escape.
  document.addEventListener escucha eventos en todo el documento.
*/
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});


/* ──────────────────────────────────────────────
   5. FORM — Formulario de contacto
   
   NOTA: este formulario actualmente solo hace validación visual.
   Para que envíe emails reales, podés usar Formspree:
   1. Creá una cuenta en formspree.io
   2. Creá un formulario y copiá el endpoint
   3. Reemplazá el fetch de abajo con el endpoint de Formspree
────────────────────────────────────────────────*/

/*
  sendForm() — valida y "envía" el formulario.
  Se llama desde onclick="sendForm()" en el botón del HTML.
*/
function sendForm() {
  // Leer los valores de los campos
  // .trim() quita espacios en blanco al inicio y al final
  const nombre = document.getElementById('fName').value.trim();
  const email  = document.getElementById('fEmail').value.trim();
  const msg    = document.getElementById('fMsg').value.trim();

  // Validar que todos los campos estén completos
  if (!nombre || !email || !msg) {
    alert('Por favor completá todos los campos.');
    return; // salir de la función sin hacer nada más
  }

  /*
    Simular el envío: ocultar el form y mostrar el mensaje de éxito.
   
    Para conectar con Formspree (envío real), reemplazá por:
   
    fetch('https://formspree.io/f/TU_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, msg })
    }).then(() => {
      document.getElementById('contactForm').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    });
  */
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}