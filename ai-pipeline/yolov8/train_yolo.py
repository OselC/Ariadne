"""
Ariadne YOLOv8 Fine-Tune — Fit Anomaly Detector
Detects: tight shoulder, waist gap, fabric pulling, seam strain
Dataset: 200–300 annotated images (COCO/YOLO format) from try-on captures
"""
import argparse
from pathlib import Path

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", type=str, default="ai-pipeline/yolov8/data.yaml")
    ap.add_argument("--model", type=str, default="yolov8n.pt", help="yolov8n.pt / yolov8s.pt pretrained")
    ap.add_argument("--epochs", type=int, default=80)
    ap.add_argument("--imgsz", type=int, default=640)
    ap.add_argument("--batch", type=int, default=16)
    ap.add_argument("--project", type=str, default="runs/detect")
    ap.add_argument("--name", type=str, default="ariadne_yolo")
    return ap.parse_args()

def main():
    args = parse_args()
    print(f"[Ariadne YOLOv8] Data: {args.data} | Model: {args.model} | Epochs: {args.epochs}")

    # Requires: pip install ultralytics
    try:
        from ultralytics import YOLO
    except ImportError:
        print("[Ariadne YOLOv8] ultralytics not installed. Run: pip install ultralytics")
        print("[Ariadne YOLOv8] Then: python ai-pipeline/yolov8/train_yolo.py --data ai-pipeline/yolov8/data.yaml")
        # Write expected data.yaml template for convenience
        tmpl = Path(args.data)
        if not tmpl.exists():
            tmpl.parent.mkdir(parents=True, exist_ok=True)
            tmpl.write_text(
                "path: ./datasets/fit_anomaly\n"
                "train: images/train\nval: images/val\n"
                "nc: 4\n"
                "names: ['tight_shoulder', 'waist_gap', 'fabric_pulling', 'seam_strain']\n"
            )
            print(f"[Ariadne YOLOv8] Created template {args.data}")
        return

    model = YOLO(args.model)
    # Freeze backbone, fine-tune head (or full fine-tune for 80 epochs — cheap on 200 images)
    results = model.train(
        data=args.data,
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        project=args.project,
        name=args.name,
        pretrained=True,
        amp=True,
    )
    print(f"[Ariadne YOLOv8] Done. Best weights: {args.project}/{args.name}/weights/best.pt")
    print("[Ariadne YOLOv8] Metrics: check runs/detect/ariadne_yolo/ for precision/recall curves, confusion matrix.")
    # Validate
    metrics = model.val()
    print(metrics)

if __name__ == "__main__":
    main()
