# SL Journeys — Next.js

The full SL Journeys website rebuilt as a **Next.js 14 (App Router) + TypeScript** app.
It is a faithful 1:1 port of the static site in the parent folder — same design system,
content, animations, language switcher, and forms — now component-based and SSG.

## Run it

```bash
cd nextJS
npm install      # first time only
npm run dev      # development  -> http://localhost:3000
```

Production:

```bash
npm run build    # prerenders all 20 routes
npm run start    # serve the production build -> http://localhost:3000
```

## Routes

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Tour packages | `/packages/hill-country`, `/packages/cultural-special`, `/packages/down-south`, `/packages/honeymoon` |
| Blog index | `/blog` |
| Blog posts | `/blog/best-time`, `/blog/cuisine`, `/blog/things-to-do`, `/blog/discover` |
| Gallery | `/gallery` |
| Contact | `/contact` |
| 404 | custom `not-found` |
| SEO | `/sitemap.xml`, `/robots.txt` |

All pages are statically prerendered (○ Static / ● SSG).

## Structure

```
src/
  app/
    layout.tsx            ← fonts (next/font), metadata, Header/Footer/SiteEffects
    page.tsx              ← home
    about|blog|gallery|contact/page.tsx
    packages/[slug]/page.tsx   ← dynamic, generateStaticParams + generateMetadata
    blog/[slug]/page.tsx       ← dynamic
    globals.css          ← the design system (ported from the static site)
    sitemap.ts, robots.ts, icon.png, apple-icon.png, not-found.tsx
  components/
    Header.tsx           ← nav, dropdown, mobile drawer, scroll-solid (client)
    LanguageSwitcher.tsx ← Google Translate behind a branded 100+ language dropdown (client)
    SiteEffects.tsx      ← scroll-reveal, count-ups, hero parallax, per-route (client)
    EnquiryForm.tsx      ← booking/contact form → WhatsApp (client)
    Gallery.tsx          ← masonry grid + lightbox (client)
    Footer.tsx, cards.tsx, Ic.tsx   ← presentational (server)
  data/
    site.ts              ← brand + contact constants
    content.ts           ← packages, experiences, destinations, reviews, blog, gallery
    languages.ts         ← language list for the switcher
    icons.ts             ← inline SVG icon set
public/assets/           ← logos + optimised photos (served at /assets/...)
```

## Editing content

All copy lives in `src/data/content.ts` (and `src/data/site.ts` for brand/contact).
Change it there and every page updates — no per-page editing.

## Notes / parity with the static site

- **Images** use plain `<img>` for pixel-identical rendering. To adopt `next/image`
  optimisation later, swap the tags in `components/cards.tsx` and the page heroes.
- **Translation** (language switcher) needs the app to be served (dev/start or hosting);
  it relies on Google's script + a cookie, so it won't translate from a `file://` page.
- Same launch-checklist items as the static site apply: placeholder prices, the
  `info@ciaoceylontours.com` email, footer social links (`#`), and testimonials adapted
  to the new brand name.

## Deploy

Works on any Node host. For Vercel: import the repo, set the project root to `nextJS`,
and deploy — no extra config needed.
