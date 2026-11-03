# Danışan heykəllər

Bakının heykəlləri danışır. Abidənin yanındakı QR kodu skan edin - və o sizə zəng edəcək.

Памятники Баку разговаривают. Отсканируйте QR-код у памятника - и он вам позвонит.

- Sayt / Сайт: https://danisan-heykeller.github.io
- `audio/` - səs yazıları / озвучка
- `qr/` - çap üçün QR kodlar / QR-коды для печати
- `assets/data.js` - heykəllər, mətnlər, vaxt nişanları / памятники, тексты, тайминги

## Metro pasportu / Паспорт метро

- `metro/` - pasport və stansiya səhifələri / паспорт и страницы станций
- `assets/metro.js` - xətlər, 27 stansiya, hekayələr, suallar (generasiya olunur) / генерируется
- `assets/passport.js` - möhürlər / печати: sual, söz, QR (pilotda üçü də var)
- `qr/metro-*.png|svg` - stansiyalar üçün QR / QR для станций
- Mətnləri `tools/build_metro.py`-də dəyişin, sonra: `python3 tools/build_metro.py`

## Hekayə avtomatı / Автомат рассказов

- `hekaye/` - "haradan - haraya" seçin, yol qədər hekayə alın / выберите поездку, получите рассказ на её длину
- `tools/hekaye/*.md` - mətnlər (front matter + [az] / [ru]); sonra / потом: `python3 tools/build_hekaye.py`
- Hekayələr səhifəyə daxildir, internet olmadan oxunur / рассказы встроены в страницу и читаются без интернета

