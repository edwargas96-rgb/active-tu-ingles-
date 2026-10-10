// Ramas del mapa mental — alternan rojo/azul marino, como en el mapa mental físico.
var RAMAS = [
  { num: 1, label: "Vocabulario esencial", color: "red" },
  { num: 2, label: "Gramática simple", color: "navy" },
  { num: 3, label: "Pronunciación", color: "red" },
  { num: 4, label: "Listening real", color: "navy" },
  { num: 5, label: "Inglés para viajar", color: "red" },
  { num: 6, label: "Conversación diaria", color: "navy" },
];

function buildMindMap() {
  var wrap = document.getElementById("mindmap");
  var svg = wrap.querySelector(".mindmap-lines");
  var cx = 260;
  var cy = 230;
  var rLine = { x: 190, y: 165 };
  var rPct = { x: 36.5, y: 35.9 };

  var colorHex = { red: "#e63946", navy: "#16215c" };

  var lines = "";
  RAMAS.forEach(function (r, i) {
    var angle = (Math.PI * 2 * i) / RAMAS.length - Math.PI / 2;
    var x = cx + Math.cos(angle) * rLine.x;
    var y = cy + Math.sin(angle) * rLine.y;
    lines +=
      '<line x1="' +
      cx +
      '" y1="' +
      cy +
      '" x2="' +
      x +
      '" y2="' +
      y +
      '" stroke="' +
      colorHex[r.color] +
      '" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round" opacity="0.55" />';
  });
  svg.innerHTML = lines;
  svg.setAttribute("viewBox", "0 0 520 460");

  RAMAS.forEach(function (r, i) {
    var angle = (Math.PI * 2 * i) / RAMAS.length - Math.PI / 2;
    var xPct = 50 + Math.cos(angle) * rPct.x;
    var yPct = 50 + Math.sin(angle) * rPct.y;

    var node = document.createElement("div");
    node.className = "mindmap-node";
    node.style.left = xPct + "%";
    node.style.top = yPct + "%";

    var card = document.createElement("div");
    card.className = "mm-card c-" + r.color;

    var numEl = document.createElement("span");
    numEl.className = "mm-num";
    numEl.textContent = r.num;

    var labelEl = document.createElement("span");
    labelEl.className = "mm-label";
    labelEl.textContent = r.label;

    card.appendChild(numEl);
    card.appendChild(labelEl);
    node.appendChild(card);
    wrap.appendChild(node);
  });
}

function rotateFlags() {
  var chips = Array.prototype.slice.call(document.querySelectorAll(".flag-chip"));
  if (!chips.length) return;
  var idx = 0;
  chips[0].classList.add("active");
  setInterval(function () {
    chips[idx].classList.remove("active");
    idx = (idx + 1) % chips.length;
    chips[idx].classList.add("active");
  }, 1800);
}

function setupReveal() {
  var els = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!("IntersectionObserver" in window)) {
    els.forEach(function (e) {
      e.classList.add("is-visible");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  els.forEach(function (e) {
    io.observe(e);
  });
}

// Notificación flotante de prueba social — nombres ficticios, ciclan en pantalla.
var COMPRAS = [
  { nombre: "María J.", lugar: "Bogotá, Colombia" },
  { nombre: "Franco R.", lugar: "Buenos Aires, Argentina" },
  { nombre: "Carla A.", lugar: "Ciudad de México, México" },
  { nombre: "Yohana P.", lugar: "Caracas, Venezuela" },
  { nombre: "Diego S.", lugar: "Lima, Perú" },
  { nombre: "Camila V.", lugar: "Santiago, Chile" },
];

function setupSocialProof() {
  var el = document.getElementById("social-proof");
  if (!el) return;
  var nameEl = el.querySelector(".social-proof-name");
  var timeEl = el.querySelector(".social-proof-time");
  var idx = 0;
  var hideTimer, nextTimer;

  function show() {
    var c = COMPRAS[idx % COMPRAS.length];
    var mins = 1 + Math.floor(Math.random() * 8);
    nameEl.textContent = c.nombre + " ✓ Verificada — " + c.lugar;
    timeEl.textContent = "hace " + mins + " min";
    el.hidden = false;
    requestAnimationFrame(function () {
      el.classList.add("is-visible");
    });
    hideTimer = window.setTimeout(function () {
      el.classList.remove("is-visible");
      window.setTimeout(function () {
        el.hidden = true;
      }, 400);
    }, 5000);
    idx++;
    nextTimer = window.setTimeout(show, idx * 60000);
  }

  var firstTimer = window.setTimeout(show, 10000);
  window.addEventListener("beforeunload", function () {
    window.clearTimeout(firstTimer);
    window.clearTimeout(hideTimer);
    window.clearTimeout(nextTimer);
  });
}

// Contador de oferta: 24h que se reinician por sesión/visitante (localStorage),
// nunca una fecha límite fija engañosa.
function setupCountdown() {
  var elBar = document.getElementById("countdown-bar");
  var elFinal = document.getElementById("countdown-final");
  if (!elBar && !elFinal) return;

  var STORAGE_KEY = "atiOfferDeadline";
  var DURATION_MS = 24 * 60 * 60 * 1000;

  function readDeadline() {
    try {
      return Number(window.localStorage.getItem(STORAGE_KEY)) || 0;
    } catch (e) {
      return 0;
    }
  }

  function writeDeadline(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch (e) {
      // localStorage no disponible (modo privado, etc.) — el contador sigue
      // funcionando en memoria durante esta visita.
    }
  }

  var deadline = readDeadline();
  if (!deadline || deadline < Date.now()) {
    deadline = Date.now() + DURATION_MS;
    writeDeadline(deadline);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function tick() {
    var remaining = deadline - Date.now();
    if (remaining <= 0) {
      deadline = Date.now() + DURATION_MS;
      writeDeadline(deadline);
      remaining = DURATION_MS;
    }
    var totalSeconds = Math.floor(remaining / 1000);
    var text =
      pad(Math.floor(totalSeconds / 3600)) +
      ":" +
      pad(Math.floor((totalSeconds % 3600) / 60)) +
      ":" +
      pad(totalSeconds % 60);
    if (elBar) elBar.textContent = text;
    if (elFinal) elFinal.textContent = text;
  }

  tick();
  window.setInterval(tick, 1000);
}

// Pestañas de niveles A1 → C2: clic y teclado (flechas, Home, End).
function setupLevelTabs() {
  var tablist = document.querySelector(".level-tabs");
  if (!tablist) return;
  var tabs = Array.prototype.slice.call(tablist.querySelectorAll(".level-tab"));
  var placeholder = document.getElementById("level-placeholder");

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (placeholder) placeholder.hidden = true;
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(tab, false);
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
}

// Carruseles (mapas y testimonios): avance automático + deslizar con el dedo/mouse
// en ambas direcciones; tocar el carrusel lo detiene o lo reanuda.
function setupCarousels() {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  Array.prototype.forEach.call(document.querySelectorAll(".preview-carousel"), function (el) {
    var group = el.querySelector(".carousel-group");
    if (!group) return;
    var duration = el.classList.contains("testi-carousel") ? 55 : 60;
    var pos = 0;
    var userPaused = false;
    var touching = false;
    var resumeAt = 0;
    var last = 0;
    var down = null;
    var moved = false;

    function width() {
      return group.offsetWidth;
    }

    function wrap() {
      var g = width();
      if (!g) return;
      if (pos < g * 0.25) pos += g;
      else if (pos > g * 1.25) pos -= g;
      el.scrollLeft = pos;
    }

    function holdOff(ms) {
      resumeAt = Date.now() + ms;
    }

    function tick(t) {
      var dt = last ? Math.min(t - last, 64) : 16;
      last = t;
      var g = width();
      if (g && !reduce && !userPaused && !touching && !down && Date.now() >= resumeAt) {
        pos += (g / duration) * (dt / 1000);
        wrap();
      }
      requestAnimationFrame(tick);
    }

    function init() {
      var g = width();
      if (!g) return false;
      pos = g * 0.5;
      el.scrollLeft = pos;
      return true;
    }

    el.addEventListener(
      "scroll",
      function () {
        if (Math.abs(el.scrollLeft - pos) > 1.5) {
          pos = el.scrollLeft;
          holdOff(2500);
          var g = width();
          if (g && (pos < g * 0.25 || pos > g * 1.25)) wrap();
        }
      },
      { passive: true },
    );

    el.addEventListener("touchstart", function () { touching = true; }, { passive: true });
    el.addEventListener("touchend", function () { touching = false; holdOff(2500); }, { passive: true });
    el.addEventListener("touchcancel", function () { touching = false; holdOff(2500); }, { passive: true });

    // Arrastre con mouse (en pantallas táctiles el desplazamiento es nativo).
    el.addEventListener("pointerdown", function (e) {
      moved = false;
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = { x: e.clientX, left: el.scrollLeft };
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - down.x;
      if (Math.abs(dx) > 6) {
        moved = true;
        el.classList.add("is-dragging");
      }
      if (moved) {
        pos = down.left - dx;
        wrap();
      }
    });
    window.addEventListener("pointerup", function () {
      if (!down) return;
      down = null;
      el.classList.remove("is-dragging");
      holdOff(2500);
    });

    // Tocar / hacer clic: detener o reanudar.
    el.addEventListener("click", function () {
      if (moved) {
        moved = false;
        return;
      }
      userPaused = !userPaused;
      el.classList.toggle("is-paused", userPaused);
    });

    function start() {
      if (!init()) return;
      requestAnimationFrame(tick);
    }
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  buildMindMap();
  rotateFlags();
  setupReveal();
  setupLevelTabs();
  setupCarousels();
  setupCountdown();
  setupSocialProof();
});
