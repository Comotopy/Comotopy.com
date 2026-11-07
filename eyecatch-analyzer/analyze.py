"""使い方: python analyze.py samples --backend mock --out out"""
import argparse, csv, json
from collections import Counter
from pathlib import Path
import backends, features

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder"); ap.add_argument("--backend", default="mock"); ap.add_argument("--out", default="out")
    a = ap.parse_args()
    be = backends.get(a.backend, a.folder)
    rows = []
    for p in sorted(Path(a.folder).glob("*.[pj][np]g")):
        try: sem = be.analyze(p)
        except Exception as e: print("skip", p.name, e); continue
        rows.append({"file": p.name, **features.color_features(p), **sem})
    out = Path(a.out); out.mkdir(exist_ok=True)
    (out / "features.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    flat = [{**r, "genders": "|".join(r["genders"]), "appeals": "|".join(r["appeals"])} for r in rows]
    with open(out / "features.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=flat[0].keys()); w.writeheader(); w.writerows(flat)
    write_report(rows, out / "report.md", a.backend)
    print(f"{len(rows)} images analyzed -> {out}/ (features.csv, report.md)")

def pct(n, t): return f"{n}件 ({n/t:.0%})"

def dist(rows, key, many=False):
    t = len(rows)
    c = Counter(v for r in rows for v in (r[key] if many else [r[key]]))
    return "\n".join(f"| {k} | {pct(v, t)} |" for k, v in c.most_common())

def write_report(rows, path, backend):
    t = len(rows); ppl = [r["people_count"] for r in rows]
    g = Counter(x for r in rows for x in r["genders"])
    with_p = sum(1 for n in ppl if n)
    avg = lambda k: (lambda v: sum(v) / len(v) if v else float('nan'))([r[k] for r in rows if r[k] is not None])
    md = f"""# 求人アイキャッチ 傾向レポート(MVP / backend={backend})
対象: {t}枚 ※性別は見た目からの推定値

## 人物
- 人物あり: {pct(with_p, t)} / 人物なし: {pct(t - with_p, t)}
- 平均人数(人物ありのみ): {sum(ppl)/max(with_p,1):.2f}人
- 人数分布: {dict(sorted(Counter(ppl).items()))}
- 推定性別(のべ人数): 男性的 {g['male']} / 女性的 {g['female']} / 不明 {g['unknown']}

## 画像タイプ
| 種別 | 割合 |
|---|---|
{dist(rows, 'image_style')}

## 訴求内容(複数選択)
| 訴求 | 出現率 |
|---|---|
{dist(rows, 'appeals', True)}

## 色
| 主要色 | 割合 |
|---|---|
{dist(rows, 'dominant_color')}

| トーン | 割合 |
|---|---|
{dist(rows, 'tone')}

- 平均明度 {avg('brightness'):.2f} / 平均コントラスト {avg('contrast'):.2f} / 平均彩度 {avg('saturation'):.2f}
- 平均テキスト面積比(概算): {avg('text_area_ratio'):.0%}

## サイズ・縦横比
| 縦横比 | 件数 |
|---|---|
""" + "\n".join(f"| {k} | {v} |" for k, v in Counter(r["aspect_ratio"] for r in rows).most_common())
    path.write_text(md, encoding="utf-8")

if __name__ == "__main__": main()
