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
    for p in sorted(q for q in Path(a.folder).iterdir() if q.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}):
        try: sem = be.analyze(p)
        except Exception as e: print("skip", p.name, e); continue
        rows.append({"file": p.name, **features.color_features(p), **sem})
    out = Path(a.out); out.mkdir(exist_ok=True)
    (out / "features.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    flat = [{k: ("|".join(v) if isinstance(v, list) else v) for k, v in r.items()} for r in rows]
    cols = list(dict.fromkeys(k for r in flat for k in r))
    with open(out / "features.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=cols, restval=''); w.writeheader(); w.writerows(flat)
    write_report(rows, out / "report.md", a.backend)
    print(f"{len(rows)} images analyzed -> {out}/ (features.csv, report.md)")

def pct(n, t): return f"{n}件 ({n/t:.0%})"

def dist(rows, key, many=False):
    t = len(rows)
    c = Counter(v for r in rows for v in ((r.get(key) or []) if many else [r.get(key)]) if v)
    return "\n".join(f"| {k} | {pct(v, t)} |" for k, v in c.most_common()) or "| (データなし) | - |"

def section(rows, title, key, many=True):
    if not any(r.get(key) for r in rows): return ""
    return f"\n## {title}\n| 項目 | 出現率 |\n|---|---|\n{dist(rows, key, many)}\n"

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
- イラスト人物あり: {pct(sum(1 for r in rows if r.get('illustration_people_count')), t)}(実写人物とは別集計)
{section(rows, '実写人物の写り方', 'person_framing')}{section(rows, '表情', 'person_expression')}{section(rows, '視線', 'person_gaze')}
## 画像タイプ
| 種別 | 割合 |
|---|---|
{dist(rows, 'image_style')}

## 訴求内容(複数選択)
| 訴求 | 出現率 |
|---|---|
{dist(rows, 'appeals', True)}

{section(rows, '写真の被写体', 'photo_subject')}{section(rows, '構成要素', 'elements')}{section(rows, 'レイアウト型', 'layout_pattern', False)}{section(rows, '文字の強調手法', 'text_emphasis')}{section(rows, 'トーン', 'tone')}
## 色
| 主要色 | 割合 |
|---|---|
{dist(rows, 'dominant_color')}

| 色温度 | 割合 |
|---|---|
{dist(rows, 'color_temp')}

- 平均明度 {avg('brightness'):.2f} / 平均コントラスト {avg('contrast'):.2f} / 平均彩度 {avg('saturation'):.2f}
- 平均テキスト面積比(概算): {avg('text_area_ratio'):.0%}

## サイズ・縦横比
| 縦横比 | 件数 |
|---|---|
""" + "\n".join(f"| {k} | {v} |" for k, v in Counter(r["aspect_ratio"] for r in rows).most_common())
    path.write_text(md, encoding="utf-8")

if __name__ == "__main__": main()
