# man & es — Stellas Deutsch

Одностраничный урок немецкой грамматики (неопределённо-личные и безличные предложения)
в связке с презентацией платформы Stellas.

- `index.html` — разметка
- `styles.css` — визуальная система (Onest, чёрно-белый контраст, mobile-first)
- `app.js` — анимации, квиз, «машина порядка слов», аккордеон
- `media/` — сжатые видео и скриншоты платформы

## Ссылки

Все CTA берутся из объекта `LINKS` в начале `app.js`:

```js
const LINKS = {
  telegram : 'https://t.me/stellas_deutsch',
  instagram: 'https://instagram.com/stellas_deutsch'
};
```

Поменяй их там — они подставятся во все кнопки сразу.
