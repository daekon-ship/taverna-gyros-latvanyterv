# Taverna Gyros — Látványterv v2 (2026)

A **Taverna Gyros Bár & Kávézó** (2200 Monor, Móricz Zsigmond u. 39.) weboldalának látványterve.

Sötét, éttermi hangulatú design: parázs-fekete alap, a **Taverna logó türkizszíne** (#40B8B0) kiemelésként, meleg papír krém szövegszín. Valódi étteremfotókkal, nem stockképekkel.

> ⚠️ Ez egy **látványterv** (`noindex`), nem az éles oldal. Az árak tájékoztató jellegűek.

## Nézet

Nyisd meg az `index.html`-t böngészőben, vagy futtass bármilyen statikus szervert a mappában, pl.:

```bash
npx serve .
# vagy
python -m http.server 8080
```

## Felépítés

```
latvanyterv/
├── index.html      # teljes egyoldalas site
├── styles.css      # design system + layout
├── script.js       # nyitvatartás-jelző, étlap-fülek, drawer, reveal animációk
└── assets/         # valódi étteremfotók
```

## Főbb funkciók

- **Élő nyitvatartás-jelző** — a fejléc feletti sáv valós időben mutatja, hogy nyitva van-e a Taverna (H–Szo 11:00–21:00, rendelésfelvétel 20:30-ig)
- **Teljes digitális étlap** — 6 kategória fülönként, mono betűtípusú árak
- **Házhozszállítás** — kiszállítási körzet a környező településekkel
- **Galéria** — valódi képek az étteremből
- **Térkép** — Google Maps beágyazás
- Reszponzív, mobilon ragadós „Étlap / Rendelek” sávval
- `prefers-reduced-motion` támogatás, fókuszálható skip-link, aria-attribútumok

## Technológia

Tiszta HTML + CSS + vanilla JS — keretrendszer és build nélkül. Betűtípusok: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), Inter, JetBrains Mono (Google Fonts).
