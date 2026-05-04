# Portfolio — Roadmap & Improvements

A living list of completed, in-progress, and suggested improvements.
Items are grouped by impact, not chronological order.

---

## ✅ Done

### Foundations
- Migrated from Vite to Next.js 15 (App Router)
- MongoDB + Mongoose schemas (Project, Experience, BentoItem, NavItem, SocialLink, ApproachPhase, Section, Setting, User, Achievement, ErrorLog)
- Public site reads from DB; falls back to safe defaults if DB is unreachable
- Cloudinary signed image uploads (folders centralized in `src/lib/folders.js`)
- NextAuth (Auth.js v5) credentials login with bcrypt hashing
- Edge-safe middleware that protects `/admin/*` routes
- Session-aware admin layout with sidebar navigation

### Admin dashboard
- Sections page (drag-reorder, visibility toggle)
- Projects, Experience, Bento, Achievements, Nav, Social, Approach pages — full CRUD with drag-reorder
- Settings → Hero / Footer / Account (change password + display name)
- Reusable `EntityListPage`, `EntityFormDialog`, `Field`, `SortableList`, `Modal`, `Skeleton`
- Reusable `PasswordInput` with visibility toggle (login + account)
- Dashboard home with real stats (counts, latest project / experience edits, quick actions)

### Public site
- Hero with admin-controlled tagline / headline / subheadline / CTA
- "Download CV" button (admin-configurable URL via Hero settings)
- Pure-CSS animated globe in bento card 2 (replaced fragile three.js)
- Pure-CSS dot-grid hover effect for Approach phases (replaced WebGL)
- Education & Recognition section (driven by the Achievement model)
- Project case-study pages at `/projects/[slug]` with markdown body, gallery, tech-stack pills, repo + live links
- 404 fallback for unknown project slugs

### Production readiness
- Env-var validation with zod (warns at startup, never blocks)
- In-memory rate limiter on login (5 attempts / email / 15 min)
- Custom error logging — `ErrorLog` collection with TTL index (30-day auto-prune); console + persisted
- Every API handler wrapped in `withErrorLogging`
- Cloudinary → React `next/image` remote pattern configured

---

## 🚧 In progress (this batch)

| # | Item | Notes |
|---|---|---|
| 19 | Contact form via Resend | New `/api/contact` route + footer modal. Needs `RESEND_API_KEY` in `.env.local` to actually send. |
| 20 | Drag-drop image upload | Extend `ImageField` with `onDrop`. |
| 21 | Markdown editor for case studies | Tabs: Write / Preview. Reuses `react-markdown`. No new dependency. |
| 22 | Cloudinary image library | `/api/cloudinary/list` + picker dialog from `ImageField`. |
| 23 | Project tags + filtering | New `tags` field on Project; filter pills on the public projects grid. |
| 24 | `<img>` → `next/image` | Swap across Hero, RecentProjects, Experience, Footer, BentoGridItem, detail page. Big perf win. |

---

## 📋 Suggested next (priority order)

### Highest impact

**1. Deploy to Vercel + custom domain** (15 min)
- `vercel deploy` → connect GitHub repo
- Add env vars in Vercel dashboard (mirror `.env.local`)
- Point custom domain via DNS A/CNAME

**2. Tests — at least the critical paths** (medium)
- Smoke test: `npm run seed` runs cleanly on a fresh DB
- API test: login flow returns a valid session
- Component test: `EntityListPage` renders, opens form, submits
- Tooling: Vitest + Testing Library (already aligned with Vite-style ESM)

**3. TypeScript conversion** (medium-large, separate session)
- Convert `.jsx` → `.tsx`, `.js` → `.ts` incrementally
- Start with `src/lib/*` and `src/models/*` (highest typing payoff)
- Add zod-inferred types for entities (`z.infer<typeof projectSchema>`)
- Strict mode + no implicit any

### Production hardening

- **IP-based rate limit** on `/api/upload-signature` (currently authenticated but unrate-limited; an attacker with stolen creds could spam Cloudinary signatures)
- **Per-IP login limit** in addition to per-email (requires reading the request headers in the NextAuth `authorize` callback)
- **CSRF protection** review (NextAuth handles defaults, but explicit headers on mutations would be safer)
- **Sentry / OpenTelemetry alternative**: emit errors to a webhook-based handler (Discord / Slack) so you see prod errors in real time without a dashboard
- **Backup**: schedule a `mongodump` cron in CI / a small Vercel cron job

### UX polish

- **Light theme toggle** — currently dark-only. Real cost: every component uses hard-coded `bg-zinc-950 text-white`-style classes; needs a theme refactor (CSS vars for surfaces + text). Medium-large.
- **Project tags filtering on the public site** — handled in this batch.
- **Loading skeletons on the public site** — currently dynamic-rendered; could shift to ISR with on-demand revalidation for speed.
- **Smooth scroll snap between sections** — small CSS-only addition.
- **Keyboard shortcuts in admin** (e.g. `n` to add new) — small.
- **Bulk actions** on entity lists (select N, delete / hide) — medium.
- **Undo last delete** within session — medium; would need a soft-delete + recover queue.
- **Search / filter** in dashboard once you have many projects — small (add a single text filter on `EntityListPage`).
- **Auto-save drafts** in admin forms — medium; currently you have to click Save.
- **Markdown table support** — extend `react-markdown` with `remark-gfm`.
- **Code-syntax highlighting** in markdown — `rehype-highlight` or `shiki`.
- **OG image generation** for project detail pages — Next.js `opengraph-image.jsx` files.
- **Sitemap + robots.txt** — Next.js `app/sitemap.js`, `app/robots.js`. Crucial for SEO.
- **Structured data** (`application/ld+json`) for Person + CreativeWork on each project page.

### Content / portfolio polish

- **Open-source page** listing GitHub repos with stars/forks via API (cached daily via revalidate)
- **Blog / writing** — a `/blog/[slug]` route mirroring projects, with a `Post` model
- **Speaking / mentorship** — already have Achievements model; could split into more types
- **Testimonials** — there's an unused `Clients.jsx` component; could be revived with a `Testimonial` model
- **Case study templates** — pre-fill the markdown body with `## Problem / ## Solution / ## Tech / ## What I learned` headings on new project creation
- **Project status** field — `live`, `archived`, `in-progress`. Add a badge on the card.
- **Featured project** flag — pin one project at the top of the grid

### Admin power-user features

- **Activity log** — track who edited what when (lightweight: append a row to `ActivityLog` collection per mutation)
- **Multi-admin support** with role enum (`owner`, `editor`)
- **Versioning / history** per entity — store last N versions and let admin revert
- **Content scheduling** — set a `publishAt` field, hide until that time
- **Image library improvements** — track which Cloudinary images are referenced vs orphaned; "delete unused" button
- **Image cropper** before upload
- **Bulk image upload** for tech-stack icons (drop a folder, all upload)
- **Theme customizer** — admin-controllable accent color (currently `purple-400` hard-coded)

### DX / code health

- **Path aliasing tightening** — currently `@/` works, could add `@models/` `@lib/` `@components/` for clarity
- **Pre-commit hooks** — Husky + lint-staged + Prettier
- **GitHub Actions** — CI that runs `npm run build` on every PR
- **Component documentation** — small Storybook-lite using a single `/playground` route
- **Conventional commits + changelog** if multiple people will contribute

### Performance

- **Bundle analysis** — `@next/bundle-analyzer` to spot heavy chunks
- **Replace `framer-motion` selectively** — it's 50KB+, used only for a handful of animations. Some can become CSS.
- **`react-icons` is heavy** — switch to `lucide-react` (tree-shakable, smaller). Already using `lu*` icons; the import path is similar.
- **ISR** for the public homepage — `export const revalidate = 60` instead of `force-dynamic`. Trades freshness for speed; revalidate on admin save.
- **Image preloading** for above-the-fold project covers
- **Font optimization** — currently no custom fonts loaded; if you add one, use `next/font`

---

## ❌ Explicitly skipped (and why)

- **Sentry** — replaced with custom MongoDB-based error logging (your call)
- **Light theme toggle** — design surgery across every component; not worth it for a single-author portfolio
- **Lottie / heavy animation libraries beyond what's already there** — not justifying the bundle weight

---

## How to use this file

When you (or a future contributor) want to know:
- *What's done?* → read "Done"
- *What's currently being worked on?* → "In progress"
- *What should I tackle next?* → "Suggested next" (in priority order)

Keep this file updated when you finish or pick up an item. It's the source of truth for the project's evolution.
