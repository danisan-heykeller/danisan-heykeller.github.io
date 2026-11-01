(function () {
  "use strict";
  var DH = window.DH;
  var ROOT = document.body.getAttribute("data-root") || "./";
  var PAGE = document.body.getAttribute("data-page"); // "home" or a monument id
  var $ = function (id) { return document.getElementById(id); };

  var T = {
    az: {
      calling: "zəng edir...", accept: "Qəbul et", decline: "Rədd et", hang: "Bitir",
      declined: "Eybi yoxdur. Geri zəng edək?", callBack: "Geri zəng et", thanks: "Dinlədiyiniz üçün sağ olun.", ai: "Səslər süni intellektlə yaradılıb. Mətnlər yoxlanılmış mənbələrə əsaslanır.",
      dur: function (m) { return "~" + m + " dəq"; }, sound: "səsi artırın", soon: "səs tezliklə, hələlik mətn",
      collected: function (n, t) { return "Toplanan zənglər: <b>" + n + "</b> / " + t; },
      deck: "Danışan heykəllər", locked: "???",
      again: "Yenidən dinlə", share: "Linki göndər", copied: "Link kopyalandı",
      copyFail: "Linki ünvan sətrindən kopyala", tr: "Monoloqun mətni", home: "Bütün heykəllər",
      story: "Storis üçün şəkil", storyLine: ["Mənə", "zəng etdi"],
      sheet: "Şəkli saxlamaq üçün barmağınızı üzərində saxlayın.", close: "Bağla",
      hint: "Digər qəhrəmanlar yaxınlıqda gözləyir. Kodlarını tapın - onlar da zəng edəcək.",
      foot: "Danışan heykəllər · postamentlərdən bizə baxan insanlar haqqında qeyri-kommersiya layihə",
      heroTitle: "Bakının heykəlləri danışır",
      heroLead: "Abidənin yanındakı kodu skan edin - və o sizə zəng edəcək. Hər biri özü haqqında danışacaq və xatirə olaraq bir fikir qoyub gedəcək.",
      how: ["Heykəlin yanında kodu tapın", "Kamera ilə skan edin", "Zəngi qəbul edin", "Dayanın və diqqətlə baxın"],
      howTitle: "Necə işləyir", audioErr: "Səs yüklənmədi. İnterneti yoxlayın və yenidən cəhd edin."
    },
    ru: {
      calling: "звонит...", accept: "Принять", decline: "Отклонить", hang: "Завершить",
      declined: "Ничего страшного. Перезвонить?", callBack: "Перезвонить", thanks: "Спасибо, что выслушали.", ai: "Голоса созданы с помощью ИИ. Тексты основаны на проверенных источниках.",
      dur: function (m) { return "~" + m + " мин"; }, sound: "сделайте звук громче", soon: "озвучка скоро, пока текст",
      collected: function (n, t) { return "Собрано звонков: <b>" + n + "</b> из " + t; },
      deck: "Говорящие памятники", locked: "???",
      again: "Послушать ещё раз", share: "Отправить ссылку", copied: "Ссылка скопирована",
      copyFail: "Скопируйте ссылку из адресной строки", tr: "Текст монолога", home: "Все памятники",
      story: "Картинка для сторис", storyLine: ["Мне позвонил", ""],
      sheet: "Нажмите и удерживайте картинку, чтобы сохранить её.", close: "Закрыть",
      hint: "Остальные герои ждут неподалёку. Найдите их код - и они тоже позвонят.",
      foot: "Danışan heykəllər · некоммерческий проект о людях, которые смотрят на нас с постаментов",
      heroTitle: "Памятники Баку разговаривают",
      heroLead: "Отсканируйте код у памятника - и он вам позвонит. Каждый расскажет о себе и оставит одну мысль на память.",
      how: ["Найдите код у памятника", "Отсканируйте его камерой", "Примите звонок", "Задержитесь и присмотритесь"],
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
  var from = new URLSearchParams(location.search).get("from");
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
  function paintLangs() {
    ["az", "ru"].forEach(function (k) { var b = $("lang-" + k); if (b) b.setAttribute("aria-pressed", k === lang ? "true" : "false"); });
    document.documentElement.lang = lang;
  }
  function bindLangs(onChange) {
    ["az", "ru"].forEach(function (k) {
      var b = $("lang-" + k);
      if (b) b.addEventListener("click", function () { lang = k; sset("dh-lang", k); paintLangs(); onChange(); });
    });
    paintLangs();
  }

  /* ---------- deck of cards ---------- */
  function renderDeck(el) {
    var got = collected(), t = T[lang];
    el.innerHTML = "";
    DH.monuments.forEach(function (m) {
      var has = got.indexOf(m.id) >= 0 && m.name;
      var tile = document.createElement(has ? "a" : "div");
      tile.className = "tile " + (has ? "got" : "locked");
      if (has) tile.href = ROOT + m.id + "/";
      var nm = document.createElement("span"); nm.className = "nm"; nm.textContent = has ? m.name[lang] : t.locked;
      var ar = document.createElement("span"); ar.className = "ar"; ar.textContent = m.area[lang];
      tile.appendChild(nm); tile.appendChild(ar);
      el.appendChild(tile);
    });
    return got.filter(function (id) { return DH.monuments.some(function (m) { return m.id === id; }); }).length;
  }

  /* ---------- home ---------- */
  function home() {
    function paint() {
      var t = T[lang];
      $("heroTitle").textContent = t.heroTitle;
      $("heroLead").textContent = t.heroLead;
      $("howTitle").textContent = t.howTitle;
      var ol = $("how"); ol.innerHTML = "";
      t.how.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      $("deckEyebrow").textContent = t.deck;
      $("count").innerHTML = t.collected(renderDeck($("deck")), DH.monuments.length);
      $("foot").textContent = t.foot;
      $("ai").textContent = t.ai;
    }
    bindLangs(paint); paint();
  }

  /* ---------- call page ---------- */
  function call(m) {
    var audio = new Audio(); audio.preload = "auto";
    var state = "ring", clock = null, spans = [], maxSeen = 0, story = null, t0 = 0;
    var voiced = m.voice !== false;
    function nowT() { return voiced ? audio.currentTime : (Date.now() - t0) / 1000; }

    if (m.photo) {
      var bg = $("bg"); bg.classList.remove("placeholder");
      bg.style.backgroundImage = "url('" + ROOT + m.photo + "')";
    }

    function fmt(s) { s = Math.max(0, Math.floor(s || 0)); var r = s % 60; return Math.floor(s / 60) + ":" + (r < 10 ? "0" : "") + r; }
    function lastCue() { var c = m.cues[lang]; return c[c.length - 1].t + 3; }
    function setState(s) {
      state = s;
      document.body.className = "s-" + s;
      $("ringView").hidden = s !== "ring";
      $("declinedView").hidden = s !== "declined";
      $("talkView").hidden = s !== "call";
      $("done").hidden = s !== "done";
    }

    function paint() {
      var t = T[lang];
      document.title = m.name[lang] + " · Danışan heykəllər";
      $("statusTxt").textContent = t.calling;
      $("name").textContent = m.name[lang];
      $("talkName").textContent = m.name[lang];
      $("role").textContent = m.role[lang];
      $("dur").textContent = t.dur(Math.max(1, Math.round(lastCue() / 60)));
      $("sound").textContent = voiced ? t.sound : t.soon;
      $("acceptLbl").textContent = t.accept;
      $("declineLbl").textContent = t.decline;
      $("hangLbl").textContent = t.hang;
      $("declinedTxt").textContent = t.declined;
      $("thanks").textContent = t.thanks;
      $("ai").textContent = t.ai;
      $("callBack").textContent = t.callBack;
      $("again").textContent = t.again;
      $("share").textContent = t.share;
      $("storyLbl").textContent = t.story;
      $("homeLink").textContent = t.home;
      $("trSum").textContent = t.tr;
      $("hint").textContent = t.hint;
      $("foot").textContent = t.foot;
      $("sheetTxt").textContent = t.sheet;
      $("sheetClose").textContent = t.close;
      $("credit").textContent = m.credit || "";
      var tb = $("trBody"); tb.innerHTML = "";
      var p = document.createElement("p");
      p.textContent = m.cues[lang].map(function (c) { return c.s; }).join(" ");
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
      var t = nowT(), cues = m.cues[lang], idx = 0;
      for (var i = 0; i < cues.length; i++) if (cues[i].t <= t + 0.05) idx = i;
      spans.forEach(function (s, i) { s.className = i < idx ? "past" : (i === idx ? "now" : ""); });
      var cur = spans[idx], box = $("subs");
      if (cur) {
        var top = cur.offsetTop - box.offsetTop;
        if (top > box.scrollTop + box.clientHeight - 48 || top < box.scrollTop) box.scrollTop = Math.max(0, top - 24);
      }
      var d = voiced ? (audio.duration || lastCue()) : lastCue();
      $("time").textContent = fmt(t) + " / " + fmt(d);
      $("prog").style.width = Math.min(100, (t / d) * 100) + "%";
      maxSeen = Math.max(maxSeen, t / d);
      if (!voiced && t >= d && state === "call") { maxSeen = 1; finish(); }
    }

    function start() {
      setState("call");
      try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) {}
      buildSubs(); maxSeen = 0; story = null;
      if (voiced) {
        audio.src = ROOT + m.audio[lang];
        audio.currentTime = 0;
        var pr = audio.play();
        if (pr && pr.catch) pr.catch(function () { $("time").textContent = T[lang].audioErr; });
      } else { t0 = Date.now(); }
      clearInterval(clock); clock = setInterval(sync, 200); sync();
      track("accepted");
    }
    function finish() {
      clearInterval(clock);
      try { audio.pause(); } catch (e) {}
      if (maxSeen >= 0.6) { collect(m.id); track("completed"); }
      setState("done"); paintDone(); window.scrollTo(0, 0);
    }
    function paintDone() {
      var t = T[lang];
      $("count").innerHTML = t.collected(renderDeck($("deck")), DH.monuments.length);
      $("deckEyebrow").textContent = t.deck;
    }

    /* story card: 1080x1920 PNG drawn on canvas */
    function loadImg(src) {
      return new Promise(function (res) {
        if (!src) return res(null);
        var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src;
      });
    }
    function wrapLines(ctx, text, maxW) {
      var words = text.split(" "), lines = [], cur = "";
      words.forEach(function (w) {
        var tryL = cur ? cur + " " + w : w;
        if (ctx.measureText(tryL).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tryL;
      });
      if (cur) lines.push(cur);
      return lines;
    }
    function makeStory() {
      var W = 1080, H = 1920, t = T[lang];
      var fontsReady = (document.fonts && document.fonts.load) ? Promise.all([
        document.fonts.load("600 120px 'El Messiri'"), document.fonts.load("600 40px 'Golos Text'")
      ]).catch(function () {}) : Promise.resolve();
      return Promise.all([loadImg(m.photo ? ROOT + m.photo : null), fontsReady]).then(function (r) {
        var img = r[0], c = document.createElement("canvas"); c.width = W; c.height = H;
        var x = c.getContext("2d");
        if (img) {
          var s = Math.max(W / img.width, H / img.height), w = img.width * s, h = img.height * s;
          x.drawImage(img, (W - w) / 2, (H - h) * 0.18, w, h);
          x.globalCompositeOperation = "saturation"; x.fillStyle = "#808080"; x.fillRect(0, 0, W, H);
          x.globalCompositeOperation = "color"; x.fillStyle = "#9b6a3c"; x.fillRect(0, 0, W, H);
          x.globalCompositeOperation = "source-over";
        } else {
          var g0 = x.createLinearGradient(0, 0, 0, H); g0.addColorStop(0, "#46352a"); g0.addColorStop(.55, "#2a2018"); g0.addColorStop(1, "#15100c");
          x.fillStyle = g0; x.fillRect(0, 0, W, H);
          var g1 = x.createRadialGradient(W / 2, H * .32, 10, W / 2, H * .32, 420); g1.addColorStop(0, "#b98352"); g1.addColorStop(1, "rgba(138,90,48,0)");
          x.fillStyle = g1; x.fillRect(0, 0, W, H);
        }
        var g = x.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "rgba(10,8,6,.25)"); g.addColorStop(.4, "rgba(10,8,6,0)"); g.addColorStop(.68, "rgba(10,8,6,.85)"); g.addColorStop(1, "rgba(10,8,6,.96)");
        x.fillStyle = g; x.fillRect(0, 0, W, H);
        // tag
        x.font = "700 30px 'Golos Text', sans-serif";
        var tag = "DANIŞAN HEYKƏLLƏR · BAKI", tw = x.measureText(tag).width;
        x.fillStyle = "#d39a5c"; x.fillRect(80, 110, tw + 48, 64);
        x.fillStyle = "#1a120a"; x.textBaseline = "middle"; x.fillText(tag, 104, 143);
        // headline
        x.textBaseline = "alphabetic";
        var y = H - 470;
        x.fillStyle = "#f3ede2"; x.font = "500 64px 'El Messiri', Georgia, serif";
        x.fillText(t.storyLine[0], 80, y);
        x.fillStyle = "#d39a5c"; x.font = "600 128px 'El Messiri', Georgia, serif";
        var lines = wrapLines(x, m.name[lang], W - 160);
        lines.forEach(function (l) { y += 136; x.fillText(l, 80, y); });
        if (t.storyLine[1]) { x.fillStyle = "#f3ede2"; x.font = "500 64px 'El Messiri', Georgia, serif"; y += 90; x.fillText(t.storyLine[1], 80, y); }
        // footer
        x.font = "500 34px 'Golos Text', sans-serif"; x.fillStyle = "#c4bbad";
        x.fillText(location.host || "danisan-heykeller.github.io", 80, H - 110);
        var n = collected().length + "", tot = " / " + DH.monuments.length;
        x.font = "600 60px 'Golos Text', sans-serif"; var nw = x.measureText(n).width;
        x.font = "500 40px 'Golos Text', sans-serif"; var tw2 = x.measureText(tot).width;
        x.fillStyle = "#f3ede2"; x.font = "600 60px 'Golos Text', sans-serif"; x.fillText(n, W - 80 - tw2 - nw, H - 110);
        x.fillStyle = "#c4bbad"; x.font = "500 40px 'Golos Text', sans-serif"; x.fillText(tot, W - 80 - tw2, H - 110);
        return c;
      });
    }
    function shareStory() {
      makeStory().then(function (c) {
        c.toBlob(function (blob) {
          var file = blob ? new File([blob], "danisan-heykeller-" + m.id + ".png", { type: "image/png" }) : null;
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file] }).then(function () { track("story"); }, function () {});
          } else {
            $("sheetImg").src = c.toDataURL("image/png");
            $("sheet").hidden = false; track("story");
          }
        }, "image/png");
      });
    }

    audio.addEventListener("ended", function () { maxSeen = 1; if (state === "call") finish(); });
    audio.addEventListener("error", function () { if (state === "call") $("time").textContent = T[lang].audioErr; });

    $("accept").addEventListener("click", start);
    $("hangup").addEventListener("click", finish);
    $("again").addEventListener("click", start);
    $("callBack").addEventListener("click", start);
    $("decline").addEventListener("click", function () { setState("declined"); track("declined"); });
    $("story").addEventListener("click", shareStory);
    $("sheetClose").addEventListener("click", function () { $("sheet").hidden = true; });
    $("share").addEventListener("click", function () {
      var url = location.origin + location.pathname + "?from=share", t = T[lang];
      function fail() { $("toast").textContent = t.copyFail; }
      try { navigator.clipboard.writeText(url).then(function () { $("toast").textContent = t.copied; track("shared"); }, fail); }
      catch (e) { fail(); }
    });

    bindLangs(function () {
      if (state === "call") { try { audio.pause(); } catch (e) {} start(); }
      paint();
    });
    setState("ring"); paint();
  }

  if (PAGE === "home") home();
  else {
    var m = DH.monuments.filter(function (x) { return x.id === PAGE && x.ready; })[0];
    if (m) call(m); else location.replace(ROOT);
  }
})();
