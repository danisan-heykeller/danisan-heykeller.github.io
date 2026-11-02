# Danışan heykəllər

Bakının heykəlləri danışır. Abidənin yanındakı QR kodu skan edin - və o sizə zəng edəcək.

Памятники Баку разговаривают. Отсканируйте QR-код у памятника - и он вам позвонит.

- Sayt / Сайт: https://danisan-heykeller.github.io
- `audio/` - səs yazıları / озвучка
- `qr/` - çap üçün QR kodlar / QR-коды для печати
- `assets/data.js` - heykəllər, mətnlər, vaxt nişanları / памятники, тексты, тайминги

## Danışan stansiyalar (metro)

- `metro/` - metro xəritəsi və stansiya səhifələri / схема метро и страницы станций
- `assets/metro.js` - xətlər, 27 stansiya, mətnlər / линии, 27 станций, тексты (генерируется)
- `tools/build_metro.py` - mətnləri burada dəyişin, sonra: `python3 tools/build_metro.py assets/metro.js`
