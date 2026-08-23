"""
Evaluate fine-tuned YOLOv8 and emit Before vs After comparison for pitch deck
"""
import argparse
from pathlib import Path

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights", type=str, required=True)
    ap.add_argument("--data", type=str, default="ai-pipeline/yolov8/data.yaml")
    ap.add_argument("--imgsz", type=int, default=640)
    return ap.parse_args()

def main():
    args = parse_args()
    try:
        from ultralytics import YOLO
    except ImportError:
        print("Install ultralytics first")
        return
    model = YOLO(args.weights)
    metrics = model.val(data=args.data, imgsz=args.imgsz)
    # Print per-class AP for deck
    print("mAP50-95:", metrics.box.map)
    print("mAP50:", metrics.box.map50)
    print("Per-class AP:", metrics.box.ap_class_index)

if __name__ == "__main__":
    main()
