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

// Carrusel de testimonios: varias tarjetas visibles a la vez, en bucle infinito,
// que avanza solo y que se puede arrastrar con el dedo o el mouse en cualquier momento.
function setupTestimonialCarousel() {
  var track = document.getElementById("testiTrack");
  var prevBtn = document.getElementById("testiPrev");
  var nextBtn = document.getElementById("testiNext");
  if (!track) return;

  var originals = Array.prototype.slice.call(track.children);
  var count = originals.length;
  if (!count) return;

  // Clones antes y después del set real: permiten desplazarse en cualquier
  // dirección sin nunca "acabarse" el carrusel.
  originals.forEach(function (s) {
    track.appendChild(s.cloneNode(true));
  });
  var prependFrag = document.createDocumentFragment();
  originals.forEach(function (s) {
    prependFrag.appendChild(s.cloneNode(true));
  });
  track.insertBefore(prependFrag, track.firstChild);

  var slides = Array.prototype.slice.call(track.children); // [clonesA(count), originals(count), clonesB(count)]

  function domIndex() {
    var pos = track.scrollLeft;
    var closest = count;
    var min = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.offsetLeft - pos);
      if (d < min) {
        min = d;
        closest = i;
      }
    });
    return closest;
  }

  function goTo(idx, smooth) {
    track.scrollTo({ left: slides[idx].offsetLeft, behavior: smooth ? "smooth" : "auto" });
  }

  function go(delta) {
    goTo(domIndex() + delta, true);
  }

  // Si el usuario (o el autoplay) llega a la zona de clones, salta sin animación
  // a la posición equivalente en el set real — el salto es invisible porque el
  // contenido del clon es idéntico.
  function normalizeIfNeeded() {
    var idx = domIndex();
    if (idx < count) {
      track.scrollTo({ left: slides[idx + count].offsetLeft, behavior: "auto" });
    } else if (idx >= count * 2) {
      track.scrollTo({ left: slides[idx - count].offsetLeft, behavior: "auto" });
    }
  }

  // Posición inicial: primer testimonio real, sin animación.
  track.scrollTo({ left: slides[count].offsetLeft, behavior: "auto" });

  // ---- Avance automático ----
  var AUTOPLAY_MS = 3200;
  var autoplayTimer;

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(function () {
      go(1);
    }, AUTOPLAY_MS);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); restartAutoplay(); });

  // ---- Arrastre con mouse (touch ya funciona nativo vía overflow-x scroll) ----
  var dragging = false;
  var dragStartX = 0;
  var dragStartScroll = 0;
  var moved = false;

  track.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse") {
      dragging = true;
      moved = false;
      dragStartX = e.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    }
    stopAutoplay();
  });

  track.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 3) moved = true;
    track.scrollLeft = dragStartScroll - delta;
  });

  function endDrag() {
    if (dragging) {
      dragging = false;
      track.classList.remove("is-dragging");
    }
    normalizeIfNeeded();
    restartAutoplay();
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("touchend", endDrag);

  // Evita que un arrastre se interprete como clic dentro de la tarjeta.
  track.addEventListener("click", function (e) {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAutoplay();
    else restartAutoplay();
  });

  var scrollTimer;
  track.addEventListener("scroll", function () {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      if (!dragging) normalizeIfNeeded();
    }, 120);
  });

  window.addEventListener("resize", function () {
    track.scrollTo({ left: slides[domIndex()].offsetLeft, behavior: "auto" });
  });

  startAutoplay();
}

document.addEventListener("DOMContentLoaded", function () {
  buildMindMap();
  rotateFlags();
  setupReveal();
  setupSocialProof();
  setupTestimonialCarousel();
});
