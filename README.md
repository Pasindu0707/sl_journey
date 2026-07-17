# SL Journey — Website

The marketing website for **SL Journey**, a Sri Lankan tour operator.
*Explore the Soul of Sri Lanka.*

Live at **https://sljourney.com**.

## Stack

- **Next.js 14** (App Router) + **TypeScript**, in `nextJS/`.
- **Static export** (`output: "export"`) — the build emits plain HTML/CSS/JS into
  `nextJS/out/`. There is no server, no database and no runtime backend.
- Plain CSS design system in `src/app/globals.css`. No Tailwind, no UI library.
- Fonts are self-hosted at build time by `next/font`, so pages make no request to
  Google for fonts.

## Run it

```bash
cd nextJS
npm install      # first time only
npm run dev      # development  -> http://localhost:3000
npm run build    # static export -> nextJS/out/
npm run lint
```

There is no `npm start`. A static export has no server to start — serve `out/`
with any static file server if you want to check the built output.

## Folder map

```
sl_journeys/
├── .github/workflows/deploy.yml    push to main -> build -> GitHub Pages
├── .gitattributes                  pins CNAME to LF
├── README.md                       this file
└── nextJS/
    ├── next.config.mjs             static export, basePath, trailingSlash
    ├── scripts/
    │   └── gen-image-dims.mjs      regenerates src/data/image-dims.ts
    ├── public/
    │   ├── CNAME                   sljourney.com — do not delete
    │   ├── .nojekyll
    │   └── assets/
    │       ├── img/lib/*.jpg       photo library
    │       └── logo/*.png          logo variants
    └── src/
        ├── app/
        │   ├── layout.tsx          root metadata, canonical, TravelAgency JSON-LD
        │   ├── page.tsx            homepage
        │   ├── globals.css         the whole design system
        │   ├── sitemap.ts          generated from site.ts + content.ts
        │   ├── robots.ts
        │   ├── not-found.tsx       404
        │   ├── about/ contact/ gallery/
        │   ├── privacy/ terms/
        │   ├── blog/               index + [slug]
        │   └── packages/[slug]/
        ├── components/             JSX only
        │   ├── Header.tsx  Footer.tsx  EnquiryForm.tsx
        │   ├── Gallery.tsx  LanguageSwitcher.tsx  SiteEffects.tsx
        │   ├── Ic.tsx  cards.tsx  JsonLd.tsx
        ├── data/
        │   ├── site.ts             brand constants — single source of truth
        │   ├── content.ts          PACKAGES, BLOG, GALLERY, REVIEWS, img()
        │   ├── image-dims.ts       GENERATED — do not hand-edit
        │   └── icons.ts  languages.ts
        └── lib/                    pure functions, no JSX
            └── schema.ts           JSON-LD builders
```

`lib/` is for pure functions. `components/` is for JSX. Don't mix.

## Editing content

Almost everything lives in two files:

- **`src/data/site.ts`** — brand name, phone, WhatsApp, email, address, site URL,
  social links. If you find a phone number or email hardcoded anywhere else,
  move it here. This is the pattern that makes a rebrand a one-line change.
- **`src/data/content.ts`** — tour packages, blog posts, gallery captions,
  reviews, homepage sections.

Prices are structured, not strings: set `priceUSD` (a number) and `priceUnit`
(`"pp"` or `"couple"`). The displayed label (`From $640 pp`) and the `Offer`
price in the structured data are both derived from those, so they cannot drift
apart. Blog `date` is ISO (`YYYY-MM-DD`) and drives both the visible date and
`datePublished`.

### Adding a photo

Drop the `.jpg` into `public/assets/img/lib/`, then:

```bash
cd nextJS && node scripts/gen-image-dims.mjs
```

That regenerates `src/data/image-dims.ts`. The gallery is a CSS-columns masonry,
so images need their intrinsic dimensions or the grid reflows as each one loads.

## Environment variables

Both are optional. Copy `.env.example` to `.env.local` for local development.

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | **Optional override.** A working [web3forms.com](https://web3forms.com) key is already committed as the default in `src/data/site.ts` — it is public by design (it ships in the client bundle regardless), so committing it exposes nothing new. Set this only to point a different environment at a different key. Where enquiries land is decided in the Web3Forms dashboard: register/set the key's recipient to `hello@sljourney.com`. |
| `NEXT_PUBLIC_BASE_PATH` | Leave unset for the custom domain. Only set it if deploying back to a project subpath, e.g. `NEXT_PUBLIC_BASE_PATH=/sl_journeys` for `<user>.github.io/sl_journeys`. |

`NEXT_PUBLIC_*` values are inlined into the client bundle and are **public by
design** — do not put anything genuinely secret in one. The Web3Forms key is
meant to be exposed; it only permits delivery to the address it was registered
to.

To set the key for the live site: **repo Settings → Secrets and variables →
Actions → Variables → New repository variable**, named
`NEXT_PUBLIC_WEB3FORMS_KEY`. Then add it to the build step in
`.github/workflows/deploy.yml`:

```yaml
      - name: Build static export
        run: npm run build
        env:
          NEXT_PUBLIC_WEB3FORMS_KEY: ${{ vars.NEXT_PUBLIC_WEB3FORMS_KEY }}
```

A repository *variable* is the honest choice here rather than a *secret*, since
the value ends up readable in the shipped JavaScript either way.

## How the deploy works

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) → `npm ci` and
`npm run build` inside `nextJS/` → uploads `nextJS/out` → GitHub Pages.

Nothing outside `nextJS/` is deployed.

### Custom domain

Three things have to agree:

1. **`nextJS/public/CNAME`** contains exactly `sljourney.com`. Everything in
   `public/` is copied into `out/`, so this survives every rebuild. Deleting it
   will drop the custom domain the next time Pages deploys, because
   `upload-pages-artifact` replaces the whole site.
2. **Repo Settings → Pages → Custom domain** is set to `sljourney.com`.
3. **Repo Settings → Pages → Enforce HTTPS** is ticked.

The CNAME file is pinned to LF in `.gitattributes` — GitHub Pages reads it
byte-for-byte and a CRLF can invalidate the domain.

## Hosting note: this repo is public

GitHub Pages only serves from a **private** repo on a paid plan (Pro/Team/
Enterprise). On the free plan the repo must be public, which is the current
setup and is fine: this is a marketing site whose content is public anyway, and
it contains no secrets.

If you want the source private at no cost, **Cloudflare Pages** builds from a
private GitHub repo on its free tier. It is the same static output, so no code
changes are needed:

- Build command `npm run build`, output directory `out`, root directory `nextJS`.
- Move the `sljourney.com` DNS to Cloudflare and point the domain at the Pages
  project.
- Set `NEXT_PUBLIC_WEB3FORMS_KEY` in the project's environment variables.
- The `CNAME` file is GitHub-specific and simply ignored there — harmless.

That also buys response headers (HSTS, CSP, Referrer-Policy), which GitHub Pages
cannot set at all. Netlify's free tier works the same way. Vercel's free tier is
non-commercial only, so it is not appropriate for a tour business.

## A note on the language switcher

The globe menu is a **Google Translate widget**, not multilingual SEO. It
translates client-side, which ranks for nothing on `google.it` / `google.fr` /
`google.de`. Real internationalisation means translated routes plus `hreflang`
tags, and is a separate project.

## Security posture

Static site, no server, no database, no auth, no stored user input — the attack
surface is close to zero, and there is deliberately no CSP meta tag, rate
limiting or input-sanitisation library here, because none of them would be doing
anything.

GitHub Pages cannot set HTTP response headers. That is a platform limitation,
not a code problem; see the Cloudflare note above if it matters to you.

`npm audit` reports vulnerabilities in `next`, `postcss` and the eslint
toolchain. None are reachable in a static export: the `next` advisories concern
the server runtime (middleware, image optimizer, cache), and this build has
`output: "export"` with `images.unoptimized`, so no such server exists. The rest
are dev-only. They are build-time and lint-time noise, not shipped code.
