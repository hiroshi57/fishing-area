"""
fishing-area エージェントパッケージ

CollectorAgent  → 情報収集
ProcessorAgent  → データ加工
ValidatorAgent  → データ検証
WriterAgent     → データ書き込み
ReporterAgent   → レポート生成
"""
from .collector  import CollectorAgent
from .processor  import ProcessorAgent
from .validator  import ValidatorAgent
from .writer     import WriterAgent
from .reporter   import ReporterAgent

__all__ = [
    "CollectorAgent",
    "ProcessorAgent",
    "ValidatorAgent",
    "WriterAgent",
    "ReporterAgent",
]
