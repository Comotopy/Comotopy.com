"""従来の画像処理による数値特徴量(決定的・無料)。"""
import colorsys
import numpy as np
from PIL import Image

NAMES = {(0, 15): "red", (15, 45): "orange", (45, 70): "yellow", (70, 170): "green",
         (170, 260): "blue", (260, 330): "purple", (330, 361): "red"}

def hue_name(h):
    return next(v for (a, b), v in NAMES.items() if a <= h < b)

def color_features(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    a = np.asarray(im.resize((160, int(160 * h / w) or 1)), dtype=np.float32) / 255
    lum = 0.2126*a[..., 0] + 0.7152*a[..., 1] + 0.0722*a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    # 主要色: 4bit量子化の最頻値
    q = (a * 15).astype(int).reshape(-1, 3)
    keys, cnt = np.unique(q[:, 0]*256 + q[:, 1]*16 + q[:, 2], return_counts=True)
    top = keys[cnt.argmax()]
    r, g, b = (top // 256) / 15, (top % 256 // 16) / 15, (top % 16) / 15
    hh, ss, vv = colorsys.rgb_to_hsv(r, g, b)
    if ss < 0.15: name = "white" if vv > 0.7 else ("black" if vv < 0.25 else "gray")
    else: name = hue_name(hh * 360)
    warm = name in ("red", "orange", "yellow")
    return {"width": w, "height": h, "aspect_ratio": round(w / h, 2),
            "dominant_color": name, "dominant_hex": "#%02x%02x%02x" % (int(r*255), int(g*255), int(b*255)),
            "dominant_share": round(float(cnt.max() / cnt.sum()), 2),
            "tone": "warm" if warm else ("cool" if name in ("green", "blue", "purple") else "neutral"),
            "brightness": round(float(lum.mean()), 2), "contrast": round(float(lum.std()), 2),
            "saturation": round(float(sat.mean()), 2)}
