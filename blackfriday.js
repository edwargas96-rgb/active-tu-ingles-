// ============================================================
// Ruleta de Black Friday (elemento interactivo).
// Siempre termina en "US$ 10": es el precio de la promoción para
// todas las personas. A veces el primer giro cae en "Otro giro" y el
// segundo giro se detiene en "US$ 10". El aviso está en el pie de página.
// Basado en halloween.js; solo cambian colores, sonidos y figuras.
// ============================================================
(function () {
  var SEGMENTOS = [
    { top: "10%", bottom: "OFF" },
    { top: "25%", bottom: "OFF" },
    { top: "US$ 10", bottom: "", win: true },
    { top: "40%", bottom: "OFF" },
    { top: "15%", bottom: "OFF" },
    { top: "50%", bottom: "OFF" },
    { top: "OTRO", bottom: "GIRO", retry: true },
    { top: "60%", bottom: "OFF" },
  ];
  var COLORES = ["#e63946", "#ffffff"];
  var STORAGE_KEY = "att_ruleta_blackfriday";
  var N = SEGMENTOS.length;
  var PASO = 360 / N;
  var GANADOR = 2;
  var OTRO = 6;
  var PROB_OTRO = 0.5;

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
    // Aro negro con luces, como un letrero de evento
    var svg = '<circle cx="150" cy="150" r="149" fill="#111111"/>' +
      '<circle cx="150" cy="150" r="136" fill="none" stroke="#2a2a2a" stroke-width="2"/>';
    SEGMENTOS.forEach(function (s, i) {
      var a0 = i * PASO;
      var a1 = a0 + PASO;
      var p0 = polar(132, a0);
      var p1 = polar(132, a1);
      var fill = s.win ? "url(#hw-gold)" : s.retry ? "#111111" : COLORES[i % COLORES.length];
      svg += '<path d="M150 150 L' + p0[0].toFixed(2) + " " + p0[1].toFixed(2) +
        " A132 132 0 0 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2) +
        ' Z" fill="' + fill + '" stroke="#111111" stroke-width="2"/>';
      var color = s.win ? "#111111" : s.retry ? "#ffc93c" : COLORES[i % COLORES.length] === "#ffffff" ? "#c1121f" : "#ffffff";
      var big = s.win ? 21 : s.retry ? 22 : 26;
      svg += '<g transform="rotate(' + (a0 + PASO / 2) + ' 150 150)">' +
        '<text x="150" y="' + (s.win ? 52 : 54) + '" text-anchor="middle" font-size="' + big + '" fill="' + color + '">' + s.top + "</text>" +
        (s.win
          ? '<image href="bf-tag.svg" x="137" y="58" width="26" height="26"/>'
          : '<text x="150" y="' + (s.retry ? 76 : 72) + '" text-anchor="middle" font-size="' + (s.retry ? 20 : 14) + '" fill="' + color + '">' + s.bottom + "</text>") +
        "</g>";
    });
    for (var k = 0; k < 20; k++) {
      var b = polar(141.5, k * 18 + 9);
      svg += '<circle class="hw-bulb' + (k % 2 ? " alt" : "") + '" cx="' + b[0].toFixed(2) + '" cy="' + b[1].toFixed(2) + '" r="3.8"/>';
    }
    wheel.innerHTML =
      '<defs><linearGradient id="hw-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c2"/><stop offset="1" stop-color="#ffc93c"/></linearGradient></defs>' +
      svg;
  }

  // Ángulo final para que el centro del segmento ganador quede bajo el puntero.
  function anguloGanador() {
    return 360 - (GANADOR * PASO + PASO / 2);
  }

  function anguloDe(idx) {
    return 360 - (idx * PASO + PASO / 2);
  }

  // Sonidos: "tic" en cada casilla y una campanita (generada, sin archivo) al ganar.
  // Los mp3 se descargan cuando la ruleta se acerca a la pantalla y el audio se
  // activa recién con el toque de la persona, para no pesar en la carga inicial.
  var SONIDOS = ["tic"];
  var audio = null;
  var datos = null;
  var buffers = {};
  var pendiente = {};

  function precargar() {
    if (datos) return;
    datos = {};
    SONIDOS.forEach(function (n) {
      datos[n] = fetch("hw-" + n + ".mp3")
        .then(function (r) { return r.arrayBuffer(); })
        .catch(function () { return null; });
    });
  }

  function reproducir(nombre, vol) {
    try {
      var src = audio.createBufferSource();
      var g = audio.createGain();
      src.buffer = buffers[nombre];
      g.gain.value = vol;
      src.connect(g);
      g.connect(audio.destination);
      src.start();
    } catch (e) {
      // Sin audio: la ruleta funciona igual.
    }
  }

  // Se llama dentro del toque de la persona (requisito de los navegadores para sonar).
  function activarAudio() {
    precargar();
    if (!audio) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      audio = new Ctx();
      SONIDOS.forEach(function (n) {
        datos[n].then(function (ab) {
          if (!ab) return;
          audio.decodeAudioData(ab, function (buf) {
            buffers[n] = buf;
            var p = pendiente[n];
            delete pendiente[n];
            if (p && performance.now() - p.t < 700) reproducir(n, p.vol);
          }, function () {});
        });
      });
    }
    if (audio.state === "suspended") audio.resume();
  }

  function tocar(nombre, vol) {
    if (!audio) return;
    if (!buffers[nombre]) {
      if (nombre !== "tic") pendiente[nombre] = { t: performance.now(), vol: vol };
      return;
    }
    reproducir(nombre, vol);
  }

  // Campanita de "precio desbloqueado": tres notas cortas, sin descargar nada.
  function campana() {
    if (!audio) return;
    try {
      var t = audio.currentTime;
      [880, 1108.7, 1318.5].forEach(function (f, i) {
        var o = audio.createOscillator();
        var g = audio.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.35, t + i * 0.09 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.6);
        o.connect(g);
        g.connect(audio.destination);
        o.start(t + i * 0.09);
        o.stop(t + i * 0.09 + 0.65);
      });
    } catch (e) {
      // Sin audio: la ruleta funciona igual.
    }
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
    var cols = ["#e63946", "#ffffff", "#ffc93c", "#ff8a8a"];
    var figuras = ["bf-tag.svg"].map(function (src) {
      var im = new Image();
      im.src = src;
      return im;
    });
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
        e: i % 9 === 0 ? figuras[(i / 9) % figuras.length | 0] : null,
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
          if (p.e.complete) ctx.drawImage(p.e, -15, -15, 30, 30);
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
    hub.innerHTML = '<img src="bf-tag.svg" alt="" />';
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
      campana();
      confeti();
      if (navigator.vibrate) navigator.vibrate([30, 40, 60]);
    }
  }

  var girando = false;
  var giros = 0;
  var angulo = 0;
  var auto = false;
  var titulo = offer.querySelector(".hw-wheel-title");

  // Sonido corto de "casi": dos notas que bajan.
  function casi() {
    if (!audio) return;
    try {
      var t = audio.currentTime;
      [523.3, 392].forEach(function (f, i) {
        var o = audio.createOscillator();
        var g = audio.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.3, t + i * 0.12 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.35);
        o.connect(g);
        g.connect(audio.destination);
        o.start(t + i * 0.12);
        o.stop(t + i * 0.12 + 0.4);
      });
    } catch (e) {
      // Sin audio: la ruleta funciona igual.
    }
  }

  function otroGiro() {
    offer.classList.add("hw-retry");
    if (titulo) titulo.textContent = "¡Casi! Te tocó otro giro. Gira de nuevo";
    btn.textContent = "Girar otra vez";
    hub.textContent = "GIRAR";
    btn.disabled = false;
    hub.disabled = false;
    casi();
    if (navigator.vibrate) navigator.vibrate(40);
    if (auto) setTimeout(girar, 1300);
  }

  function girar() {
    if (girando || offer.classList.contains("hw-won")) return;
    girando = true;
    giros += 1;
    activarAudio();
    btn.disabled = true;
    hub.disabled = true;
    offer.classList.remove("hw-retry");
    // Primer giro: a veces cae en "Otro giro". El siguiente siempre cae en US$ 10.
    var cae = giros === 1 && Math.random() < PROB_OTRO ? OTRO : GANADOR;
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dur = reducido ? 1800 : giros === 1 ? 5200 : 4200;
    var vueltas = reducido ? 2 : giros === 1 ? 6 : 5;
    var jitter = (Math.random() - 0.5) * PASO * 0.6;
    var base = angulo - (angulo % 360);
    var desde = angulo;
    var destino = base + 360 * vueltas + anguloDe(cae) + jitter;
    var inicio = performance.now();
    var ultimo = Math.floor(desde / PASO);
    function frame(now) {
      var p = Math.min(1, (now - inicio) / dur);
      var e = 1 - Math.pow(1 - p, 4);
      var rot = desde + (destino - desde) * e;
      wheel.style.transform = "rotate(" + rot + "deg)";
      var seg = Math.floor(rot / PASO);
      if (seg !== ultimo) {
        ultimo = seg;
        tocar("tic", 0.35);
        pointer.classList.add("tick");
        setTimeout(function () { pointer.classList.remove("tick"); }, 60);
      }
      if (p < 1) requestAnimationFrame(frame);
      else {
        girando = false;
        angulo = destino;
        if (cae === OTRO) setTimeout(otroGiro, 250);
        else setTimeout(function () { ganar(true); }, 250);
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
      if (quieto >= 6 || performance.now() - t0 > 1800) {
        auto = true;
        setTimeout(girar, 150);
      }
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
      activarAudio();
      irARuleta();
    },
    true
  );

  dibujar();
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        precargar();
        io.disconnect();
      }
    }, { rootMargin: "400px" });
    io.observe(offer);
  }
  function girarManual() {
    auto = false;
    girar();
  }
  hub.addEventListener("click", girarManual);
  btn.addEventListener("click", girarManual);

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

// Barra fija del celular: aparece al empezar a bajar, mientras la ruleta todavía
// no está en pantalla y la persona no giró; al tocarla la lleva a la ruleta.
(function () {
  var bar = document.getElementById("hw-go");
  var offer = document.getElementById("hw-offer");
  if (!bar || !offer) return;
  var ruletaVisible = false;
  function actualizar() {
    var girada = document.documentElement.classList.contains("hw-unlocked");
    var mostrar = !girada && !ruletaVisible && window.scrollY > 120 && offer.getBoundingClientRect().top > 0;
    bar.classList.toggle("is-visible", mostrar);
    bar.setAttribute("aria-hidden", mostrar ? "false" : "true");
    bar.tabIndex = mostrar ? 0 : -1;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) {
      ruletaVisible = e[0].isIntersecting;
      actualizar();
    }, { threshold: 0.25 }).observe(offer);
  }
  window.addEventListener("scroll", actualizar, { passive: true });
  actualizar();
})();
