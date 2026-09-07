// Ramas del mapa mental — cada una es un pilar del método.
var RAMAS = [
  { label: "Vocabulario esencial", color: "#2563EB", emoji: "✨" },
  { label: "Gramática simple", color: "#7C3AED", emoji: "💬" },
  { label: "Pronunciación", color: "#DB2777", emoji: "🎤" },
  { label: "Listening real", color: "#EA580C", emoji: "🎧" },
  { label: "Inglés para viajar", color: "#059669", emoji: "✈️" },
  { label: "Conversación diaria", color: "#0891B2", emoji: "🛡️" },
];

function buildMindMap() {
  var wrap = document.getElementById("mindmap");
  var svg = wrap.querySelector(".mindmap-lines");
  var cx = 180;
  var cy = 160;
  var rLine = { x: 128, y: 108 };
  var rPct = { x: 35.5, y: 33.7 };

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
      r.color +
      '" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round" opacity="0.55" />';
  });
  svg.innerHTML = lines;
  svg.setAttribute("viewBox", "0 0 360 320");

  RAMAS.forEach(function (r, i) {
    var angle = (Math.PI * 2 * i) / RAMAS.length - Math.PI / 2;
    var xPct = 50 + Math.cos(angle) * rPct.x;
    var yPct = 50 + Math.sin(angle) * rPct.y;

    var node = document.createElement("div");
    node.className = "mindmap-node";
    node.style.left = xPct + "%";
    node.style.top = yPct + "%";

    var icon = document.createElement("span");
    icon.className = "mindmap-icon";
    icon.style.backgroundColor = r.color + "1a";
    icon.textContent = r.emoji;

    var label = document.createElement("span");
    label.className = "mindmap-label";
    label.textContent = r.label;

    node.appendChild(icon);
    node.appendChild(label);
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

document.addEventListener("DOMContentLoaded", function () {
  buildMindMap();
  rotateFlags();
  setupReveal();
});
