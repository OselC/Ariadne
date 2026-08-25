"""
Generate Before vs After collage for deck (LoRA)
Produces: ai-pipeline/eval/before_after.png
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def make_collage(before_path: str, after_path: str, out: str):
    try:
        a = Image.open(before_path).convert("RGB")
        b = Image.open(after_path).convert("RGB")
    except FileNotFoundError:
        # create placeholder
        a = Image.new("RGB", (512, 640), (40, 40, 50))
        b = Image.new("RGB", (512, 640), (230, 57, 70))
        d = ImageDraw.Draw(a); d.text((180, 310), "BEFORE", fill="white")
        d = ImageDraw.Draw(b); d.text((180, 310), "AFTER", fill="white")
    h = min(a.height, b.height)
    a = a.crop((0, 0, a.width, h))
    b = b.crop((0, 0, b.width, h))
    collage = Image.new("RGB", (a.width + b.width + 16, h + 48))
    collage.paste((15, 15, 25), [0, 0, collage.width, collage.height])  # bg
    collage.paste(a, (0, 48))
    collage.paste(b, (a.width + 16, 48))
    draw = ImageDraw.Draw(collage)
    draw.text((10, 12), "BEFORE — base model (floating clothing, unrealistic drapes)", fill="white")
    draw.text((a.width + 20, 12), "AFTER — fine-tuned LoRA (precise body alignment & local fit)", fill="white")
    collage.save(out)
    print(f"Saved {out}")

if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument("--before", default="ai-pipeline/eval/before.jpg")
    ap.add_argument("--after", default="ai-pipeline/eval/after.jpg")
    ap.add_argument("--out", default="ai-pipeline/eval/before_after.png")
    args = ap.parse_args()
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    make_collage(args.before, args.after, args.out)
