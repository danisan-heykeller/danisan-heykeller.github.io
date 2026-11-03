/* Hekayə avtomatı - a story sized to your ride (idea proven by Short Édition story dispensers).
   Pick from/to stations, the page estimates ride time and serves stories that fit. Everything is in this
   page's scripts, so once loaded it works underground without internet. */
(function () {
  "use strict";
  var MT = window.DH_METRO, HK = window.DH_HEKAYE;
  var $ = function (id) { return document.getElementById(id); };

  var T = {
    az: {
      brand: "Hekayə avtomatı · Bakı metrosu",
      title: "Hekayə avtomatı",
      lead: "Haradan hara gedirsiniz? Yolunuz qədər uzun bir hekayə verəcəyik - stansiyanıza çatanda bitəcək.",
      from: "Haradan", to: "Haraya", swap: "Yerlərini dəyiş", go: "Hekayəni al",
      pick: "Stansiya seçin",
      ride: function (m, x) { return "Yol: təxminən <b>" + m + " dəq</b>" + (x ? " · " + x + " keçid" : ""); },
      same: "Eyni stansiyadır. Başqa stansiya seçin.",
      plan: function (n, m) { return n === 1 ? "Bu yol üçün 1 hekayə, ~" + m + " dəq" : "Bu yol üçün " + n + " hekayə, ~" + m + " dəq"; },
      min: function (m) { return "~" + m + " dəq oxu"; },
      next: "Növbəti hekayə", another: "Başqa hekayələr", save: "Saxla", saved: "Saxlanıldı",
      quote: "Sitat kartı", savedTitle: "Saxladıqlarım", none: "Hələ heç nə saxlamamısınız.",
      offline: "İnternet olmasa da oxumaq olar: hekayələr artıq telefonunuzdadır.",
      test: "Sınaq mətni - pilotda əsl hekayələrlə əvəz olunacaq.",
      orig: "", src: "",
      done: "Hekayələr bitdi. Yaxşı yol!",
      sheet: "Şəkli saxlamaq üçün barmağınızı üzərində saxlayın.", close: "Bağla",
      back: "Metro pasportu",
      foot: "Hekayə avtomatı · Danışan heykəllər layihəsinin bölməsi. Yol vaxtı təxminidir. Bakı Metropoliteninin rəsmi layihəsi deyil.",
      lines: {}
    },
    ru: {
      brand: "Автомат рассказов · бакинское метро",
      title: "Hekayə avtomatı",
      lead: "Откуда и куда вы едете? Дадим рассказ длиной ровно в вашу поездку - он закончится к вашей станции.",
      from: "Откуда", to: "Куда", swap: "Поменять местами", go: "Получить рассказ",
      pick: "Выберите станцию",
      ride: function (m, x) { return "В пути: примерно <b>" + m + " мин</b>" + (x ? " · пересадок: " + x : ""); },
      same: "Это одна и та же станция. Выберите другую.",
      plan: function (n, m) { return n === 1 ? "На эту поездку - 1 рассказ, ~" + m + " мин" : "На эту поездку - рассказов: " + n + ", ~" + m + " мин"; },
      min: function (m) { return "~" + m + " мин чтения"; },
      next: "Следующий рассказ", another: "Другие рассказы", save: "Сохранить", saved: "Сохранено",
      quote: "Карточка с цитатой", savedTitle: "Сохранённое", none: "Пока ничего не сохранено.",
      offline: "Можно читать без интернета: рассказы уже у вас в телефоне.",
      test: "Тестовый текст - в пилоте его заменят настоящие рассказы.",
      orig: "Оригинал на азербайджанском. Русский перевод готовится.", src: "",
      done: "Рассказы на эту поездку закончились. Хорошей дороги!",
      sheet: "Нажмите и удерживайте картинку, чтобы сохранить её.", close: "Закрыть",
      back: "Паспорт метро",
      foot: "Hekayə avtomatı · раздел проекта Danışan heykəllər. Время в пути примерное. Не официальный проект Бакинского метрополитена.",
      lines: {}
    }
  };

  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var lang = sget("dh-lang");
  if (!T[lang]) lang = (navigator.language || "").slice(0, 2).toLowerCase() === "az" ? "az" : "ru";

  /* ---------- ride time: shortest path on the metro graph ---------- */
  var adj = {};
  HK.edges.forEach(function (e) {
    (adj[e[0]] = adj[e[0]] || []).push([e[1], e[2]]);
    (adj[e[1]] = adj[e[1]] || []).push([e[0], e[2]]);
  });
  function ride(a, b) {
    var dist = {}, prev = {}, todo = Object.keys(adj);
    todo.forEach(function (k) { dist[k] = Infinity; }); dist[a] = 0;
    while (todo.length) {
      todo.sort(function (x, y) { return dist[x] - dist[y]; });
      var u = todo.shift(); if (u === b || dist[u] === Infinity) break;
      adj[u].forEach(function (p) { var d = dist[u] + p[1]; if (d < dist[p[0]]) { dist[p[0]] = d; prev[p[0]] = [u, p[1]]; } });
    }
    var x = 0, c = b; while (prev[c]) { if (prev[c][1] > 2) x++; c = prev[c][0]; }
    return { min: dist[b], transfers: x };
  }

  function mn(t) { return t.min[lang] || t.min.az; }

  /* ---------- story plan: fill the ride with stories that fit ---------- */
  var plan = [], idx = 0, seen = [];
  function makePlan(m) {
    var pool = HK.texts.slice();
    pool = pool.slice().sort(function () { return Math.random() - 0.5; });
    pool.sort(function (x, y) { return (seen.indexOf(x.id) >= 0) - (seen.indexOf(y.id) >= 0); });
    var out = [], left = m;
    // pick a story that fills most of the remaining time (unread first, otherwise random), then fill the rest
    while (left > 0) {
      var fits = pool.filter(function (t) { return mn(t) <= left && out.indexOf(t) < 0; });
      if (!fits.length) break;
      var big = fits.filter(function (t) { return mn(t) >= left * 0.6; });
      var cand = big.length ? big : fits.sort(function (x, y) { return mn(y) - mn(x); }).slice(0, 1);
      var fresh = cand.filter(function (t) { return seen.indexOf(t.id) < 0; });
      var c = fresh.length ? fresh : cand;
      var t = c[Math.floor(Math.random() * c.length)];
      out.push(t); left -= mn(t);
    }
    if (!out.length) out.push(pool.sort(function (x, y) { return mn(x) - mn(y); })[0]);
    return out;
  }

  function saved() { var a = []; try { a = JSON.parse(sget("dh-hekaye-saved") || "[]"); } catch (e) {} return Array.isArray(a) ? a : []; }
  function toggleSave(id) {
    var a = saved(), i = a.indexOf(id);
    if (i < 0) a.push(id); else a.splice(i, 1);
    sset("dh-hekaye-saved", JSON.stringify(a));
  }

  /* ---------- UI ---------- */
  function fillSelects() {
    ["from", "to"].forEach(function (k) {
      var sel = $(k), cur = sel.value; sel.innerHTML = "";
      var o0 = document.createElement("option"); o0.value = ""; o0.textContent = T[lang].pick; sel.appendChild(o0);
      MT.lines.forEach(function (ln) {
        var g = document.createElement("optgroup"); g.label = ln.name[lang];
        ln.stations.forEach(function (id) {
          var st = MT.stations.filter(function (s) { return s.id === id; })[0];
          var o = document.createElement("option"); o.value = id; o.textContent = st.label; g.appendChild(o);
        });
        sel.appendChild(g);
      });
      sel.value = cur || sget("dh-hk-" + k) || "";
    });
  }
  function showRide() {
    var a = $("from").value, b = $("to").value, t = T[lang];
    $("go").disabled = !(a && b && a !== b);
    if (a && b && a === b) { $("ride").textContent = t.same; return null; }
    if (!(a && b)) { $("ride").textContent = ""; return null; }
    var r = ride(a, b); $("ride").innerHTML = t.ride(r.min, r.transfers); return r;
  }
  function render() {
    var t = T[lang], s = plan[idx], box = $("story");
    if (!s) { box.hidden = true; return; }
    box.hidden = false;
    var total = plan.reduce(function (n, x) { return n + mn(x); }, 0);
    $("planInfo").textContent = t.plan(plan.length, total) + (plan.length > 1 ? " · " + (idx + 1) + "/" + plan.length : "");
    $("sTitle").textContent = s.title[lang];
    $("sMeta").textContent = s.author[lang] + " · " + t.min(mn(s));
    var L = s.text[lang] ? lang : "az";
    $("sTest").hidden = !s.test && L === lang; $("sTest").textContent = s.test ? t.test : t.orig;
    $("sSrc").textContent = s.source ? t.src + s.source : "";
    var body = $("sBody"); body.innerHTML = ""; body.lang = L;
    s.text[L].forEach(function (p) { var el = document.createElement("p"); el.textContent = p; body.appendChild(el); });
    var isSaved = saved().indexOf(s.id) >= 0;
    $("save").textContent = isSaved ? t.saved : t.save; $("save").setAttribute("aria-pressed", isSaved ? "true" : "false");
    $("next").textContent = idx < plan.length - 1 ? t.next : t.another;
    $("quote").textContent = t.quote;
    $("endNote").textContent = idx === plan.length - 1 ? t.done : "";
    if (seen.indexOf(s.id) < 0) seen.push(s.id);
  }
  function paintSaved() {
    var t = T[lang], ids = saved(), ul = $("savedList"); ul.innerHTML = "";
    $("savedTitle").textContent = t.savedTitle;
    if (!ids.length) { var li = document.createElement("li"); li.className = "muted"; li.textContent = t.none; ul.appendChild(li); return; }
    ids.forEach(function (id) {
      var s = HK.texts.filter(function (x) { return x.id === id; })[0]; if (!s) return;
      var li = document.createElement("li"), b = document.createElement("button");
      b.type = "button"; b.className = "linkbtn"; b.textContent = s.title[lang] + " · " + s.author[lang];
      b.addEventListener("click", function () { plan = [s]; idx = 0; render(); $("story").scrollIntoView({ behavior: "smooth" }); });
      li.appendChild(b); ul.appendChild(li);
    });
  }
  function paint() {
    var t = T[lang];
    document.documentElement.lang = lang;
    ["az", "ru"].forEach(function (k) { $("lang-" + k).setAttribute("aria-pressed", k === lang ? "true" : "false"); });
    document.title = t.title + " · Danışan heykəllər";
    $("brand").textContent = t.brand; $("heroTitle").textContent = t.title; $("heroLead").textContent = t.lead;
    $("fromLbl").textContent = t.from; $("toLbl").textContent = t.to; $("swap").setAttribute("aria-label", t.swap); $("swap").title = t.swap;
    $("go").textContent = t.go; $("offline").textContent = t.offline;
    $("back").textContent = t.back; $("foot").textContent = t.foot;
    $("sheetTxt").textContent = t.sheet; $("sheetClose").textContent = t.close;
    fillSelects(); showRide(); render(); paintSaved();
  }

  /* ---------- quote card 1080x1920 ---------- */
  function wrap(x, text, w) {
    var words = text.split(" "), lines = [], cur = "";
    words.forEach(function (wd) { var tr = cur ? cur + " " + wd : wd; if (x.measureText(tr).width > w && cur) { lines.push(cur); cur = wd; } else cur = tr; });
    if (cur) lines.push(cur); return lines;
  }
  function quoteCard() {
    var s = plan[idx]; if (!s) return;
    var paras = s.text[lang] || s.text.az, q = paras.filter(function (p) { return p.length > 60 && p.length < 260; }).pop() || paras[0];
    var W = 1080, H = 1920, c = document.createElement("canvas"); c.width = W; c.height = H;
    var x = c.getContext("2d");
    var ready = (document.fonts && document.fonts.load) ? Promise.all([document.fonts.load("500 60px 'Noto Serif Display'"), document.fonts.load("600 40px 'Golos Text'")]).catch(function () {}) : Promise.resolve();
    ready.then(function () {
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a2420"); g.addColorStop(1, "#0e0c09");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.font = "700 30px 'Golos Text', sans-serif";
      var tag = "HEKAYƏ AVTOMATI · BAKI METROSU", tw = x.measureText(tag).width;
      x.fillStyle = "#d39a5c"; x.fillRect(80, 110, tw + 48, 64);
      x.fillStyle = "#1a120a"; x.textBaseline = "middle"; x.fillText(tag, 104, 143); x.textBaseline = "alphabetic";
      x.font = "500 56px 'Noto Serif Display', Georgia, serif";
      var lines = wrap(x, q, W - 180).slice(0, 14), y = Math.max(560, Math.round((H - lines.length * 80 - 160) / 2));
      x.fillStyle = "#d39a5c"; x.font = "500 220px 'Noto Serif Display', Georgia, serif"; x.fillText("“", 70, y - 90);
      x.fillStyle = "#f3ede2"; x.font = "500 56px 'Noto Serif Display', Georgia, serif";
      lines.forEach(function (l) { x.fillText(l, 90, y); y += 80; });
      x.fillStyle = "#d39a5c"; x.font = "600 44px 'Golos Text', sans-serif"; x.fillText(s.title[lang], 90, y + 70);
      x.fillStyle = "#c4bbad"; x.font = "500 36px 'Golos Text', sans-serif"; x.fillText(s.author[lang], 90, y + 125);
      var host = location.host || "danisan-heykeller.github.io"; x.fillText(host, 90, H - 110);
      c.toBlob(function (blob) {
        var file = blob ? new File([blob], "hekaye-" + s.id + ".png", { type: "image/png" }) : null;
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] }).catch(function () {});
        else { $("sheetImg").src = c.toDataURL("image/png"); $("sheet").hidden = false; }
      }, "image/png");
    });
  }

  /* ---------- events ---------- */
  ["az", "ru"].forEach(function (k) { $("lang-" + k).addEventListener("click", function () { lang = k; sset("dh-lang", k); plan = []; paint(); }); });
  ["from", "to"].forEach(function (k) { $(k).addEventListener("change", function () { sset("dh-hk-" + k, $(k).value); showRide(); }); });
  $("swap").addEventListener("click", function () {
    var a = $("from").value; $("from").value = $("to").value; $("to").value = a;
    sset("dh-hk-from", $("from").value); sset("dh-hk-to", $("to").value); showRide();
  });
  $("go").addEventListener("click", function () {
    var r = showRide(); if (!r) return;
    plan = makePlan(r.min); idx = 0; render(); $("story").scrollIntoView({ behavior: "smooth" });
  });
  $("next").addEventListener("click", function () {
    if (idx < plan.length - 1) idx++;
    else { var r = showRide(); plan = makePlan(r ? r.min : 5); idx = 0; }
    render(); $("story").scrollIntoView({ behavior: "smooth" });
  });
  $("save").addEventListener("click", function () { toggleSave(plan[idx].id); render(); paintSaved(); });
  $("quote").addEventListener("click", quoteCard);
  $("sheetClose").addEventListener("click", function () { $("sheet").hidden = true; });
  paint();
})();
