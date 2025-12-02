# App Directory Overview

The Next.js app uses route groups to keep responsibilities separate:

```
app/
├── (site)/          # Marketing pages (landing, layout, hero sections)
├── (docs)/          # Localized documentation routes
├── (shared)/        # Components/providers reused by both groups
└── [locale]/…       # Locale-aware routes that stitch everything together
```

- **`(shared)/charts-ui`** – Sliders, color pickers, chart controls, etc. Anything referenced from the docs or marketing pages belongs here.
- **`(shared)/providers`** – Theme + chart-color contexts. Wrap new pages/providers here instead of inlining them.
- **`(site)/components`** – Pure marketing/landing UI (hero, navbar, sidebar). These components should remain presentation-only so they can move independently of docs.

When adding a new component:
1. Ask whether it’s shared between docs + marketing. If yes, put it under `(shared)`.
2. Keep imports consistent (`@/app/(shared)/…`) – ESLint will block the old `@/app/_components` path.
3. Docs content should import charts exclusively from `@canopy/charts`.


