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

document.addEventListener("DOMContentLoaded", function () {
  buildMindMap();
  rotateFlags();
  setupReveal();
  setupCountdown();
  setupSocialProof();
});
