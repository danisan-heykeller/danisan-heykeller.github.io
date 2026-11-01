(function () {
  "use strict";
  var DH = window.DH;
  var ROOT = document.body.getAttribute("data-root") || "./";
  var PAGE = document.body.getAttribute("data-page"); // "home" or a monument id
  var $ = function (id) { return document.getElementById(id); };

  var T = {
    az: {
      calling: "zəng edir...", accept: "Qəbul et", decline: "Rədd et", hang: "Bitir",
      declined: "Zəng rədd edildi.", callBack: "Geri zəng et",
      collected: function (n, t) { return "<b>" + n + "</b> / " + t + " zəng toplanıb"; },
      deck: "Danışan heykəllər", locked: "???",
      again: "Yenidən dinlə", share: "Dostuna göndər", copied: "Link kopyalandı",
      copyFail: "Linki ünvan sətrindən kopyala", tr: "Monoloqun mətni", home: "Bütün heykəllər",
      hint: "Qalan heykəllər gizlidir. Onları tap, yanındakı QR kodu skan et - və zəngi qəbul et.",
      foot: "Danışan heykəllər · Bakının abidələri danışır",
      heroTitle: "Bakının heykəlləri danışır",
      heroLead: "Abidənin yanındakı QR kodu skan edin - və o sizə zəng edəcək. Hər heykəl öz hekayəsini danışır.",
      how: ["Heykəlin yanında QR kodu tapın", "Telefonun kamerası ilə skan edin", "Zəngi qəbul edin və dinləyin", "Bütün zəngləri toplayın"],
      howTitle: "Necə işləyir", audioErr: "Səs yüklənmədi. İnterneti yoxlayın və yenidən cəhd edin."
    },
    ru: {
      calling: "звонит...", accept: "Принять", decline: "Отклонить", hang: "Завершить",
      declined: "Звонок отклонён.", callBack: "Перезвонить",
      collected: function (n, t) { return "<b>" + n + "</b> из " + t + " звонков собрано"; },
      deck: "Говорящие памятники", locked: "???",
      again: "Послушать ещё раз", share: "Отправить другу", copied: "Ссылка скопирована",
      copyFail: "Скопируйте ссылку из адресной строки", tr: "Текст монолога", home: "Все памятники",
      hint: "Остальные памятники скрыты. Найдите их, отсканируйте QR рядом - и примите звонок.",
      foot: "Danışan heykəllər · памятники Баку разговаривают",
      heroTitle: "Памятники Баку разговаривают",
      heroLead: "Отсканируйте QR-код у памятника - и он вам позвонит. Каждый рассказывает свою историю.",
      how: ["Найдите QR-код у памятника", "Отсканируйте камерой телефона", "Примите звонок и слушайте", "Соберите все звонки"],
      howTitle: "Как это работает", audioErr: "Звук не загрузился. Проверьте интернет и попробуйте ещё раз."
    }
  };

  /* ---------- storage (per-viewer, never required) ---------- */
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function collected() {
    var a = [];
    try { a = JSON.parse(sget("dh-collected") || "[]"); } catch (e) {}
    return Array.isArray(a) ? a : [];
  }
  function collect(id) {
    var c = collected();
    if (c.indexOf(id) < 0) { c.push(id); sset("dh-collected", JSON.stringify(c)); }
  }

  /* ---------- analytics (GoatCounter, only when a code is set) ---------- */
  var params = new URLSearchParams(location.search);
  var from = params.get("from");
  function track(evt) {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: PAGE + "-" + evt, event: true }); } catch (e) {}
  }
  if (DH.analytics) {
    window.goatcounter = { path: function (p) { return p + (from ? "?from=" + from : ""); } };
    var gs = document.createElement("script");
    gs.async = true; gs.src = "https://gc.zgo.at/count.js";
    gs.setAttribute("data-goatcounter", "https://" + DH.analytics + ".goatcounter.com/count");
    document.head.appendChild(gs);
  }

  /* ---------- language ---------- */
  var lang = sget("dh-lang");
  if (!T[lang]) lang = (navigator.language || "").slice(0, 2).toLowerCase() === "az" ? "az" : "ru";
  function bindLangs(onChange) {
    ["az", "ru"].forEach(function (k) {
      var b = $("lang-" + k);
      if (!b) return;
      b.addEventListener("click", function () { lang = k; sset("dh-lang", k); paintLangs(); onChange(); });
    });
    paintLangs();
  }
  function paintLangs() {
    ["az", "ru"].forEach(function (k) { var b = $("lang-" + k); if (b) b.setAttribute("aria-pressed", k === lang ? "true" : "false"); });
    document.documentElement.lang = lang;
  }

  /* ---------- deck of cards ---------- */
  function renderDeck(el, currentId) {
    var got = collected(), t = T[lang];
    el.innerHTML = "";
    DH.monuments.forEach(function (m) {
      var has = got.indexOf(m.id) >= 0 && m.name;
      var tile = document.createElement(has ? "a" : "div");
      tile.className = "tile " + (has ? "got" : "locked");
      if (has) tile.href = ROOT + m.id + "/";
      var nm = document.createElement("span"); nm.className = "nm";
      nm.textContent = has ? m.name[lang] : t.locked;
      var ar = document.createElement("span"); ar.className = "ar";
      ar.textContent = m.area[lang];
      tile.appendChild(nm); tile.appendChild(ar);
      if (m.id === currentId && has) tile.setAttribute("aria-current", "true");
      el.appendChild(tile);
    });
    return got.length;
  }

  /* ---------- home page ---------- */
  function home() {
    function paint() {
      var t = T[lang];
      $("heroTitle").textContent = t.heroTitle;
      $("heroLead").textContent = t.heroLead;
      $("howTitle").textContent = t.howTitle;
      var ol = $("how"); ol.innerHTML = "";
      t.how.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      $("deckEyebrow").textContent = t.deck;
      var n = renderDeck($("deck"), null);
      $("count").innerHTML = t.collected(n, DH.monuments.length);
      $("foot").textContent = t.foot;
    }
    bindLangs(paint); paint();
  }

  /* ---------- monument call page ---------- */
  function call(m) {
    var audio = new Audio(); audio.preload = "auto";
    var state = "ring", clock = null, spans = [], maxSeen = 0;

    function fmt(s) { s = Math.max(0, Math.floor(s)); var r = s % 60; return Math.floor(s / 60) + ":" + (r < 10 ? "0" : "") + r; }
    function show(id, on) { $(id).hidden = !on; }

    function paintStatic() {
      var t = T[lang];
      document.title = m.name[lang] + " · Danışan heykəllər";
      $("name").textContent = m.name[lang];
      $("role").textContent = m.role[lang];
      $("place").textContent = m.area[lang];
      $("acceptLbl").textContent = t.accept;
      $("declineLbl").textContent = t.decline;
      $("hangLbl").textContent = t.hang;
      $("again").textContent = t.again;
      $("share").textContent = t.share;
      $("homeLink").textContent = t.home;
      $("trSum").textContent = t.tr;
      $("hint").textContent = t.hint;
      $("foot").textContent = t.foot;
      $("callBack").textContent = t.callBack;
      if (state === "ring") $("status").textContent = t.calling;
      if (state === "declined") $("status").textContent = t.declined;
      var tb = $("trBody"); tb.innerHTML = "";
      var p = document.createElement("p");
      m.cues[lang].forEach(function (c, i) { p.appendChild(document.createTextNode((i ? " " : "") + c.s)); });
      tb.appendChild(p);
      if (state === "done") paintDone();
    }

    function buildSubs() {
      var box = $("subs"); box.innerHTML = ""; spans = [];
      m.cues[lang].forEach(function (c, i) {
        var s = document.createElement("span"); s.textContent = c.s;
        box.appendChild(s); if (i < m.cues[lang].length - 1) box.appendChild(document.createTextNode(" "));
        spans.push(s);
      });
    }
    function sync() {
      var t = audio.currentTime, cues = m.cues[lang], idx = 0;
      for (var i = 0; i < cues.length; i++) if (cues[i].t <= t + 0.05) idx = i;
      spans.forEach(function (s, i) { s.className = i < idx ? "past" : (i === idx ? "now" : ""); });
      var cur = spans[idx], box = $("subs");
      if (cur) {
        var top = cur.offsetTop - box.offsetTop;
        if (top > box.scrollTop + box.clientHeight - 48 || top < box.scrollTop) box.scrollTop = Math.max(0, top - 24);
      }
      $("status").textContent = fmt(t);
      if (audio.duration) maxSeen = Math.max(maxSeen, t / audio.duration);
    }

    function start() {
      state = "call";
      $("caller").classList.remove("ringing");
      $("caller").classList.add("speaking");
      show("ringActions", false); show("declinedActions", false); show("callActions", true);
      show("wave", true); show("subs", true); show("done", false);
      buildSubs(); maxSeen = 0;
      audio.src = m.audio[lang];
      audio.currentTime = 0;
      var pr = audio.play();
      if (pr && pr.catch) pr.catch(function () { $("status").textContent = T[lang].audioErr; });
      clearInterval(clock); clock = setInterval(sync, 200);
      track("accepted");
    }
    function finish() {
      clearInterval(clock);
      try { audio.pause(); } catch (e) {}
      if (maxSeen >= 0.6) { collect(m.id); track("completed"); }
      state = "done";
      $("caller").classList.remove("speaking");
      show("wave", false); show("subs", false); show("callActions", false);
      paintDone(); show("done", true);
    }
    function paintDone() {
      var t = T[lang];
      var n = renderDeck($("deck"), m.id);
      $("count").innerHTML = t.collected(n, DH.monuments.length);
      $("deckEyebrow").textContent = t.deck;
    }

    audio.addEventListener("ended", function () { maxSeen = 1; if (state === "call") finish(); });
    audio.addEventListener("error", function () { if (state === "call") $("status").textContent = T[lang].audioErr; });

    $("accept").addEventListener("click", start);
    $("hangup").addEventListener("click", finish);
    $("again").addEventListener("click", start);
    $("callBack").addEventListener("click", start);
    $("decline").addEventListener("click", function () {
      state = "declined";
      $("caller").classList.remove("ringing");
      show("ringActions", false); show("declinedActions", true);
      $("status").textContent = T[lang].declined;
      track("declined");
    });
    $("share").addEventListener("click", function () {
      var url = location.origin + location.pathname + "?from=share", t = T[lang];
      function fail() { $("toast").textContent = t.copyFail; }
      try { navigator.clipboard.writeText(url).then(function () { $("toast").textContent = t.copied; track("shared"); }, fail); }
      catch (e) { fail(); }
    });

    bindLangs(function () {
      if (state === "call") { try { audio.pause(); } catch (e) {} start(); }
      paintStatic();
    });
    $("initial").textContent = m.initial;
    paintStatic();
  }

  if (PAGE === "home") home();
  else {
    var m = DH.monuments.filter(function (x) { return x.id === PAGE && x.ready; })[0];
    if (m) call(m); else location.replace(ROOT);
  }
})();
