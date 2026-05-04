# Portfolio content derived from your CV

Paste these values into the corresponding admin pages (`/admin/...`) once the
dashboard is up. This positions the portfolio around your **AI / RAG / full-stack** identity.

---

## 1. `Settings → Hero`

| Field | Value |
|---|---|
| Tagline | `AI · Full-Stack · LLM Integration` |
| Headline | `Building AI-powered products that ship` |
| Subheadline | `I'm Junaid — an AI-focused Full-Stack Engineer specializing in RAG pipelines, LLM integration, and production-grade web & mobile applications.` |
| Primary CTA text | `See my work` |
| Primary CTA link | `#projects` |
| Resume / CV URL | `/resume.pdf` (already in `public/`) |
| Resume button text | `Download CV` |

---

## 2. `Settings → Footer`

| Field | Value |
|---|---|
| Headline | `Have an AI or full-stack project in mind?` |
| Paragraph | `I help teams ship RAG systems, LLM-integrated apps, and end-to-end web platforms. Let's talk about what you're building.` |
| CTA text | `Get in touch` |
| Contact email | `chmjunaidsaleem@gmail.com` |
| Copyright | `© 2025 Choudhary Muhammad Junaid` |

---

## 3. `Experience` — replace existing entries with these three

### Entry 1 — Vanar
- **Title:** `Associate Software Engineer · Vanar`
- **Description:**
  ```
  Aug 2025 – Present · Onsite, Pakistan. Build and integrate Retrieval-Augmented
  Generation (RAG) systems including embedding pipelines and model workflows.
  Train and fine-tune AI models, ship LLM-based features and streaming responses
  into live production apps.
  ```
- **Thumbnail:** `/exp1.svg` (or upload a Vanar logo)

### Entry 2 — CognoRise InfoTech
- **Title:** `Full-Stack Developer · CognoRise InfoTech`
- **Description:**
  ```
  Jan 2024 – Jul 2025 · Remote contract. Built full-stack apps and RESTful APIs,
  implemented Multi-Factor Authentication and CRUD workflows, integrated AI
  features and automation logic. Agile delivery across feature planning and
  production.
  ```
- **Thumbnail:** `/exp2.svg`

### Entry 3 — Dynmsol
- **Title:** `Frontend Web Developer · Dynmsol`
- **Description:**
  ```
  Aug 2023 – Dec 2023 · Onsite, Pakistan. Developed responsive UI components for
  a Laravel-React e-commerce platform. Implemented product listing, navigation,
  and checkout flows; integrated frontend with backend APIs.
  ```
- **Thumbnail:** `/exp3.svg`

---

## 4. `Projects` — keep existing 2, add these 4 new ones

### AI Tool Hub
- **Slug:** `ai-tool-hub`
- **Description:**
  `A fully automated platform that discovers, evaluates, and compares AI tools without manual input. Cron-based pipelines fetch newly released tools and multiple LLM APIs auto-rate, generate insights, and produce comparisons.`
- **Tech stack labels:** `Next.js`, `Supabase`, `TypeScript`, `LLM APIs`, `Cron Jobs`
- **Tags:** `AI`, `Full-Stack`, `Automation`
- **Live URL:** *your deployed link*

### RAG-Based AI Application
- **Slug:** `rag-app`
- **Description:**
  `Retrieval-Augmented Generation system built with embeddings and vector search. Implements semantic search, streaming AI responses, and a retrieval pipeline tuned for answer accuracy and relevance.`
- **Tech stack labels:** `SvelteKit`, `OpenAI`, `Vector DB`, `TypeScript`
- **Tags:** `AI`, `RAG`
- **Live URL:** *your deployed link*

### Nail Health App
- **Slug:** `nail-health`
- **Description:**
  `AI-powered cross-platform app that detects nail diseases from images. Tracks user health history with progress timelines and uses deep linking for seamless navigation between sessions and care reminders.`
- **Tech stack labels:** `Capacitor`, `TypeScript`, `OpenAI API`, `Firebase`
- **Tags:** `AI`, `Mobile`, `Health`
- **Live URL:** *App Store / Play Store / website*

### Plant Doctor App
- **Slug:** `plant-doctor`
- **Description:**
  `AI-driven app that detects plant diseases and suggests treatments. Image-based progress tracking lets users monitor recovery; reminders and deep links keep care consistent.`
- **Tech stack labels:** `Capacitor`, `TypeScript`, `OpenAI API`, `Firebase`
- **Tags:** `AI`, `Mobile`
- **Live URL:** *your deployed link*

---

## 5. `Bento Grid` — small refresh

### Card 3 (tech stack) — update columns
- **Left column:** `Next.js`, `TypeScript`, `Python`
- **Right column:** `MongoDB`, `RAG / LLM`, `Capacitor`

### Card 4 (description)
- Title stays the same
- Update description to: `AI-focused Full-Stack Engineer. RAG, LLM integration, end-to-end product delivery.`

---

## 6. `Settings → Approach` — rewrite phases

### Phase 1
- **Title:** `Discovery & Architecture`
- **Description:** `Map the problem to the right pattern — RAG vs fine-tuning vs prompt engineering — and design retrieval pipelines, schemas, and integration points before any code lands.`

### Phase 2
- **Title:** `Build & Integrate`
- **Description:** `Ship the system end-to-end: embedding pipelines, vector search, LLM streaming, full-stack workflows, and the integrations that connect them. Tight feedback loops with the product team.`

### Phase 3
- **Title:** `Measure & Refine`
- **Description:** `Evaluate retrieval accuracy, monitor latency and cost, and iterate on prompts, indexes, and UX. Ship improvements that move real metrics.`

---

## 7. `Settings → Education & Recognition` (already seeded)

These are loaded into your DB by `npm run seed`. Visible on the homepage in the new
"Education & Recognition" section.

### Education
- BS Software Engineering — Lahore Garrison University — Graduated 2024

### Recognition
- Evaluator, G-TECH Hackathon 2025 — Lahore Garrison University, 2025
- Web Development Mentor — LGU SE-Tech Society, Spring 2025

---

## How to apply this

1. Open `http://localhost:3000/admin/login` and sign in.
2. Walk through `Settings → Hero`, `Footer`, `Experience`, `Projects`, `Bento Grid`,
   and `Settings → Approach` — pasting the values above.
3. Save each section. The public site updates immediately (no rebuild needed).

Or, if you'd prefer not to paste manually, run `npm run seed` — the seed script
already contains the CV-aligned hero/footer/experience/achievement data and will
upsert it into your DB.
