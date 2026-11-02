/* Metro pasportu - stamp collection for Baku metro stations.
   Pilot: three ways to earn a stamp (on-site question, honour word, QR on the station) can be switched to compare. */
(function () {
  "use strict";
  var MT = window.DH_METRO;
  var ROOT = document.body.getAttribute("data-root") || "./";
  var PAGE = document.body.getAttribute("data-page");
  var $ = function (id) { return document.getElementById(id); };

  var T = {
    az: {
      brand: "Metro pasportu · Bakı",
      title: "Metro pasportu",
      lead: "Bakı metrosunun 27 stansiyası - 27 möhür. Stansiyaya gəlin, möhürü alın və onun hekayəsini açın.",
      pilot: "Pilot: hələlik 3 stansiyada möhür var. Qalanları tezliklə.",
      count: function (n, t) { return "Möhürlər: <b>" + n + "</b> / " + t; },
      get: "möhür al →", soon: "tezliklə", branch: "qol",
      share: "Pasportu storisə paylaş", back: "Danışan heykəllər", passport: "Pasportuma qayıt",
      mode: "Pilot: möhürü necə almaq?", modes: { quiz: "Sual", honor: "Söz", qr: "QR" },
      modeHint: {
        quiz: "Yalnız stansiyada cavab verə biləcəyiniz sual.",
        honor: "Stansiyadasınızsa, sadəcə təsdiq edin.",
        qr: "Möhür stansiyadakı QR kodu skan edəndə verilir."
      },
      honorBtn: "Stansiyadayam - möhürü vur",
      qrNeed: "Stansiyada QR kodu tapın və telefonun kamerası ilə skan edin.",
      qrDemo: "Pilot: QR hələ stansiyada asılmayıb. Sınamaq üçün QR faylını başqa ekrandan skan edin.",
      wrong: "Tam deyil. Ətrafa bir də baxın.",
      stamped: "Möhür pasportunuzda!", on: "Möhür vurulub",
      story: "Stansiyanın hekayəsi", look: "Ətrafa baxın", locked: "Hekayə möhürdən sonra açılır.",
      storyLine: "Metro pasportum",
      sheet: "Şəkli saxlamaq üçün barmağınızı üzərində saxlayın.", close: "Bağla",
      foot: "Metro pasportu · Danışan heykəllər layihəsinin bölməsi. Bakı Metropoliteninin rəsmi layihəsi deyil.",
      reset: "Bu stansiyanın möhürünü sil (sınaq üçün)"
    },
    ru: {
      brand: "Паспорт метро · Баку",
      title: "Паспорт метро",
      lead: "27 станций бакинского метро - 27 печатей. Приезжайте на станцию, получайте печать и открывайте её историю.",
      pilot: "Пилот: пока печати есть на 3 станциях. Остальные скоро.",
      count: function (n, t) { return "Печатей: <b>" + n + "</b> из " + t; },
      get: "получить печать →", soon: "скоро", branch: "ветка",
      share: "Поделиться паспортом в сторис", back: "Говорящие памятники", passport: "Вернуться в паспорт",
      mode: "Пилот: как получить печать?", modes: { quiz: "Вопрос", honor: "Слово", qr: "QR" },
      modeHint: {
        quiz: "Вопрос, на который можно ответить только на станции.",
        honor: "Если вы на станции - просто подтвердите.",
        qr: "Печать ставится, когда вы сканируете QR-код на станции."
      },
      honorBtn: "Я на станции - поставить печать",
      qrNeed: "Найдите QR-код на станции и отсканируйте его камерой телефона.",
      qrDemo: "Пилот: QR на станции пока не висит. Чтобы попробовать, отсканируйте QR-файл с другого экрана.",
      wrong: "Не совсем. Посмотрите вокруг ещё раз.",
      stamped: "Печать в вашем паспорте!", on: "Печать стоит",
      story: "История станции", look: "Посмотрите вокруг", locked: "История откроется после печати.",
      storyLine: "Мой паспорт метро",
      sheet: "Нажмите и удерживайте картинку, чтобы сохранить её.", close: "Закрыть",
      foot: "Паспорт метро · раздел проекта Danışan heykəllər. Не официальный проект Бакинского метрополитена.",
      reset: "Стереть печать этой станции (для теста)"
    }
  };

  /* ---------- storage ---------- */
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function stamps() {
    var o = {};
    try { o = JSON.parse(sget("dh-stamps") || "{}"); } catch (e) {}
    return (o && typeof o === "object") ? o : {};
  }
  function addStamp(id, mode) {
    var o = stamps();
    if (!o[id]) { var n = new Date(), pad = function (v) { return (v < 10 ? "0" : "") + v; };
      o[id] = { d: n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate()), m: mode }; sset("dh-stamps", JSON.stringify(o)); }
  }
  function dropStamp(id) { var o = stamps(); delete o[id]; sset("dh-stamps", JSON.stringify(o)); }
  function nStamps() { var o = stamps(); return MT.stations.filter(function (s) { return o[s.id]; }).length; }

  /* ---------- language ---------- */
  var lang = sget("dh-lang");
  if (!T[lang]) lang = (navigator.language || "").slice(0, 2).toLowerCase() === "az" ? "az" : "ru";
  function bindLangs(onChange) {
    function paintL() {
      ["az", "ru"].forEach(function (k) { var b = $("lang-" + k); if (b) b.setAttribute("aria-pressed", k === lang ? "true" : "false"); });
      document.documentElement.lang = lang;
    }
    ["az", "ru"].forEach(function (k) {
      var b = $("lang-" + k);
      if (b) b.addEventListener("click", function () { lang = k; sset("dh-lang", k); paintL(); onChange(); });
    });
    paintL();
  }

  /* ---------- stamp drawing (SVG, also rasterised for the story image) ---------- */
  var ICON = {
    pyramid: '<path d="M60 34 L82 72 H38 Z M60 34 L60 72 M49 53 H71" fill="none" stroke-width="3.2" stroke-linejoin="round"/>',
    star: '<path d="M60 33 L66 46 L80 44 L72 56 L80 68 L66 66 L60 79 L54 66 L40 68 L48 56 L40 44 L54 46 Z" fill="none" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="56" r="5"/>',
    wall: '<path d="M38 74 V48 H44 V41 H50 V48 H56 V41 H64 V48 H70 V41 H76 V48 H82 V74 Z M54 74 V63 A6 6 0 0 1 66 63 V74" fill="none" stroke-width="3" stroke-linejoin="round"/>'
  };
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function stampSVG(st, date) {
    var c = st.color, rot = (hash(st.id) % 17) - 8, name = st.label.toLocaleUpperCase("az");
    var fs = name.length > 11 ? 10 : 12;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="stamp-svg" role="img" aria-label="' + esc(st.label) + '">' +
      '<g transform="rotate(' + rot + ' 60 60)" fill="' + c + '" stroke="' + c + '" opacity=".92">' +
      '<defs><path id="arc-' + st.id + '" d="M20 60 A40 40 0 0 1 100 60"/><path id="arcb-' + st.id + '" d="M16 60 A44 44 0 0 0 104 60"/></defs>' +
      '<circle cx="60" cy="60" r="56" fill="none" stroke-width="3"/>' +
      '<circle cx="60" cy="60" r="49" fill="none" stroke-width="1.2" stroke-dasharray="2 2.4"/>' +
      '<text font-family="Golos Text, Arial, sans-serif" font-weight="700" font-size="' + fs + '" letter-spacing="1.2" stroke="none" text-anchor="middle">' +
      '<textPath href="#arc-' + st.id + '" startOffset="50%">' + esc(name) + '</textPath></text>' +
      '<text font-family="Golos Text, Arial, sans-serif" font-weight="600" font-size="8.5" letter-spacing="2" stroke="none" text-anchor="middle">' +
      '<textPath href="#arcb-' + st.id + '" startOffset="50%">BAKI METRO</textPath></text>' +
      ICON[st.icon || "star"] +
      (date ? '<text x="60" y="87" font-family="Golos Text, Arial, sans-serif" font-size="7.5" font-weight="600" stroke="none" text-anchor="middle">' + esc(date.split("-").reverse().join(".")) + '</text>' : '') +
      '</g></svg>';
  }

  /* ---------- passport page ---------- */
  function passport() {
    function paint() {
      var t = T[lang], got = stamps();
      document.title = t.title + " · Danışan heykəllər";
      $("brand").textContent = t.brand;
      $("heroTitle").textContent = t.title;
      $("heroLead").textContent = t.lead;
      $("pilot").textContent = t.pilot;
      $("count").innerHTML = t.count(nStamps(), MT.stations.length);
      $("shareLbl").textContent = t.share;
      $("back").textContent = t.back;
      $("foot").textContent = t.foot;
      $("sheetTxt").textContent = t.sheet;
      $("sheetClose").textContent = t.close;
      var box = $("pages"); box.innerHTML = "";
      MT.lines.forEach(function (ln) {
        var sec = document.createElement("section"); sec.className = "ppage"; sec.style.setProperty("--lc", ln.color);
        var h = document.createElement("h2"); h.className = "ppage-h"; h.textContent = ln.name[lang]; sec.appendChild(h);
        var grid = document.createElement("div"); grid.className = "slots";
        ln.stations.forEach(function (id) {
          var st = MT.stations.filter(function (x) { return x.id === id; })[0];
          var has = got[id];
          var el = document.createElement(st.ready ? "a" : "div");
          el.className = "slot " + (has ? "got" : st.ready ? "live" : "soon");
          if (st.ready) el.href = ROOT + "metro/" + id + "/";
          var art = document.createElement("div"); art.className = "slot-art";
          if (has) art.innerHTML = stampSVG(st, has.d);
          var nm = document.createElement("span"); nm.className = "slot-nm"; nm.textContent = st.ready ? st.name[lang] : st.label;
          var tg = document.createElement("span"); tg.className = "slot-tg";
          tg.textContent = has ? "" : st.ready ? t.get : (st.branch ? t.branch + " · " : "") + t.soon;
          el.appendChild(art); el.appendChild(nm); if (tg.textContent) el.appendChild(tg);
          grid.appendChild(el);
        });
        sec.appendChild(grid); box.appendChild(sec);
      });
      $("share").hidden = nStamps() === 0;
    }
    $("share").addEventListener("click", shareStory);
    $("sheetClose").addEventListener("click", function () { $("sheet").hidden = true; });
    bindLangs(paint); paint();
  }

  /* ---------- story image: passport with stamps, 1080x1920 ---------- */
  function svgImg(svg) {
    return new Promise(function (res) {
      var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); };
      im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }
  function shareStory() {
    var t = T[lang], got = stamps(), W = 1080, H = 1920;
    var done = MT.stations.filter(function (s) { return got[s.id]; });
    var fontsReady = (document.fonts && document.fonts.load) ? Promise.all([
      document.fonts.load("600 100px 'El Messiri'"), document.fonts.load("600 40px 'Golos Text'")]).catch(function () {}) : Promise.resolve();
    fontsReady.then(function () {
      return Promise.all(MT.stations.map(function (s) { return got[s.id] ? svgImg(stampSVG(s, got[s.id].d)) : Promise.resolve(null); }));
    }).then(function (imgs) {
      var c = document.createElement("canvas"); c.width = W; c.height = H;
      var x = c.getContext("2d");
      var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#2a2420"); g.addColorStop(1, "#0e0c09");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = "#efe6d4"; x.fillRect(60, 300, W - 120, H - 520);
      x.font = "700 30px 'Golos Text', sans-serif";
      var tag = "METRO PASPORTU · BAKI", tw = x.measureText(tag).width;
      x.fillStyle = "#d39a5c"; x.fillRect(80, 110, tw + 48, 64);
      x.fillStyle = "#1a120a"; x.textBaseline = "middle"; x.fillText(tag, 104, 143);
      x.textBaseline = "alphabetic"; x.fillStyle = "#f3ede2"; x.font = "600 86px 'El Messiri', Georgia, serif";
      x.fillText(t.storyLine, 80, 260);
      var cols = 5, cell = (W - 200) / cols, y0 = 340;
      MT.stations.forEach(function (s, i) {
        var cx = 100 + (i % cols) * cell, cy = y0 + Math.floor(i / cols) * (cell + 18);
        if (imgs[i]) x.drawImage(imgs[i], cx + 6, cy + 6, cell - 12, cell - 12);
        else {
          x.strokeStyle = "rgba(60,48,36,.28)"; x.lineWidth = 3; x.setLineDash([8, 9]);
          x.beginPath(); x.arc(cx + cell / 2, cy + cell / 2, cell / 2 - 14, 0, Math.PI * 2); x.stroke(); x.setLineDash([]);
        }
      });
      x.fillStyle = "#f3ede2"; x.font = "600 64px 'Golos Text', sans-serif";
      var n = done.length + "", tot = " / " + MT.stations.length;
      x.fillText(n, 80, H - 110); var nw = x.measureText(n).width;
      x.fillStyle = "#c4bbad"; x.font = "500 44px 'Golos Text', sans-serif"; x.fillText(tot, 80 + nw, H - 110);
      x.font = "500 34px 'Golos Text', sans-serif"; var host = location.host || "danisan-heykeller.github.io";
      x.fillText(host, W - 80 - x.measureText(host).width, H - 110);
      c.toBlob(function (blob) {
        var file = blob ? new File([blob], "metro-pasportu.png", { type: "image/png" }) : null;
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file] }).catch(function () {});
        else { $("sheetImg").src = c.toDataURL("image/png"); $("sheet").hidden = false; }
      }, "image/png");
    });
  }

  /* ---------- station page ---------- */
  function station(st) {
    var params = new URLSearchParams(location.search);
    var viaQR = params.get("k") === st.key;
    var mode = sget("dh-stamp-mode");
    if (!{ quiz: 1, honor: 1, qr: 1 }[mode]) mode = "quiz";
    if (viaQR) mode = "qr";
    document.body.style.setProperty("--lc", st.color);
    var justNow = false;

    function earn(how) { addStamp(st.id, how); justNow = true; paint(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    if (viaQR && !stamps()[st.id]) { addStamp(st.id, "qr"); justNow = true; }

    function paint() {
      var t = T[lang], has = stamps()[st.id], line = MT.lines.filter(function (l) { return l.id === st.line; })[0];
      document.title = st.name[lang] + " · " + t.title;
      $("brand").textContent = t.brand;
      $("lineName").textContent = line.name[lang];
      $("name").textContent = st.name[lang];
      $("role").textContent = st.role[lang];
      $("stampArt").innerHTML = has ? stampSVG(st, has.d) : stampSVG(st, "");
      $("stampArt").className = "stamp-art" + (has ? " on" + (justNow ? " fresh" : "") : " off");
      $("stampMsg").textContent = has ? (justNow ? t.stamped : t.on + " · " + has.d.split("-").reverse().join(".")) : "";
      $("earn").hidden = !!has;
      $("modeLbl").textContent = t.mode;
      ["quiz", "honor", "qr"].forEach(function (k) {
        var b = $("m-" + k); b.textContent = t.modes[k]; b.setAttribute("aria-pressed", k === mode ? "true" : "false");
      });
      $("modeHint").textContent = t.modeHint[mode];
      // method bodies
      $("quiz").hidden = mode !== "quiz"; $("honor").hidden = mode !== "honor"; $("qr").hidden = mode !== "qr";
      $("qText").textContent = st.q[lang];
      var opts = $("qOpts"); opts.innerHTML = "";
      st.q.opts[lang].forEach(function (o, i) {
        var b = document.createElement("button"); b.type = "button"; b.className = "btn opt"; b.textContent = o;
        b.addEventListener("click", function () {
          if (i === st.q.a) earn("quiz");
          else { b.classList.add("no"); $("qMsg").textContent = t.wrong; }
        });
        opts.appendChild(b);
      });
      $("qMsg").textContent = "";
      $("honorBtn").textContent = t.honorBtn;
      $("qrNeed").textContent = t.qrNeed;
      $("qrDemo").textContent = t.qrDemo;
      $("qrImg").src = ROOT + "qr/metro-" + st.id + ".svg";
      // reward
      $("storyTitle").textContent = t.story;
      $("story").textContent = has ? st.story[lang] : t.locked;
      $("story").className = has ? "story" : "story locked";
      $("lookTitle").textContent = t.look;
      var ul = $("lookList"); ul.innerHTML = "";
      st.look[lang].forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ul.appendChild(li); });
      $("look").hidden = !has;
      $("toPassport").textContent = t.passport;
      $("reset").textContent = t.reset; $("reset").hidden = !has;
      $("foot").textContent = t.foot;
    }
    ["quiz", "honor", "qr"].forEach(function (k) {
      $("m-" + k).addEventListener("click", function () { mode = k; sset("dh-stamp-mode", k); paint(); });
    });
    $("honorBtn").addEventListener("click", function () { earn("honor"); });
    $("reset").addEventListener("click", function () { dropStamp(st.id); justNow = false; paint(); });
    bindLangs(paint); paint();
  }

  if (PAGE === "passport") passport();
  else {
    var st = MT.stations.filter(function (x) { return x.id === PAGE && x.ready; })[0];
    if (st) station(st); else location.replace(ROOT + "metro/");
  }
})();
