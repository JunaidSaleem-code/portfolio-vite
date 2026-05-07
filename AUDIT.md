# Project Audit / Context

Living context document for this codebase. Read this first if you (or an AI assistant) are picking up the project cold. Companion to `ROADMAP.md` (what's done / pending) and `CV_PORTFOLIO_CONTENT.md` (CV-derived copy).

---

## 1. What this is

A **personal portfolio for Junaid Saleem** built on Next.js 15 with a custom CMS-style admin dashboard. The portfolio is fully data-driven from MongoDB — no part of the public site is hardcoded copy (with hardcoded *fallbacks* if the DB is unreachable, so the page never hard-crashes).

**Capabilities:**
- Public marketing site under the **Studio editorial theme** (cream / lime / ink, Plus Jakarta Sans + Fraunces): Hero, Selected Work, Experience, Approach (Process), Credentials, Footer
- Scroll-driven lime "ScrollStroke" signature threading through every section
- Project case-study pages at `/projects/[slug]` with Markdown bodies and galleries
- Admin dashboard at `/admin` (login-protected) for CRUD + reordering of every collection
- Cloudinary-hosted images with signed uploads, drag-drop, and a library picker
- Resend-powered contact form
- Newsletter subscriber capture with CSV export
- Anonymous visit analytics (no PII, no cookies)
- Custom error logging to MongoDB (no Sentry)
- Realistic WebGL globe (`cobe`) on the bento "time zone" card

**Recent shifts** (in roughly that order):
1. **TypeScript migration** of `src/lib/*` and root config files (`auth.config.ts`, `middleware.ts`); models + components still `.js` / `.jsx`. `tsconfig.json` replaces `jsconfig.json`.
2. **Public-site redesign** to the Studio theme — `src/components/studio/*`. Section order is now hardcoded in `page.jsx`; the legacy `Section`-collection-driven render path is dormant.
3. **DB content CV-aligned** via a new `scripts/reset.mjs` (`npm run reset`) — Experience, Approach, Bento card 3/4 now exactly match `CV_PORTFOLIO_CONTENT.md`. New `scripts/inspect.mjs` (`npm run inspect`) gives a read-only DB snapshot.
4. **Globe** moved from pure-CSS to `cobe` for a realistic rotating WebGL sphere with markers (Lahore highlighted, plus 9 other cities).

---

## 2. Tech stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 15 (App Router) | `force-dynamic` on data-driven pages |
| UI runtime | React | 18.3.1 | Pinned exact, not caret |
| Language | TypeScript + JavaScript | mixed | Migration in progress: `src/lib/*` and root config files are `.ts`; models + components still `.js` / `.jsx`. `tsconfig.json` (replaced `jsconfig.json`) with `allowJs: true` so the mix compiles. |
| Styling | Tailwind CSS | 3.4 | `darkMode: "class"`, typography plugin |
| Theming | next-themes + Studio theme | latest | Public site uses the **Studio editorial theme** (cream/lime); admin keeps the original dark/light next-themes setup |
| Fonts | Plus Jakarta Sans + Fraunces + JetBrains Mono | Google Fonts | Loaded via `@import` in `globals.css`. Jakarta = body/display, Fraunces italic = accent serif, JetBrains Mono = labels / eyebrows |
| DB | MongoDB Atlas + Mongoose | 9.x | TTL indexes for log/visit pruning |
| Auth | NextAuth (Auth.js) | 5.0 beta | Credentials provider + bcrypt |
| Validation | zod | 4.x | Both server (API routes) and client (forms) |
| Forms | react-hook-form | 7.x | Paired with zod |
| Server data fetching | Native server components | – | `connectDB()` + Mongoose `.lean()` |
| Client data fetching | TanStack Query | 5.x | Used in admin only |
| Drag/drop | @dnd-kit | 6.x | Sortable + utilities |
| Images | next/image + Cloudinary | – | Bento card images stay `<img>` (positioning) |
| Icons | react-icons | 5.x | `lu*` (Lucide) primarily |
| Markdown | react-markdown | latest | + `@tailwindcss/typography` for prose |
| Animation | framer-motion | 12.x | Used for ScrollStroke + section reveals |
| Globe | cobe | 2.0.1 | Realistic WebGL globe, ~3KB. Used by `GridGlobe.jsx` for the bento "time zone" card |
| Email | Resend | 4.x | Contact form |

**Packages explicitly *not* used:**
- `@react-three/fiber`, `three`, `react-globe.gl` — were causing `ReactCurrentOwner` Next.js incompatibility; replaced first with pure-CSS, now with `cobe` (pure WebGL, no fiber dependency)
- Sentry — replaced with custom MongoDB-based logger
- Redis — in-memory rate limiter is fine for single-instance

---

## 3. Directory layout

```
portfolio-vite/                 ← original folder name kept; stack is now Next.js
├── public/                     ← static assets + resume.pdf + favicon
├── scripts/
│   ├── seed.mjs                ← idempotent seed: collections + admin user
│   ├── inspect.mjs             ← read-only DB content listing (`npm run inspect`)
│   └── reset.mjs               ← one-shot CV-alignment cleanup (`npm run reset`)
├── src/
│   ├── app/                    ← Next.js App Router
│   │   ├── layout.jsx          ← Root, wraps in ThemeProvider + VisitTracker
│   │   ├── page.jsx            ← Public homepage; reads sections from DB
│   │   ├── globals.css         ← Tailwind + theme CSS variables
│   │   ├── projects/[slug]/    ← Public project case-study pages
│   │   ├── admin/
│   │   │   ├── layout.jsx      ← Wraps admin pages in <Providers>
│   │   │   ├── login/page.jsx  ← Login form (outside protected area)
│   │   │   └── (dashboard)/    ← Route group → all protected admin pages
│   │   │       ├── layout.jsx  ← Sidebar shell
│   │   │       ├── page.jsx    ← Dashboard overview (stats)
│   │   │       ├── analytics/      ← Visit metrics dashboard
│   │   │       ├── sections/       ← Drag-reorder homepage sections
│   │   │       ├── projects/       ← Project CRUD
│   │   │       ├── experience/     ← Experience CRUD
│   │   │       ├── achievements/   ← Education + Recognition CRUD
│   │   │       ├── bento/          ← Bento grid CRUD
│   │   │       ├── subscribers/    ← Subscriber list + CSV export
│   │   │       └── settings/
│   │   │           ├── layout.jsx  ← Sub-tabs
│   │   │           ├── hero/, footer/, nav/, social/, approach/, account/
│   │   └── api/                ← Next.js Route Handlers
│   │       ├── auth/[...nextauth]/  ← NextAuth handlers
│   │       ├── admin/profile/, admin/password/  ← Profile + password APIs
│   │       ├── achievements/, projects/, experience/, bento/, sections/,
│   │       │   nav/, social/, approach/      ← Each: route.js, [id]/route.js, reorder/route.js
│   │       ├── settings/[key]/  ← GET / PUT singleton settings (hero, footer)
│   │       ├── upload-signature/  ← POST → Cloudinary signature
│   │       ├── cloudinary/list/   ← GET → list assets in folder
│   │       ├── contact/           ← POST → send via Resend
│   │       ├── subscribe/         ← POST → upsert subscriber
│   │       ├── subscribers/       ← Admin list + DELETE + export CSV
│   │       └── track/             ← POST → record visit (public, rate-limited)
│   ├── components/
│   │   ├── studio/              ← Public-site editorial theme (active)
│   │   │   (StudioShell, StudioNav, StudioHero, StudioWork, StudioExperience,
│   │   │    StudioApproach, StudioCredentials, StudioFooter, ScrollStroke)
│   │   ├── (legacy public)      (Hero, Grid, RecentProjects, Experience,
│   │   │                         Achievements, Approach, Footer, ContactDialog,
│   │   │                         SubscribeForm, ThemeToggle, ThemeProvider,
│   │   │                         VisitTracker, Reveal, ScrollPathLayer)
│   │   │                         — still on disk; ContactDialog + SubscribeForm
│   │   │                         + VisitTracker are reused by Studio components.
│   │   ├── ui/                  ← Aceternity-style primitives kept from the original
│   │   │   (Spotlight, MagicButton, 3d-pin, bento-grid, moving-border,
│   │   │    floating-navbar, text-generate-effect, GridGlobe (cobe WebGL),
│   │   │    canvas-reveal-effect (CSS), background-gradient-animation,
│   │   │    infinite-moving-cards)
│   │   └── admin/               ← Reusable admin building blocks
│   │       ├── EntityListPage   ← The CRUD orchestrator (used by 8 pages)
│   │       ├── EntityFormDialog ← Modal create/edit
│   │       ├── SortableList     ← @dnd-kit wrapper
│   │       ├── ImageLibraryDialog
│   │       ├── Modal, PageHeader, Sidebar, Skeleton, SettingForm, Providers
│   │       └── forms/Field, ImageField, ListField, MarkdownEditor, PasswordInput
│   ├── lib/                     ← All `.ts` (TypeScript-migrated)
│   │   ├── auth.ts              ← Full NextAuth config (server-only — uses Mongoose)
│   │   ├── auth-helpers.ts      ← `withAuth` route wrapper
│   │   ├── api-handlers.ts      ← `listCreate`, `detail`, `reorder` factory
│   │   ├── api-client.ts        ← Browser fetch wrappers
│   │   ├── data.ts              ← Server data loaders (getHomePageData, getProjectBySlug, …)
│   │   ├── analytics.ts         ← Aggregation queries for the analytics page
│   │   ├── mongodb.ts           ← Cached Mongoose connection
│   │   ├── cloudinary.ts        ← `signUpload({ folder })`
│   │   ├── folders.ts           ← Centralized folder paths for Cloudinary
│   │   ├── schemas.ts           ← All zod schemas (entities + inputs) + inferred types
│   │   ├── visit-tracker.ts     ← Bot/device classification helpers
│   │   ├── rate-limit.ts        ← In-memory token bucket
│   │   ├── env.ts               ← Startup validator (warns, never throws)
│   │   ├── logger.ts            ← `logError` writes to ErrorLog collection
│   │   ├── utils.ts             ← `cn`, `slugify`
│   ├── models/                  ← Mongoose schemas (one file per collection, still `.js`)
│   │   └── _helpers.js          ← Shared `orderingFields`, `baseOptions`
│   ├── auth.config.ts           ← Edge-safe Auth.js config (used by middleware)
│   ├── middleware.ts            ← Protects /admin/* via Auth.js
│   └── data/                    ← Static fixtures (confetti.json, legacy index.ts)
├── ROADMAP.md                   ← Done / suggested-next list
├── CV_PORTFOLIO_CONTENT.md      ← Copy-paste content derived from your CV
├── AUDIT.md                     ← (this file)
├── next.config.mjs, tailwind.config.mjs, postcss.config.mjs, tsconfig.json
├── package.json                 ← `"type": "module"`, scripts: dev / build / start / seed / inspect / reset / test
└── .env.local                   ← Local credentials (gitignored)
```

Path aliasing: `@/*` → `src/*` (configured in `tsconfig.json`).

---

## 4. Data model

10 Mongoose models. Files: `src/models/<Name>.js`.

| Model | Purpose | Key fields | Special |
|---|---|---|---|
| `Project` | Portfolio projects | title, slug (unique), description, image, gallery[], techIcons[], techStack[], tags[], link, repoLink, body (Markdown), order, visible | Slug used in `/projects/[slug]` |
| `Experience` | Work history | title, description, thumbnail, order, visible | – |
| `BentoItem` | About-section cards | title, description, image, spareImage, className, imgClassName, spareImageClassName, titleClassName, **cardType** (`default` / `globe` / `techStack` / `emailCta`), techStackLeft[], techStackRight[], emailAddress, order, visible | `cardType` drives special-render branches in `BentoGridItem` |
| `Achievement` | Education + recognition | type (`education` / `recognition`), title, organization, period, description, icon, order, visible | – |
| `ApproachPhase` | "My Approach" cards | phaseLabel, title, description, backgroundClass, animationSpeed, colors[][], dotSize, overlay, order, visible | colors is RGB triples; overlay = bool for radial fade on light bgs |
| `NavItem` | Floating navbar | name, link, order, visible | – |
| `SocialLink` | Footer icons | label, icon, link, order, visible | – |
| `Section` | Homepage layout control | key (enum), label, order, visible | Fixed set of 7 keys; admin can reorder/hide but not add/delete |
| `Setting` | Singleton key/value | key (unique), data (Mixed) | Used for `hero` and `footer` configs |
| `User` | Admin login | email (unique), passwordHash, name | Single-admin; rotation via re-seed |
| `ErrorLog` | API error capture | message, stack, path, method, userId, meta | TTL: 30 days |
| `Visit` | Anonymous page views | path, referrer, country, device, sessionId | TTL: 90 days |
| `Subscriber` | Newsletter opt-ins | email (unique), name, source, unsubscribed | – |

**Shared via `_helpers.js`:**
- `orderingFields`: `{ order: Number, visible: Boolean }`
- `baseOptions`: `{ timestamps: true }`

---

## 5. API surface

All routes under `/src/app/api/`. Authentication via `withAuth` wrapper in `src/lib/auth-helpers.js` (returns 401 if no session).

### CRUD entities (factory-generated)

For each entity in **{ projects, experience, bento, achievements, nav, social, approach, sections }**:
- `GET    /api/{entity}` — list
- `POST   /api/{entity}` — create (sections excluded — no POST)
- `PATCH  /api/{entity}/[id]` — update
- `DELETE /api/{entity}/[id]` — delete (sections excluded)
- `PATCH  /api/{entity}/reorder` — bulk reorder by `ids[]`

All driven by `listCreate(Model, schema)`, `detail(Model, schema)`, `reorder(Model)` in `src/lib/api-handlers.js`. Per-entity route file is **3 lines**.

### Singleton settings

- `GET /api/settings/[key]` — read setting (hero, footer)
- `PUT /api/settings/[key]` — write setting (zod-validated per key)

### Admin

- `GET  /api/admin/profile`, `PATCH /api/admin/profile` — name update
- `POST /api/admin/password` — password change (current pw verification, signs out)

### Public

- `POST /api/contact` — Resend mail (rate-limited 5/IP/10min)
- `POST /api/subscribe` — newsletter opt-in (rate-limited 5/IP/hour)
- `GET  /api/subscribers`, `DELETE /api/subscribers/[id]`, `GET /api/subscribers/export` — admin-only
- `POST /api/track` — visit log (bot-filtered, rate-limited 60/IP/hour)

### Cloudinary

- `POST /api/upload-signature` — signed upload for direct browser → Cloudinary (admin-only)
- `GET  /api/cloudinary/list?folder=...` — list assets for the library picker

### Auth

- `* /api/auth/[...nextauth]` — NextAuth handlers (sign in / out, session)

---

## 6. Patterns / conventions

### DRY-by-factory
The core insight is that **most CRUD pages are identical except for fields and labels**. So:
- One `EntityListPage` component drives 8 admin pages
- One `Field` component renders 7 input types from a `{ name, label, type, … }` descriptor
- One `listCreate` / `detail` / `reorder` factory generates 24 API routes
- Per-entity files end up being a list of field descriptors + a `<EntityListPage resource={...} fields={...} />` invocation

Adding a new entity is roughly: model + zod schema + 3 route files (3 lines each) + 1 admin page (~30 lines).

### Server / Client split
- **Public site** is server-rendered (`force-dynamic`). `getHomePageData()` runs on the server, results passed to client components as props.
- **Admin** uses TanStack Query for client-side fetching with optimistic reorder.
- **Auth** is split: `auth.config.js` (Edge-safe, used by middleware) vs `lib/auth.js` (full, with Mongoose + bcrypt).

### Defensive defaults
- `getHomePageData()` is wrapped in a try/catch — if the DB is down, returns `EMPTY_HOME_DATA` and the page renders with hardcoded fallbacks (Hero / Footer / Approach defaults).
- `connectDB()` lazily checks `MONGODB_URI` so the env doesn't throw at import time.
- `env.js` *warns* about missing keys; doesn't throw.

### Theming
- `next-themes` toggles `class="dark"` on `<html>`.
- Components use `dark:` Tailwind variants. Light mode uses `zinc-50 / zinc-200 / zinc-900` palette; dark uses `black / zinc-950 / white`.
- Brand purple (`purple-400` / `purple-500`) stays in both themes.
- Dark is the design baseline; light is functional but plainer (Spotlights vanish on white, gradient-heavy components like Approach phases stay dark-flavored).

### Folder structure for Cloudinary
Centralized in `src/lib/folders.js`:
```js
const ROOT = "portfolio";
export const FOLDERS = {
  projects: `${ROOT}/projects`,
  tech: `${ROOT}/tech`,
  experience: `${ROOT}/experience`,
  bento: `${ROOT}/bento`,
  social: `${ROOT}/social`,
};
```
Change `ROOT` once → all upload destinations move.

### Rate limiting
In-memory `Map`-based bucket (`src/lib/rate-limit.js`). Survives only the process lifetime — adequate for single-instance Vercel/Railway. Used on:
- Login (5 / email / 15 min)
- Contact (5 / IP / 10 min)
- Subscribe (5 / IP / hour)
- Track (60 / IP / hour)
- Upload-signature: **not** rate-limited (known gap, called out in roadmap)

### Logging
`src/lib/logger.js` exports `logError(err, ctx)`. Writes to `ErrorLog` collection (TTL 30 days). All API factory handlers wrap in `withErrorLogging` so every uncaught error is captured. Logger has its own try/catch — logging failures cannot crash the request.

### Validation pipeline
Zod schemas in `src/lib/schemas.js`. Server uses `schema.safeParse()` in route factories. Client uses the same fields via `react-hook-form` defaults. For partial updates (`PATCH`), `schema.partial()`.

---

## 7. How the public site renders

`src/app/page.jsx` is a server component using the **Studio editorial theme**:

```js
const { projects, experiences, achievements, approachPhases,
        navItems, socialLinks, settings } = await getHomePageData();

return (
  <StudioShell>
    <StudioNav navItems={navItems} />
    <StudioHero content={settings?.hero} />
    <StudioWork items={projects} />
    <StudioExperience items={experiences} />
    <StudioApproach phases={approachPhases} />
    <StudioCredentials items={achievements} />
    <StudioFooter content={settings?.footer} socialLinks={socialLinks} />
  </StudioShell>
);
```

**Key change from the legacy layout**: section order is currently **hardcoded** in `page.jsx` rather than driven by the `Section` collection. The admin's drag-reorder UI for sections still works against `/api/sections`, but the public site no longer reads from it under the Studio theme. (Bento grid is also no longer surfaced in the Studio layout — bento items remain in the DB and editable, but aren't rendered.)

**StudioShell** is the wrapper:
- `min-h-screen` cream backdrop with warm/cool radial washes, dot grid, soft grain
- Renders `<ScrollStroke />` — three intertwined SVG strands with `pathLength` tied to `useScroll`, so they unspool from a hero-area tangle as the user scrolls
- Studio CSS variables (`--st-bg`, `--st-ink`, `--st-accent` lime, `--st-paper`, `--st-muted`, …) defined in `globals.css` and consumed by every Studio component
- Fonts: `Plus Jakarta Sans` (display/body), `Fraunces` italic (accent serif), `JetBrains Mono` (eyebrows / labels)

`StudioCredentials` and `StudioExperience` render an empty-state card if their collection is empty (instead of the original `return null`), so missing data shows up as a clear "add via /admin/…" prompt rather than a blank page.

---

## 8. Admin data flow

1. User navigates to `/admin/projects` (client component).
2. `<EntityListPage resource="projects" />` calls `apiList("projects")` via TanStack Query.
3. List renders inside `<SortableList>`. Edit / Delete / Toggle-visibility / Reorder all call mutations against `/api/projects/...`.
4. On success, `qc.invalidateQueries(["projects"])` refetches.
5. Reorder is **optimistic**: `onMutate` snapshots and reorders the cache; `onError` rolls back; `onSettled` invalidates.
6. Create / edit forms render in `<EntityFormDialog>`. Each field is a `<Field>` driven by a descriptor:

```js
{ name: "image", label: "Cover image", type: "image", folder: FOLDERS.projects, required: true }
```

Field types: `text`, `textarea`, `select`, `checkbox`, `image`, `imageList`, `stringList`, `markdown`. Adding a new type = one branch in `Field.jsx`.

---

## 9. Image upload flow

Direct-to-Cloudinary signed uploads — the server *never* proxies the file:

1. User picks a file (or drops it) in `<ImageField>`.
2. Browser POSTs `/api/upload-signature` with the target folder.
3. Server returns `{ signature, timestamp, apiKey, cloudName, folder }` — signed against `CLOUDINARY_API_SECRET`.
4. Browser POSTs the file directly to `https://api.cloudinary.com/v1_1/{cloud}/auto/upload` with the signature.
5. Cloudinary returns `secure_url`. The form stores that string in the entity's `image` field.

Library picker (`<ImageLibraryDialog>`): lists existing assets in a folder via `GET /api/cloudinary/list` — a search expression like `folder:portfolio/projects/* AND resource_type:image` returned by `cloudinary.search.execute()`.

---

## 10. Auth flow

NextAuth v5 / Auth.js, **Credentials provider, JWT strategy** (no DB session collection).

**Why split config?** Next.js middleware runs on the Edge runtime, but Mongoose uses Node APIs. Mongoose can't run in middleware. So:
- `auth.config.js` — providers: `[]`, no DB. Edge-safe. Used by `middleware.js` to redirect unauthenticated requests.
- `lib/auth.js` — full config with Credentials provider that hits MongoDB. Server-only. Used by API routes that need `auth()`.

`authorize()` flow:
1. Lowercase / trim email.
2. Hit per-email rate limit. Throw if exceeded (NextAuth surfaces the error message to the client).
3. `connectDB()` → `User.findOne({ email })`.
4. `bcrypt.compare(password, user.passwordHash)`.
5. On success: `resetRateLimit()` and return `{ id, email, name }`.

JWT callback default — token contains the returned user.

Middleware uses `authorized()` callback in `auth.config.js` to:
- Redirect unauthenticated → `/admin/login`
- Redirect authenticated away from `/admin/login` → `/admin`

---

## 11. Theme system

Two parallel theme systems coexist:

### Public site — Studio editorial theme (active)
- Single fixed editorial theme. **No dark/light toggle on the public site** — Studio is cream/lime/ink only.
- Defined as CSS variables in `globals.css`:
  - `--st-bg: #F4EFDE` (warm cream base), `--st-bg-2`, `--st-paper: #FAF6E8`
  - `--st-ink: #0F1B22` (near-black ink), `--st-ink-2`
  - `--st-muted`, `--st-muted-2`
  - `--st-accent: #C2F84F` (signature lime), `--st-accent-2`, `--st-accent-glow`
  - `--st-line` / `--st-line-2` (hairline borders)
- Utility classes provided in `globals.css`: `.st-shell`, `.st-display`, `.st-italic`, `.st-mono`, `.st-cta` / `.st-cta--ghost` / `.st-cta--dark`, `.st-up` / `.st-fade` reveal animations, `.st-link` underline-on-hover, `.st-paper`, `.st-grain`, `.st-marquee`.
- Signature element: lime `ScrollStroke` SVG that tangles in the hero region and unspools as you scroll, threading through every section.

### Admin — next-themes (still active)
- `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>` in root layout.
- Tailwind `darkMode: "class"`.
- `<ThemeToggle>` (in admin sidebar) toggles between `"dark"` and `"light"`. Persisted in `localStorage`.
- Admin components written with `bg-X dark:bg-Y` paired classes.

**Migration note**: when the Studio theme replaced the original Aceternity-flavored public site, light/dark variants on the public components became dead code. The legacy `Hero.jsx`, `Grid.jsx`, `Experience.jsx`, `Achievements.jsx`, `Approach.jsx`, `Footer.jsx`, and `RecentProjects.jsx` are still on disk but unused — kept for reference / fallback. Eventually delete or move to `legacy/`.

---

## 12. Visit analytics

Privacy-respecting:
- No IP, no fingerprint, no PII.
- Stores only: path, referrer hostname, country (from `x-vercel-ip-country` / `cf-ipcountry` headers if available), device class, opaque `sessionId` (random string in `sessionStorage`).
- Auto-prunes after 90 days via Mongo TTL index.
- Bot-filtered server-side via `isBot()` user-agent regex.

Client tracker (`<VisitTracker />`) is in the root layout. It:
- Skips paths starting with `/admin` or `/api`.
- Dedupes within a session via `sessionStorage` keys.
- Uses `navigator.sendBeacon` (non-blocking) with a `fetch` fallback.

Analytics dashboard (`/admin/analytics`) runs Mongo aggregations:
- Total visits, unique sessions
- Visits per day (filled timeline, even with zero-days)
- Top paths, referrers, devices, countries

Pure CSS bars; no chart library.

---

## 13. Email / contact form

`/api/contact` uses Resend SDK:
- Server-side rate limiting per IP.
- Zod-validated body.
- Sends a plain-text email to `CONTACT_TO_EMAIL` (falls back to `ADMIN_EMAIL`).
- `replyTo` set to the sender's email so you can reply directly.
- **Soft fails in dev** if `RESEND_API_KEY` is missing — logs the message to console and returns 200, so the form still works locally.

Client UI: `<ContactDialog>` modal opened from the footer's "Get in touch" button.

---

## 14. Operations

### Local dev
```bash
npm install
cp .env.example .env.local        # then fill in values
npm run seed                      # one-time DB populate + admin user create
npm run dev                       # http://localhost:3000
```

### Content / DB scripts
```bash
npm run inspect    # read-only: prints every doc in projects / experience /
                   # achievements / bento / approach + counts for nav, social,
                   # sections, hero, footer settings. Safe to run any time.

npm run reset     # one-shot CV-alignment cleanup (destructive — see scripts/reset.mjs):
                   # • deletes Project entries with empty `slug` (de-dupe)
                   # • wipes & reinserts Experience and ApproachPhase from CV
                   # • patches BentoItem cards 3 (tech stack) + 4 (description)
                   # • leaves Achievements / Nav / Social / Sections / Settings alone
```

`reset` is intentionally separate from `seed` — `seed` is idempotent / safe to re-run, `reset` is for the specific case of "I want my DB to match `CV_PORTFOLIO_CONTENT.md` exactly, throw away whatever's drifted." Don't wire it into deploy / CI.

### Required env vars
```
MONGODB_URI=
AUTH_SECRET=                                 # openssl rand -base64 32
ADMIN_EMAIL=                                 # picks the dashboard login
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=           # same as above, exposed to browser
RESEND_API_KEY=                              # optional in dev
CONTACT_TO_EMAIL=                            # optional, defaults to ADMIN_EMAIL
CONTACT_FROM_EMAIL=                          # must be a Resend-verified sender
```

### Production
```bash
npm run build       # Next.js build
npm run start       # serve compiled output
```

Vercel deploy is the path of least resistance — env vars get added in the dashboard, framework is auto-detected. **Note**: in-memory rate limit doesn't survive Vercel's per-request isolation perfectly; for serious production swap to Redis (Upstash works).

### Re-seeding behavior
`scripts/seed.mjs` is idempotent:
- Singletons (Section, Setting) are upserted by `key`.
- List collections (Project, etc.) are populated **only if empty**. So re-running won't clobber edits you've made via the dashboard.
- Admin user is upserted by email AND old admin users with different emails are deleted (single-admin enforcement).

---

## 15. Known quirks / gotchas

1. **Re-seed needed for hero copy update**: hero defaults in seed are upserted by `key="hero"`. If you've edited the hero in the admin, those edits will be **overwritten** by the next `npm run seed`. Either edit in admin OR via seed, not both.

2. **Bento grid `<img>` not migrated to `next/image`**: the bento card backgrounds use complex absolute-position classes (`imgClassName: "absolute right-0 bottom-0 md:w-96 w-60"`) that don't translate to `Image fill`. Migrating them is a redesign.

3. **Legacy public components are dead code under Studio**: the old Aceternity-flavored `Hero`, `Grid`, `RecentProjects`, `Experience`, `Achievements`, `Approach`, `Footer`, plus `Reveal.jsx` and `ScrollPathLayer.jsx` are still on disk but no longer rendered. `ContactDialog`, `SubscribeForm`, `VisitTracker` are reused by the Studio components — keep those. Eventually move the rest to a `legacy/` folder or delete.

4. **`@react-three/fiber` still off-limits**: previously used for the bento globe + canvas-reveal. The globe now uses **`cobe`** (pure WebGL, ~3KB, no fiber dependency) — see `src/components/ui/GridGlobe.jsx`. The canvas-reveal effect for `Approach` is still pure-CSS but isn't used in the Studio layout. Don't reintroduce fiber 8.x — it reaches into removed React internals (`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner`) and breaks under Next.js 15. Fiber 9 needs React 19; not done yet.

5. **Existing unused files**: `src/components/Clients.jsx` (testimonials/companies) and parts of `src/data/index.ts` (testimonials, companies arrays) are dead but not deleted — preserved in case the user wants to revive them.

   **Globe canvas init gotcha**: cobe needs a non-zero buffer size at init. `GridGlobe.jsx` uses a fixed render-buffer size (`RENDER_SIZE = 600`) and lets CSS scale the canvas (`width: RENDER_SIZE; max-width: 100%; aspect-ratio: 1`). Don't switch back to reading `offsetWidth` at mount — it can be 0 before layout, producing a white canvas with a broken-image-looking placeholder.

6. **package.json `"type": "module"`** is required for the seed script to use ES imports. This means **all** `.js` files in the project are ES modules. CommonJS files must be renamed `.cjs` (only `tailwind.config.mjs` and `postcss.config.mjs` matter — both already converted).

7. **Cloudinary credentials in chat history**: during initial setup, the user pasted real Cloudinary keys into chat. Recommendation: rotate `CLOUDINARY_API_SECRET` once via dashboard → API Keys → Regenerate.

8. **Admin email vs MongoDB user confusion**: `ADMIN_EMAIL` / `ADMIN_PASSWORD` are *the dashboard login*, not MongoDB credentials. The seed script enforces email-format on `ADMIN_EMAIL` because the login form has `<input type="email">`.

---

## 16. Notable design decisions

| Decision | Why |
|---|---|
| `force-dynamic` on home page | Admin updates show instantly; ISR + revalidate-on-save is the optimization for later |
| In-memory rate limit | Single-instance deployment; Redis is overkill for a portfolio |
| MongoDB for everything (logs, visits, content, users) | One backing store, no extra infra. TTL indexes handle pruning |
| Custom logger instead of Sentry | User preference. ErrorLog is queryable + auto-pruned |
| CSS globe / dot-grid replacing fiber | Stability over aesthetic exactness; saved 600KB+ bundle |
| Zod schemas shared between server and client | Single source of truth for validation; partial schemas for PATCH |
| Factory-pattern API handlers | DRY: 8 entities × 3 routes = 24 handler files, each 3 lines |
| Field descriptor → component | Same DRY approach for forms — adding a project field is 5 lines, not a redesign |
| Drag-and-drop with `@dnd-kit` | Modern, accessible, keyboard-navigable — better than `react-beautiful-dnd` |
| `next-themes` over custom theme state | Handles SSR mismatch + localStorage; saves rolling our own |
| Email + password auth (not OAuth) | Single-admin; no need for provider configuration; works offline in dev |

---

## 17. Where to start as a new contributor

1. Read `README.md` (if present) and this file.
2. Read `ROADMAP.md` for the current "next up" list.
3. Pick a `lib/*.js` file and trace it. The data flow is small — there are only ~10 modules in `lib/`.
4. To understand the admin surface: open `src/components/admin/EntityListPage.jsx` and follow the imports. That single component tells you 80% of the admin's behavior.
5. To understand the public site: `src/app/page.jsx` → `src/lib/data.js` → `src/components/<section>.jsx`.

---

## 18. Glossary of unusual props / fields

- **`cardType`** (BentoItem) — discriminated union: `"default" | "globe" | "techStack" | "emailCta"`. Drives a switch in `BentoGridItem` for which special inner component to render.
- **`backgroundClass`** (ApproachPhase) — Tailwind class string applied to the canvas-reveal hover background, e.g. `"bg-emerald-900"`.
- **`overlay`** (ApproachPhase) — adds a radial-gradient mask over the canvas-reveal, used for light backgrounds (phase 2 = lime-50).
- **`uniqueBy`** (seed.mjs internal) — when set, the seed script upserts by that field instead of skipping populated collections.
- **`spareImage`** / **`spareImageClassName`** (BentoItem) — secondary decoration image (e.g. card 4 has `/grid.svg` peeking from the corner).
- **`tags`** (Project) — used by the public projects grid to derive filter pills. Empty array = no tag pills shown.
- **`techStack`** (Project) — labels for the case-study page (text). Distinct from `techIcons` (image URLs for the card).
- **`tab=write|preview`** (MarkdownEditor) — local state, not persisted.
- **`x-pf-sid`** (sessionStorage) — internal name for the visit-tracker session ID.

---

Last reviewed: 2026-05-06 — Studio redesign, TypeScript migration of `lib/*`, cobe globe, CV-aligned DB content, new inspect/reset scripts. Update this file when a major system changes.
