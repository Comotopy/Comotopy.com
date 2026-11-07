"""使い方: python evaluate.py <folder> <features.json>  (正解ラベルとの一致率。存在する項目のみ評価)"""
import json, sys
from pathlib import Path
folder, pred = sys.argv[1], sys.argv[2]
gt = {r["file"]: r for r in json.loads((Path(folder) / "ground_truth.json").read_text())}
pr = [r for r in json.loads(Path(pred).read_text()) if r["file"] in gt]; n = len(pr)
SCALAR = ["people_count", "illustration_people_count", "image_style", "layout_pattern"]
MULTI = ["genders", "appeals", "text_emphasis", "elements"]
print(f"対象 {n}枚")
for k in SCALAR:
    if all(k in gt[r["file"]] and k in r for r in pr):
        print(f"{k:26s} 完全一致 {sum(gt[r['file']][k] == r[k] for r in pr)/n:.0%}")
for k in MULTI:
    if not all(k in gt[r["file"]] and k in r for r in pr): continue
    tp = fp = fn = ex = 0; per = {}
    for r in pr:
        a, b = set(gt[r["file"]][k]), set(r[k]); ex += a == b
        tp += len(a & b); fp += len(b - a); fn += len(a - b)
        for v in a | b:
            d = per.setdefault(v, [0, 0, 0]); d[0] += v in a and v in b; d[1] += v in b and v not in a; d[2] += v in a and v not in b
    P, R = tp / max(tp + fp, 1), tp / max(tp + fn, 1)
    print(f"{k:26s} 完全一致 {ex/n:.0%} / 適合率 {P:.0%} / 再現率 {R:.0%}")
    bad = {v: d for v, d in per.items() if d[1] or d[2]}
    if bad: print("   誤り(項目: 正解〇判定〇 / 過剰判定 / 見落とし):", {v: tuple(d) for v, d in bad.items()})
# 混同: スカラー項目の不一致一覧
for k in SCALAR:
    if all(k in gt[r["file"]] and k in r for r in pr):
        bad = [(r["file"], gt[r["file"]][k], r[k]) for r in pr if gt[r["file"]][k] != r[k]]
        if bad: print(f"[{k}] 不一致:", bad)
