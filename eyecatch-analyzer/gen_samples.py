"""仮画像(求人アイキャッチ風)を生成し、正解ラベルを sidecar JSON に保存する。"""
import json, random, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BG = {"red": (200, 50, 45), "orange": (240, 140, 40), "yellow": (245, 210, 60),
      "green": (60, 160, 90), "blue": (45, 100, 190), "navy": (25, 40, 90),
      "white": (245, 245, 245), "gray": (120, 125, 130)}
APPEAL = ["salary", "no_experience", "short_hours", "bonus", "athome"]
TEXT = {"salary": "HOURLY 1,500 YEN", "no_experience": "NO EXPERIENCE OK",
        "short_hours": "SHORT HOURS OK", "bonus": "BONUS UP TO 1M YEN",
        "athome": "FRIENDLY WORKPLACE"}
JOB = ["blue_collar", "sales"]

def font(size):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",):
        try: return ImageFont.truetype(p, size)
        except OSError: pass
    return ImageFont.load_default()

def person(d, x, y, s, gender, uniform):
    skin = (235, 200, 170)
    body = (240, 130, 30) if uniform else (60, 70, 90)
    d.rectangle([x - s*0.5, y + s*0.8, x + s*0.5, y + s*2.6], fill=body)
    d.ellipse([x - s*0.4, y, x + s*0.4, y + s*0.9], fill=skin)
    hair = (30, 25, 20)
    if gender == "female":
        d.rectangle([x - s*0.45, y + s*0.2, x - s*0.3, y + s*1.5], fill=hair)
        d.rectangle([x + s*0.3, y + s*0.2, x + s*0.45, y + s*1.5], fill=hair)
    d.pieslice([x - s*0.42, y - s*0.05, x + s*0.42, y + s*0.8], 180, 360, fill=hair)

def make(i, rnd):
    w, h = rnd.choice([(800, 400), (800, 400), (600, 600), (1000, 300)])
    bg = rnd.choice(list(BG)); job = rnd.choice(JOB)
    style = rnd.choice(["photo_like", "illustration", "text_only"])
    n = 0 if style == "text_only" else rnd.choice([0, 1, 1, 2, 3])
    genders = [rnd.choice(["male", "female"]) for _ in range(n)]
    appeal = rnd.sample(APPEAL, rnd.choice([1, 2]))
    im = Image.new("RGB", (w, h), BG[bg]); d = ImageDraw.Draw(im)
    dark = bg in ("white", "yellow")
    fg = (20, 20, 20) if dark else (255, 255, 255)
    fs = rnd.choice([28, 40, 56]); y = h * 0.08
    for a in appeal:
        d.text((w*0.05, y), TEXT[a], fill=fg, font=font(fs)); y += fs * 1.4
    for k, g in enumerate(genders):
        person(d, w*(0.55 + 0.14*k) if n > 1 else w*0.75, h*0.25, h*0.12, g, job == "blue_collar")
    name = f"sample_{i:03d}.png"
    return name, im, {"file": name, "job_type": job, "people_count": n,
        "genders": sorted(genders), "image_style": style, "appeals": sorted(appeal),
        "text_size_px": fs, "text_area_ratio_hint": round(fs*1.4*len(appeal)/h, 2)}

if __name__ == "__main__":
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "samples"); out.mkdir(exist_ok=True)
    rnd = random.Random(42); truth = []
    for i in range(30):
        name, im, t = make(i, rnd); im.save(out / name); truth.append(t)
    (out / "ground_truth.json").write_text(json.dumps(truth, ensure_ascii=False, indent=1))
    print(f"generated {len(truth)} images -> {out}")
