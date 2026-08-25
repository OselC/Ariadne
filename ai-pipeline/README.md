# AI Pipeline — Ariadne FitVision

Hybrid AI: pre-trained foundation + fine-tuned LoRA for competition requirement.

## Architecture (per PDF)

```
Live Smartphone Camera
   ├─ Layer 1: MediaPipe Pose (Intelligence Engine) → 33 landmarks → shoulder/chest/waist/height → size chart compare → fit_risk JSON
   └─ Layer 2: IDM-VTON / Flux + Custom LoRA (Rendering Engine) → photoreal try-on
MediaPipe Pose (client) → steadiness + body measurement → clean Base64 frame
Output: Consumer (try-on + warning) + Merchant (return risk & sizing analytics) → Supabase
```

## Options

### Option A — Fashion Style / Garment LoRA (Kohya_ss / Diffusers)

Curate 20–50 multi-angle images (lovechara.work, tumblr, LolitaWardrobe, tanuki-kimono, brand sites).
Train LoRA on top of SDXL or FLUX for local cuts & intricate textures.

```bash
# setup
pip install -r lora/requirements.txt
# prepare dataset: ai-pipeline/datasets/lolita_01/  (20-50 images + .txt captions)
accelerate launch --mixed_precision=fp16 lora/train_lora.py \
  --pretrained_model_name_or_path="black-forest-labs/FLUX.1-dev" \
  --dataset_dir="./datasets/lolita_01" \
  --output_dir="./weights/lolita-lora" \
  --rank=16 --learning_rate=1e-4 --max_train_steps=1500
```

See `lora/train_lora.py` for full script.

## Before vs After

- Loss curves: TensorBoard / W&B (`--report_to wandb` in LoRA)
- Side-by-side renders: `ai-pipeline/eval/compare.py` generates before/after collage

## API Wiring

- `lib/mediapipe.ts` → MediaPipe Pose (Layer 1) with `estimateBodyProportions` + `calculateFitAnalysis` (no LLM, on-device)
- `lib/replicate.ts` → Replicate IDM-VTON (Layer 2) with mock fallback
- Both respect `NEXT_PUBLIC_MOCK_AI=true` for offline demo (fit analysis works offline via MediaPipe)

## Repro

All scripts log to `ai-pipeline/runs/` and expect no local GPU for inference (MediaPipe on-device + Replicate).
