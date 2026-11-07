"""使い方: python evaluate.py samples out/features.json  (正解ラベルとの一致率)"""
import json, sys
from collections import Counter
from pathlib import Path
folder, pred = sys.argv[1], sys.argv[2]
gt = {r["file"]: r for r in json.loads((Path(folder) / "ground_truth.json").read_text())}
pr = json.loads(Path(pred).read_text()); n = len(pr)
acc = lambda f: sum(f(gt[r["file"]], r) for r in pr) / n
print(f"対象 {n}枚")
print(f"人物の有無   : {acc(lambda g, r: (g['people_count'] > 0) == (r['people_count'] > 0)):.0%}")
print(f"人数         : {acc(lambda g, r: g['people_count'] == r['people_count']):.0%}")
print(f"性別構成     : {acc(lambda g, r: g['genders'] == sorted(r['genders'])):.0%}")
print(f"画像タイプ   : {acc(lambda g, r: g['image_style'] == r['image_style']):.0%}")
print(f"訴求(完全一致): {acc(lambda g, r: g['appeals'] == sorted(r['appeals'])):.0%}")
tp = fp = fn = 0
for r in pr:
    a, b = set(gt[r["file"]]["appeals"]), set(r["appeals"]); tp += len(a & b); fp += len(b - a); fn += len(a - b)
print(f"訴求(項目別) : 適合率 {tp/max(tp+fp,1):.0%} / 再現率 {tp/max(tp+fn,1):.0%}")
conf = Counter((gt[r["file"]]["image_style"], r["image_style"]) for r in pr)
print("画像タイプ混同(正解→判定):", dict(conf))
