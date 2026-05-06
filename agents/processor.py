"""
ProcessorAgent - CollectorAgent の生データから釣果を抽出・正規化するエージェント。

Claude API を使い、自由文テキストを INITIAL_CATCHES 互換 JSON に変換する。
釣り場名 → 座標の変換も担当する。
"""
import json
import logging
from .base import BaseAgent

log = logging.getLogger("ProcessorAgent")

# 釣り場名 → (lat, lng) のルックアップテーブル
SPOT_COORDS: dict[str, dict[str, tuple]] = {
    "洞爺湖": {
        "財田":         (42.5840, 140.8670),
        "月浦":         (42.6050, 140.7720),
        "えぼし岩":     (42.5590, 140.8215),
        "仲洞爺":       (42.6200, 140.8300),
        "洞爺湖温泉":   (42.5700, 140.7912),
        "壮瞥":         (42.5580, 140.8350),
        "旭浦":         (42.5800, 140.8000),
        "相馬妙見":     (42.5750, 140.7600),
        "ソウベツ":     (42.5580, 140.8350),
    },
    "支笏湖": {
        "ポロピナイ":   (42.7855, 141.3710),
        "モーラップ":   (42.7530, 141.3055),
        "美笛":         (42.7375, 141.3185),
        "苔の洞門":     (42.7448, 141.3542),
        "丸駒温泉":     (42.7720, 141.3650),
        "支笏湖温泉":   (42.7620, 141.3580),
        "オコタンペ":   (42.7920, 141.3350),
        "シシャモナイ": (42.7450, 141.3500),
    },
}

DEFAULT_COORDS = {
    "洞爺湖": (42.5979, 140.8200),
    "支笏湖": (42.7650, 141.3500),
}

EXTRACT_SYSTEM = """あなたは釣果データ抽出専門AIです。
与えられたテキストから洞爺湖・支笏湖の釣果情報を抽出し、
以下のJSON配列のみを返してください。抽出できない場合は [] を返してください。

[
  {
    "lake": "洞爺湖 または 支笏湖",
    "spot": "釣り場名（不明な場合は湖名のみ）",
    "fish_type": "ワカサギ/ヒメマス/ニジマス/アメマス/ブラウントラウト/サクラマス/その他",
    "count": 数値（不明なら1）,
    "year": 4桁の西暦,
    "month": 1〜12,
    "day": 1〜31（不明ならnull）,
    "notes": "ルアー・釣り方・天気など",
    "source_url": "情報元のURL"
  }
]

注意:
- 確認できない情報は含めない
- countは数値のみ（匹・尾などの単位は除く）
- JSONのみ返すこと（説明文を含めない）"""


class ProcessorAgent(BaseAgent):
    def __init__(self):
        super().__init__("ProcessorAgent")

    def run(self, raw_items: list[dict]) -> list[dict]:
        """生アイテムリストを正規化済み釣果リストに変換する。"""
        extracted: list[dict] = []

        for item in raw_items:
            catches = self._extract(item)
            for c in catches:
                extracted.append(self._enrich(c, item["url"]))

        self.logger.info(f"加工完了: {len(extracted)}件")
        return extracted

    def _extract(self, item: dict) -> list[dict]:
        """1つのrawアイテムからClaude APIで釣果を抽出する。"""
        prompt = (
            f"URL: {item['url']}\n"
            f"タイトル: {item['title']}\n"
            f"内容: {item['snippet']}\n\n"
            f"lake_hint（対象の湖）: {item.get('lake_hint', '不明')}\n"
            f"\n上記から釣果をJSON配列で抽出してください。"
        )
        raw = self.call_claude(EXTRACT_SYSTEM, prompt)
        return self._parse_json(raw)

    def _parse_json(self, text: str) -> list[dict]:
        """テキストからJSON配列を安全に抽出する。"""
        try:
            start = text.find("[")
            end = text.rfind("]") + 1
            if start >= 0 and end > start:
                return json.loads(text[start:end])
        except json.JSONDecodeError as e:
            self._log_error(
                msg="JSON解析失敗",
                cause=e,
                impact="このソースの釣果がスキップされる",
                action="Claude出力形式を確認。プロンプトを調整してください",
            )
        return []

    def _enrich(self, catch: dict, source_url: str) -> dict:
        """座標とソースURLを付与する。"""
        lake = catch.get("lake", "")
        spot = catch.get("spot", "")
        lat, lng = self._resolve_coords(lake, spot)
        return {**catch, "lat": lat, "lng": lng, "source_url": source_url}

    def _resolve_coords(self, lake: str, spot: str) -> tuple:
        """釣り場名から座標を解決する。一致なければ湖の中心を返す。"""
        for key, coords in SPOT_COORDS.get(lake, {}).items():
            if key in spot or spot in key:
                return coords
        return DEFAULT_COORDS.get(lake, (42.65, 141.10))
