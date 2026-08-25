# Ariadne — FitVision AI

> **“The digital thread to your perfect fit.”** Guiding you through the fashion labyrinth.

Smart Commerce & Return-Prevention Ecosystem for fashion e-commerce. Combines **Real-Time Body & Fabric Analysis** with **Virtual Try-On (VTON)** to eliminate sizing uncertainty, while giving merchants **Supply Chain Insights** that cut return costs & deadstock.

For **COMPFEST AIC — AI for the Backbone of the Economy** · Primary: Smart Commerce · Secondary: Smart Logistics.

---

## Hybrid AI Architecture

```
Live Smartphone Camera
   ├─ Layer 1: MediaPipe Pose (Intelligence Engine) → estimates shoulder/chest/waist/height from 33 landmarks → fit risk JSON
   └─ Layer 2: IDM-VTON / Flux + Custom LoRA     → photoreal garment draping
MediaPipe Pose (client) → steadiness + body measurement → clean Base64 frame
            ↓                         ↓
    Consumer: Realistic Try-On + Fit Warning
    Merchant: Return Risk & Sizing Demand Analytics (Supabase)
```

**No local GPU / LLM needed** — MediaPipe runs on-device in browser, Replicate handles rendering.

| Component | Technology | Purpose |
|-----------|------------|---------|
| Intelligence Engine | MediaPipe Pose (on-device) | Live landmark detection, body proportion estimation, size chart compare, fit risk |
| Rendering + Fine-Tuning | IDM-VTON / Flux + Custom LoRA | Fine-tuned on 20–50 multi-angle local fashion images for local cuts |
| Real-time Camera/Pose | MediaPipe Pose (JS) | Client-side tracking — ensure steady pose before sending frame |
| Frontend | Next.js 14 + Tailwind + shadcn/ui | Consumer try-on flow + Merchant dashboard (Tremor/Recharts) |
| Backend & DB | Node.js API routes + Supabase | Base64 payloads, catalog, `try_on_sessions`, `analytics_events` |

---

## Quick Start

> **Do not auto-install** — run manually as requested.

```bash
# 1. install (you run manually)
npm install

# 2. env
cp .env.example .env.local
# fill: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#       SUPABASE_SERVICE_ROLE_KEY, REPLICATE_API_TOKEN
# For demo without keys:
#   NEXT_PUBLIC_MOCK_AI=true

# 3. supabase (SQL Editor → run)
# supabase/schema.sql  → then seed.sql

# 4. run
npm run dev   # → http://localhost:3000
```

Open `/try-on` for consumer flow, `/dashboard` for merchant analytics.

**Mock mode:** `NEXT_PUBLIC_MOCK_AI=true` bypasses Replicate with realistic fixtures — perfect for hackathon demo without keys/billing. MediaPipe fit analysis works offline.

---

## Routes

- `/` — Landing (myth, architecture diagram, value props)
- `/try-on` — Live camera (MediaPipe Pose) → Garment catalog (Supabase) → Fit Analysis (MediaPipe body measurement) → VTON render (Replicate)
- `/dashboard` — B2B portal: return rate, conversion uplift, RTO saved (IDR), sizing demand, weekly trends, fit risk split, inventory recs
- `POST /api/analyze-fit` — `{ imageBase64, productId, selectedSize, body }` → fit JSON (via MediaPipe geometry, no LLM)
- `POST /api/virtual-tryon` — `{ humanImage, garmentImage, productId, category }` → resultUrl
- `GET /api/catalog?category=&q=` — Supabase `products` with fallback fixtures
- `GET /api/analytics` — KPIs + charts from `analytics_events`

## Supabase Tables

- `products` — catalog with `size_chart jsonb`, `fabric`, `stretch_level`
- `try_on_sessions` — consumer sessions + `fit_analysis jsonb`
- `analytics_events` — `view | try_on | purchase | return` for dashboard

See `supabase/schema.sql` & `seed.sql`.

## AI Pipeline (Fine-Tuning)

- `ai-pipeline/lora/train_lora.py` — Fashion LoRA on SDXL/FLUX via Kohya_ss or `accelerate launch ...` (see README inside)
- `ai-pipeline/eval/compare.py` — Before/After collage for pitch deck + W&B/TensorBoard loss curves
- `ai-pipeline/lora/Ariadne_LoRA_Training.ipynb` — One-click Colab notebook (free T4)

Dataset curation (20–50 multi-angle): lovechara.work, tumblr artist-refs, @LolitaWardrobe, tanuki-kimono, brand sites.

## Team

| Role | PIC |
|------|-----|
| Frontend Lead | Sergio Winnero |
| Backend & Integration Lead | Vincent |
| AI Pipeline & Fine-Tuning Lead | Osel Citta Chen |
| Merchant Dashboard Lead | Louis Alexander Pekandi |
| Product & Pitch Lead | Putri Khairani Azzahra |

## Tagline Origins

*Ariadne gave Theseus a red thread to escape the labyrinth.* The **Fabric Thread** (weaving) + **Tech Thread** (live data threads) — our AI weaves garments onto your moving body with mathematical precision.

---

Built for COMPFEST AIC. Stack: Next.js, Tailwind, shadcn/ui, Supabase, MediaPipe Pose, Replicate IDM-VTON, LoRA.
