// ============================================================
// Ruleta de Halloween (elemento interactivo).
// Siempre se detiene en "US$ 10": es el precio de la promoción para
// todas las personas. El aviso está en el pie de página.
// ============================================================
(function () {
  var SEGMENTOS = [
    { top: "10%", bottom: "OFF" },
    { top: "25%", bottom: "OFF" },
    { top: "US$ 10", bottom: "🎃", win: true },
    { top: "40%", bottom: "OFF" },
    { top: "15%", bottom: "OFF" },
    { top: "50%", bottom: "OFF" },
    { top: "30%", bottom: "OFF" },
    { top: "60%", bottom: "OFF" },
  ];
  var COLORES = ["#ff7a1a", "#2a1846", "#ff7a1a", "#151a36"];
  var STORAGE_KEY = "att_ruleta_halloween";
  var N = SEGMENTOS.length;
  var PASO = 360 / N;
  var GANADOR = 2;

  var offer = document.getElementById("hw-offer");
  var wheel = document.getElementById("hw-wheel");
  if (!offer || !wheel) return;
  var hub = document.getElementById("hw-hub");
  var btn = document.getElementById("hw-spin-btn");
  var pointer = document.getElementById("hw-pointer");
  var heroCta = offer.parentNode.querySelector(".hero-offer + .cta") || document.querySelector(".hero .cta");

  function polar(r, deg) {
    var a = ((deg - 90) * Math.PI) / 180;
    return [150 + r * Math.cos(a), 150 + r * Math.sin(a)];
  }

  function dibujar() {
    var svg = '<circle cx="150" cy="150" r="149" fill="#140d22"/>' +
      '<circle cx="150" cy="150" r="141" fill="none" stroke="#ff7a1a" stroke-width="3"/>';
    SEGMENTOS.forEach(function (s, i) {
      var a0 = i * PASO;
      var a1 = a0 + PASO;
      var p0 = polar(132, a0);
      var p1 = polar(132, a1);
      var fill = s.win ? "url(#hw-gold)" : COLORES[i % COLORES.length];
      svg += '<path d="M150 150 L' + p0[0].toFixed(2) + " " + p0[1].toFixed(2) +
        " A132 132 0 0 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2) +
        ' Z" fill="' + fill + '" stroke="#140d22" stroke-width="2"/>';
      var color = s.win ? "#140d22" : i % 2 === 0 ? "#140d22" : "#fff";
      var big = s.win ? 21 : 26;
      svg += '<g transform="rotate(' + (a0 + PASO / 2) + ' 150 150)">' +
        '<text x="150" y="' + (s.win ? 52 : 54) + '" text-anchor="middle" font-size="' + big + '" fill="' + color + '">' + s.top + "</text>" +
        '<text x="150" y="' + (s.win ? 76 : 72) + '" text-anchor="middle" font-size="' + (s.win ? 20 : 14) + '" fill="' + color + '">' + s.bottom + "</text></g>";
    });
    for (var k = 0; k < 16; k++) {
      var b = polar(141, k * 22.5 + 11.25);
      svg += '<circle class="hw-bulb' + (k % 2 ? " alt" : "") + '" cx="' + b[0].toFixed(2) + '" cy="' + b[1].toFixed(2) + '" r="4.2"/>';
    }
    wheel.innerHTML =
      '<defs><linearGradient id="hw-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c2"/><stop offset="1" stop-color="#ffc93c"/></linearGradient></defs>' +
      svg;
  }

  // Ángulo final para que el centro del segmento ganador quede bajo el puntero.
  function anguloGanador() {
    return 360 - (GANADOR * PASO + PASO / 2);
  }

  var audio = null;
  function sonido(freq, dur, tipo, vol) {
    try {
      if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
      var o = audio.createOscillator();
      var g = audio.createGain();
      o.type = tipo || "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol || 0.05, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
      o.connect(g);
      g.connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + dur);
    } catch (e) {
      // Sin audio: la ruleta funciona igual.
    }
  }

  function fanfarria() {
    [523, 659, 784, 1046].forEach(function (f, i) {
      setTimeout(function () { sonido(f, 0.28, "triangle", 0.09); }, i * 110);
    });
  }

  function confeti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = document.createElement("canvas");
    c.className = "hw-confetti";
    document.body.appendChild(c);
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = window.innerWidth;
    var H = window.innerHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    var ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    var cols = ["#ff7a1a", "#ffc93c", "#7bd94b", "#9b5de5", "#ffffff"];
    var emojis = ["🎃", "🦇", "👻", "🍬"];
    var box = wheel.getBoundingClientRect();
    var ox = box.left + box.width / 2;
    var oy = box.top + box.height / 2;
    var parts = [];
    for (var i = 0; i < 150; i++) {
      var a = Math.random() * Math.PI * 2;
      var v = 4 + Math.random() * 9;
      parts.push({
        x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 4,
        c: cols[i % cols.length],
        e: i % 9 === 0 ? emojis[(i / 9) % emojis.length | 0] : null,
      });
    }
    var t0 = performance.now();
    function frame(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += 0.32;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 2.2));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        if (p.e) {
          ctx.font = "26px serif";
          ctx.fillText(p.e, -13, 9);
        } else {
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });
      if (t < 3.3) requestAnimationFrame(frame);
      else c.remove();
    }
    requestAnimationFrame(frame);
  }

  function ganar(animado) {
    offer.classList.add("hw-won");
    document.documentElement.classList.add("hw-unlocked");
    hub.disabled = true;
    hub.textContent = "🎃";
    if (heroCta) {
      heroCta.classList.add("hw-pulse");
      var txt = heroCta.firstChild;
      if (txt && txt.nodeType === 3) txt.nodeValue = "Quiero mis mapas por US$ 10 ";
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      // localStorage no disponible: no pasa nada.
    }
    if (animado) {
      fanfarria();
      confeti();
      if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    }
  }

  var girando = false;
  function girar() {
    if (girando || offer.classList.contains("hw-won")) return;
    girando = true;
    btn.disabled = true;
    hub.disabled = true;
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dur = reducido ? 1800 : 5200;
    var vueltas = reducido ? 2 : 6;
    var jitter = (Math.random() - 0.5) * PASO * 0.6;
    var destino = 360 * vueltas + anguloGanador() + jitter;
    var inicio = performance.now();
    var ultimo = 0;
    function frame(now) {
      var p = Math.min(1, (now - inicio) / dur);
      var e = 1 - Math.pow(1 - p, 4);
      var rot = destino * e;
      wheel.style.transform = "rotate(" + rot + "deg)";
      var seg = Math.floor(rot / PASO);
      if (seg !== ultimo) {
        ultimo = seg;
        sonido(1400, 0.03, "square", 0.035);
        pointer.classList.add("tick");
        setTimeout(function () { pointer.classList.remove("tick"); }, 60);
      }
      if (p < 1) requestAnimationFrame(frame);
      else {
        girando = false;
        setTimeout(function () { ganar(true); }, 250);
      }
    }
    requestAnimationFrame(frame);
  }

  // Mientras no haya girado, cualquier botón de compra lleva a la ruleta y la gira sola.
  function irARuleta() {
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var wrap = offer.querySelector(".hw-wheel-wrap");
    wrap.scrollIntoView({ behavior: reducido ? "auto" : "smooth", block: "center" });
    var ultimoY = -1;
    var quieto = 0;
    var t0 = performance.now();
    function esperar() {
      var y = window.scrollY;
      quieto = Math.abs(y - ultimoY) < 1 ? quieto + 1 : 0;
      ultimoY = y;
      if (quieto >= 6 || performance.now() - t0 > 1800) setTimeout(girar, 150);
      else requestAnimationFrame(esperar);
    }
    requestAnimationFrame(esperar);
  }

  window.addEventListener(
    "click",
    function (e) {
      if (offer.classList.contains("hw-won")) return;
      var a = e.target.closest ? e.target.closest("a[data-checkout]") : null;
      if (!a) return;
      e.preventDefault();
      e.stopPropagation();
      irARuleta();
    },
    true
  );

  dibujar();
  hub.addEventListener("click", girar);
  btn.addEventListener("click", girar);

  var yaGiro = false;
  try {
    yaGiro = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {
    yaGiro = false;
  }
  if (yaGiro) {
    wheel.style.transform = "rotate(" + anguloGanador() + "deg)";
    ganar(false);
  }
})();
