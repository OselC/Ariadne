# Ariadne — FitVision AI

> **“The digital thread to your perfect fit.”**

Smart Commerce & Return-Prevention Ecosystem for fashion e-commerce. Combines **Real-Time Body & Fabric Analysis** with **Virtual Try-On (VTON)** to eliminate sizing uncertainty, while giving merchants **Supply Chain Insights** that cut return costs & deadstock.

For **COMPFEST AIC — AI for the Backbone of the Economy** · Smart Commerce

---

## Hybrid AI Architecture

```
Live Smartphone Camera
   ├─ Layer 1: GPT Vision (Intelligence Engine)  → parses body proportions, size chart, fabric stretch → fit risk JSON
   └─ Layer 2: IDM-VTON / Flux + Custom LoRA     → photoreal garment draping
MediaPipe Pose (client) → steadiness gate → clean Base64 frame
            ↓                         ↓
    Consumer: Realistic Try-On + Fit Warning
    Merchant: Return Risk & Sizing Demand Analytics (Supabase)
```

**No local GPU needed** — orchestrate Replicate + OpenAI from Next.js API routes.

| Component | Technology | Purpose |
|-----------|------------|---------|
| Intelligence Engine | GPT-4o Vision API | Live frame analysis, body proportions, size chart parse, fit risk |
| Rendering + Fine-Tuning | IDM-VTON / Flux + Custom LoRA / YOLOv8 | Fine-tuned on 20–50 multi-angle local fashion images; YOLOv8 for fit anomalies |
| Real-time Camera/Pose | MediaPipe Pose (JS) | Client-side tracking — ensure steady pose before sending frame |
| Frontend | Next.js 14 + Tailwind + shadcn/ui | Consumer try-on flow + Merchant dashboard (Tremor/Recharts) |
| Backend & DB | Node.js API routes + Supabase | Base64 payloads, catalog, `try_on_sessions`, `analytics_events` |

---

## Quick Start

```bash
# 1. install (you run manually)
npm install

# 2. env
cp .env.example .env.local
# fill: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#       SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN
# For demo without keys:
#   NEXT_PUBLIC_MOCK_AI=true

# 3. supabase (SQL Editor → run)
# supabase/schema.sql  → then seed.sql

# 4. run
npm run dev   # → http://localhost:3000
```

Open `/try-on` for consumer flow, `/dashboard` for merchant analytics.

**Mock mode:** `NEXT_PUBLIC_MOCK_AI=true` bypasses OpenAI/Replicate with realistic fixtures.

---

## Routes

- `/` — Landing (myth, architecture diagram, value props)
- `/try-on` — Live camera (MediaPipe) → Garment catalog (Supabase) → Fit Analysis (GPT-4o) → VTON render (Replicate)
- `/dashboard` — B2B portal: return rate, conversion uplift, RTO saved (IDR), sizing demand, weekly trends, fit risk split, inventory recs
- `POST /api/analyze-fit` — `{ imageBase64, productId, selectedSize }` → fit JSON
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
- `ai-pipeline/yolov8/train_yolo.py` — YOLOv8 detector for `tight_shoulder, waist_gap, fabric_pulling, seam_strain`
- `ai-pipeline/eval/compare.py` — Before/After collage for pitch deck + W&B/TensorBoard loss curves

Dataset curation (20–50 multi-angle): lovechara.work, tumblr artist-refs, @LolitaWardrobe, tanuki-kimono, brand sites.

## Team

| Role | PIC |
|------|-----|
| Frontend Lead | Sergio Winnero |
| Backend & Integration Lead | Vincent |
| AI Pipeline & Fine-Tuning Lead | Osel Citta Chen |
| Merchant Dashboard Lead | Louis Alexander Pekandi |
| Product & Pitch Lead | Putri Khairani Azzahra |

Stack: Next.js, Tailwind, shadcn/ui, Supabase, OpenAI, Replicate, MediaPipe, LoRA, YOLOv8.
