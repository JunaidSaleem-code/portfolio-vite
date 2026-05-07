# Multi-Business Remote Oversight Platform — Plan

> Custom unified system to monitor a **farm**, **petrol pump**, and **bus transport** operation remotely, with a focus on **cash control and anti-fraud** rather than just dashboards.

---

## 1. Context & Problem

You run **three businesses you can't physically watch** — a farm, a petrol pump, and a transport (bus) operation, 5–20 units total. Today everything is on **paper and WhatsApp**. Your real worry isn't reporting; it's **cash leakage and trust** when you're not on-site.

**The core insight driving this plan:** A dashboard is only as honest as the inputs feeding it. Most "business management apps" fail in this exact context because staff can fudge numbers. So the system must be designed first as an **anti-fraud data capture layer**, and second as a dashboard. Photos, append-only ledgers, sequential reading checks, and cross-validations matter more than charts.

This is a **separate project** from your existing portfolio (different domain, different users, different data sensitivity), but it should reuse your existing stack so you/your dev are immediately productive.

---

## 2. Recommended Approach — 3-Tier System

1. **Data capture layer** — WhatsApp bot (primary) + mobile PWA (fallback). Mandatory photo + timestamp + GPS on every cash/meter/odometer entry.
2. **Validation & ledger layer** — append-only entries, sequential reading checks (yesterday's closing = today's opening), daily cash reconciliation (expected vs deposited), two-person sign-off above thresholds, anomaly engine.
3. **Owner dashboard layer** — per-business and consolidated views, real-time alerts to your phone (WhatsApp + email), weekly auto-summary, "surprise audit" feature.

**Build incrementally.** Phase 1 = petrol pump only (highest fraud risk + most structured numbers = best ROI). Then buses, then farm, then cross-business roll-up.

---

## 3. Tech Stack

Matches the stack already in your portfolio project — reuse what you know.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 App Router** | Same as portfolio; SSR for fast dashboards |
| Auth | **NextAuth v5** (credentials) | Already in use; add role-based middleware |
| Database | **MongoDB Atlas (replica set)** | Same as portfolio; replica set required for **transactions** on financial entries |
| ORM | **Mongoose** | Same as portfolio |
| UI | **Tailwind + shadcn/ui** | Tables, forms, charts |
| Charts | **Recharts** | KPI cards + trend lines |
| Forms | **React Hook Form + Zod** | Strong server-side validation is non-negotiable for money |
| Images | **Cloudinary** | Same as portfolio (meter/odometer/cash photos) |
| Email | **Resend** | Same as portfolio (alerts, weekly reports) |
| WhatsApp | **Twilio WhatsApp Business API** | Bot for staff data entry + alerts to owner. ~$0.005–0.01/msg |
| SMS fallback | **Twilio SMS** | If WhatsApp is down |
| Hosting | **Vercel + MongoDB Atlas** | Free tier handles 5–20 units easily |
| Background jobs | **Vercel Cron + Inngest (or QStash)** | Daily reconciliation, anomaly checks, weekly reports |

**Estimated infra cost at your scale:** $30–60/month.

> *Trade-off note:* If you ever want bank-grade audit trail, PostgreSQL + Prisma is stronger than MongoDB. For now, MongoDB with replica-set transactions + an append-only audit collection is sufficient and matches your existing skill.

---

## 4. Domain Model

### Shared / core collections
- **Organization** — top-level group (you).
- **Business** — `{ type: "petrol_pump" | "bus_fleet" | "farm", name, location }`.
- **Unit** — a specific bus / pump nozzle / field.
- **User** — `{ role: "owner" | "manager" | "staff", phone, whatsapp, assignedUnits[] }`.
- **DailyEntry** — universal envelope: `{ unitId, submittedBy, submittedAt, type, payload, photoUrls[], gps, status, verifiedBy }`.
- **CashLedger** — `{ businessId, unitId, date, expectedCash, depositedCash, depositSlipPhoto, variance, status }`.
- **AuditLog** — append-only; every action (create/edit/approve/flag) logged with `{ actor, before, after, timestamp }`.
- **Alert** — `{ type, severity, businessId, message, triggeredAt, resolvedAt }`.

### Business-specific collections
- **Petrol pump:** `PumpNozzle`, `MeterReading` (opening + closing per shift, with photo), `FuelDelivery`, `Shift`, `Sale` (computed).
- **Bus fleet:** `Bus`, `Route`, `Trip` (start/end odometer with photo, fare collected, fuel filled), `MaintenanceLog`.
- **Farm:** `Field`, `Crop`, `InputExpense` (seed/fertilizer/labor with receipt photo), `HarvestRecord`, `ProduceSale`.

### Non-negotiable invariants
1. **Sequential reading rule:** today's `meter.opening` MUST equal yesterday's `meter.closing` for the same nozzle/bus. Mismatch → auto-flag + alert.
2. **Cash reconciliation rule:** `expectedCash = sales − approved expenses`; `variance = expected − deposited`. If `|variance| > 2%` → alert.
3. **Photo proof rule:** every meter/odometer/cash entry must have a photo, or it cannot be submitted.
4. **Append-only rule:** entries cannot be deleted. Corrections require a counter-entry, owner approval, and full audit log.

---

## 5. Anti-Fraud Strategy (the part that actually makes it robust)

Anomaly alerts alone are **not enough**. Use a layered defense:

### Layer 1 — Make faking expensive (most important)
- **Photo + timestamp + GPS on every entry.** Pump meter, bus odometer, cash count, deposit slip. Server records server-side timestamp; client photo's EXIF is also stored. This single control eliminates ~80% of casual fraud.
- **Sequential reading validation.** Closing today = opening tomorrow. System auto-flags any gap.
- **Append-only ledger.** No deletes — only counter-entries needing your approval.

### Layer 2 — Catch what slips through
- **Daily cash reconciliation** with deposit slip photo. Variance > 2% → instant WhatsApp alert.
- **Anomaly engine (nightly cron):**
  - Petrol pump: daily sales drop > 20% vs 30-day rolling avg, or fuel sold vs fuel delivered + tank level out of balance.
  - Bus: fuel-per-km outside normal range (theft via fake fill-ups), trips far below route average.
  - Farm: input expenses spiking without matching harvest output.
- **Two-person sign-off** on entries above threshold (expense > Rs. 10,000, refunds, manual variance corrections).

### Layer 3 — Operational discipline
- **Weekly auto-summary** to your WhatsApp every Monday: per-business P&L, top 3 alerts, units with missing entries.
- **Surprise audit feature.** Tap "Request live photo of pump 2 NOW" from your dashboard. Staff has 5 minutes to send a live photo. Failure = flag.
- **Monthly per-unit P&L.** Underperforming bus / nozzle / field becomes immediately visible.

---

## 6. Project Structure

```
biz-ops/   (NEW repo, separate from portfolio-vite)
├── src/
│   ├── app/
│   │   ├── (owner)/               # role: owner — full access
│   │   │   ├── dashboard/         # consolidated KPIs across all businesses
│   │   │   ├── pump/              # petrol pump views
│   │   │   ├── fleet/             # bus views
│   │   │   ├── farm/              # farm views
│   │   │   ├── alerts/            # alert inbox + resolve flow
│   │   │   ├── audit/             # audit log + surprise audit trigger
│   │   │   └── settings/          # users, units, thresholds
│   │   ├── (manager)/             # verify pending entries
│   │   ├── (staff)/               # mobile PWA for data entry
│   │   │   ├── submit/[unitId]/   # daily entry form (camera-first)
│   │   │   └── history/
│   │   ├── api/
│   │   │   ├── webhooks/whatsapp/ # Twilio inbound messages
│   │   │   ├── entries/           # POST entry, server-side validation
│   │   │   ├── cron/reconcile/    # daily cash reconciliation
│   │   │   ├── cron/anomaly/      # nightly anomaly detection
│   │   │   └── cron/weekly/       # Monday summary
│   │   └── login/
│   ├── lib/
│   │   ├── db/                    # Mongoose connection
│   │   ├── models/                # Business, Unit, DailyEntry, CashLedger…
│   │   ├── auth/                  # NextAuth + role middleware
│   │   ├── whatsapp/              # Twilio client + bot state machine
│   │   ├── validators/            # Zod schemas per entry type
│   │   ├── anomaly/               # detection rules engine
│   │   └── audit/                 # append-only logger
│   └── components/
│       ├── EntityListPage/        # ← copy pattern from portfolio
│       ├── KPICard, TrendChart, AlertBanner, PhotoUploader, ReconcileForm
└── ...
```

**Reusable patterns from your portfolio project:**
- `EntityListPage` component → reuse for managing Units, Users, Buses, Fields.
- NextAuth credentials setup → extend with role middleware (`owner` / `manager` / `staff`).
- Cloudinary upload helper → reuse for meter/odometer/cash photos.
- Resend email setup → extend for alert emails.
- Mongoose connection pattern → same.

---

## 7. Phasing

### Phase 1 — Petrol Pump MVP (3–4 weeks)
**Why first:** highest fraud risk, most structured numbers, fastest measurable ROI.
- User/role system, Business + Unit CRUD.
- WhatsApp bot for "open shift" / "close shift" / "deposit cash" with photo prompts.
- Mobile PWA fallback form.
- Sequential reading validation + cash reconciliation.
- Owner dashboard: today's sales, variance, recent alerts.
- WhatsApp alerts on variance > threshold.

**Success criteria:** 7 days of pump data captured without paper, 100% of entries have photos, you receive at least one variance alert in test.

### Phase 2 — Bus Fleet (2–3 weeks)
- Bus + Route + Trip models, odometer-based fuel-per-km checks.
- Driver WhatsApp flow: start trip / end trip / fuel fill (with receipt photo).
- Fleet dashboard: revenue per bus per day, fuel efficiency outliers.

### Phase 3 — Farm (2–3 weeks)
- Field + Crop + Input/Harvest models.
- Seasonal P&L (different from daily — buckets by crop cycle).
- Receipt OCR (optional, via Cloudinary + a vision model) for input invoices.

### Phase 4 — Cross-business intelligence (1–2 weeks)
- Consolidated dashboard, weekly WhatsApp summary, surprise-audit feature, anomaly engine v2.

**Total realistic timeline:** ~2.5–3 months part-time, ~6 weeks full-time.

---

## 8. Critical Files to Create — Phase 1 Only

- `src/lib/db/connect.js` — Mongoose connection.
- `src/lib/models/Business.js`, `Unit.js`, `User.js`, `DailyEntry.js`, `CashLedger.js`, `AuditLog.js`, `Alert.js`, `MeterReading.js`.
- `src/lib/auth/index.js` — NextAuth v5 with role-based session.
- `src/middleware.js` — protect `/(owner)`, `/(manager)`, `/(staff)` routes by role.
- `src/lib/validators/meterReading.js`, `cashDeposit.js` — Zod schemas.
- `src/lib/whatsapp/bot.js` — state machine: which question to ask next.
- `src/lib/whatsapp/twilio.js` — send/receive primitives.
- `src/lib/anomaly/rules.js` — sequential-reading rule, variance rule.
- `src/lib/audit/log.js` — append-only writer.
- `src/app/api/webhooks/whatsapp/route.js` — inbound message handler.
- `src/app/api/entries/route.js` — POST new entry (server validates, runs rules, writes audit log).
- `src/app/api/cron/reconcile/route.js` — daily cron.
- `src/app/(owner)/dashboard/page.jsx` — KPI cards + trend charts + alert feed.
- `src/app/(owner)/pump/[unitId]/page.jsx` — per-pump detail.
- `src/app/(staff)/submit/[unitId]/page.jsx` — mobile-first entry form.

---

## 9. Verification

1. **Paper-replacement parallel run (Phase 1):** run the petrol pump on the system *in parallel with paper* for 7 days. Compare. Any mismatch is a bug or a fraud signal.
2. **Photo audit:** pull 20 random entries from the past week. Every one should have a photo with timestamp and GPS that matches the unit. Any without = bug.
3. **Sequential reading check:** manually enter a closing reading lower than the previous opening — system must reject and alert.
4. **Variance alert test:** submit a cash deposit with a 5% shortfall — WhatsApp alert should arrive within 60 seconds.
5. **Surprise audit test (Phase 4):** tap "request live photo" — staff's WhatsApp should ping; if no response in 5 min, alert fires.
6. **Load check:** seed 30 days × 20 units of entries; dashboard should render under 1.5s.

---

## 10. Out of Scope (deliberately)

- **No accounting/tax module** — use Zoho Books / QuickBooks / your accountant. Export from this system → import there.
- **No payroll** — same reason.
- **No customer-facing features** (e.g., bus ticketing) — different problem, different app.
- **No CCTV integration** — money is the priority; cameras are a separate, much heavier investment. Revisit later.

Keeping scope tight is what makes the build robust. Adding any of the above before Phase 4 is finished will sink the project.
