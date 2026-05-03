# run.ps1 - 釣果更新エージェントの実行スクリプト
#
# 使い方:
#   .\run.ps1                    # 過去30日分を収集
#   .\run.ps1 -Days 7            # 過去7日分を収集
#   .\run.ps1 -Install           # 初回セットアップ（仮想環境 + パッケージ）
#   .\run.ps1 -Days 60 -Install  # セットアップ + 過去60日分

param(
    [int]    $Days       = 30,
    [int]    $MaxSources = 15,
    [switch] $Install,
    [string] $LogLevel   = "INFO"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# ---------- APIキーを読み込む ----------
function Load-EnvFile {
    if (Test-Path ".env") {
        Get-Content ".env" | ForEach-Object {
            if ($_ -match "^([^#][^=]*)=(.+)$") {
                [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim(), "Process")
            }
        }
    }
}

Load-EnvFile

if (-not $env:ANTHROPIC_API_KEY) {
    Write-Error @"
ANTHROPIC_API_KEY が設定されていません。
.env ファイルを作成し、以下を記述してください:

  ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxx
"@
    exit 1
}

# ---------- 仮想環境のセットアップ ----------
function Setup-Venv {
    Write-Host "[setup] 仮想環境を作成します..."
    python -m venv .venv
    & ".venv\Scripts\pip" install --upgrade pip --quiet
    & ".venv\Scripts\pip" install -r requirements.txt
    Write-Host "[setup] セットアップ完了"
}

if ($Install -or -not (Test-Path ".venv\Scripts\python.exe")) {
    Setup-Venv
}

# ---------- エージェント実行 ----------
Write-Host ""
Write-Host "=== 釣果更新エージェント起動 ===" -ForegroundColor Cyan
Write-Host "  対象期間: 過去 $Days 日間"
Write-Host "  最大収集数: 1湖あたり $MaxSources ソース"
Write-Host ""

$pythonArgs = @(
    "orchestrator.py",
    "--days",        $Days,
    "--max-sources", $MaxSources,
    "--log-level",   $LogLevel
)

& ".venv\Scripts\python" @pythonArgs

if ($LASTEXITCODE -ne 0) {
    Write-Error "エージェントがエラーで終了しました（終了コード: $LASTEXITCODE）"
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "=== 完了 ===" -ForegroundColor Green
Write-Host "  ログ: logs\run_$(Get-Date -Format 'yyyy-MM-dd').log"
Write-Host "  レポート: logs\report_$(Get-Date -Format 'yyyy-MM-dd').md"
