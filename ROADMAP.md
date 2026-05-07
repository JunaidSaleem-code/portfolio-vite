# Portfolio — Roadmap & Improvements

A living list of completed, in-progress, and suggested improvements.
Items are grouped by impact, not chronological order.

---

## ✅ Done

### Foundations

- Migrated from Vite to Next.js 15 (App Router)
- MongoDB + Mongoose schemas (Project, Experience, BentoItem, NavItem, SocialLink, ApproachPhase, Section, Setting, User, Achievement, ErrorLog, Visit, Subscriber)
- Public site reads from DB; falls back to safe defaults if DB is unreachable
- Cloudinary signed image uploads (folders centralized in `src/lib/folders.js`)
- NextAuth (Auth.js v5) credentials login with bcrypt hashing
- Edge-safe middleware that protects `/admin/*` routes
- Session-aware admin layout with sidebar navigation
- **Light + dark theme toggle** (next-themes; toggle in floating nav + admin sidebar; defaults to dark)

### Admin dashboard

- Sections page (drag-reorder, visibility toggle)
- Projects, Experience, Bento, Achievements, Nav, Social, Approach pages — full CRUD with drag-reorder
- Settings → Hero / Footer / Account (change password + display name)
- **Analytics tab** — visits/day chart, top pages, top referrers, device + country splits
- **Subscribers tab** — table with search, delete, CSV export
- Reusable `EntityListPage`, `EntityFormDialog`, `Field`, `SortableList`, `Modal`, `Skeleton`, `MarkdownEditor`, `ImageLibraryDialog`
- Reusable `PasswordInput` with visibility toggle
- Dashboard home with real stats (counts, latest project / experience edits, quick actions)
- Drag-drop image upload (extends `ImageField`)
- Cloudinary image library picker reachable from any image field

### Public site

- Hero with admin-controlled tagline / headline / subheadline / CTA
- "Download CV" button (admin-configurable URL via Hero settings)
- Pure-CSS animated globe in bento card 2 (replaced fragile three.js)
- Pure-CSS dot-grid hover effect for Approach phases (replaced WebGL)
- Education & Recognition section (driven by the Achievement model)
- Project case-study pages at `/projects/[slug]` with markdown body, gallery, tech-stack pills, repo + live links
- Project tags + filter pills on the homepage
- Real contact form (Resend) with rate limit and graceful soft-fail in dev
- Newsletter / "Stay in touch" subscribe widget in the footer
- Anonymous visit tracking (no PII, no cookies)
- 404 fallback for unknown project slugs
- `<img>` → `next/image` swap on covers, gallery, social icons, experience thumbnails
- React markdown rendering with `prose` (typography plugin)

### Production readiness

- Env-var validation with zod (warns at startup, never blocks)
- In-memory rate limiter on login (5 attempts / email / 15 min) and on contact / subscribe endpoints
- Custom error logging — `ErrorLog` collection with TTL index (30-day auto-prune); console + persisted
- Every API handler wrapped in `withErrorLogging`
- Cloudinary → React `next/image` remote pattern configured
- TTL index on `Visit` collection (90-day auto-prune)

### SEO

- `app/sitemap.js` — homepage + every visible project
- `app/robots.js` — allow all, disallow `/admin` + `/api`, sitemap link
- Root metadata: `metadataBase`, OpenGraph, Twitter card, canonical, robots directives, keywords, title template
- `Person` JSON-LD on every page (root layout)
- `CreativeWork` JSON-LD on each project detail page
- Auto-generated OG images via `next/og`: `app/opengraph-image.jsx` (homepage) + `app/projects/[slug]/opengraph-image.jsx` (per project, with title/description/tech-stack pills)
- New env var `NEXT_PUBLIC_SITE_URL` (helper: `siteUrl()` from `@/lib/env`)

### Testing

- Vitest + Testing Library + jsdom configured (`vitest.config.js`, `vitest.setup.js`)
- Scripts: `npm test` (one-shot), `npm run test:watch`
- Pure-logic suites covering critical building blocks: `slugify` / `cn`, every zod entity schema (project, experience, contact, subscribe, password, section, bento, achievement, reorder), `rateLimit` (limit, decrement, reset, window expiry), visit-tracker helpers (device classification, bot detection, path/referrer cleaning, country header parsing) — 47 tests, ~1.6s

---

## 📋 Suggested next (priority order)

### Highest impact

**1. Deploy to Vercel + custom domain** *(~15 min, your action)*

- `vercel deploy` → connect GitHub repo
- Add env vars in Vercel dashboard (mirror `.env.local`)
- Point custom domain via DNS A/CNAME

**2. ~~SEO basics~~** — done. See "SEO" section under ✅ Done.

**3. Tests — at least the critical paths** *(partial)*

- ✅ Tooling installed (Vitest + Testing Library + jsdom)
- ✅ Pure-logic / utility tests (47 passing)
- ⏳ Still missing: integration test for `npm run seed`, NextAuth `authorize()` (needs Mongoose mocks), component tests for `EntityListPage`

**4. TypeScript conversion** *(medium-large, separate session)*

- Convert `.jsx` → `.tsx`, `.js` → `.ts` incrementally
- Start with `src/lib/*` and `src/models/*` (highest typing payoff)
- Add zod-inferred types for entities (`z.infer<typeof projectSchema>`)
- Strict mode + no implicit any

### Production hardening

- **IP-based rate limit on `/api/upload-signature`** (currently authenticated but uncapped)
- **Per-IP login limit** in addition to per-email
- **CSRF protection** review (NextAuth handles defaults, but explicit headers on mutations would be safer)
- **Backup**: schedule a `mongodump` cron in CI / a small Vercel cron job
- **Visitor consent banner** if you operate in EU — even with no PII, GDPR likes a heads-up
- **Visitor exclusion** — your own visits inflate analytics. Add a `?excludeMe=1` query param that sets a `localStorage` flag the tracker respects

### UX polish

- **Featured project flag** + **Project status badge** (`live` / `archived` / `wip`)
- **Activity log** of admin edits (lightweight `ActivityLog` collection)
- **Markdown extras** — tables (`remark-gfm`), code highlighting (`shiki`)
- **Bulk actions** in admin lists (multi-select → delete/hide)
- **Search filter on every entity list** (already on subscribers; trivial to extend)
- **Case study template** auto-fill on new project (`## Problem / ## Solution / …` pre-fill)
- **Auto-save drafts** in admin forms
- **Smooth scroll snap** between public sections
- **Keyboard shortcuts in admin** (e.g. `n` to add new)
- **Undo last delete** within session (soft-delete + recover queue)
- **OG image generation** for project detail pages (Next.js `opengraph-image.jsx`)

### Content / portfolio polish

- **Open-source page** listing GitHub repos with stars/forks via API (cached daily)
- **Blog / writing** — a `/blog/[slug]` route mirroring projects, with a `Post` model
- **Testimonials** — there's an unused `Clients.jsx` component; could be revived with a `Testimonial` model
- **Speaking / mentorship** could split out from `Achievement`

### Admin power-user features

- **Multi-admin support** with role enum (`owner`, `editor`)
- **Versioning / history** per entity — store last N versions and let admin revert
- **Content scheduling** — set a `publishAt` field, hide until that time
- **Image library improvements** — track which Cloudinary images are referenced vs orphaned; "delete unused" button
- **Image cropper** before upload
- **Bulk image upload** for tech-stack icons
- **Theme customizer** — admin-controllable accent color (currently `purple-400` hard-coded)

### Performance

- **Bundle analysis** — `@next/bundle-analyzer` to spot heavy chunks
- **Replace `framer-motion` selectively** — it's 50KB+, used for a handful of animations. Some can become CSS.
- **`react-icons` is heavy** — switch to `lucide-react` (tree-shakable, smaller)
- **ISR** for the public homepage — `export const revalidate = 60` instead of `force-dynamic`. Trades freshness for speed; revalidate on admin save.
- **Image preloading** for above-the-fold project covers
- **Font optimization** — currently no custom fonts loaded; if you add one, use `next/font`

### DX / code health

- **Path aliasing tightening** — `@models/`, `@lib/`, `@components/` for clarity
- **Pre-commit hooks** — Husky + lint-staged + Prettier
- **GitHub Actions CI** — runs `npm run build` on every PR
- **Conventional commits + changelog** if multiple people will contribute

---

## ❌ Explicitly skipped (and why)

- **Sentry** — replaced with custom MongoDB-based error logging (your call)
- **Lottie / heavy animation libraries beyond what's already there** — not justifying the bundle weight
- **Visitor email harvesting** — not legitimately possible from anonymous traffic; subscribers are the legitimate alternative

---

## How to use this file

When you (or a future contributor) want to know:

- *What's done?* → read "Done"
- *What should I tackle next?* → "Suggested next" (in priority order)

Keep this file updated when you finish or pick up an item. It's the source of truth for the project's evolution.
