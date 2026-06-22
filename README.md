# FORGE Personal Training — Norwich

A complete, fast, SEO-optimised **portfolio website for a personal/gym trainer**, built
from scratch as a self-contained static site (HTML + CSS + vanilla JS). It includes a blog,
about, services, pricing, location/contact pages and a **no-API chat assistant** that
understands the whole site.

> **Brand & content are an imagined demo.** "FORGE Personal Training", trainer "Jordan Hale",
> the address, phone, prices and reviews are all placeholders — swap them for real details
> before going live (see [Customise](#customise) below).

---

## ✨ Features

- **6 core pages** — Home, About, Services, Pricing, Blog, Contact — plus **4 full blog articles**.
- **No-API chatbot ("Spotter")** — a floating assistant on every page that answers questions
  about services, prices, hours, location, booking and more. 100% client-side: **no API keys,
  no backend, no network calls.** See [`js/chatbot.js`](js/chatbot.js).
- **Local SEO for Norwich** — unique titles/meta per page, `LocalBusiness`, `Service`,
  `Product`, `FAQPage`, `BlogPosting` and `Person` JSON-LD, Open Graph/Twitter cards,
  canonical URLs, `sitemap.xml`, `robots.txt`, geo meta and a consistent NAP footer.
- **Bold, responsive, accessible design** — dark "energetic" theme, mobile-first, semantic
  HTML, ARIA on the nav and chatbot, keyboard-friendly, `prefers-reduced-motion` respected.
- **Zero dependencies / no build step** — no frameworks, no npm. Uses the system font stack.
  Images load from Unsplash with **branded local SVG fallbacks**, so nothing ever renders
  broken (even offline).

## 🗂 Project structure

```
.
├── index.html                  # Home
├── about.html                  # About Jordan
├── services.html               # Services
├── pricing.html                # Prices + FAQ
├── blog.html                   # Blog listing
├── contact.html                # Location, hours, map, contact form
├── 404.html
├── blog/
│   ├── best-gyms-norwich.html
│   ├── fat-loss-busy-professionals.html
│   ├── beginners-strength-plan.html
│   └── eat-before-after-training.html
├── css/styles.css              # Whole design system (CSS custom properties)
├── js/
│   ├── main.js                 # Nav, scroll reveal, demo form
│   └── chatbot.js              # No-API assistant + knowledge base
├── assets/                     # logo, favicon, OG image, SVG photo fallbacks
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## ▶️ Run locally

It's a static site, so any static server works:

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser (the contact-page map and Unsplash photos need a
connection; everything else works offline thanks to the SVG fallbacks).

## 🚀 Deploy (free)

- **GitHub Pages** — push to GitHub, then *Settings → Pages → Deploy from branch* (root).
  A `.nojekyll` file is included so all assets are served as-is.
- **Netlify / Vercel** — drag-and-drop the folder, or connect the repo. No build command,
  publish directory = project root.

After deploying, update the domain in `sitemap.xml`, `robots.txt`, the `<link rel="canonical">`
tags and the JSON-LD `url` fields (currently `https://www.forgept-norwich.co.uk/`).

## 🛠 Customise

| What | Where |
|------|-------|
| **Business name, address, phone, email** | Footer + JSON-LD in each `*.html`; phone also in `js/main.js` and `js/chatbot.js` |
| **Prices** | `pricing.html` (cards + JSON-LD) and the `prices` intent in `js/chatbot.js` |
| **Photos** | Replace the Unsplash `src` URLs with your own images (drop them in `assets/`). The `onerror` fallback SVGs can stay as a safety net. |
| **Brand colours** | CSS custom properties at the top of `css/styles.css` (`--accent`, `--bg`, …) |
| **Chatbot answers** | The `KB` array in `js/chatbot.js` — each intent has `keywords`, an `answer` and quick-reply `chips` |
| **Map** | The Google Maps `<iframe>` in `contact.html` |

### Make the contact form live

The form in `contact.html` is a front-end demo (`js/main.js` shows a confirmation). To
receive submissions without a backend, point it at a form service, e.g. **Formspree**:

```html
<form action="https://formspree.io/f/your-id" method="POST">
```

(or use **Netlify Forms** by adding `netlify` to the `<form>` tag). Then remove the
`data-demo` attribute so the JS no longer intercepts the submit.

## 🤖 How the no-API chatbot works

`js/chatbot.js` injects a chat widget into every page and ships a local `knowledgeBase` (`KB`)
of intents. When you type, it normalises the text and scores it against each intent's
keywords, returning the best match (with a friendly fallback that points to the contact
details). Quick-reply chips let visitors explore without typing. Because everything runs in
the browser, there are **no API calls, no keys and no running costs** — and it works offline.

To extend it, add a new object to the `KB` array with `keywords`, an `answer` (HTML allowed)
and optional `chips`.

## 🔁 Optional: mirror to Wix

This repo is the source of truth. If you later want a Wix version for visual editing, the
content (copy, services, prices, blog posts) is all here to copy across — recreate the pages
in the Wix editor and embed the chatbot via an HTML/embed element using `js/chatbot.js`.

---

© FORGE Personal Training (demo). Built as a portfolio site optimised for the Norwich, UK area.
