(function () {
  "use strict";
  var DH = window.DH;
  var ROOT = document.body.getAttribute("data-root") || "./";
  var PAGE = document.body.getAttribute("data-page"); // "home" or a monument id
  var $ = function (id) { return document.getElementById(id); };
  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  var T = {
    az: {
      calling: "zəng edir...", accept: "Qəbul et", decline: "İmtina et", hang: "Bitir", pause: "Fasilə", resume: "Davam",
      dur: function (m) { return "~" + m + " dəq"; }, sound: "qulaqlıqla daha yaxşıdır", soon: "səs tezliklə",
      what: "Bu nədir?", whatTitle: "Danışan heykəllər",
      whatText: "Bakının heykəlləri yoldan keçənlərə zəng edir. Qəbul edin - qəhrəman bir dəqiqə özü haqqında danışacaq və xatirə olaraq bir fikir qoyub gedəcək.",
      aboutLink: "Layihə haqqında", close: "Bağla",
      declined: "Eybi yoxdur.", declinedSub: "Geri zəng edə və ya onun nə demək istədiyini oxuya bilərsiniz.",
      callBack: "Geri zəng et", read: "Oxumaq",
      showText: "Mətni göstər", hideText: "Mətni gizlət",
      back: "Geri", next: "Davam", finish: "Bitir",
      thanks: "Dinlədiyiniz üçün sağ olun.", thanksRead: "Oxuduğunuz üçün sağ olun.",
      story: "Paylaş", sheetShare: "Göndər", sheetReady: "Dostunuz onu belə görəcək.", again: "Yenidən dinlə", share: "Linki kopyala", copied: "Link kopyalandı",
      copyFail: "Linki ünvan sətrindən kopyala", others: "Digər qəhrəmanlar", home: "Layihə haqqında",
      storyLine: "Mənə zəng etdi", sheet: "Şəkli saxlamaq üçün barmağınızı üzərində saxlayın.",
      ai: "Səslər süni intellektlə yaradılıb. Mətnlər yoxlanılmış mənbələrə əsaslanır.",
      audioErr: "Səs yüklənmədi. İnterneti yoxlayın və yenidən cəhd edin.",
      stageEyebrow: "Bakı · ictimai layihə", toHeroes: "Qəhrəmanlara keç", soonHero: "Növbəti səs - tezliklə", soonAsk: "Kimi çağıraq? Qəhrəman təklif edin.", qrTxt: "Telefonda açın - zəng belə daha yaxşı səslənir.",
      heroTitle: "Bakının heykəlləri danışır",
      heroLead: "Abidənin yanındakı kodu skan edin - və o sizə zəng edəcək.",
      incStatus: "indi zəng edir", incNext: "Növbəti",
      heroesTitle: "Qəhrəmanlar", callHim: "Zəng et",
      howTitle: "Necə işləyir", how: ["Heykəlin yanında kodu tapın", "Kamera ilə skan edin", "Zəngi qəbul edin", "Dayanın və diqqətlə baxın"],
      aboutTitle: "Layihə haqqında",
      aboutText: "İstəyirik ki, heykəllərin yanında dayansınlar. Hər zəng - qəhrəmanla tanışlıq və özünüzlə aparmağa dəyən bir dəyərdir.",
      endorse: "Gökand layihəsi", author: "Müəllif - Renat Raxmatulin",
      foot: "Danışan heykəllər · postamentlərdən bizə baxan insanlar haqqında qeyri-kommersiya layihə"
    },
    ru: {
      calling: "звонит...", accept: "Принять", decline: "Отклонить", hang: "Завершить", pause: "Пауза", resume: "Дальше",
      dur: function (m) { return "~" + m + " мин"; }, sound: "лучше в наушниках", soon: "озвучка скоро",
      what: "Что это?", whatTitle: "Danışan heykəllər",
      whatText: "Памятники Баку звонят прохожим. Примите звонок - герой минуту расскажет о себе и оставит одну мысль на память.",
      aboutLink: "О проекте", close: "Закрыть",
      declined: "Ничего страшного.", declinedSub: "Можно перезвонить или прочитать, что он хотел сказать.",
      callBack: "Перезвонить", read: "Прочитать",
      showText: "Показать текст", hideText: "Скрыть текст",
      back: "Назад", next: "Дальше", finish: "Завершить",
      thanks: "Спасибо, что выслушали.", thanksRead: "Спасибо, что прочитали.",
      story: "Поделиться", sheetShare: "Отправить", sheetReady: "Так увидит её ваш друг.", again: "Послушать ещё раз", share: "Скопировать ссылку", copied: "Ссылка скопирована",
      copyFail: "Скопируйте ссылку из адресной строки", others: "Другие герои", home: "О проекте",
      storyLine: "Мне позвонил", sheet: "Нажмите и удерживайте картинку, чтобы сохранить её.",
      ai: "Голоса созданы с помощью ИИ. Тексты основаны на проверенных источниках.",
      audioErr: "Звук не загрузился. Проверьте интернет и попробуйте ещё раз.",
      stageEyebrow: "Баку · общественный проект", toHeroes: "К героям", soonHero: "Следующий голос - скоро", soonAsk: "Кого позвать? Предложите героя.", qrTxt: "Откройте на телефоне - так звонок звучит как надо.",
      heroTitle: "Памятники Баку разговаривают",
      heroLead: "Отсканируйте код у памятника - и он вам позвонит.",
      incStatus: "сейчас звонит", incNext: "Следующий",
      heroesTitle: "Герои", callHim: "Позвонить",
      howTitle: "Как это работает", how: ["Найдите код у памятника", "Отсканируйте его камерой", "Примите звонок", "Задержитесь и присмотритесь"],
      aboutTitle: "О проекте",
      aboutText: "Мы хотим, чтобы у памятников останавливались. Каждый звонок - знакомство с героем и одна ценность, которую стоит унести с собой.",
      endorse: "Проект Gökand", author: "Автор - Ренат Рахматулин",
      foot: "Danışan heykəllər · некоммерческий проект о людях, которые смотрят на нас с постаментов"
    }
  };

  /* ---------- storage (per-viewer, never required) ---------- */
  function sget(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function collected() { var a = []; try { a = JSON.parse(sget("dh-collected") || "[]"); } catch (e) {} return Array.isArray(a) ? a : []; }
  function collect(id) { var c = collected(); if (c.indexOf(id) < 0) { c.push(id); sset("dh-collected", JSON.stringify(c)); } }

  /* ---------- analytics (GoatCounter, only when a code is set) ---------- */
  var from = new URLSearchParams(location.search).get("from");
  function track(evt) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: PAGE + "-" + evt, event: true }); } catch (e) {} }
  if (DH.analytics) {
    window.goatcounter = { path: function (p) { return p + (from ? "?from=" + from : ""); } };
    var gs = document.createElement("script"); gs.async = true; gs.src = "https://gc.zgo.at/count.js";
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
  function heroes() { return DH.monuments.filter(function (m) { return m.ready && m.name; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  /* ---------- home ---------- */
  function home() {
    var list = heroes(), SLOTS = 6;
    function paint() {
      var t = T[lang];
      ["stageEyebrow", "heroTitle", "heroLead", "aboutText", "toHeroes", "heroesTitle", "endorse", "author", "foot", "ai"].forEach(function (k) { $(k).textContent = t[k]; });
      var ol = $("how"); ol.innerHTML = "";
      t.how.forEach(function (s) { ol.appendChild(el("li", "", s)); });
      var box = $("heroes"); box.innerHTML = "";
      list.forEach(function (m) {
        var a = el("a", "hero-card"); a.href = ROOT + m.id + "/";
        var ph = el("span", "ph"), phi = el("i"); phi.style.backgroundImage = "url('" + ROOT + m.photo + "')"; ph.appendChild(phi);
        var b = el("span", "hc-body");
        b.appendChild(el("span", "hc-name", m.name[lang]));
        b.appendChild(el("span", "hc-role", m.role[lang]));
        b.appendChild(el("span", "hc-proverb", m.proverb ? m.proverb[lang] : ""));
        var ft = el("span", "hc-foot");
        ft.appendChild(el("span", "", m.area[lang]));
        ft.appendChild(el("span", "hc-call", t.callHim + " →"));
        b.appendChild(ft); a.appendChild(ph); a.appendChild(b); box.appendChild(a);
      });
      for (var i = list.length; i < SLOTS; i++) {
        var c = el("div", "hero-card closed");
        c.appendChild(el("span", "ph"));
        var cb = el("span", "hc-body");
        cb.appendChild(el("span", "hc-name", t.soonHero));
        cb.appendChild(el("span", "hc-role", t.soonAsk));
        c.appendChild(cb); box.appendChild(c);
      }
    }
    bindLangs(paint); paint();
  }

  /* ---------- call page ---------- */
  function call(m) {
    var audio = new Audio(); audio.preload = "auto";
    var state = "ring", clock = null, spans = [], maxSeen = 0, t0 = 0, pausedAt = 0, paused = false;
    var voiced = m.voice !== false, wakeLock = null, readIdx = 0, finishedBy = "call";
    function nowT() { return voiced ? audio.currentTime : (paused ? pausedAt : (Date.now() - t0) / 1000); }

    if (m.photo) { var bg = $("bg"); bg.classList.remove("placeholder"); bg.style.setProperty("--photo", "url('" + ROOT + m.photo + "')"); }
    /* the whole monument: the photo fills exactly the space between the top bar and the panel */
    function fitPhoto() {
      var bgEl = $("bg"), view = { ring: "ringView", declined: "declinedView", call: "talkView" }[state];
      if (!view) { bgEl.style.top = ""; bgEl.style.height = ""; return; }
      var top = document.querySelector(".top").getBoundingClientRect().bottom;
      var subs = $("subs");
      if (state === "call" && !subs.hidden) {
        subs.style.maxHeight = "";
        var room = $(view).getBoundingClientRect().top - top, want = window.innerHeight * (voiced ? 0.36 : 0.28);
        if (room < want) subs.style.maxHeight = Math.max(120, subs.clientHeight - (want - room)) + "px";
      }
      var bottom = $(view).getBoundingClientRect().top;
      bgEl.style.top = Math.max(0, top) + "px";
      bgEl.style.height = Math.max(0, bottom - top) + "px";
      requestAnimationFrame(function () {
        var v = $(view); if (!v || v.hidden) return;
        bgEl.style.height = Math.max(0, v.getBoundingClientRect().top - top) + "px";
      });
    }
    window.addEventListener("resize", fitPhoto);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitPhoto(); });

    function fmt(s) { s = Math.max(0, Math.floor(s || 0)); var r = s % 60; return Math.floor(s / 60) + ":" + (r < 10 ? "0" : "") + r; }
    function lastCue() { var c = m.cues[lang]; return c[c.length - 1].t + 3; }
    function total() { return voiced ? (audio.duration || lastCue()) : lastCue(); }
    function setState(s) {
      state = s;
      document.body.className = "call s-" + s + (paused ? " paused" : "") + ($("subs").hidden ? "" : " with-text");
      $("ringView").hidden = s !== "ring";
      $("declinedView").hidden = s !== "declined";
      $("talkView").hidden = s !== "call";
      $("readView").hidden = s !== "read";
      $("done").hidden = s !== "done";
      window.scrollTo(0, 0);
      fitPhoto();
    }
    function paragraphs() {
      var c = m.cues[lang], b = [0].concat(m.paras ? m.paras[lang] : []).concat([c.length]), out = [];
      for (var i = 0; i < b.length - 1; i++) out.push(c.slice(b[i], b[i + 1]).map(function (x) { return x.s; }).join(" "));
      return out;
    }

    function paint() {
      var t = T[lang];
      document.title = m.name[lang] + " · Danışan heykəllər";
      $("statusTxt").textContent = t.calling;
      $("name").textContent = m.name[lang]; $("talkName").textContent = m.name[lang]; $("readName").textContent = m.name[lang];
      $("role").textContent = m.role[lang];
      $("dur").textContent = t.dur(Math.max(1, Math.round(lastCue() / 60)));
      $("sound").textContent = voiced ? t.sound : t.soon;
      $("acceptLbl").textContent = t.accept; $("declineLbl").textContent = t.decline; $("hangLbl").textContent = t.hang;
      $("pauseLbl").textContent = paused ? t.resume : t.pause;
      $("whatBtn").textContent = "?"; $("whatBtn").setAttribute("aria-label", t.what); $("whatBtn").title = t.what; $("whatTitle").textContent = t.whatTitle; $("whatText").textContent = t.whatText;
      $("whatHome").textContent = t.aboutLink; $("whatClose").textContent = t.close;
      $("declinedTxt").textContent = t.declined; $("declinedSub").textContent = t.declinedSub;
      $("callBack").textContent = t.callBack; $("readBtn").textContent = t.read;
      $("textToggle").textContent = $("subs").hidden ? t.showText : t.hideText;
      $("readBack").textContent = t.back;
      $("valueLbl").textContent = m.value ? m.value[lang] : "";
      $("proverb").textContent = m.proverb ? m.proverb[lang] : "";
      $("thanks").textContent = finishedBy === "read" ? t.thanksRead : t.thanks;
      $("storyLbl").textContent = t.story; $("again").textContent = t.again; $("share").textContent = t.share;
      $("othersLbl").textContent = t.others; $("homeLink").textContent = t.home; $("ai").textContent = t.ai;
      if ($("qrTxt")) $("qrTxt").textContent = t.qrTxt;
      $("sheetTxt").textContent = canShareFiles ? t.sheetReady : t.sheet; $("sheetClose").textContent = t.close; $("sheetShare").textContent = t.sheetShare;
      $("credit").textContent = (m.credit && typeof m.credit === "object") ? (m.credit[lang] || "") : (m.credit || "");
      var oth = $("others"); oth.innerHTML = "";
      heroes().filter(function (x) { return x.id !== m.id; }).forEach(function (x) {
        var a = el("a", "other"); a.href = ROOT + x.id + "/";
        var ph = el("span", "ph"), phi = el("i"); phi.style.backgroundImage = "url('" + ROOT + x.photo + "')"; ph.appendChild(phi);
        var tx = el("span", "ot");
        tx.appendChild(el("b", "", x.name[lang]));
        tx.appendChild(el("span", "", x.value ? x.value[lang] : ""));
        a.appendChild(ph); a.appendChild(tx); oth.appendChild(a);
      });
      if (state === "read") paintRead();
    }

    /* optional subtitles during the call */
    function buildSubs() {
      var box = $("subs"); box.innerHTML = ""; spans = [];
      m.cues[lang].forEach(function (c, i) {
        var s = el("span", "", c.s);
        box.appendChild(s); if (i < m.cues[lang].length - 1) box.appendChild(document.createTextNode(" "));
        spans.push(s);
      });
    }
    function sync() {
      var t = nowT(), cues = m.cues[lang], idx = 0;
      for (var i = 0; i < cues.length; i++) if (cues[i].t <= t + 0.05) idx = i;
      if (!$("subs").hidden) {
        spans.forEach(function (s, i) { s.className = i < idx ? "past" : (i === idx ? "now" : ""); });
        var cur = spans[idx], box = $("subs");
        if (cur) { var top = cur.offsetTop - box.offsetTop; if (top > box.scrollTop + box.clientHeight - 48 || top < box.scrollTop) box.scrollTop = Math.max(0, top - 24); }
      }
      paintCards(false);
      var d = total();
      $("time").textContent = fmt(t) + " / " + fmt(d);
      $("prog").style.width = Math.min(100, (t / d) * 100) + "%";
      maxSeen = Math.max(maxSeen, t / d);
      if (!voiced && !paused && t >= d && state === "call") { maxSeen = 1; finish("call"); }
    }
    var cardIdx = -1, manual = null, manualSlot = -1;
    function autoSlot(n) { return Math.min(n - 1, Math.floor((nowT() / total()) * n)); }
    function pickCard(k) {
      var n = (m.cards || []).length; if (!n) return;
      manual = (k + n) % n; manualSlot = autoSlot(n); paintCards(true); track("card");
    }
    function paintCards(force) {
      var box = $("cards"), list = m.cards || [];
      var show = list.length && $("subs").hidden;
      box.hidden = !show; if (!show) return;
      var slot = autoSlot(list.length), i = slot;
      if (manual !== null) { if (slot === manualSlot) i = manual; else manual = null; }
      if (i === cardIdx && !force) return;
      cardIdx = i; box.innerHTML = "";
      var c = list[i], card = el("div", "info");
      card.addEventListener("click", function (e) { if (e.target.tagName !== "BUTTON") pickCard(cardIdx + 1); });
      card.appendChild(el("p", "eyebrow", c.label[lang]));
      card.appendChild(el("p", "info-t", c.text[lang]));
      var dots = el("div", "dots");
      list.forEach(function (x, k) {
        var d = el("button", k === i ? "on" : ""); d.type = "button";
        d.setAttribute("aria-label", x.label[lang]); d.title = x.label[lang];
        d.addEventListener("click", function () { pickCard(k); });
        dots.appendChild(d);
      });
      card.appendChild(dots); box.appendChild(card);
      fitPhoto();
    }
    function lockScreen() { try { if (navigator.wakeLock && navigator.wakeLock.request) navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; }, function () {}); } catch (e) {} }
    function unlockScreen() { try { if (wakeLock) wakeLock.release(); } catch (e) {} wakeLock = null; }

    function start() {
      paused = false;
      buildSubs(); maxSeen = 0; cardIdx = -1; manual = null;
      $("subs").hidden = true;
      $("textToggle").hidden = false;
      setState("call");
      try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) {}
      $("textToggle").textContent = $("subs").hidden ? T[lang].showText : T[lang].hideText;
      $("pauseLbl").textContent = T[lang].pause;
      if (voiced) {
        audio.src = ROOT + m.audio[lang]; audio.currentTime = 0;
        var pr = audio.play(); if (pr && pr.catch) pr.catch(function () { $("time").textContent = T[lang].audioErr; });
      } else { t0 = Date.now(); }
      lockScreen();
      clearInterval(clock); clock = setInterval(sync, 200); sync();
      track("accepted");
    }
    function togglePause() {
      if (state !== "call") return;
      if (!paused) { paused = true; if (voiced) audio.pause(); else pausedAt = nowT(); }
      else { paused = false; if (voiced) audio.play(); else t0 = Date.now() - pausedAt * 1000; }
      document.body.classList.toggle("paused", paused);
      $("pauseLbl").textContent = paused ? T[lang].resume : T[lang].pause;
      $("pause").setAttribute("aria-pressed", paused ? "true" : "false");
    }
    function finish(by) {
      clearInterval(clock); unlockScreen();
      try { audio.pause(); } catch (e) {}
      finishedBy = by;
      if (by === "read" || maxSeen >= 0.6) { collect(m.id); track(by === "read" ? "read-done" : "completed"); }
      paused = false; setState("done"); paint();
    }

    /* reading, paragraph by paragraph */
    function paintRead() {
      var ps = paragraphs(), t = T[lang];
      readIdx = Math.max(0, Math.min(readIdx, ps.length - 1));
      $("page").textContent = ps[readIdx];
      $("readPos").textContent = (readIdx + 1) + " / " + ps.length;
      $("readBack").disabled = readIdx === 0;
      $("readNext").textContent = readIdx === ps.length - 1 ? t.finish : t.next;
    }
    function openRead() { readIdx = 0; setState("read"); paintRead(); track("read"); }

    /* story card: 1080x1920 PNG with the hero's proverb */
    function loadImg(src) { return new Promise(function (res) { if (!src) return res(null); var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; }); }
    function wrapLines(x, text, maxW) {
      var words = text.split(" "), lines = [], cur = "";
      words.forEach(function (w) { var tl = cur ? cur + " " + w : w; if (x.measureText(tl).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tl; });
      if (cur) lines.push(cur); return lines;
    }
    function makeStory() {
      var W = 1080, H = 1920, t = T[lang];
      var fontsReady = (document.fonts && document.fonts.load) ? Promise.all([
        document.fonts.load("600 96px 'Cormorant SC'"), document.fonts.load("italic 400 54px Alegreya")
      ]).catch(function () {}) : Promise.resolve();
      return Promise.all([loadImg(m.story ? ROOT + m.story : (m.photo ? ROOT + m.photo : null)), fontsReady]).then(function (r) {
        var img = r[0], c = document.createElement("canvas"); c.width = W; c.height = H;
        var x = c.getContext("2d");
        var PAPER = "#0b1730", INK = "#f3ebdd", SOFT = "#c9c2b2", OATH = "#c8743a", OATHT = "#d88a52", LINE = "#2a3d63";
        x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
        var PH = 1000;
        if (img) {
          var cover = !!m.story, s = cover ? Math.max(W / img.width, PH / img.height) : Math.min(W / img.width, PH / img.height), w = img.width * s, h = img.height * s;
          x.fillStyle = "#08112a"; x.fillRect(0, 0, W, PH);
          x.save(); x.beginPath(); x.rect(0, 0, W, PH); x.clip();
          x.drawImage(img, (W - w) / 2, cover ? 0 : PH - h, w, h);
          if (!cover) { x.globalCompositeOperation = "saturation"; x.fillStyle = "#808080"; x.fillRect(0, 0, W, PH); }
          x.globalCompositeOperation = "source-over"; x.restore();
        } else { x.fillStyle = "#13284b"; x.fillRect(0, 0, W, PH); }
        x.fillStyle = LINE; x.fillRect(0, PH, W, 2);
        x.fillStyle = OATH; x.fillRect(80, PH + 86, 56, 4);
        x.font = "600 32px 'Cormorant SC', Georgia, serif"; x.fillStyle = OATHT; x.textBaseline = "middle";
        x.fillText("DANIŞAN HEYKƏLLƏR · BAKI", 156, PH + 88);
        x.textBaseline = "alphabetic";
        var y = PH + 190;
        x.fillStyle = SOFT; x.font = "italic 400 46px Alegreya, Georgia, serif"; x.fillText(storyLine(t), 80, y);
        x.fillStyle = INK; x.font = "600 96px 'Cormorant SC', Georgia, serif";
        wrapLines(x, m.name[lang], W - 160).forEach(function (l) { y += 100; x.fillText(l, 80, y); });
        if (m.proverb) {
          y += 96;
          x.fillStyle = OATHT; x.font = "600 30px 'Cormorant SC', Georgia, serif"; x.fillText((m.value ? m.value[lang] : "").toUpperCase(), 80, y);
          x.fillStyle = INK; x.font = "italic 400 54px Alegreya, Georgia, serif";
          wrapLines(x, m.proverb[lang], W - 160).forEach(function (l) { y += 70; x.fillText(l, 80, y); });
        }
        x.font = "400 32px Alegreya, Georgia, serif"; x.fillStyle = SOFT;
        x.fillText((location.host || "danisan-heykeller.github.io") + "/" + m.id, 80, H - 90);
        return c;
      });
    }
    function storyLine(t) { return (m.female && lang === "ru") ? "Мне позвонила" : t.storyLine; }
    var storyFile = null, canShareFiles = false;
    function shareUrl() { return location.origin + location.pathname + "?from=share"; }
    function shareStory() {
      $("sheetToast").textContent = "";
      makeStory().then(function (c) {
        $("sheetImg").src = c.toDataURL("image/png");
        c.toBlob(function (blob) {
          storyFile = blob ? new File([blob], "danisan-heykeller-" + m.id + ".png", { type: "image/png" }) : null;
          try { canShareFiles = !!(storyFile && navigator.canShare && navigator.canShare({ files: [storyFile] })); } catch (e) { canShareFiles = false; }
          $("sheetShare").hidden = !(canShareFiles || navigator.share);
          $("sheetTxt").textContent = canShareFiles ? T[lang].sheetReady : T[lang].sheet;
          $("sheet").hidden = false; track("story-preview");
        }, "image/png");
      });
    }
    function sendStory() {
      var t = T[lang], data = canShareFiles ? { files: [storyFile], text: storyLine(t) + " " + m.name[lang] + " - " + shareUrl() } : { title: m.name[lang], url: shareUrl() };
      try { navigator.share(data).then(function () { track("story"); }, function () {}); } catch (e) {}
    }

    audio.addEventListener("ended", function () { maxSeen = 1; if (state === "call") finish("call"); });
    audio.addEventListener("error", function () { if (state === "call") $("time").textContent = T[lang].audioErr; });

    $("accept").addEventListener("click", start);
    $("decline").addEventListener("click", function () { setState("declined"); track("declined"); });
    $("callBack").addEventListener("click", start);
    $("readBtn").addEventListener("click", openRead);
    $("hangup").addEventListener("click", function () { finish("call"); });
    $("pause").addEventListener("click", togglePause);
    $("textToggle").addEventListener("click", function () {
      var s = $("subs"); s.hidden = !s.hidden; document.body.classList.toggle("with-text", !s.hidden);
      $("textToggle").textContent = s.hidden ? T[lang].showText : T[lang].hideText; paintCards(true); sync(); fitPhoto(); track("text");
    });
    $("readBack").addEventListener("click", function () { readIdx--; paintRead(); });
    $("readNext").addEventListener("click", function () { if (readIdx >= paragraphs().length - 1) finish("read"); else { readIdx++; paintRead(); } });
    $("again").addEventListener("click", start);
    $("story").addEventListener("click", shareStory);
    $("whatBtn").addEventListener("click", function () { $("what").hidden = false; $("whatClose").focus(); });
    $("whatClose").addEventListener("click", function () { $("what").hidden = true; });
    $("sheetClose").addEventListener("click", function () { $("sheet").hidden = true; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { $("what").hidden = true; $("sheet").hidden = true; } });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && state === "call") lockScreen(); });
    $("sheetShare").addEventListener("click", sendStory);
    $("share").addEventListener("click", function () {
      var t = T[lang];
      function fail() { $("sheetToast").textContent = t.copyFail; }
      try { navigator.clipboard.writeText(shareUrl()).then(function () { $("sheetToast").textContent = t.copied; track("shared"); }, fail); } catch (e) { fail(); }
    });

    bindLangs(function () {
      if (state === "call") { try { audio.pause(); } catch (e) {} start(); }
      paint();
      fitPhoto();
    });
    setState("ring"); paint(); fitPhoto();
  }

  if (PAGE === "home") home();
  else {
    var m = DH.monuments.filter(function (x) { return x.id === PAGE && x.ready; })[0];
    if (m) call(m); else location.replace(ROOT);
  }
})();
