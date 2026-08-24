# AI Pipeline — Ariadne FitVision

Hybrid AI: pre-trained foundations + fine-tuned LoRA / YOLOv8 for competition requirement.

## Architecture (per PDF)

```
Live Smartphone Camera
   ├─ Layer 1: HF Vision (Qwen2-VL) (Intelligence Engine) → body proportions, size chart parse, fabric stretch → fit_risk JSON
   └─ Layer 2: IDM-VTON / Flux + Custom LoRA (Rendering Engine) → photoreal try-on
MediaPipe Pose (client) → steadiness gate → clean Base64 frame
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

### Option B — YOLOv8 Classifier / Object Detector (fit anomalies)

Fine-tune last layer on 200–300 annotated images to detect: tight shoulder, waist gap, fabric pulling, seam strain.

```bash
pip install -r yolov8/requirements.txt
python yolov8/train_yolo.py --data yolov8/data.yaml --epochs 80 --imgsz 640 --batch 16
python yolov8/evaluate.py --weights runs/detect/ariadne_yolo/weights/best.pt --data yolov8/data.yaml
```

## Before vs After

- Loss curves: TensorBoard / W&B (`--report_to wandb` in LoRA)
- Side-by-side renders: `ai-pipeline/eval/compare.py` generates before/after collage

## API Wiring

- `lib/huggingface.ts` → Hugging Face Qwen2-VL (Layer 1) with JSON mode + mock fallback (HF_TOKEN)
- `lib/replicate.ts` → Replicate IDM-VTON (Layer 2) with mock fallback
- Both respect `NEXT_PUBLIC_MOCK_AI=true` for offline demo

## Repro

All scripts log to `ai-pipeline/runs/` and expect no local GPU for inference (Replicate + HF Inference calls).
