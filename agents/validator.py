"""
ValidatorAgent - 加工済み釣果データの品質検証と重複排除。

AI不使用・純Python実装。
各検証項目は独立した関数として管理し、失敗理由を明示する。
"""
import logging
from datetime import date

log = logging.getLogger("ValidatorAgent")

# 北海道の座標範囲（概略）
LAT_RANGE = (41.3, 45.6)
LNG_RANGE = (139.3, 145.9)

VALID_LAKES   = {"洞爺湖", "支笏湖"}
VALID_FISH    = {"ワカサギ", "ヒメマス", "ニジマス", "アメマス",
                 "ブラウントラウト", "サクラマス", "その他"}
COUNT_RANGE   = (1, 9999)
YEAR_RANGE    = (2020, date.today().year)


class ValidatorAgent:

    def run(self, catches: list[dict], existing_ids: set[str]) -> list[dict]:
        """検証を通過した釣果のみを返す。"""
        valid: list[dict] = []
        for c in catches:
            ok, reason = self._validate_all(c, existing_ids)
            if ok:
                valid.append(c)
            else:
                self.logger.warning(f"除外: {reason} | {c.get('lake')} {c.get('spot')}")

        log.info(f"検証完了: {len(valid)}/{len(catches)}件通過")
        return valid

    # ログ出力用に logger を持つ
    @property
    def logger(self):
        return log

    def _validate_all(self, c: dict, existing_ids: set[str]) -> tuple[bool, str]:
        """全ルールを順番にチェックし、最初の失敗理由を返す。"""
        checks = [
            self._check_lake,
            self._check_coords,
            self._check_date,
            self._check_count,
            self._check_fish_type,
        ]
        for fn in checks:
            ok, reason = fn(c)
            if not ok:
                return False, reason

        if make_dedup_id(c) in existing_ids:
            return False, "重複データ（既に登録済み）"

        return True, ""

    def _check_lake(self, c: dict) -> tuple[bool, str]:
        lake = c.get("lake", "")
        if lake not in VALID_LAKES:
            return False, f"不明な湖: {lake!r}"
        return True, ""

    def _check_coords(self, c: dict) -> tuple[bool, str]:
        lat, lng = float(c.get("lat", 0)), float(c.get("lng", 0))
        if not (LAT_RANGE[0] <= lat <= LAT_RANGE[1]):
            return False, f"緯度が北海道外: {lat}"
        if not (LNG_RANGE[0] <= lng <= LNG_RANGE[1]):
            return False, f"経度が北海道外: {lng}"
        return True, ""

    def _check_date(self, c: dict) -> tuple[bool, str]:
        try:
            year  = int(c.get("year",  0))
            month = int(c.get("month", 0))
            day   = int(c.get("day") or 1)
            date(year, month, day)
        except (ValueError, TypeError) as e:
            return False, f"日付が不正: {e}"

        if not (YEAR_RANGE[0] <= year <= YEAR_RANGE[1]):
            return False, f"年が範囲外: {year}"
        return True, ""

    def _check_count(self, c: dict) -> tuple[bool, str]:
        try:
            count = int(c.get("count", 0))
        except (ValueError, TypeError):
            return False, "countが数値でない"
        if not (COUNT_RANGE[0] <= count <= COUNT_RANGE[1]):
            return False, f"countが範囲外: {count}"
        return True, ""

    def _check_fish_type(self, c: dict) -> tuple[bool, str]:
        fish = c.get("fish_type", "")
        if not fish:
            return False, "fish_typeが空"
        # VALID_FISH 以外でも「その他」として通過させる
        return True, ""


def make_dedup_id(c: dict) -> str:
    """重複判定用のキーを生成する。"""
    return "_".join([
        str(c.get("lake",      "")),
        str(c.get("spot",      "")),
        str(c.get("fish_type", "")),
        str(c.get("year",      "")),
        str(c.get("month",     "")),
        str(c.get("day",       "")),
    ])


def make_id_set(catches: list[dict]) -> set[str]:
    """既存の釣果リストから重複チェック用セットを生成する。"""
    return {make_dedup_id(c) for c in catches}
