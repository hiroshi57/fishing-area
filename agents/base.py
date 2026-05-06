"""
BaseAgent - 全エージェントが継承する基底クラス。
Anthropic SDK のラッパーとロギング設定を提供する。
"""
import logging
import anthropic
from dotenv import load_dotenv

load_dotenv()

MODEL = "claude-sonnet-4-6"


class BaseAgent:
    def __init__(self, name: str):
        self.name = name
        self.client = anthropic.Anthropic()
        self.logger = logging.getLogger(name)

    def call_claude(self, system: str, prompt: str, max_tokens: int = 4096) -> str:
        """テキスト抽出専用のシンプルなAPI呼び出し。"""
        response = self.client.messages.create(
            model=MODEL,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": prompt}],
        )
        return self._extract_text(response)

    def _extract_text(self, response) -> str:
        """レスポンスから最初のtextブロックを取り出す。"""
        for block in response.content:
            if hasattr(block, "text"):
                return block.text
        return ""

    def _log_error(self, msg: str, cause: Exception, impact: str, action: str) -> None:
        """原因・影響範囲・対応案を3点セットで記録する。"""
        self.logger.error(
            f"{msg}\n"
            f"  原因: {cause}\n"
            f"  影響範囲: {impact}\n"
            f"  対応案: {action}"
        )
