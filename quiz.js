// ============================================================
// Test "¿Activa es para ti?": preguntas con beneficio, bullet y
// testimonio real en cada respuesta, análisis y perfil final.
// El porcentaje sale de las respuestas (entre 93% y 99%) y se muestra
// como resultado orientativo. No toca píxel ni rastreo.
// ============================================================
(function () {
  var T = {
    maria: { img: "avatar-maria.jpg", name: "María José · Bogotá", text: "Siempre me perdía entre tantos cursos. El sistema de mapas me mostró exactamente qué estudiar cada semana." },
    franco: { img: "avatar-franco.jpg", name: "Franco Ríos · Buenos Aires", text: "Lo uso 15 minutos por día antes de trabajar. Es tan simple que por fin no abandoné un método de inglés." },
    carla: { img: "avatar-carla.jpg", name: "Carla Andrade · Ciudad de México", text: "Me ayudó muchísimo para mi entrevista de trabajo en inglés. El mapa deja clarísimo qué aprender primero." },
    yohana: { img: "avatar-yohana.jpg", name: "Yohana Pérez · Caracas", text: "Es el primer método que realmente pude seguir de principio a fin. Ahora entiendo canciones y series sin traducir todo." },
  };

  // Cada opción: [emoji, texto, puntos, valor para el perfil]
  var Q = [
    {
      key: "nivel",
      q: "¿Cuál es tu nivel de inglés hoy?",
      o: [["🌱", "Desde cero", 1, "A1"], ["🙂", "Entiendo algo, pero no hablo", 1, "A2"], ["💬", "Me defiendo", 1, "B1"], ["🚀", "Intermedio o avanzado", 1, "B2"]],
      fb: function (v) {
        return {
          t: "Empiezas exactamente en tu nivel: " + v,
          p: "No tienes que adivinar qué estudiar: los mapas están organizados del A1 al C2 y avanzas en orden.",
          b: "<b>+300 mapas mentales</b> separados por nivel",
          who: "maria",
        };
      },
    },
    {
      key: "meta",
      q: "¿Para qué quieres el inglés?",
      o: [["💼", "Para mi trabajo", 1, "Trabajo"], ["✈️", "Para viajar", 1, "Viajar"], ["🎓", "Para estudiar", 1, "Estudios"], ["🎬", "Series, música y para mí", 1, "Para mí"]],
      fb: function (v) {
        var w = v === "Trabajo" || v === "Estudios" ? "carla" : "yohana";
        return {
          t: "Activa te sirve para " + (v === "Para mí" ? "disfrutar el inglés" : v.toLowerCase()),
          p: "Aprendes vocabulario, gramática y frases de situaciones reales, explicado de forma visual en una sola hoja.",
          b: "Explicación, <b>ejemplos prácticos</b> y errores comunes en cada mapa",
          who: w,
        };
      },
    },
    {
      key: "bloqueo",
      q: "¿Qué te pasa cuando intentas hablar?",
      o: [["😶", "Me quedo en blanco", 1, ""], ["🔁", "Pienso en español y traduzco", 1, ""], ["😳", "Me da vergüenza equivocarme", 1, ""], ["🤏", "Hablo, pero con errores", 1, ""]],
      fb: function () {
        return {
          t: "Es más común de lo que crees, y tiene solución",
          p: "Cuando ves la estructura clara en una hoja, la frase sale sin tener que traducir palabra por palabra.",
          b: "Cada mapa muestra <b>los errores más comunes</b> para que no los repitas",
          who: "yohana",
        };
      },
    },
    {
      key: "tiempo",
      q: "¿Cuánto tiempo puedes dedicar al día?",
      o: [["⏱️", "5 a 10 minutos", 1, "10 min/día"], ["⏰", "15 minutos", 2, "15 min/día"], ["🕒", "30 minutos", 2, "30 min/día"], ["📚", "Más de 30 minutos", 2, "+30 min/día"]],
      fb: function () {
        return {
          t: "Con 15 minutos al día ya avanzas",
          p: "Un mapa por sesión: lo lees, practicas con la mini actividad y listo. Sin clases largas ni horarios.",
          b: "Estudia <b>a tu ritmo</b>, cuando quieras",
          who: "franco",
        };
      },
    },
    {
      key: "freno",
      q: "¿Qué te ha frenado hasta ahora?",
      o: [["🌀", "Me pierdo con tanto contenido", 1, ""], ["🥱", "Me aburro y lo dejo", 1, ""], ["💸", "Los cursos son caros", 1, ""], ["🏃", "Empiezo y abandono a la mitad", 1, ""]],
      fb: function (v, i) {
        var t = ["Todo en un solo lugar y en orden", "Visual y directo: nada de clases eternas", "Pago único, sin mensualidades", "Un camino claro de principio a fin"][i];
        return {
          t: t,
          p: "Se acabó buscar una explicación en YouTube, otra en Google y terminar con apuntes por todas partes.",
          b: "<b>Pago único</b> · Acceso inmediato · Sin suscripción",
          who: i === 3 ? "yohana" : "maria",
        };
      },
    },
    {
      key: "estilo",
      q: "¿Cómo aprendes mejor?",
      o: [["👀", "Viendo esquemas y colores", 2, "Visual"], ["✍️", "Leyendo y escribiendo", 1, "Lector"], ["🧩", "Practicando con ejemplos", 1, "Práctico"], ["🗣️", "Repitiendo en voz alta", 1, "Auditivo"]],
      fb: function () {
        return {
          t: "Los mapas mentales se adaptan a tu forma de aprender",
          p: "Colores, iconos y ejemplos ayudan a tu memoria a guardar la información de forma organizada.",
          b: "Pronunciación y <b>mini actividad</b> para practicar en cada mapa",
          who: "franco",
        };
      },
    },
    {
      key: "lugar",
      q: "¿Dónde prefieres estudiar?",
      o: [["📱", "En el celular", 1, "Celular"], ["💻", "En la computadora", 1, "Computadora"], ["📲", "En la tablet", 1, "Tablet"], ["🖨️", "Impreso, en papel", 1, "Impreso"]],
      fb: function (v) {
        return {
          t: "Perfecto: funciona " + (v === "Impreso" ? "impreso" : "en tu " + v.toLowerCase()) + " y en todos lados",
          p: "Recibes todo al instante por correo, en alta resolución. Lo abres en cualquier dispositivo o lo imprimes.",
          b: "<b>Acceso inmediato</b> · Celular, tablet, computadora o impreso",
          who: "carla",
        };
      },
    },
    {
      key: "compromiso",
      q: "¿Qué tan importante es para ti mejorar tu inglés este año?",
      o: [["🔥", "Muy importante", 3, ""], ["👍", "Importante", 2, ""], ["🤔", "Quiero intentarlo", 1, ""]],
      fb: function () {
        return {
          t: "Puedes empezar hoy, sin riesgo",
          p: "Si en 7 días sientes que no es para ti, tienes garantía. Y además te llevas 5 bonos de regalo.",
          b: "<b>Garantía de 7 días</b> · 5 bonos de regalo",
          who: "maria",
        };
      },
    },
  ];

  // Vista previa de un mapa real en cada respuesta: [archivo, nombre]
  var MAPAS = [
    [11, "Verbo To Be: preguntas"], [3, "Profesiones"], [12, "Contracciones con To Be"], [7, "Singular y plural"],
    [9, "There is / There are"], [10, "Artículos: a, an y the"], [8, "This, that, these y those"], [13, "Adjetivos posesivos"],
  ];
  var XP_POR_PREGUNTA = 15;

  var PERFIL = {
    Visual: "Aprendiz visual",
    Lector: "Aprendiz organizado",
    Práctico: "Aprendiz práctico",
    Auditivo: "Aprendiz comunicativo",
  };

  var entry = document.getElementById("qz-open");
  if (!entry) return;

  var root = document.createElement("div");
  root.className = "qz";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Test: ¿Activa es para ti?");
  root.innerHTML = '<div class="qz-sheet"><button type="button" class="qz-close" aria-label="Cerrar">×</button><div class="qz-body"></div></div>';
  document.body.appendChild(root);
  var body = root.querySelector(".qz-body");
  var sheet = root.querySelector(".qz-sheet");

  var step = 0;
  var ans = [];
  var timers = [];
  var xp = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function open() {
    step = 0;
    ans = [];
    xp = 0;
    root.classList.add("open");
    document.documentElement.classList.add("qz-lock");
    pregunta();
  }

  function close() {
    clearTimers();
    root.classList.remove("open");
    document.documentElement.classList.remove("qz-lock");
  }

  function estrellas(n) {
    var h = "";
    for (var k = 0; k < Q.length; k++) h += '<span class="' + (k < n ? "on" : "") + '">★</span>';
    return h;
  }

  function pregunta() {
    var it = Q[step];
    body.innerHTML =
      '<span class="qz-xp" id="qz-xp">⭐ ' + xp + " XP</span>" +
      '<div class="qz-stars" id="qz-stars">' + estrellas(step) + "</div>" +
      '<p class="qz-count">Pregunta ' + (step + 1) + " de " + Q.length + "</p>" +
      '<p class="qz-q">' + esc(it.q) + "</p>" +
      '<div class="qz-opts">' +
      it.o
        .map(function (o, i) {
          return '<button type="button" class="qz-opt" data-i="' + i + '"><span class="qz-emo" aria-hidden="true">' + o[0] + "</span>" + esc(o[1]) + "</button>";
        })
        .join("") +
      '</div><div class="qz-fbwrap"></div>';
    sheet.scrollTop = 0;
  }

  function responder(i) {
    var it = Q[step];
    var o = it.o[i];
    ans[step] = { i: i, pts: o[2], v: o[3], t: o[1] };
    Array.prototype.forEach.call(body.querySelectorAll(".qz-opt"), function (b) {
      b.disabled = true;
      if (+b.getAttribute("data-i") === i) b.classList.add("sel");
    });
    xp += XP_POR_PREGUNTA + o[2] * 5;
    var xpEl = document.getElementById("qz-xp");
    xpEl.textContent = "⭐ " + xp + " XP";
    xpEl.classList.remove("bump");
    void xpEl.offsetWidth;
    xpEl.classList.add("bump");
    document.getElementById("qz-stars").innerHTML = estrellas(step + 1);
    var fb = it.fb(o[3], i);
    var w = T[fb.who];
    var m = MAPAS[step];
    var ultimo = step === Q.length - 1;
    body.querySelector(".qz-fbwrap").innerHTML =
      '<div class="qz-fb"><p class="qz-plus">+' + (XP_POR_PREGUNTA + o[2] * 5) + " XP · ¡Estrella " + (step + 1) + " de " + Q.length + "! ⭐</p>" +
      '<div class="qz-unlock"><p class="qz-unlock-t">🔓 ¡Desbloqueaste una vista previa!</p><img src="mapa-preview-' + m[0] + '.jpg" alt="Mapa mental: ' + esc(m[1]) + '" loading="lazy" /><p class="qz-unlock-n">Mapa mental: ' + esc(m[1]) + " · uno de los +300</p></div>" +
      '<div class="qz-ben"><p class="qz-fb-title">' + esc(fb.t) + '</p><p class="qz-fb-text">' + esc(fb.p) + '</p><p class="qz-fb-bullet">' + fb.b + "</p>" +
      '<div class="qz-testi"><img src="' + w.img + '" alt="" width="44" height="44" loading="lazy" /><p><strong>' + esc(w.name) + ' <span class="qz-st">★★★★★</span></strong>“' + esc(w.text) + "”</p></div></div></div>" +
      '<button type="button" class="qz-next">' + (ultimo ? "Ver mi resultado" : "Siguiente") + " →</button>";
    var nx = body.querySelector(".qz-next");
    timers.push(setTimeout(function () {
      var f = body.querySelector(".qz-fb");
      sheet.scrollTo({ top: f.offsetTop - 12, behavior: "smooth" });
    }, 120));
  }

  function siguiente() {
    step++;
    if (step < Q.length) pregunta();
    else analizar();
  }

  function analizar() {
    var pasos = ["Analizando tu nivel y tu objetivo", "Cruzando tus respuestas con los +300 mapas", "Armando tu ruta de estudio", "Calculando cuánto combinas con Activa"];
    var C = 2 * Math.PI * 46;
    body.innerHTML =
      '<span class="qz-xp">⭐ ' + xp + " XP</span>" +
      '<div class="qz-load"><div class="qz-stars">' + estrellas(Q.length) + "</div>" +
      '<div class="qz-deck">' + MAPAS.map(function (m, k) { return '<img src="mapa-preview-' + m[0] + '.jpg" alt="" style="opacity:0" data-k="' + k + '" />'; }).join("") + "</div>" +
      '<div class="qz-ring"><svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="46" fill="none" stroke="#f1e8d4" stroke-width="10"/><circle id="qz-arc" cx="55" cy="55" r="46" fill="none" stroke="#e63946" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><div class="qz-ring-num" id="qz-pct">0%</div></div>' +
      '<p class="qz-q" style="margin:0 0 8px;font-size:22px">Analizando tus respuestas…</p><ul class="qz-steps">' +
      pasos.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
      "</ul></div>";
    sheet.scrollTop = 0;
    var DUR = 5600;
    var t0 = performance.now();
    var lis = body.querySelectorAll(".qz-steps li");
    var deck = body.querySelectorAll(".qz-deck img");
    var arc = document.getElementById("qz-arc");
    var num = document.getElementById("qz-pct");
    function frame(now) {
      if (!root.classList.contains("open")) return;
      var q = Math.min(1, (now - t0) / DUR);
      var e = q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2;
      arc.setAttribute("stroke-dashoffset", C * (1 - e));
      num.textContent = Math.round(e * 100) + "%";
      Array.prototype.forEach.call(lis, function (li, k) {
        var a = k / lis.length;
        var b = (k + 1) / lis.length;
        li.className = q >= b ? "done" : q >= a ? "doing" : "";
      });
      // los mapas se van apilando, uno por uno
      var shown = Math.min(deck.length, Math.floor(q * (deck.length + 1)));
      Array.prototype.forEach.call(deck, function (im, k) {
        var on = k < shown;
        im.style.opacity = on ? 1 : 0;
        im.style.transform = on ? "rotate(" + ((k % 2 ? 1 : -1) * (3 + k)) + "deg) translateY(" + (-k * 2) + "px)" : "translateY(40px) scale(.8)";
      });
      if (q < 1) requestAnimationFrame(frame);
      else timers.push(setTimeout(resultado, 450));
    }
    requestAnimationFrame(frame);
  }

  function val(key) {
    for (var k = 0; k < Q.length; k++) if (Q[k].key === key) return ans[k];
    return null;
  }

  function resultado() {
    var pts = ans.reduce(function (s, a) { return s + (a ? a.pts : 0); }, 0);
    // Puntos posibles: 8 a 14 → 93% a 99%
    var pct = Math.max(93, Math.min(99, 93 + Math.round(((pts - 8) / 6) * 6)));
    var nivel = val("nivel").v;
    var meta = val("meta").v;
    var tiempo = val("tiempo").v;
    var lugar = val("lugar").v;
    var perfil = PERFIL[val("estilo").v] || "Aprendiz decidido";
    var C = 2 * Math.PI * 72;
    var why = [
      "Empiezas en el <b>" + nivel + "</b> y avanzas en orden, sin perderte.",
      "Con <b>" + tiempo + "</b> ya avanzas: un mapa por sesión.",
      "Lo estudias en " + (lugar === "Impreso" ? "<b>papel</b>" : "tu <b>" + lugar.toLowerCase() + "</b>") + " y en cualquier dispositivo.",
      "<b>Pago único</b>, acceso inmediato y <b>garantía de 7 días</b>.",
    ];
    var girada = document.documentElement.classList.contains("hw-unlocked");
    body.innerHTML =
      '<canvas class="qz-confetti" id="qz-conf"></canvas>' +
      '<div class="qz-res"><div class="qz-stars">' + estrellas(Q.length) + "</div>" +
      '<span class="qz-badge">🏆 Logro desbloqueado: ' + esc(perfil) + "</span>" +
      '<p class="qz-res-profile">Tu meta: ' + esc(meta.toLowerCase()) + "</p>" +
      '<div class="qz-match"><svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="72" fill="none" stroke="#e8f6ee" stroke-width="14"/><circle id="qz-marc" cx="85" cy="85" r="72" fill="none" stroke="#21b573" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><div class="qz-match-num"><span id="qz-mnum">0%</span><small>combina contigo</small></div></div>' +
      '<p class="qz-big">¡Activa tu Inglés es para ti!</p>' +
      '<div class="qz-score"><div><b>' + xp + '</b><span>XP</span></div><div><b>' + Q.length + "/" + Q.length + '</b><span>Estrellas</span></div><div><b>' + MAPAS.length + '</b><span>Mapas vistos</span></div></div>' +
      '<p class="qz-sub">Los mapas que ya viste</p><div class="qz-grid">' + MAPAS.map(function (m, k) { return '<img src="mapa-preview-' + m[0] + '.jpg" alt="' + esc(m[1]) + '" style="animation-delay:' + (0.15 + k * 0.08) + 's" />'; }).join("") + "</div>" +
      '<p class="qz-more">…y te esperan +290 mapas más, del A1 al C2</p>' +
      '<div class="qz-chips"><div class="qz-chip"><span>Empiezas en</span><b>' + esc(nivel) + '</b></div><div class="qz-chip"><span>Tu ritmo</span><b>' + esc(tiempo) + '</b></div><div class="qz-chip"><span>Tu meta</span><b>' + esc(meta) + '</b></div><div class="qz-chip"><span>Estudias en</span><b>' + esc(lugar) + "</b></div></div>" +
      '<ul class="qz-why">' + why.map(function (w) { return "<li>" + w + "</li>"; }).join("") + "</ul>" +
      '<a href="#comprar" data-checkout target="_blank" rel="noopener" class="cta qz-cta">' + (girada ? "Quiero empezar ahora" : "Desbloquear mi precio Black Friday") + " →</a>" +
      '<p class="qz-micro">Pago único · Acceso inmediato · Garantía de 7 días</p>' +
      '<p class="qz-note">Resultado orientativo según tus respuestas.</p></div>';
    sheet.scrollTop = 0;
    if (window.CHECKOUT_URL) body.querySelector(".qz-cta").href = window.CHECKOUT_URL;
    var t0 = performance.now();
    var arc = document.getElementById("qz-marc");
    var num = document.getElementById("qz-mnum");
    function frame(now) {
      var q = Math.min(1, (now - t0) / 1400);
      var e = 1 - Math.pow(1 - q, 3);
      arc.setAttribute("stroke-dashoffset", C * (1 - (e * pct) / 100));
      num.textContent = Math.round(e * pct) + "%";
      if (q < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    confeti();
  }

  function confeti() {
    var cv = document.getElementById("qz-conf");
    if (!cv || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var W = (cv.width = sheet.clientWidth);
    var H = (cv.height = sheet.clientHeight);
    var ctx = cv.getContext("2d");
    var cols = ["#e63946", "#ffc93c", "#16215c", "#21b573", "#5b7cfa"];
    var P = [];
    for (var k = 0; k < 110; k++) P.push({ x: W / 2, y: H * 0.28, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 3, r: Math.random() * 6 + 4, c: cols[k % cols.length], a: Math.random() * 6 });
    var t0 = performance.now();
    function f(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      P.forEach(function (p) {
        p.vy += 0.28;
        p.x += p.vx;
        p.y += p.vy;
        p.a += 0.2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.globalAlpha = Math.max(0, 1 - t / 2.6);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
      });
      if (t < 2.6 && root.classList.contains("open")) requestAnimationFrame(f);
      else ctx.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(f);
  }

  entry.addEventListener("click", open);
  root.querySelector(".qz-close").addEventListener("click", close);
  root.addEventListener("click", function (e) {
    if (e.target === root) close();
    var opt = e.target.closest ? e.target.closest(".qz-opt") : null;
    if (opt && !opt.disabled) responder(+opt.getAttribute("data-i"));
    if (e.target.closest && e.target.closest(".qz-next")) siguiente();
  });
  // Al tocar el botón final se cierra el test; si la ruleta no se giró,
  // blackfriday.js lleva a la ruleta, y si ya se giró, abre el checkout.
  window.addEventListener(
    "click",
    function (e) {
      if (e.target.closest && e.target.closest(".qz-cta")) close();
    },
    true
  );
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("open")) close();
  });
})();
