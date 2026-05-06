"""
WriterAgent - 検証済み釣果を data.js と catches_db.json に書き込む。

data.js の INITIAL_CATCHES 配列をブラケット深さを数えて安全に置換する。
"""
import json
import logging
from datetime import datetime
from pathlib import Path

log = logging.getLogger("WriterAgent")

DATA_JS_PATH   = Path(__file__).parent.parent / "js"   / "data.js"
CATCHES_DB_PATH = Path(__file__).parent.parent / "data" / "catches_db.json"


class WriterAgent:

    def run(self, new_catches: list[dict]) -> dict:
        """新規釣果を追記し、data.js と DB を更新する。"""
        existing  = self._load_db()
        to_add    = [self._normalize(c) for c in new_catches]
        all_data  = existing + to_add

        self._save_db(all_data)
        self._update_data_js(all_data)

        result = {
            "added":     len(to_add),
            "total":     len(all_data),
            "timestamp": datetime.now().isoformat(),
        }
        log.info(f"書き込み完了: {result}")
        return result

    # ---------- DB 操作 ----------

    def _load_db(self) -> list[dict]:
        if CATCHES_DB_PATH.exists():
            return json.loads(CATCHES_DB_PATH.read_text("utf-8"))
        return []

    def _save_db(self, catches: list[dict]) -> None:
        CATCHES_DB_PATH.parent.mkdir(exist_ok=True)
        CATCHES_DB_PATH.write_text(
            json.dumps(catches, ensure_ascii=False, indent=2), "utf-8"
        )

    # ---------- 正規化 ----------

    def _normalize(self, c: dict) -> dict:
        uid = int(datetime.now().timestamp() * 1000) + abs(hash(str(c))) % 9999
        return {
            "id":        uid,
            "lake":      c.get("lake", ""),
            "spot":      c.get("spot", c.get("lake", "")),
            "lat":       round(float(c.get("lat", 0)), 6),
            "lng":       round(float(c.get("lng", 0)), 6),
            "fish_type": c.get("fish_type", "その他"),
            "count":     int(c.get("count", 1)),
            "year":      int(c["year"]),
            "month":     int(c["month"]),
            "day":       int(c.get("day") or 1),
            "notes":     c.get("notes", ""),
        }

    # ---------- data.js 書き換え ----------

    def _update_data_js(self, all_catches: list[dict]) -> None:
        src = DATA_JS_PATH.read_text("utf-8")
        start, end = self._find_array_bounds(src, "const INITIAL_CATCHES = [")
        if start < 0:
            log.error("INITIAL_CATCHES が data.js に見つかりません")
            return
        new_json = json.dumps(all_catches, ensure_ascii=False, indent=2)
        new_src  = src[:start] + new_json + src[end:]
        DATA_JS_PATH.write_text(new_src, "utf-8")

    def _find_array_bounds(self, src: str, start_marker: str) -> tuple[int, int]:
        """[ の開始位置から対応する ] の直後までを返す。"""
        marker_end = src.find(start_marker)
        if marker_end < 0:
            return -1, -1
        open_idx = src.find("[", marker_end)
        depth = 0
        for i in range(open_idx, len(src)):
            if   src[i] == "[": depth += 1
            elif src[i] == "]": depth -= 1
            if depth == 0:
                return open_idx, i + 1
        return -1, -1
