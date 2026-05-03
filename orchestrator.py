"""
orchestrator.py - 釣果更新エージェントの司令塔。

実行順:
  1. CollectorAgent  : Webから釣果情報を収集
  2. ProcessorAgent  : 生テキストを構造化JSONに変換
  3. ValidatorAgent  : 座標・日付・重複などを検証
  4. WriterAgent     : data.js と DB に書き込み
  5. ReporterAgent   : 実行結果レポートを生成

使い方:
  python orchestrator.py [--days 30]
"""
import argparse
import json
import logging
import sys
from datetime import date, timedelta
from pathlib import Path

from agents import (
    CollectorAgent, ProcessorAgent,
    ValidatorAgent, WriterAgent, ReporterAgent,
)
from agents.validator import make_id_set

CATCHES_DB = Path("data/catches_db.json")


def setup_logging(level: str = "INFO") -> None:
    """標準出力とファイルの両方にログを出力する。"""
    Path("logs").mkdir(exist_ok=True)
    logging.basicConfig(
        level=getattr(logging, level, logging.INFO),
        format="%(asctime)s [%(name)-16s] %(levelname)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(f"logs/run_{date.today()}.log", encoding="utf-8"),
        ],
    )


def load_existing_ids() -> set[str]:
    """DBから既存レコードの重複チェック用IDセットを生成する。"""
    if CATCHES_DB.exists():
        return make_id_set(json.loads(CATCHES_DB.read_text("utf-8")))
    return set()


def step_collect(since_date: str, max_sources: int) -> list[dict]:
    """Step 1: Webから釣果情報を収集する。"""
    log = logging.getLogger("Orchestrator")
    log.info(f"=== Step 1/4: 情報収集 (since {since_date}) ===")
    collected = CollectorAgent(max_sources=max_sources).run(since_date)
    log.info(f"  収集ソース数: {len(collected)}")
    return collected


def step_process(collected: list[dict]) -> list[dict]:
    """Step 2: 生テキストを構造化JSONに変換する。"""
    log = logging.getLogger("Orchestrator")
    log.info("=== Step 2/4: データ加工 ===")
    processed = ProcessorAgent().run(collected)
    log.info(f"  抽出件数: {len(processed)}")
    return processed


def step_validate(processed: list[dict]) -> list[dict]:
    """Step 3: 座標・日付・重複などを検証する。"""
    log = logging.getLogger("Orchestrator")
    log.info("=== Step 3/4: データ検証 ===")
    validated = ValidatorAgent().run(processed, load_existing_ids())
    log.info(f"  検証通過: {len(validated)}")
    return validated


def step_write(validated: list[dict]) -> dict:
    """Step 4: data.js と DB に書き込む。"""
    logging.getLogger("Orchestrator").info("=== Step 4/4: データ書き込み ===")
    return WriterAgent().run(validated)


def run_pipeline(since_date: str, max_sources: int) -> dict:
    """全エージェントを順番に実行し、最終サマリーを返す。"""
    reporter  = ReporterAgent()
    collected = step_collect(since_date, max_sources)
    processed = step_process(collected)
    validated = step_validate(processed)
    result    = step_write(validated)
    summary   = reporter.build_summary(collected, processed, validated, result)
    reporter.run(summary)
    return summary


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="釣果更新エージェント")
    parser.add_argument("--days",       type=int, default=30,  help="何日前から収集するか")
    parser.add_argument("--max-sources",type=int, default=15,  help="1湖あたりの最大収集ソース数")
    parser.add_argument("--log-level",  type=str, default="INFO", help="ログレベル")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    setup_logging(args.log_level)

    since_date = (date.today() - timedelta(days=args.days)).isoformat()
    summary = run_pipeline(since_date, args.max_sources)

    print("\n" + "=" * 50)
    print(f"  追加: {summary['added']}件  合計DB: {summary['total_db']}件")
    print("=" * 50)


if __name__ == "__main__":
    main()
