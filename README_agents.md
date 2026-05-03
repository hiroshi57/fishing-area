# 🤖 釣果自動更新エージェント

洞爺湖・支笏湖の釣果情報をWebから自動収集し、`data.js` を更新するマルチエージェントシステムです。

---

## アーキテクチャ

```
orchestrator.py
│
├─► [Step 1] CollectorAgent（情報収集）
│   ├─ DuckDuckGo で釣果レポートを検索
│   ├─ anglers.jp / 釣りブログ等のスニペットを収集
│   └─ output: raw_items[] { url, title, snippet, lake_hint }
│
├─► [Step 2] ProcessorAgent（データ加工）
│   ├─ Claude API で自由文テキストから構造化データを抽出
│   ├─ 釣り場名 → 座標に変換（内蔵ルックアップテーブル）
│   └─ output: processed[] { lake, spot, lat, lng, fish_type, count, year, month, day }
│
├─► [Step 3] ValidatorAgent（データ検証）
│   ├─ 北海道座標範囲チェック
│   ├─ 日付・匹数の妥当性チェック
│   ├─ 既存DBとの重複排除
│   └─ output: validated[] （品質を通過したもののみ）
│
├─► [Step 4] WriterAgent（データ書き込み）
│   ├─ data/catches_db.json に追記（永続ストア）
│   ├─ js/data.js の INITIAL_CATCHES を更新（Web表示用）
│   └─ output: { added, total, timestamp }
│
└─► [Step 5] ReporterAgent（レポート生成）
    ├─ Claude API で実行サマリーを文章化
    └─ logs/report_YYYY-MM-DD.md に保存
```

---

## セットアップ

### 1. Anthropic API キーを取得する

https://console.anthropic.com/ でAPIキーを発行してください。

### 2. .env ファイルを作成する

```powershell
Copy-Item .env.example .env
# .env を開いてキーを入力
notepad .env
```

### 3. 初回セットアップ（仮想環境 + パッケージ）

```powershell
.\run.ps1 -Install
```

---

## 使い方

```powershell
# 基本実行（過去30日分を収集）
.\run.ps1

# 過去7日分だけ収集（直近確認）
.\run.ps1 -Days 7

# 過去60日分を広く収集
.\run.ps1 -Days 60

# 詳細ログで実行（デバッグ用）
.\run.ps1 -LogLevel DEBUG
```

### 定期実行（Windowsタスクスケジューラ）

```powershell
# 毎週月曜 6:00 に自動実行するタスクを登録
$action  = New-ScheduledTaskAction -Execute "PowerShell.exe" `
             -Argument "-NonInteractive -File `"$PWD\run.ps1`" -Days 7" `
             -WorkingDirectory $PWD
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At "06:00"
Register-ScheduledTask -TaskName "FishingMapUpdate" -Action $action -Trigger $trigger -RunLevel Highest
```

---

## ファイル構成

```
fishing-area/
├── agents/
│   ├── __init__.py
│   ├── base.py          # BaseAgent（共通基底クラス）
│   ├── collector.py     # 情報収集エージェント
│   ├── processor.py     # データ加工エージェント
│   ├── validator.py     # データ検証エージェント
│   ├── writer.py        # データ書き込みエージェント
│   └── reporter.py      # レポート生成エージェント
├── data/
│   ├── .gitkeep
│   └── catches_db.json  # 収集データの永続ストア（自動生成）
├── logs/
│   ├── .gitkeep
│   ├── run_YYYY-MM-DD.log    # 実行ログ（自動生成）
│   └── report_YYYY-MM-DD.md # 実行レポート（自動生成）
├── js/
│   ├── app.js
│   └── data.js          # エージェントが INITIAL_CATCHES を更新
├── orchestrator.py      # 全エージェントの司令塔
├── config.json          # 設定ファイル
├── requirements.txt     # Python依存パッケージ
├── run.ps1              # PowerShell 実行スクリプト
└── .env.example         # 環境変数テンプレート
```

---

## 注意事項

- `.env` ファイルは絶対に GitHub にコミットしないでください（`.gitignore` で除外済み）
- DuckDuckGo は無料ですが過剰なリクエストでブロックされる場合があります。`config.json` の `search_delay_seconds` で調整してください
- `catches_db.json` はエージェントが追記していく永続データです。誤って削除しても `js/data.js` の INITIAL_CATCHES はそのまま残ります
- Web から収集したデータはあくまで参考情報です。実際の釣果は手動入力（マップ画面の「＋ 釣果を記録する」）で確認済みデータを登録することを推奨します

---

## トラブルシューティング

| 症状 | 原因 | 対応 |
|------|------|------|
| `ModuleNotFoundError: anthropic` | 仮想環境が有効でない / インストール未実施 | `.\run.ps1 -Install` を実行 |
| `ANTHROPIC_API_KEY が設定されていません` | `.env` ファイルがない / キーが空 | `.env.example` をコピーしてキーを記入 |
| `JSON解析失敗` がログに多い | Claudeの出力が不安定 | `--log-level DEBUG` で詳細確認 |
| 追加件数が常に0 | 既存データと重複 / 検証で除外 | `logs/` のレポートで除外理由を確認 |
