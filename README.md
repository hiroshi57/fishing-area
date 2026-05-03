# 🎣 釣果マップ - 洞爺湖・支笏湖

北海道の洞爺湖・支笏湖での釣果を Google Maps 上に記録・可視化するウェブアプリです。

## スクリーンショット

```
[サイドバー]              [Google Maps (航空写真)]
 統計カード               魚マーカー（月カラー + 年カラー）
 湖移動ボタン             🐟 アイコン + 匹数バッジ
 年/月フィルター
 凡例
 釣果追加ボタン
```

## 機能

- 🗺 洞爺湖・支笏湖の釣果を地図上に表示
- 🐟 魚のマーカーに釣れた匹数を表示
- 🎨 マーカーの丸の色 = 月（12色）、縁の色 = 年（複数色）
- 🔍 年・月でフィルタリング
- ➕ 新しい釣果を地図クリックで座標入力して記録
- 💾 記録した釣果をブラウザ（localStorage）に保存

---

## セットアップ手順

### 1. Google Cloud Console でキーを取得する

#### API キー
1. https://console.cloud.google.com/ にアクセス
2. プロジェクトを作成（または既存を選択）
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「APIキー」
4. 作成されたキーをコピー
5. 「Maps JavaScript API」を有効化する（APIライブラリから検索）

#### マップ ID（カスタムHTMLマーカーに必要）
1. 「Google Maps Platform」→「マップのスタイル設定」→「マップ ID を作成」
2. マップの種類：JavaScript
3. 作成後に表示されるマップ ID をコピー

### 2. index.html を編集する

```html
<!-- index.html の末尾付近 -->
<script
  async
  src="https://maps.googleapis.com/maps/api/js?key=【APIキーをここに】&libraries=marker&loading=async&callback=initMap">
</script>
```

```javascript
// js/app.js の initMap 関数内
map = new Map(document.getElementById('map'), {
  ...
  mapId: '【マップIDをここに】',
  ...
});
```

### 3. GitHub Pages で公開する

```powershell
# リポジトリをクローン
git clone https://github.com/hiroshi57/fishing-area.git
cd fishing-area

# ファイルをコピー後
git add .
git commit -m "釣果マップ 初期リリース"
git push origin main
```

GitHub のリポジトリ設定 → Pages → Source: main ブランチのルート → 保存

---

## ファイル構成

```
fishing-area/
├── index.html          メインHTML（地図・モーダル・サイドバー）
├── css/
│   └── style.css       スタイル（ダーク系、魚マーカーデザイン）
├── js/
│   ├── app.js          地図・マーカー・フィルター・フォームの処理
│   └── data.js         初期サンプルデータ + localStorage読み書き
└── README.md           このファイル
```

---

## データ形式

`js/data.js` の `INITIAL_CATCHES` 配列に釣果データを追記できます。

```javascript
{
  id: 100,              // ユニークなID（整数）
  lake: '洞爺湖',        // '洞爺湖' または '支笏湖'
  spot: '月浦',          // 釣り場の名前（自由記述）
  lat: 42.6050,         // 緯度（小数点6桁まで）
  lng: 140.7720,        // 経度（小数点6桁まで）
  fish_type: 'ニジマス', // 魚の種類
  count: 3,             // 釣れた匹数
  year: 2025,           // 年
  month: 5,             // 月（1〜12）
  day: 10,              // 日
  notes: 'フライで。夕方から好調。'  // メモ（省略可）
}
```

---

## マーカーのカラールール

| 要素 | 意味 |
|------|------|
| 丸の背景色 | 月（1月=深青 ～ 12月=濃紺、季節で変化） |
| 丸の縁の色 | 年（年ごとに異なる色が自動割り当て） |
| 数字バッジ | 釣れた匹数 |

---

## 注意事項

- API キーは公開リポジトリにそのまま入れないでください。  
  GitHub Pages で使う場合は、Google Cloud Console でそのドメインのみ許可する制限を設定してください。
- ブラウザに記録した釣果は localStorage に保存されます。  
  ブラウザのデータを消去すると削除されますのでご注意ください。
- 長期保存したい場合は `js/data.js` の `INITIAL_CATCHES` に手動で追記することをお勧めします。
