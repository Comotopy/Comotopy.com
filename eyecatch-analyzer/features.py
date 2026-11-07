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
    # 強調色: 彩度・明度が十分ある画素だけで色相ヒストグラム(背景の白/グレー/写真の肌色割れを避ける)
    hue = np.zeros_like(mx)
    d = np.maximum(mx - mn, 1e-6)
    r_, g_, b_ = a[..., 0], a[..., 1], a[..., 2]
    hue = np.where(mx == r_, ((g_ - b_) / d) % 6, np.where(mx == g_, (b_ - r_) / d + 2, (r_ - g_) / d + 4)) * 60
    m = (sat > 0.4) & (mx > 0.25)
    accents = {}
    if m.sum():
        for hv in hue[m]:
            n_ = hue_name(float(hv)); accents[n_] = accents.get(n_, 0) + 1
        # 暗い紺は「blue」だが低明度なので別名にする
    navy = float(((mx < 0.45) & (sat > 0.4) & (hue > 200) & (hue < 260)).mean())
    top_acc = sorted(accents.items(), key=lambda kv: -kv[1])[:2]
    accent_list = [f"{k}:{v/a[...,0].size:.0%}" for k, v in top_acc]
    warm = name in ("red", "orange", "yellow")
    return {"width": w, "height": h, "aspect_ratio": round(w / h, 2),
            "dominant_color": name, "dominant_hex": "#%02x%02x%02x" % (int(r*255), int(g*255), int(b*255)),
            "dominant_share": round(float(cnt.max() / cnt.sum()), 2),
            "accent_colors": accent_list, "navy_share": round(navy, 2),
            "color_temp": "warm" if warm else ("cool" if name in ("green", "blue", "purple") else "neutral"),
            "brightness": round(float(lum.mean()), 2), "contrast": round(float(lum.std()), 2),
            "saturation": round(float(sat.mean()), 2)}
