# Builds assets/metro.js: lines, 27 stations, pilot monologues with reading-pace cue timings.
import json, sys

OUT = sys.argv[1]

def cues(lines):
    t, out = 0.0, []
    for s in lines:
        out.append({"t": round(t, 2), "s": s})
        t += 0.7 + len(s) / 14.5  # comfortable reading pace for the text-only mode
    return out

L = {
 "koroglu": {
  "az": [
   "Alo?",
   "Bəli, mənəm, Koroğlu.",
   "Təəccüblənməyin - Bakıda stansiyalar bəzən zəng vurur.",
   "Məni bir nəfər uydurmayıb.",
   "Əsrlər boyu aşıqlar məni nəsildən-nəslə danışıblar.",
   "Qıratım, sazım və dağlarda Çənlibel qalam - dastanım belə başlayır.",
   "Mən incidilənləri qorumuşam, artığını özümə götürməmişəm.",
   "1937-ci ildə Üzeyir Hacıbəyli mənim haqqımda \"Koroğlu\" operasını yazdı.",
   "Bu stansiya isə 2011-ci il dekabrın 30-dan mənim adımı daşıyır.",
   "Stansiyanın girişində iyirmi metr hündürlüyündə şüşə piramida durur - çıxanda başınızı qaldırın.",
   "Platformadakı sütunlar yarı mərmər, yarı poladdır.",
   "Mənim kimi: yarı mahnı, yarı polad.",
   "Mənim stansiyamdan ayda bir milyondan çox insan keçir.",
   "Hər kəs öz işinə tələsir - bu da yaxşıdır.",
   "Dayandığınız üçün sağ olun.",
   "Bizdə deyirlər: dost dar gündə tanınar.",
   "Qəhrəman olmaq üçün qılınc lazım deyil.",
   "Yanınızda kimsə çətinlik çəkirsə, əl uzadın.",
   "Elə bu gün. Elə burada."
  ],
  "ru": [
   "Алло?",
   "Да, это я, Кёроглу.",
   "Не удивляйтесь - в Баку станции иногда звонят.",
   "Меня придумал не один человек.",
   "Веками ашуги рассказывали обо мне - от деда к внуку.",
   "Мой конь Гырат, мой саз и горная крепость Ченлибель - так начинается моё сказание.",
   "Я защищал обиженных и не брал себе лишнего.",
   "В 1937 году Узеир Гаджибейли написал обо мне оперу \"Кёроглу\".",
   "А эта станция носит моё имя с 30 декабря 2011 года.",
   "Над входом стоит стеклянная пирамида высотой двадцать метров - на выходе поднимите голову.",
   "Колонны на платформе - наполовину мрамор, наполовину сталь.",
   "Как и я: наполовину песня, наполовину сталь.",
   "Через мою станцию за месяц проходит больше миллиона человек.",
   "Каждый спешит по своим делам - и это хорошо.",
   "Спасибо, что остановились.",
   "У нас говорят: друг познаётся в беде.",
   "Чтобы быть героем, меч не нужен.",
   "Если рядом кому-то тяжело - протяните руку.",
   "Сегодня. Прямо здесь."
  ]
 },
 "nizami": {
  "az": [
   "Alo?",
   "Salam. Nizami Gəncəvi danışır.",
   "Mən səkkiz yüz ildən çox əvvəl Gəncədə yaşamışam.",
   "Bütün ömrüm sözdür.",
   "Beş poema yazmışam, onları birlikdə \"Xəmsə\" - \"Beşlik\" adlandırırlar.",
   "\"Sirlər xəzinəsi\", \"Xosrov və Şirin\", \"Leyli və Məcnun\", \"Yeddi gözəl\" və \"İskəndərnamə\".",
   "Ətrafınızdakı divarlara baxın.",
   "Bu stansiya 1976-cı il dekabrın 31-də açılıb.",
   "Rəssam Mikayıl Abdullayev burada mənim portretimi və \"Xəmsə\"nin süjetləri əsasında on səkkiz mozaika panno yaradıb.",
   "Onlarda aşiqləri, hökmdarları və müdrikləri tapın - onlar mənim qəhrəmanlarımdır.",
   "Mozaika kiçik daş parçalarından yığılıb.",
   "Pannolar dağılmağa başlayanda ustalar onları parça-parça bərpa etdilər.",
   "Söz də belədir: biri kiçikdir, birlikdə isə bütöv bir poemanı saxlayırlar.",
   "Dayandığınız üçün sağ olun.",
   "Bizdə deyirlər: söz var, kəsər savaşı, söz var, kəsdirər başı.",
   "Mən səkkiz yüz ildir yalnız sözlə yaşayıram.",
   "Sözlərinizi diqqətlə seçin.",
   "Bu gün kiməsə bir xoş söz deyin - o, düşündüyünüzdən çox yaşayacaq."
  ],
  "ru": [
   "Алло?",
   "Здравствуйте. Говорит Низами Гянджеви.",
   "Я жил в Гяндже больше восьмисот лет назад.",
   "Вся моя жизнь - это слова.",
   "Я написал пять поэм, их вместе называют \"Хамсе\" - \"Пятерица\".",
   "\"Сокровищница тайн\", \"Хосров и Ширин\", \"Лейли и Меджнун\", \"Семь красавиц\" и \"Искендер-наме\".",
   "Посмотрите на стены вокруг.",
   "Эту станцию открыли 31 декабря 1976 года.",
   "Художник Микаил Абдуллаев выложил здесь мой портрет и восемнадцать мозаичных панно по сюжетам \"Хамсе\".",
   "Найдите на них влюблённых, правителей и мудрецов - это мои герои.",
   "Мозаика собрана из маленьких кусочков камня.",
   "Когда панно начали разрушаться, мастера восстанавливали их кусочек за кусочком.",
   "Так и со словами: каждое маленькое, а вместе они держат целую поэму.",
   "Спасибо, что остановились.",
   "У нас говорят: есть слово, что останавливает войну, и есть слово, что стоит головы.",
   "Я восемьсот лет живу только словами.",
   "Выбирайте свои бережно.",
   "Скажите сегодня кому-нибудь одно доброе слово - оно проживёт дольше, чем вы думаете."
  ]
 },
 "icherisheher": {
  "az": [
   "Alo?",
   "Salam. Bu, \"İçərişəhər\" stansiyasıdır.",
   "Mən Bakı metrosunun ilk stansiyalarından biriyəm - məni 1967-ci il noyabrın 6-da açıblar.",
   "O vaxt başqa adım vardı.",
   "2007-ci ildə mənə apardığım Qədim şəhərin adını verdilər.",
   "Divarlara baxın: burada qədim Bakının on altı təsviri var, onları Fransada hazırlayıblar.",
   "Zalın dərinliyində isə üzərində \"İçərişəhər\" sözü olan qala divarı parçası var.",
   "İstiqlaliyyət küçəsinə çıxanda geri dönün: girişim şüşə və metaldan piramidadır.",
   "Lap yaxında əsrlik qala divarları durur, burada, yerin altında isə qatarlar gedir.",
   "Köhnə ilə təzə burada mübahisə etmir - bir-birini saxlayır.",
   "Dayandığınız üçün sağ olun.",
   "Bizdə deyirlər: atalar sözü ağlın gözüdür.",
   "Böyüklərimiz bu şəhəri elə görüblər ki, biz onu artıq heç vaxt belə görməyəcəyik.",
   "Bu gün ailənizin böyüyünə zəng edin və soruşun: uşaqlığında Bakı necə idi?",
   "Cavabı yazın - bir gün bunu sizdən soruşacaqlar."
  ],
  "ru": [
   "Алло?",
   "Здравствуйте. Это станция \"Ичеришехер\".",
   "Я одна из самых первых станций бакинского метро - меня открыли 6 ноября 1967 года.",
   "Тогда у меня было другое имя.",
   "В 2007 году меня назвали в честь Старого города, к которому я веду.",
   "Посмотрите на стены: здесь шестнадцать картин древнего Баку, их сделали во Франции.",
   "А в глубине зала - фрагмент крепостной стены со словом \"İçərişəhər\".",
   "Выйдете на улицу Истиглалият - обернитесь: мой вход - пирамида из стекла и металла.",
   "Совсем рядом стоят стены, которым много веков, а здесь, под землёй, идут поезда.",
   "Старое и новое здесь не спорят - они держат друг друга.",
   "Спасибо, что остановились.",
   "У нас говорят: мудрость предков - глаза разума.",
   "Старшие видели этот город таким, каким мы его уже не увидим.",
   "Позвоните сегодня старшему в вашей семье и спросите, каким был Баку в его детстве.",
   "Запишите ответ - однажды об этом будут спрашивать вас."
  ]
 }
}

S = {
 "koroglu": {
  "name": {"az": "Koroğlu", "ru": "Кёроглу"},
  "role": {"az": "dastan qəhrəmanı · Qırmızı xətt", "ru": "герой дастана · Красная линия"},
  "look": {
   "az": ["Girişdəki 20 metrlik şüşə piramida", "Yarı mərmər, yarı polad sütunlar", "Mərmər platforma"],
   "ru": ["Стеклянная пирамида над входом - 20 метров", "Колонны: наполовину мрамор, наполовину сталь", "Мраморная платформа"]
  }
 },
 "nizami": {
  "name": {"az": "Nizami", "ru": "Низами"},
  "role": {"az": "şair · XII əsr · Yaşıl xətt", "ru": "поэт · XII век · Зелёная линия"},
  "look": {
   "az": ["Şairin böyük mozaika portreti", "\"Xəmsə\" üzrə 18 panno - Leyli və Məcnunu tapın", "Pannoları müqayisə edin: bərpa olunanları ayırd edə bilərsinizmi?"],
   "ru": ["Большой мозаичный портрет поэта", "18 панно по \"Хамсе\" - найдите Лейли и Меджнуна", "Сравните панно: узнаете ли вы отреставрированные?"]
  }
 },
 "icherisheher": {
  "name": {"az": "İçərişəhər", "ru": "Ичеришехер"},
  "role": {"az": "stansiya · 1967 · Qırmızı xətt", "ru": "станция · 1967 · Красная линия"},
  "look": {
   "az": ["Divarlarda qədim Bakının 16 təsviri", "\"İçərişəhər\" yazılı qala divarı parçası", "İstiqlaliyyət küçəsində piramida-giriş"],
   "ru": ["16 картин древнего Баку на стенах", "Фрагмент крепостной стены с надписью \"İçərişəhər\"", "Вход-пирамида на улице Истиглалият"]
  }
 }
}

# 27 stations, route order; "branch" marks the Bakmil spur
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
        sid, nm = st[0], st[1]
        d = {"id": sid, "cid": "metro-" + sid, "line": ln["id"], "label": nm, "ready": sid in L}
        if len(st) > 2: d["branch"] = True
        if sid in L:
            d.update(S[sid]); d["cues"] = {k: cues(v) for k, v in L[sid].items()}
            d["voice"] = False; d["photo"] = ""; d["kind"] = "metro"
        stations.append(d)
lines = [{"id": l["id"], "color": l["color"], "name": l["name"], "stations": [s[0] for s in l["stations"]]} for l in LINES]
assert len(stations) == 27, len(stations)
with open(OUT, "w", encoding="utf-8") as f:
    f.write("/* Danışan stansiyalar - metro section data. Generated; texts live in build script. */\n")
    f.write("window.DH_METRO = " + json.dumps({"lines": lines, "stations": stations}, ensure_ascii=False, indent=1) + ";\n")
for sid in L:
    for k in ("az", "ru"):
        c = cues(L[sid][k]); print(sid, k, "~%ds" % (c[-1]["t"] + 3), sum(len(x.split()) for x in L[sid][k]), "words")
