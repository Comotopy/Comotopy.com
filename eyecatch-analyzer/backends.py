"""意味的特徴量(人物・訴求・種別)の抽出バックエンド。mock / claude を切替可能。"""
import base64, json, os
from pathlib import Path

SCHEMA_PROMPT = """これは求人広告のアイキャッチ画像です。次のJSONのみを返してください(説明文は不要)。
{"people_count": 整数(見える人物の数),
 "genders": ["male"|"female"|"unknown", ...]  /* 見た目からの推定 */,
 "image_style": "photo_like"|"illustration"|"text_only"|"composite"(写真+図解/アイコン/吹き出し等の合成),
 "appeals": ["salary"|"no_experience"|"short_hours"|"bonus"|"athome"|"flexible_shift"|"license_only"|"vehicle_support"|"side_job"|"no_fee"|"direct_commute"|"other", ...],
 "text_area_ratio": 0〜1(テキストが占める画像面積の概算),
 "main_text": "最も目立つ文言"}"""

class MockBackend:
    """正解JSONを読むだけ。パイプライン・集計・レポートの検証用。"""
    def __init__(self, folder):
        self.t = {r["file"]: r for r in json.loads((Path(folder) / "ground_truth.json").read_text())}
    def analyze(self, path):
        r = self.t[Path(path).name]
        return {k: r[k] for k in ("people_count", "genders", "image_style", "appeals")} | {
            "text_area_ratio": r["text_area_ratio_hint"], "main_text": ""}

class ManualBackend:
    """人手(またはClaude Codeセッション上のClaude)が付けたラベルJSONを読む。"""
    def __init__(self, folder):
        self.t = json.loads((Path(folder) / "manual_labels.json").read_text())
    def analyze(self, path):
        return self.t[Path(path).name]

class ClaudeBackend:
    def __init__(self, model="claude-sonnet-5-5"):
        import anthropic
        self.c, self.model = anthropic.Anthropic(), model
    def analyze(self, path):
        data = base64.standard_b64encode(Path(path).read_bytes()).decode()
        mt = {".png": "image/png", ".webp": "image/webp"}.get(Path(path).suffix.lower(), "image/jpeg")
        r = self.c.messages.create(model=self.model, max_tokens=500, messages=[{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64", "media_type": mt, "data": data}},
            {"type": "text", "text": SCHEMA_PROMPT}]}])
        txt = r.content[0].text
        return json.loads(txt[txt.index("{"): txt.rindex("}") + 1])

def get(name, folder):
    if name == "mock": return MockBackend(folder)
    if name == "manual": return ManualBackend(folder)
    if name == "claude":
        if not os.environ.get("ANTHROPIC_API_KEY"): raise SystemExit("ANTHROPIC_API_KEY が未設定です")
        return ClaudeBackend()
    raise SystemExit(f"unknown backend: {name}")
