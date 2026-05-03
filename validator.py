"""
CollectorAgent - 洞爺湖・支笏湖の釣果情報を収集するエージェント。

収集源:
  - DuckDuckGo 検索経由でのスニペット（2次情報）
  - anglers.jp / つりしん 等の釣果サイト（2次情報）

出力: list[dict] raw_items
  各アイテムは { url, title, snippet, lake_hint } を持つ。
"""
import time
import logging
from duckduckgo_search import DDGS

from .base import BaseAgent

log = logging.getLogger("CollectorAgent")

# 湖ごとの検索クエリテンプレート
QUERIES = {
    "洞爺湖": [
        "洞爺湖 釣果 {year}年",
        "洞爺湖 ワカサギ ニジマス ヒメマス 釣果",
        "洞爺湖 トラウト 釣果 site:anglers.jp",
    ],
    "支笏湖": [
        "支笏湖 釣果 {year}年",
        "支笏湖 ブラウントラウト アメマス 釣果",
        "支笏湖 トラウト 釣果 site:anglers.jp",
    ],
}

MAX_RESULTS_PER_QUERY = 5
SEARCH_DELAY_SEC = 1.5


class CollectorAgent(BaseAgent):
    def __init__(self, max_sources: int = 15):
        super().__init__("CollectorAgent")
        self.max_sources = max_sources

    def run(self, since_date: str) -> list[dict]:
        """since_date 以降を対象に両湖の釣果ソースを収集する。"""
        year = since_date[:4]
        all_items: list[dict] = []

        for lake in ["洞爺湖", "支笏湖"]:
            items = self._collect_lake(lake, year)
            all_items.extend(items)
            self.logger.info(f"{lake}: {len(items)}件収集")

        return all_items

    def _collect_lake(self, lake: str, year: str) -> list[dict]:
        """1湖分の検索を実行し、重複URLを除いたアイテムを返す。"""
        seen_urls: set[str] = set()
        unique_items: list[dict] = []

        for tmpl in QUERIES[lake]:
            query = tmpl.format(year=year)
            for item in self._search(query):
                if item["url"] not in seen_urls:
                    seen_urls.add(item["url"])
                    unique_items.append({**item, "lake_hint": lake})

            if len(unique_items) >= self.max_sources:
                break
            time.sleep(SEARCH_DELAY_SEC)

        return unique_items[: self.max_sources]

    def _search(self, query: str) -> list[dict]:
        """DuckDuckGo でテキスト検索し、結果を返す。失敗時は空リスト。"""
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=MAX_RESULTS_PER_QUERY))
            return [
                {"url": r["href"], "title": r["title"], "snippet": r["body"]}
                for r in results
            ]
        except Exception as e:
            self._log_error(
                msg=f"検索失敗: {query}",
                cause=e,
                impact="このクエリの釣果が収集されない",
                action="次のクエリに続行。ネットワーク接続を確認してください",
            )
            return []
