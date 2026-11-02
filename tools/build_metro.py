# Builds assets/metro.js (Metro pasportu): lines, 27 stations, pilot stories, on-site questions, QR keys,
# and qr/metro-<id>.png|.svg for printing. Edit texts here, then run:
#   python3 tools/build_metro.py
import json, os
import qrcode
import qrcode.image.svg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://danisan-heykeller.github.io"

# Pilot stations. "story" unlocks after the stamp; "q" is answerable only on the spot (answer = index in "opts").
P = {
 "koroglu": {
  "name": {"az": "Koroğlu", "ru": "Кёроглу"},
  "role": {"az": "dastan qəhrəmanı", "ru": "герой дастана"},
  "icon": "pyramid", "key": "qrt7",
  "story": {
   "az": "Mən Koroğluyam - aşıqların əsrlər boyu nəsildən-nəslə danışdığı dastanın qəhrəmanı. Qıratım, sazım və Çənlibel qalam var. 1937-ci ildə Üzeyir Hacıbəyli mənim haqqımda opera yazdı, 2011-ci il dekabrın 30-dan isə bu stansiya mənim adımı daşıyır. Buradan ayda bir milyondan çox insan keçir. Bizdə deyirlər: dost dar gündə tanınar. Yanınızda kimsə çətinlik çəkirsə, əl uzadın.",
   "ru": "Я Кёроглу - герой дастана, который веками рассказывали ашуги, от деда к внуку. У меня есть конь Гырат, саз и крепость Ченлибель. В 1937 году Узеир Гаджибейли написал обо мне оперу, а с 30 декабря 2011 года эта станция носит моё имя. Через неё за месяц проходит больше миллиона человек. У нас говорят: друг познаётся в беде. Если рядом кому-то тяжело - протяните руку."
  },
  "q": {
   "az": "Stansiyanın girişindəki zal hansı formadadır?", "ru": "Какой формы зал над входом в станцию?",
   "opts": {"az": ["Günbəz", "Piramida", "Qüllə"], "ru": ["Купол", "Пирамида", "Башня"]}, "a": 1
  },
  "look": {
   "az": ["Girişdəki 20 metrlik şüşə piramida", "Yarı mərmər, yarı polad sütunlar", "Mərmər platforma"],
   "ru": ["Стеклянная пирамида над входом - 20 метров", "Колонны: наполовину мрамор, наполовину сталь", "Мраморная платформа"]
  }
 },
 "nizami": {
  "name": {"az": "Nizami", "ru": "Низами"},
  "role": {"az": "şair · XII əsr", "ru": "поэт · XII век"},
  "icon": "star", "key": "xms5",
  "story": {
   "az": "Mən Nizami Gəncəviyəm, XII əsrdə Gəncədə yaşamış şair. \"Xəmsə\"m beş poemadır və onların süjetləri bu divarlarda canlanıb: stansiya 1976-cı il dekabrın 31-də açılıb, rəssam Mikayıl Abdullayev burada mənim portretimi və on səkkiz mozaika panno yaradıb. Pannolar dağılanda ustalar onları parça-parça bərpa ediblər. Bizdə deyirlər: söz var, kəsər savaşı, söz var, kəsdirər başı. Bu gün kiməsə bir xoş söz deyin.",
   "ru": "Я Низами Гянджеви, поэт из Гянджи, жил в XII веке. Моя \"Хамсе\" - это пять поэм, и их сюжеты ожили на этих стенах: станцию открыли 31 декабря 1976 года, а художник Микаил Абдуллаев выложил здесь мой портрет и восемнадцать мозаичных панно. Когда панно начали разрушаться, мастера восстанавливали их кусочек за кусочком. У нас говорят: есть слово, что останавливает войну, и есть слово, что стоит головы. Скажите сегодня кому-нибудь доброе слово."
  },
  "q": {
   "az": "Divarlardakı şəkillər nədən düzəldilib?", "ru": "Из чего сделаны картины на стенах?",
   "opts": {"az": ["Yağlı boya", "Fotoşəkil", "Mozaika"], "ru": ["Масляная краска", "Фотографии", "Мозаика"]}, "a": 2
  },
  "look": {
   "az": ["Şairin böyük mozaika portreti", "\"Xəmsə\" üzrə 18 panno - Leyli və Məcnunu tapın", "Pannoları müqayisə edin: bərpa olunanları ayırd edə bilərsinizmi?"],
   "ru": ["Большой мозаичный портрет поэта", "18 панно по \"Хамсе\" - найдите Лейли и Меджнуна", "Сравните панно: узнаете ли вы отреставрированные?"]
  }
 },
 "icherisheher": {
  "name": {"az": "İçərişəhər", "ru": "Ичеришехер"},
  "role": {"az": "stansiya · 1967", "ru": "станция · 1967"},
  "icon": "wall", "key": "qla3",
  "story": {
   "az": "Mən \"İçərişəhər\" stansiyasıyam, Bakı metrosunun ilklərindən biri - məni 1967-ci il noyabrın 6-da açıblar. 2007-ci ildə mənə apardığım Qədim şəhərin adını verdilər. Divarlarımda Fransada hazırlanmış qədim Bakının on altı təsviri, zalın dərinliyində isə \"İçərişəhər\" yazılı qala divarı parçası var. Bizdə deyirlər: atalar sözü ağlın gözüdür. Bu gün ailənizin böyüyündən soruşun: uşaqlığında Bakı necə idi?",
   "ru": "Я станция \"Ичеришехер\", одна из первых в бакинском метро - меня открыли 6 ноября 1967 года. В 2007 году мне дали имя Старого города, к которому я веду. На моих стенах шестнадцать картин древнего Баку, сделанных во Франции, а в глубине зала - кусок крепостной стены с надписью \"İçərişəhər\". У нас говорят: мудрость предков - глаза разума. Спросите сегодня старшего в семье, каким был Баку в его детстве."
  },
  "q": {
   "az": "Zalın dərinliyində nə var?", "ru": "Что находится в глубине зала?",
   "opts": {"az": ["Köhnə vaqon", "Qala divarı parçası", "Fəvvarə"], "ru": ["Старый вагон", "Кусок крепостной стены", "Фонтан"]}, "a": 1
  },
  "look": {
   "az": ["Divarlarda qədim Bakının 16 təsviri", "\"İçərişəhər\" yazılı qala divarı parçası", "İstiqlaliyyət küçəsində piramida-giriş"],
   "ru": ["16 картин древнего Баку на стенах", "Фрагмент крепостной стены с надписью \"İçərişəhər\"", "Вход-пирамида на улице Истиглалият"]
  }
 }
}

# 27 stations in route order; "branch" marks the Bakmil spur
LINES = [
 {"id": "red", "color": "#d4553f", "name": {"az": "Qırmızı xətt", "ru": "Красная линия"}, "stations": [
  ["icherisheher", "İçərişəhər"], ["sahil", "Sahil"], ["28may", "28 May"], ["genclik", "Gənclik"],
  ["nerimanov", "Nəriman Nərimanov"], ["bakmil", "Bakmil", "branch"], ["ulduz", "Ulduz"], ["koroglu", "Koroğlu"],
  ["qarayev", "Qara Qarayev"], ["neftchiler", "Neftçilər"], ["xalqlar", "Xalqlar Dostluğu"], ["ehmedli", "Əhmədli"],
  ["aslanov", "Həzi Aslanov"]]},
 {"id": "green", "color": "#3fa66b", "name": {"az": "Yaşıl xətt", "ru": "Зелёная линия"}, "stations": [
  ["dernegul", "Dərnəgül"], ["azadliq", "Azadlıq prospekti"], ["nesimi", "Nəsimi"], ["ecemi", "Memar Əcəmi"],
  ["20yanvar", "20 Yanvar"], ["inshaatchilar", "İnşaatçılar"], ["elmler", "Elmlər Akademiyası"], ["nizami", "Nizami"],
  ["cabbarli", "Cəfər Cabbarlı"], ["xetai", "Xətai"]]},
 {"id": "purple", "color": "#9a6cc8", "name": {"az": "Bənövşəyi xətt", "ru": "Фиолетовая линия"}, "stations": [
  ["xocesen", "Xocəsən"], ["avtovagzal", "Avtovağzal"], ["ecemi2", "Memar Əcəmi-2"], ["8noyabr", "8 Noyabr"]]}
]

stations = []
for ln in LINES:
    for st in ln["stations"]:
        sid, label = st[0], st[1]
        d = {"id": sid, "line": ln["id"], "color": ln["color"], "label": label, "ready": sid in P}
        if len(st) > 2: d["branch"] = True
        if sid in P: d.update(P[sid])
        stations.append(d)
assert len(stations) == 27

lines = [{"id": l["id"], "color": l["color"], "name": l["name"], "stations": [s[0] for s in l["stations"]]} for l in LINES]
with open(os.path.join(ROOT, "assets/metro.js"), "w", encoding="utf-8") as f:
    f.write("/* Metro pasportu - generated by tools/build_metro.py; edit texts there. */\n")
    f.write("window.DH_METRO = " + json.dumps({"lines": lines, "stations": stations}, ensure_ascii=False, indent=1) + ";\n")

for sid, p in P.items():
    url = "%s/metro/%s/?k=%s" % (SITE, sid, p["key"])
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=4)
    qr.add_data(url); qr.make(fit=True)
    qr.make_image(fill_color="black", back_color="white").save(os.path.join(ROOT, "qr/metro-%s.png" % sid))
    qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage).save(os.path.join(ROOT, "qr/metro-%s.svg" % sid))
    print(sid, url)
