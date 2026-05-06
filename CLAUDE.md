# MeetingOS - CLAUDE.md

> **Version**: v8.1
> **Last Updated**: 2026-02-25

## プロジェクト概要
会議録音・文字起こし・議事録生成ツール。音声/動画ファイルをアップロードすると、自動で文字起こし・話者推定・議事録生成を行う。

## 技術スタック
- **Frontend**: React 19 (CRA), 単一ファイル `src/App.js` (~3456行)
- **Backend**: Node.js + Express.js (`server/index.js`, ~1450行)
- **AI**: OpenAI Whisper-1 (文字起こし) + Claude claude-sonnet-4-5 (話者推定, primary) + GPT-4o-mini (議事録生成, fallback)
- **File Processing**: fluent-ffmpeg (音声チャンク分割, 16kHz モノラル変換)

## ディレクトリ構造
```
C:/Users/hiroshi_takizawa/MeetingOS/
├── src/
│   ├── App.js          # React フロントエンド全体 (巨大単一ファイル ~3456行)
│   ├── App.css         # スタイル
│   └── index.js        # エントリーポイント
├── server/
│   ├── index.js        # Express サーバー・メインロジック (~1450行)
│   ├── chunker.js      # FFmpeg チャンク分割 (3分/チャンク, 16kHz モノラル)
│   ├── pipeline-helpers.js  # パイプラインユーティリティ関数
│   ├── voiceos-enhancer.js  # 発言録整形 (フィラー除去等)
│   ├── auth.js         # JWT 認証
│   ├── database.js     # データベース (SQLite)
│   ├── database-pg.js  # PostgreSQL 対応
│   └── security.js     # セキュリティミドルウェア
├── public/             # 静的ファイル
├── data/
│   ├── uploads/        # アップロードファイル一時保存
│   └── results/        # 処理結果 JSON
├── CHANGES.md          # 変更履歴・タスク記録
├── package.json
├── .env                # API キー (OPENAI_API_KEY, ANTHROPIC_API_KEY)
└── docker-compose.yml
```

## 処理パイプライン
```
音声/動画アップロード
→ FFmpeg でチャンク分割 (3分/chunk, 並列3, 16kHz モノラル変換)
→ Whisper API で文字起こし (並列最大8)
→ Claude API で話者推定
   ├─ バッチ分割 (80セグ/バッチ, 重複10)
   ├─ 並列バッチ処理 (最大3並列)
   ├─ タイムアウト保護 (60秒/バッチ)
   └─ 話者ラベル一貫性マージ
→ VoiceOS Enhancement (任意: フィラー除去・文法修正)
→ GPT-4o-mini で議事録生成
→ SSE でリアルタイム進捗通知
```

## 主要定数 (server/index.js)
```js
MAX_PARALLEL_WHISPER = 8              // Whisper 並列数
WHISPER_RATE_DELAY_MS = 200           // バッチ間ディレイ
SPEAKER_BATCH_SIZE = 80               // 話者推定バッチサイズ (セグメント数)
SPEAKER_BATCH_OVERLAP = 10            // バッチ重複セグメント数
MAX_CONCURRENT_SPEAKER_BATCHES = 3    // 並列バッチ数 (v8.1追加)
MAX_TEXT_LENGTH = 1000000             // テキスト最大長 (100万字)
UPLOAD_CLEANUP_HOURS = 24             // アップロードファイル保持時間
```

## APIエンドポイント

### 処理系
| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/transcribe` | POST | 音声/動画ファイルアップロード・文字起こし開始 |
| `/api/process` | POST | 統合エンドポイント (自動判別: 音声/テキスト) |
| `/api/process-text` | POST | テキスト入力処理 |
| `/api/assign-speakers` | POST | 話者推定のみ (セグメント配列を受け取る) |
| `/api/enhance-transcript` | POST | 発言録整形 |
| `/api/generate-minutes` | POST | 議事録生成 |

### 進捗・状態系
| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/progress/:sessionId` | GET | SSE 進捗ストリーム |
| `/api/session/:sessionId` | GET | セッション状態取得 |
| `/health` | GET | サーバー状態確認 |

### 結果・分析系
| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/results` | GET | 結果一覧 (search/sort/pagination) |
| `/api/results/:filename` | GET | 特定結果取得 |
| `/api/speaker-stats/:sessionId` | GET | セッションの話者統計 (**v8.1 新規**) |
| `/api/speaker-stats` | POST | セグメントから話者統計計算 (**v8.1 新規**) |

### speaker-stats レスポンス形式
```json
{
  "speakers": [
    {
      "speaker": "A",
      "totalDuration": 120.5,
      "segmentCount": 42,
      "turns": 15,
      "firstSeen": 0.0,
      "percentage": 60,
      "avgSegmentDuration": 2.9
    }
  ],
  "totalDuration": 200.0,
  "speakerCount": 2,
  "segmentCount": 70
}
```

## 話者推定アーキテクチャ (v8.1)

```
assignSpeakersBatch(segments)
  │
  ├─ [小さい入力: ≤80セグ] → assignSpeakersOneBatch() 直接実行
  │
  └─ [大きい入力: >80セグ]
       ├─ バッチ分割 (80セグ/バッチ, 重複10)
       ├─ processParallel(batches, ..., MAX_CONCURRENT=3) ← 並列実行
       │    └─ 各バッチ: assignSpeakersOneBatch()
       │         ├─ Claude API (primary, temperature=0, timeout=60s)
       │         ├─ OpenAI fallback (timeout=60s)
       │         └─ フォールバック: 全セグ speaker='A'
       └─ 話者ラベル一貫性マージ (重複領域でマッピング構築)
```

## 環境変数 (.env)
```
OPENAI_API_KEY=...      # Whisper + GPT-4o-mini (必須)
ANTHROPIC_API_KEY=...   # Claude 話者推定 (推奨、なければ OpenAI fallback)
PORT=3001
NODE_ENV=development
```

## 開発サーバー起動
```bash
# フロントエンド (port 3000) + バックエンド (port 3001) 同時起動
npm run dev

# バックエンドのみ
npm run server

# フロントエンドのみ
npm start
```

## 注意事項
- `App.js` は非常に大きい (~3456行) → offset/limit を使って分割読み込みすること
- `server/index.js` には一部文字化けした日本語があるが、機能には影響しない（UTF-8/Shift-JIS混在の可能性）
- session は in-memory Map → サーバー再起動で消える
- API キーは .env に格納済み
- Windows 環境 (Node.js, npm は PATH に設定済みと仮定)
- pipeline-helpers.js は独立したユーティリティ関数群（server/index.js とは独立しており、現状 index.js からはインポートしていない）

## 既知の課題・将来タスク
1. **パイプライン重複**: Whisper 完了チャンクから逐次で話者推定を開始 (v9.0 候補)
2. **フロントエンド改善**: 話者統計グラフ、波形ビジュアライザー (v9.0 候補)
3. **セッション永続化**: 現在は in-memory のみ (SQLite への移行候補)
4. **スピーカープロファイル蓄積**: バッチ間で話者特性を蓄積して精度向上 (研究課題)
