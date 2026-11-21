// ============================================================
// Test "¿Activa es para ti?".
// Después de cada respuesta aparece UNA sola cosa, en lugar de las opciones:
//   - un testimonio real: se lee y pasa solo a la siguiente pregunta (5 s);
//   - un mapa mental o un beneficio/bono: con botón para seguir cuando quiera.
// Al final: análisis, perfil y porcentaje (entre 93% y 99%, según las
// respuestas, mostrado como resultado orientativo). No toca píxel ni rastreo.
// ============================================================
(function () {
  var T = {
    maria: { img: "avatar-maria.jpg", name: "María José", city: "Bogotá, Colombia", text: "Siempre me perdía entre tantos cursos. El sistema de mapas me mostró exactamente qué estudiar cada semana. En un mes ya entendía videos sin subtítulos." },
    franco: { img: "avatar-franco.jpg", name: "Franco Ríos", city: "Buenos Aires, Argentina", text: "Lo uso 15 minutos por día antes de trabajar. Es tan simple que por fin no abandoné un método de inglés." },
    carla: { img: "avatar-carla.jpg", name: "Carla Andrade", city: "Ciudad de México, México", text: "Me ayudó muchísimo para mi entrevista de trabajo en inglés. El mapa deja clarísimo qué aprender primero." },
    yohana: { img: "avatar-yohana.jpg", name: "Yohana Pérez", city: "Caracas, Venezuela", text: "Es el primer método que realmente pude seguir de principio a fin. Ahora entiendo canciones y series sin traducir todo." },
  };

  var LEER_MS = 5000; // tiempo de lectura del testimonio antes de pasar solo

  // Cada opción: [emoji, texto, puntos, valor para el perfil]
  // Cada pregunta muestra después: {tipo:"testi"} | {tipo:"mapa"} | {tipo:"bene"}
  var Q = [
    {
      q: "¿Ya intentaste aprender inglés antes?",
      o: [["🔁", "Sí, varias veces", 2, ""], ["☝️", "Sí, una vez", 1, ""], ["🙈", "Nunca empecé en serio", 1, ""]],
      show: function () {
        return { tipo: "testi", lead: "No eres la única persona. Mira lo que dice María:", who: "maria" };
      },
    },
    {
      q: "¿Cuál es tu mayor miedo al hablar inglés?",
      o: [["😶", "Quedarme en blanco", 1, ""], ["😳", "Que se burlen de mi pronunciación", 1, ""], ["👂", "No entender lo que me dicen", 1, ""], ["📝", "Equivocarme en la gramática", 1, ""]],
      show: function () {
        return {
          tipo: "mapa",
          t: "Ese miedo baja cuando ves todo claro en una sola hoja",
          img: 12,
          name: "Contracciones con To Be",
          b: "Cada mapa trae <b>pronunciación</b> y los <b>errores más comunes</b> para que no los repitas.",
        };
      },
    },
    {
      q: "Cuando alguien te habla en inglés, tú…",
      o: [["😰", "Me pongo nervioso", 1, ""], ["🧩", "Entiendo solo algunas palabras", 1, ""], ["🔄", "Traduzco todo en mi cabeza", 1, ""], ["🤐", "Entiendo, pero no sé responder", 1, ""]],
      show: function () {
        return { tipo: "testi", lead: "A Yohana le pasaba lo mismo:", who: "yohana" };
      },
    },
    {
      q: "¿Por qué dejaste de estudiar la última vez?",
      o: [["🌀", "Me perdí con tanto contenido", 1, ""], ["🥱", "Me aburrí", 1, ""], ["⏳", "No tenía tiempo", 1, ""], ["💸", "Era muy caro", 1, ""]],
      show: function (i) {
        var t = ["Aquí todo está en orden, del A1 al C2", "Visual y directo: un tema por hoja", "Bastan 15 minutos al día", "Pago único, sin mensualidades"][i];
        return {
          tipo: "bene",
          t: t,
          items: ["<b>+300 mapas mentales</b> organizados por nivel", "Explicación, ejemplos y <b>mini actividad</b> en cada mapa", "<b>Pago único</b> · Acceso inmediato · Sin suscripción"],
        };
      },
    },
    {
      q: "¿Cuánto tiempo puedes dedicar al día?",
      o: [["⏱️", "5 a 10 minutos", 1, "10 min/día"], ["⏰", "15 minutos", 2, "15 min/día"], ["🕒", "30 minutos o más", 2, "30 min/día"]],
      show: function () {
        return { tipo: "testi", lead: "Franco estudia 15 minutos por día:", who: "franco" };
      },
    },
    {
      q: "¿Para qué quieres el inglés?",
      o: [["💼", "Para mi trabajo", 1, "Trabajo"], ["✈️", "Para viajar", 1, "Viajar"], ["🎓", "Para estudiar", 1, "Estudios"], ["🎬", "Series, música y para mí", 1, "Para mí"]],
      show: function (i) {
        var m = [[3, "Profesiones"], [4, "Países"], [11, "Verbo To Be: preguntas"], [6, "Personas"]][i];
        return {
          tipo: "mapa",
          t: "Vocabulario y frases para la vida real",
          img: m[0],
          name: m[1],
          b: "Gramática, vocabulario y situaciones reales, explicado de forma <b>visual</b>.",
        };
      },
    },
    {
      q: "¿Cuál es tu nivel de inglés hoy?",
      o: [["🌱", "Desde cero", 1, "A1"], ["🙂", "Entiendo algo, pero no hablo", 1, "A2"], ["💬", "Me defiendo", 1, "B1"], ["🚀", "Intermedio o avanzado", 1, "B2"]],
      show: function () {
        return { tipo: "testi", lead: "Saber qué aprender primero lo cambia todo:", who: "carla" };
      },
    },
    {
      q: "¿Qué tan importante es para ti hablar inglés este año?",
      o: [["🔥", "Muy importante", 3, ""], ["👍", "Importante", 2, ""], ["🤔", "Quiero intentarlo", 1, ""]],
      show: function () {
        return {
          tipo: "bene",
          t: "Empiezas hoy y sin riesgo",
          items: ["<b>5 bonos de regalo</b>: 500 frases, phrasal verbs, expresiones, Ruta de Fluencia y +80 ebooks", "<b>Garantía de 7 días</b>", "Celular, tablet, computadora o <b>impreso</b>"],
        };
      },
    },
  ];

  var GRID = [11, 3, 12, 7, 9, 10, 8, 13];
  var XP_POR_PREGUNTA = 15;

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
  var raf = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(raf);
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

  function pasos(n) {
    var h = "";
    for (var k = 0; k < Q.length; k++) h += '<i class="' + (k < n ? "on" : k === n ? "cur" : "") + '"></i>';
    return h;
  }

  function cabecera(n) {
    return '<span class="qz-xp" id="qz-xp">⭐ ' + xp + " XP</span>" + '<div class="qz-steps-bar" id="qz-steps">' + pasos(n) + "</div>";
  }

  function pregunta() {
    clearTimers();
    var it = Q[step];
    body.innerHTML =
      cabecera(step) +
      '<p class="qz-count">Pregunta ' + (step + 1) + " de " + Q.length + "</p>" +
      '<p class="qz-q">' + esc(it.q) + "</p>" +
      '<div class="qz-area">' +
      '<div class="qz-opts">' +
      it.o
        .map(function (o, i) {
          return '<button type="button" class="qz-opt" data-i="' + i + '"><span class="qz-emo" aria-hidden="true">' + o[0] + "</span>" + esc(o[1]) + "</button>";
        })
        .join("") +
      "</div></div>";
    sheet.scrollTop = 0;
  }

  function responder(i) {
    var it = Q[step];
    var o = it.o[i];
    ans[step] = { i: i, pts: o[2], v: o[3] };
    var gana = XP_POR_PREGUNTA + o[2] * 5;
    xp += gana;
    var sel = body.querySelector('.qz-opt[data-i="' + i + '"]');
    Array.prototype.forEach.call(body.querySelectorAll(".qz-opt"), function (b) {
      b.disabled = true;
    });
    sel.classList.add("sel");
    var xpEl = document.getElementById("qz-xp");
    xpEl.textContent = "⭐ " + xp + " XP";
    xpEl.classList.remove("bump");
    void xpEl.offsetWidth;
    xpEl.classList.add("bump");
    document.getElementById("qz-steps").innerHTML = pasos(step + 1);
    // Breve confirmación de la opción elegida y luego aparece el contenido
    timers.push(setTimeout(function () {
      mostrar(it.show(i), gana);
    }, 450));
  }

  function mostrar(c, gana) {
    var ultimo = step === Q.length - 1;
    var area = body.querySelector(".qz-area");
    var plus = '<p class="qz-plus">+' + gana + " XP · ¡Respuesta " + (step + 1) + " de " + Q.length + "!</p>";
    var html = "";
    if (c.tipo === "testi") {
      var w = T[c.who];
      html =
        plus +
        '<div class="qz-card qz-tcard">' +
        '<p class="qz-lead">' + esc(c.lead) + "</p>" +
        '<div class="qz-who"><img src="' + w.img + '" alt="" width="64" height="64" /><div><strong>' + esc(w.name) + '</strong><span>' + esc(w.city) + '</span><span class="qz-st">★★★★★</span></div></div>' +
        '<blockquote>“' + esc(w.text) + "”</blockquote>" +
        "</div>" +
        '<div class="qz-auto"><div class="qz-auto-bar"><i id="qz-auto"></i></div><p>' + (ultimo ? "Preparando tu resultado…" : "Siguiente pregunta en un momento…") + "</p></div>";
    } else if (c.tipo === "mapa") {
      html =
        plus +
        '<div class="qz-card qz-map">' +
        '<p class="qz-card-t">🔓 ' + esc(c.t) + "</p>" +
        '<img src="mapa-preview-' + c.img + '.jpg" alt="Mapa mental: ' + esc(c.name) + '" />' +
        '<p class="qz-map-n">Mapa mental: <b>' + esc(c.name) + "</b> · uno de los +300</p>" +
        '<p class="qz-card-p">' + c.b + "</p>" +
        "</div>" +
        '<button type="button" class="qz-next">' + (ultimo ? "Ver mi resultado" : "Siguiente pregunta") + " →</button>";
    } else {
      html =
        plus +
        '<div class="qz-card qz-bene">' +
        '<p class="qz-card-t">✅ ' + esc(c.t) + "</p>" +
        '<ul class="qz-why">' + c.items.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" +
        "</div>" +
        '<button type="button" class="qz-next">' + (ultimo ? "Ver mi resultado" : "Siguiente pregunta") + " →</button>";
    }
    area.innerHTML = '<div class="qz-fb">' + html + "</div>";
    sheet.scrollTop = 0;
    if (c.tipo === "testi") {
      var bar = document.getElementById("qz-auto");
      var t0 = performance.now();
      (function f(now) {
        var q = Math.min(1, (now - t0) / LEER_MS);
        if (bar) bar.style.width = q * 100 + "%";
        if (q < 1) raf = requestAnimationFrame(f);
      })(t0);
      timers.push(setTimeout(siguiente, LEER_MS));
    }
  }

  function siguiente() {
    clearTimers();
    step++;
    if (step < Q.length) pregunta();
    else analizar();
  }

  function analizar() {
    var etapas = ["Analizando tus respuestas", "Cruzando tu perfil con los +300 mapas", "Armando tu ruta de estudio", "Calculando cuánto combinas con Activa"];
    var C = 2 * Math.PI * 46;
    body.innerHTML =
      cabecera(Q.length) +
      '<div class="qz-load">' +
      '<div class="qz-deck">' + GRID.map(function (n, k) { return '<img src="mapa-preview-' + n + '.jpg" alt="" style="opacity:0" data-k="' + k + '" />'; }).join("") + "</div>" +
      '<div class="qz-ring"><svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="46" fill="none" stroke="#eef0fa" stroke-width="10"/><circle id="qz-arc" cx="55" cy="55" r="46" fill="none" stroke="#e63946" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><div class="qz-ring-num" id="qz-pct">0%</div></div>' +
      '<p class="qz-q" style="margin:0 0 8px;font-size:22px">Analizando tus respuestas…</p><ul class="qz-steps">' +
      etapas.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") +
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
        li.className = q >= (k + 1) / lis.length ? "done" : q >= k / lis.length ? "doing" : "";
      });
      var shown = Math.min(deck.length, Math.floor(q * (deck.length + 1)));
      Array.prototype.forEach.call(deck, function (im, k) {
        var on = k < shown;
        im.style.opacity = on ? 1 : 0;
        im.style.transform = on ? "rotate(" + ((k % 2 ? 1 : -1) * (3 + k)) + "deg) translateY(" + -k * 2 + "px)" : "translateY(40px) scale(.8)";
      });
      if (q < 1) raf = requestAnimationFrame(frame);
      else timers.push(setTimeout(resultado, 450));
    }
    raf = requestAnimationFrame(frame);
  }

  function resultado() {
    var pts = ans.reduce(function (s, a) { return s + (a ? a.pts : 0); }, 0);
    var min = 8, max = 12; // puntos posibles
    var pct = Math.max(93, Math.min(99, 93 + Math.round(((pts - min) / (max - min)) * 6)));
    var nivel = ans[6].v;
    var meta = ans[5].v;
    var tiempo = ans[4].v;
    var perfil = ["Aprendiz persistente", "Aprendiz decidido", "Aprendiz que empieza con todo"][ans[0].i] || "Aprendiz decidido";
    var C = 2 * Math.PI * 72;
    var why = [
      "Empiezas en el <b>" + nivel + "</b> y avanzas en orden, sin perderte.",
      "Con <b>" + tiempo + "</b> ya avanzas: un mapa por sesión.",
      "Todo explicado de forma visual, con <b>errores comunes</b> y pronunciación.",
      "<b>Pago único</b>, acceso inmediato y <b>garantía de 7 días</b>.",
    ];
    var girada = document.documentElement.classList.contains("hw-unlocked");
    body.innerHTML =
      '<canvas class="qz-confetti" id="qz-conf"></canvas>' +
      cabecera(Q.length) +
      '<div class="qz-res">' +
      '<span class="qz-badge">🏆 Logro desbloqueado: ' + esc(perfil) + "</span>" +
      '<div class="qz-match"><svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="72" fill="none" stroke="#eef0fa" stroke-width="14"/><circle id="qz-marc" cx="85" cy="85" r="72" fill="none" stroke="#21b573" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><div class="qz-match-num"><span id="qz-mnum">0%</span><small>combina contigo</small></div></div>' +
      '<p class="qz-big">¡Activa tu Inglés es para ti!</p>' +
      '<div class="qz-score"><div><b>' + xp + '</b><span>XP</span></div><div><b>' + Q.length + "/" + Q.length + '</b><span>Respuestas</span></div><div><b>' + esc(nivel) + '</b><span>Empiezas en</span></div></div>' +
      '<p class="qz-sub">Algunos de tus +300 mapas</p><div class="qz-grid">' + GRID.map(function (n, k) { return '<img src="mapa-preview-' + n + '.jpg" alt="" style="animation-delay:' + (0.15 + k * 0.08) + 's" />'; }).join("") + "</div>" +
      '<p class="qz-more">…y +290 mapas más, del A1 al C2</p>' +
      '<div class="qz-chips"><div class="qz-chip"><span>Tu meta</span><b>' + esc(meta) + '</b></div><div class="qz-chip"><span>Tu ritmo</span><b>' + esc(tiempo) + "</b></div></div>" +
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
      if (q < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    confeti();
  }

  function confeti() {
    var cv = document.getElementById("qz-conf");
    if (!cv || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var W = (cv.width = sheet.clientWidth);
    var H = (cv.height = sheet.clientHeight);
    var ctx = cv.getContext("2d");
    var cols = ["#e63946", "#16215c", "#f4c430", "#21b573", "#ffffff"];
    var P = [];
    for (var k = 0; k < 110; k++) P.push({ x: W / 2, y: H * 0.25, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 3, r: Math.random() * 6 + 4, c: cols[k % cols.length], a: Math.random() * 6 });
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
