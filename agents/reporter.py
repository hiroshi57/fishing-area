"""
ReporterAgent - エージェント実行結果のサマリーを生成・保存する。

Claude API でレポートを文章化し、logs/report_YYYY-MM-DD.md に保存する。
"""
import json
import logging
from datetime import date
from pathlib import Path

from .base import BaseAgent

log = logging.getLogger("ReporterAgent")

LOGS_DIR = Path(__file__).parent.parent / "logs"

REPORT_SYSTEM = """あなたは釣果データ更新レポートを作成するエージェントです。
与えられたJSON形式の更新サマリーをもとに、日本語の簡潔なMarkdownレポートを作成してください。
含める内容: 実行日時、追加件数、主な魚種・湖の内訳、特記事項。
Markdownのみ返すこと。"""


class ReporterAgent(BaseAgent):
    def __init__(self):
        super().__init__("ReporterAgent")

    def run(self, summary: dict) -> str:
        """サマリーからレポートを生成し、ファイルに保存する。"""
        report_md = self._generate_report(summary)
        path = self._save_report(report_md)
        self.logger.info(f"レポート保存: {path}")
        return report_md

    def _generate_report(self, summary: dict) -> str:
        prompt = (
            f"以下の更新サマリーをレポートにしてください。\n\n"
            f"```json\n{json.dumps(summary, ensure_ascii=False, indent=2)}\n```"
        )
        return self.call_claude(REPORT_SYSTEM, prompt, max_tokens=1024)

    def _save_report(self, content: str) -> Path:
        LOGS_DIR.mkdir(exist_ok=True)
        path = LOGS_DIR / f"report_{date.today()}.md"
        path.write_text(content, "utf-8")
        return path

    def build_summary(
        self,
        collected:  list[dict],
        processed:  list[dict],
        validated:  list[dict],
        write_result: dict,
    ) -> dict:
        """各ステップの統計をまとめたサマリーを生成する。"""
        return {
            "timestamp":   write_result.get("timestamp"),
            "collected":   len(collected),
            "processed":   len(processed),
            "validated":   len(validated),
            "added":       write_result.get("added", 0),
            "total_db":    write_result.get("total", 0),
            "by_fish":     self._count_by_key(validated, "fish_type"),
            "by_lake":     self._count_by_key(validated, "lake"),
        }

    def _count_by_key(self, catches: list[dict], key: str) -> dict[str, int]:
        """指定キーで釣果リストを集計する。"""
        counts: dict[str, int] = {}
        for c in catches:
            val = c.get(key, "不明")
            counts[val] = counts.get(val, 0) + 1
        return counts
