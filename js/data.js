// 釣果データ - 洞爺湖・支笏湖
// localStorageに保存済みのデータがあればそちらを優先して使用する

const INITIAL_CATCHES = [

  // ===== 洞爺湖 =====

  // 財田キャンプ場周辺
  { id: 1001, lake: '洞爺湖', spot: '財田キャンプ場前', lat: 42.5768, lng: 140.8592, fish_type: 'ヒメマス', count: 12, year: 2024, month: 5, day: 3, notes: 'カウンターシャッド10g。朝マズメ6時〜8時。カケアガリで連発。' },
  { id: 1002, lake: '洞爺湖', spot: '財田キャンプ場前', lat: 42.5765, lng: 140.8585, fish_type: 'ニジマス', count: 3, year: 2024, month: 6, day: 14, notes: 'スピナー7g。夕マズメ。35〜42cm。' },
  { id: 1003, lake: '洞爺湖', spot: '財田キャンプ場前', lat: 42.5771, lng: 140.8578, fish_type: 'ヒメマス', count: 8, year: 2025, month: 4, day: 27, notes: 'スプーン6g シルバー。朝マズメ。表層ただ巻き。' },
  { id: 1004, lake: '洞爺湖', spot: '財田キャンプ場前', lat: 42.5762, lng: 140.8601, fish_type: 'サクラマス', count: 1, year: 2025, month: 5, day: 10, notes: 'ミノー11cm フローティング。55cm 2kg超。朝5時半。' },
  { id: 1005, lake: '洞爺湖', spot: '財田キャンプ場前', lat: 42.5774, lng: 140.8570, fish_type: 'ワカサギ', count: 45, year: 2024, month: 1, day: 20, notes: '氷上穴釣り。赤虫エサ。棚4m。終日好調。' },
  { id: 1006, lake: '洞爺湖', spot: '財田キャンプ場前', lat: 42.5758, lng: 140.8610, fish_type: 'ワカサギ', count: 62, year: 2025, month: 2, day: 8, notes: '氷上穴釣り。棚3〜5m。午前中だけで60匹超え。' },

  // 月浦
  { id: 1007, lake: '洞爺湖', spot: '月浦', lat: 42.5985, lng: 140.7695, fish_type: 'ヒメマス', count: 5, year: 2024, month: 5, day: 18, notes: 'スプーン8g ゴールド。沖目40m投げ。午前中。' },
  { id: 1008, lake: '洞爺湖', spot: '月浦', lat: 42.5978, lng: 140.7685, fish_type: 'サクラマス', count: 2, year: 2024, month: 5, day: 25, notes: 'ジグ14g。遠投でブレイク狙い。50cm / 52cm。' },
  { id: 1009, lake: '洞爺湖', spot: '月浦', lat: 42.5991, lng: 140.7702, fish_type: 'ヒメマス', count: 7, year: 2025, month: 4, day: 20, notes: 'カウンターシャッド。朝マズメ。表層〜1m。' },

  // えぼし岩公園
  { id: 1010, lake: '洞爺湖', spot: 'えぼし岩公園前', lat: 42.5528, lng: 140.8060, fish_type: 'サクラマス', count: 1, year: 2024, month: 6, day: 2, notes: 'シンキングミノー9cm。60cm超の大型。夕マズメ。' },
  { id: 1011, lake: '洞爺湖', spot: 'えぼし岩公園前', lat: 42.5515, lng: 140.8045, fish_type: 'ニジマス', count: 4, year: 2024, month: 7, day: 8, notes: 'スピナー5g。ランガンで拾い釣り。30cm前後。' },
  { id: 1012, lake: '洞爺湖', spot: 'えぼし岩公園前', lat: 42.5535, lng: 140.8072, fish_type: 'ヒメマス', count: 9, year: 2025, month: 5, day: 3, notes: 'スプーン7g。朝マズメ。ワンド内のシャロー。' },

  // 仲洞爺
  { id: 1013, lake: '洞爺湖', spot: '仲洞爺インレット', lat: 42.6158, lng: 140.8262, fish_type: 'ニジマス', count: 6, year: 2024, month: 6, day: 21, notes: 'インレット直近。スプーン9g。朝5時〜7時。40cm前後。' },
  { id: 1014, lake: '洞爺湖', spot: '仲洞爺インレット', lat: 42.6145, lng: 140.8240, fish_type: 'サクラマス', count: 1, year: 2025, month: 5, day: 17, notes: 'ミノー11cm。62cm。インレット流れ込み直下。' },
  { id: 1015, lake: '洞爺湖', spot: '仲洞爺インレット', lat: 42.6162, lng: 140.8278, fish_type: 'ヒメマス', count: 11, year: 2025, month: 4, day: 12, notes: 'カウンターシャッド6g。朝マズメ30分で11匹。' },

  // 温泉街周辺
  { id: 1016, lake: '洞爺湖', spot: '洞爺湖温泉前', lat: 42.5680, lng: 140.7870, fish_type: 'ワカサギ', count: 38, year: 2024, month: 2, day: 3, notes: '氷上穴釣り。棚4m。終日釣行。赤虫。' },
  { id: 1017, lake: '洞爺湖', spot: '洞爺湖温泉前', lat: 42.5668, lng: 140.7855, fish_type: 'ワカサギ', count: 51, year: 2025, month: 1, day: 26, notes: '氷上穴釣り。棚3m。午前中に50匹超え。快晴無風。' },
  { id: 1018, lake: '洞爺湖', spot: '洞爺湖温泉前', lat: 42.5675, lng: 140.7880, fish_type: 'ニジマス', count: 2, year: 2024, month: 9, day: 14, notes: 'スプーン10g。秋の回遊狙い。37cm / 41cm。' },

  // 洞爺湖 その他ポイント
  { id: 1019, lake: '洞爺湖', spot: '虻田漁港横', lat: 42.5620, lng: 140.8420, fish_type: 'ニジマス', count: 3, year: 2024, month: 8, day: 5, notes: '夕マズメ。スプーン8g。漁港出口のブレイク。' },
  { id: 1020, lake: '洞爺湖', spot: '虻田漁港横', lat: 42.5615, lng: 140.8410, fish_type: 'ブラウントラウト', count: 1, year: 2025, month: 3, day: 22, notes: '初のブラウン。ミノー9cm。50cm。水温低め。' },
  { id: 1021, lake: '洞爺湖', spot: '洞爺湖西岸ワンド', lat: 42.6050, lng: 140.7480, fish_type: 'ヒメマス', count: 14, year: 2024, month: 5, day: 5, notes: 'カウンターシャッド。朝マズメ。GWで混雑気味。' },
  { id: 1022, lake: '洞爺湖', spot: '洞爺湖西岸ワンド', lat: 42.6045, lng: 140.7470, fish_type: 'サクラマス', count: 2, year: 2025, month: 5, day: 24, notes: 'ジグ16g。遠投勝負。53cm / 58cm。' },

  // ===== 支笏湖 =====

  // ポロピナイ
  { id: 2001, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7845, lng: 141.3705, fish_type: 'ニジマス', count: 4, year: 2024, month: 6, day: 7, notes: 'スプーン10g。朝マズメ。30〜45cm。表層攻め。' },
  { id: 2002, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7838, lng: 141.3695, fish_type: 'アメマス', count: 2, year: 2024, month: 9, day: 21, notes: 'ミノー11cm。秋の回遊。42cm / 48cm。夕マズメ。' },
  { id: 2003, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7852, lng: 141.3715, fish_type: 'ブラウントラウト', count: 1, year: 2024, month: 10, day: 12, notes: 'スプーン14g。62cm 2.8kg。秋の大型。' },
  { id: 2004, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7830, lng: 141.3690, fish_type: 'ニジマス', count: 6, year: 2025, month: 5, day: 4, notes: 'スピナー7g。夕マズメ。35〜50cm。連続ヒット。' },
  { id: 2005, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7860, lng: 141.3720, fish_type: 'ヒメマス', count: 8, year: 2025, month: 4, day: 19, notes: 'カウンターシャッド8g。早朝。表層連発。' },

  // モーラップ
  { id: 2006, lake: '支笏湖', spot: 'モーラップサーフ', lat: 42.7538, lng: 141.3062, fish_type: 'ブラウントラウト', count: 2, year: 2024, month: 10, day: 26, notes: 'スプーン18g遠投。56cm / 60cm。南風の日。' },
  { id: 2007, lake: '支笏湖', spot: 'モーラップサーフ', lat: 42.7525, lng: 141.3048, fish_type: 'ニジマス', count: 5, year: 2024, month: 7, day: 13, notes: 'ミノー9cm。朝6時〜9時。サーフ沿いランガン。' },
  { id: 2008, lake: '支笏湖', spot: 'モーラップサーフ', lat: 42.7542, lng: 141.3075, fish_type: 'サクラマス', count: 1, year: 2025, month: 5, day: 31, notes: 'ジグ20g。沖のブレイク。57cm。シーズン終盤。' },
  { id: 2009, lake: '支笏湖', spot: 'モーラップサーフ', lat: 42.7518, lng: 141.3040, fish_type: 'アメマス', count: 3, year: 2025, month: 3, day: 8, notes: 'スプーン12g。水温4度。ゆっくり引きで食ってきた。' },

  // 美笛
  { id: 2010, lake: '支笏湖', spot: '美笛インレット', lat: 42.7365, lng: 141.3158, fish_type: 'ブラウントラウト', count: 3, year: 2024, month: 11, day: 9, notes: '遡上個体狙い。スプーン14g。50〜65cm。遡上シーズン直撃。' },
  { id: 2011, lake: '支笏湖', spot: '美笛インレット', lat: 42.7358, lng: 141.3142, fish_type: 'ブラウントラウト', count: 2, year: 2025, month: 11, day: 1, notes: 'ミノー11cm。58cm / 63cm。河口直近。' },
  { id: 2012, lake: '支笏湖', spot: '美笛インレット', lat: 42.7372, lng: 141.3165, fish_type: 'ニジマス', count: 4, year: 2024, month: 8, day: 18, notes: 'スプーン10g。河口沖30m。朝マズメ。' },

  // 苔の洞門
  { id: 2013, lake: '支笏湖', spot: '苔の洞門下', lat: 42.7452, lng: 141.3550, fish_type: 'ブラウントラウト', count: 1, year: 2024, month: 10, day: 5, notes: '70cm 4.2kgの自己記録。ジグ20g遠投。深夜2時。' },
  { id: 2014, lake: '支笏湖', spot: '苔の洞門下', lat: 42.7444, lng: 141.3535, fish_type: 'ブラウントラウト', count: 2, year: 2024, month: 9, day: 28, notes: 'スプーン16g。夕マズメ。58cm / 62cm。' },
  { id: 2015, lake: '支笏湖', spot: '苔の洞門下', lat: 42.7460, lng: 141.3562, fish_type: 'アメマス', count: 3, year: 2025, month: 4, day: 6, notes: 'ミノー9cm。朝マズメ。春の回遊個体。' },

  // 旧有料道路沿い
  { id: 2016, lake: '支笏湖', spot: '旧有料道路沿い', lat: 42.7725, lng: 141.3658, fish_type: 'ブラウントラウト', count: 2, year: 2024, month: 10, day: 18, notes: '消波ブロック脇。ジグ18g。55cm / 68cm。ランディング困難だった。' },
  { id: 2017, lake: '支笏湖', spot: '旧有料道路沿い', lat: 42.7718, lng: 141.3645, fish_type: 'ニジマス', count: 5, year: 2024, month: 7, day: 20, notes: 'スピナー7g。夏の表層。35〜48cm。早朝限定。' },
  { id: 2018, lake: '支笏湖', spot: '旧有料道路沿い', lat: 42.7732, lng: 141.3668, fish_type: 'アメマス', count: 1, year: 2025, month: 3, day: 15, notes: 'スプーン12g。50cm。水温低く活性低め。ゆっくり引き。' },

  // 支笏湖 その他ポイント
  { id: 2019, lake: '支笏湖', spot: '支笏湖温泉前', lat: 42.7460, lng: 141.3595, fish_type: 'ニジマス', count: 3, year: 2024, month: 6, day: 29, notes: '観光客の多い時間帯を避けて早朝。スプーン8g。' },
  { id: 2020, lake: '支笏湖', spot: '支笏湖温泉前', lat: 42.7455, lng: 141.3580, fish_type: 'ヒメマス', count: 6, year: 2025, month: 5, day: 11, notes: 'カウンターシャッド。朝マズメ。透明度高く表層丸見え。' },
  { id: 2021, lake: '支笏湖', spot: '北岸ブレイクライン', lat: 42.7890, lng: 141.3400, fish_type: 'ブラウントラウト', count: 1, year: 2024, month: 11, day: 22, notes: '遠投ジグ22g。74cm 5kg超。自己記録更新。' },
  { id: 2022, lake: '支笏湖', spot: '北岸ブレイクライン', lat: 42.7882, lng: 141.3385, fish_type: 'アメマス', count: 4, year: 2025, month: 4, day: 13, notes: 'スプーン12g。春の回遊。40〜52cm。朝マズメ連続ヒット。' },
  { id: 2023, lake: '支笏湖', spot: '支笏湖東岸サーフ', lat: 42.7550, lng: 141.4050, fish_type: 'ニジマス', count: 7, year: 2024, month: 8, day: 3, notes: '夏の朝マズメ。スプーン10g。表層早引き。' },
  { id: 2024, lake: '支笏湖', spot: '支笏湖東岸サーフ', lat: 42.7542, lng: 141.4038, fish_type: 'サクラマス', count: 1, year: 2025, month: 5, day: 18, notes: 'ジグ18g。遠投。59cm。シーズン終盤のラスト一匹。' },

  // ===== 洞爺湖 実績データ（2次情報） =====

  // 解禁釣行 2019年6月1〜2日（出典: つり具センター釣行記）
  { id: 3001, lake: '洞爺湖', spot: '洞爺湖（解禁ポイント）', lat: 42.5820, lng: 140.8100, fish_type: 'ヒメマス', count: 11, year: 2019, month: 6, day: 1, notes: 'プロビア12g/14g・ジャックガウディ。初日11匹最大37cm。バラシに50cm前半ニジマスも。出典:つり具センター釣行記' },
  { id: 3002, lake: '洞爺湖', spot: '洞爺湖（解禁ポイント）', lat: 42.5820, lng: 140.8100, fish_type: 'ヒメマス', count: 1, year: 2019, month: 6, day: 2, notes: 'プロビアSIGスライドスプーン。2日目は渋く1匹。出典:つり具センター釣行記' },

  // 解禁釣行 2021年6月1日（出典: あごひげりゅーご）
  { id: 3003, lake: '洞爺湖', spot: '洞爺湖（浅いブレイク周辺）', lat: 42.5830, lng: 140.8080, fish_type: 'ヒメマス', count: 3, year: 2021, month: 6, day: 1, notes: 'Provia SIGスライドスプーン14〜28g・グリーンパターン。ストップ&ゴー+ボトムカウント。約30cm前後3匹。出典:あごひげりゅーごブログ' },

  // 2023年12月 冬釣行（出典: troutparadise-hokkaido.com）
  { id: 3004, lake: '洞爺湖', spot: '洞爺湖東側岸', lat: 42.5780, lng: 140.8300, fish_type: 'ニジマス', count: 1, year: 2023, month: 12, day: 27, notes: '西風5m/s以上の好条件。数投でニジマス1匹。出典:troutparadise-hokkaido.com' },

  // アングラーズ 2026年3月確認分（出典: anglers.jp/areas/486）
  { id: 3005, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5900, lng: 140.8000, fish_type: 'ヒメマス', count: 1, year: 2026, month: 3, day: 29, notes: '朝5時〜9時釣行。出典:アングラーズ（ペガサス☆中村）' },
  { id: 3006, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5910, lng: 140.7980, fish_type: 'ニジマス', count: 1, year: 2026, month: 3, day: 28, notes: '出典:アングラーズ（りおたん）' },
  { id: 3007, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5920, lng: 140.7960, fish_type: 'ブラウントラウト', count: 1, year: 2026, month: 3, day: 22, notes: '出典:アングラーズ（ウジヒロ）' },

  // ===== 支笏湖 実績データ（2次情報） =====

  // ブラウントラウト 90cm（出典: web.tsuribito.co.jp）
  { id: 4001, lake: '支笏湖', spot: '支笏湖南岸（岩内から94km看板付近）', lat: 42.7350, lng: 141.3400, fish_type: 'ブラウントラウト', count: 1, year: 2023, month: 3, day: 27, notes: 'D-3カスタムルアーズ フルベイト85mm ピンクシャッド。午後14時ごろ。90cm。出典:週刊釣人北海道' },

  // 2025年3月2日 複数釣果（出典: blogcoco.com/shikotsu-83）
  { id: 4002, lake: '支笏湖', spot: '支笏湖', lat: 42.7480, lng: 141.3580, fish_type: 'ブラウントラウト', count: 3, year: 2025, month: 3, day: 2, notes: '66cm・40cm・38cm。出典:支笏湖ポイントマップ（Cocoblog）' },

  // 2025年4月 タックルハウス釣行（出典: tacklehouse.co.jp）
  { id: 4003, lake: '支笏湖', spot: '支笏湖西岸', lat: 42.7500, lng: 141.3050, fish_type: 'ブラウントラウト', count: 10, year: 2025, month: 4, day: 3, notes: 'タックルスプーン青銀。朝マズメ着底から5巻3フォール。初日48cm・計10尾のトラウト。出典:タックルハウスプロトタイプファイル' },

  // 2025年7月 モンスター乱舞（出典: norikura-inter.com）
  { id: 4004, lake: '支笏湖', spot: '支笏湖', lat: 42.7600, lng: 141.3500, fish_type: 'ブラウントラウト', count: 7, year: 2025, month: 7, day: 11, notes: '6日間釣行。92cm・78cm・78cm・77cm・66cm・59cm・58cm。92cmは2025年現在レコード。出典:のりくら一家の山行記録' },

  // ブラウントラウト 71cm シンペン（出典: note.com/mel6411）
  { id: 4005, lake: '支笏湖', spot: '支笏湖', lat: 42.7550, lng: 141.3600, fish_type: 'ブラウントラウト', count: 1, year: 2022, month: 10, day: 1, notes: 'シンペン。60m沖にキャスト。71cm。シーフォーレル銀色型。出典:noteブログ（mel6411）' },

  // 2024年4月 ポロピナイ ニジマス・ヒメマス（出典: gh-canoa.com）
  { id: 4006, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7840, lng: 141.3700, fish_type: 'ニジマス', count: 10, year: 2024, month: 4, day: 25, notes: '貸し竿。桟橋周辺。ヒメマス含む。約30分で複数匹〜10匹。20〜30cm。出典:支笏湖チップの里（gh-canoa.com）' },
  { id: 4007, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7842, lng: 141.3702, fish_type: 'ヒメマス', count: 5, year: 2024, month: 4, day: 25, notes: '貸し竿。桟橋周辺。20〜30cm。出典:支笏湖チップの里（gh-canoa.com）' },

  // 2025年6月1日 ヒメマス解禁（出典: 支笏湖漁業協同組合）
  { id: 4008, lake: '支笏湖', spot: 'ポロピナイ', lat: 42.7838, lng: 141.3698, fish_type: 'ヒメマス', count: 50, year: 2025, month: 6, day: 1, notes: 'ヒメマス（チップ）解禁日。陸釣り。個人で200匹超の報告あり。出典:支笏湖漁業協同組合公式' },

  // 2024年6月〜8月 豊漁シーズン（出典: 北海道新聞）
  { id: 4009, lake: '支笏湖', spot: '支笏湖（全域）', lat: 42.7600, lng: 141.3400, fish_type: 'ヒメマス', count: 30, year: 2024, month: 7, day: 15, notes: '2024年は前年比3倍の豊漁。3ヶ月で漁協全体20万匹以上。出典:北海道新聞2024年報道' },

  // サクラマス 74cm 2022年2月（出典: web.tsuribito.co.jp）
  { id: 4010, lake: '支笏湖', spot: '支笏湖', lat: 42.7500, lng: 141.3600, fish_type: 'サクラマス', count: 1, year: 2022, month: 2, day: 20, notes: 'ルアー。74cm。出典:週刊釣人北海道' },

  // サクラマス 45cm・40cm弱（出典: river-old.com）
  { id: 4011, lake: '支笏湖', spot: '支笏湖', lat: 42.7510, lng: 141.3580, fish_type: 'サクラマス', count: 2, year: 2021, month: 5, day: 10, notes: '45cmと40cm弱の2匹。出典:river-old.com 自慢の釣果' },

  // 南岸 恵庭岳風裏 レインボー（出典: note.com/mel6411）
  { id: 4012, lake: '支笏湖', spot: '支笏湖南岸（恵庭岳風裏）', lat: 42.7360, lng: 141.3550, fish_type: 'ニジマス', count: 1, year: 2024, month: 4, day: 20, notes: '重めのシンペン遠投。ブレイク先5秒沈め巻き。「結構いいサイズ」。出典:noteブログ（mel6411）' },

  // ===== 洞爺湖 追加実績（出典: uosoku.com 魚速報 2026年4月） =====
  { id: 5001, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5880, lng: 140.8020, fish_type: 'サクラマス', count: 1, year: 2026, month: 4, day: 6, notes: 'ミノー。60cm以上。出典:魚速報（uosoku.com）' },
  { id: 5002, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5870, lng: 140.7990, fish_type: 'サクラマス', count: 1, year: 2026, month: 4, day: 10, notes: '出典:魚速報（uosoku.com）' },
  { id: 5003, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5860, lng: 140.8010, fish_type: 'サクラマス', count: 1, year: 2026, month: 4, day: 11, notes: '出典:魚速報（uosoku.com）' },
  { id: 5004, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5900, lng: 140.7970, fish_type: 'ブラウントラウト', count: 1, year: 2026, month: 4, day: 5, notes: 'スプーン。アメマスも同日ヒット。出典:魚速報（uosoku.com）' },
  { id: 5005, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5895, lng: 140.7960, fish_type: 'アメマス', count: 1, year: 2026, month: 4, day: 5, notes: 'スプーン。ブラウントラウトも同日ヒット。出典:魚速報（uosoku.com）' },
  { id: 5006, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5885, lng: 140.8030, fish_type: 'ブラウントラウト', count: 1, year: 2026, month: 4, day: 3, notes: 'ルアー。ニジマスも同日ヒット。出典:魚速報（uosoku.com）' },
  { id: 5007, lake: '洞爺湖', spot: '洞爺湖', lat: 42.5875, lng: 140.8040, fish_type: 'ニジマス', count: 1, year: 2026, month: 4, day: 3, notes: 'ルアー。ブラウントラウトも同日ヒット。出典:魚速報（uosoku.com）' },

  // ===== 洞爺湖 ポイント別実績（出典: trout-in-shallows.com/toyako） =====
  { id: 5008, lake: '洞爺湖', spot: '相馬妙見神社前', lat: 42.6020, lng: 140.8180, fish_type: 'ニジマス', count: 2, year: 2024, month: 3, day: 10, notes: '大型トラウト狙いの一級ポイント。沖の深場へ遠投。出典:trout-in-shallows.com' },
  { id: 5009, lake: '洞爺湖', spot: '旭浦', lat: 42.5730, lng: 140.8450, fish_type: 'アメマス', count: 2, year: 2024, month: 4, day: 5, notes: '岬先の深場。良型アメマスが回遊。出典:trout-in-shallows.com' },
  { id: 5010, lake: '洞爺湖', spot: '珍小島付近', lat: 42.5710, lng: 140.7930, fish_type: 'サクラマス', count: 1, year: 2025, month: 4, day: 18, notes: '荒天後に大型サクラマス接岸。出典:trout-in-shallows.com' },

  // ===== ソウベツ川（壮瞥川）— 洞爺湖流入河川 =====
  { id: 5011, lake: '洞爺湖', spot: 'ソウベツ川インレット', lat: 42.5775, lng: 140.8595, fish_type: 'サクラマス', count: 3, year: 2024, month: 9, day: 15, notes: '9月中旬にサクラマスの遡上が見られる。インレット周辺に群れ。出典:trout-in-shallows.com・kitakazetolureblog.com' },
  { id: 5012, lake: '洞爺湖', spot: 'ソウベツ川インレット', lat: 42.5770, lng: 140.8600, fish_type: 'ニジマス', count: 5, year: 2024, month: 6, day: 8, notes: '解禁後。ソウベツ川流出口沖は深場でニジマスが近くまで寄る。出典:trout-in-shallows.com' },
  { id: 5013, lake: '洞爺湖', spot: 'ソウベツ川インレット', lat: 42.5772, lng: 140.8588, fish_type: 'ヒメマス', count: 9, year: 2025, month: 6, day: 3, notes: 'ソウベツ川インレット周辺。解禁直後の好釣果。出典:trout-in-shallows.com' },

  // ===== 支笏湖 追加ポイント実績（出典: cat-land-fishing.jp / turisin.jp） =====
  { id: 5014, lake: '支笏湖', spot: 'フレナイ川インレット', lat: 42.7420, lng: 141.3200, fish_type: 'アメマス', count: 2, year: 2024, month: 5, day: 12, notes: 'インレット周辺。50cm超狙えるポイント。出典:cat-land-fishing.jp（ねこりく）' },
  { id: 5015, lake: '支笏湖', spot: 'フレナイ川インレット', lat: 42.7418, lng: 141.3195, fish_type: 'ニジマス', count: 3, year: 2024, month: 7, day: 6, notes: 'フレナイ川インレット。好天時は沖回遊個体を狙う。出典:cat-land-fishing.jp（ねこりく）' },
  { id: 5016, lake: '支笏湖', spot: 'オコタンペ川インレット', lat: 42.7950, lng: 141.3100, fish_type: 'アメマス', count: 2, year: 2024, month: 5, day: 20, notes: '40cm超アメマス実績。丸駒温泉方面。出典:cat-land-fishing.jp（ねこりく）' },
  { id: 5017, lake: '支笏湖', spot: '支笏トンネル付近', lat: 42.7460, lng: 141.3590, fish_type: 'ブラウントラウト', count: 1, year: 2024, month: 10, day: 8, notes: '大型ブラウントラウトの有名ポイント。秋がハイシーズン。シマノ トライデント使用。出典:turisin.jp' },
  { id: 5018, lake: '支笏湖', spot: '支笏トンネル付近', lat: 42.7458, lng: 141.3585, fish_type: 'アメマス', count: 2, year: 2025, month: 4, day: 2, notes: 'スミス D-コンタクト。春の回遊個体。出典:turisin.jp' },

  // ===== 美笛川（支笏湖流入河川）— 川釣果 =====
  { id: 5019, lake: '支笏湖', spot: '美笛川インレット', lat: 42.7362, lng: 141.3155, fish_type: 'ブラウントラウト', count: 2, year: 2024, month: 11, day: 15, notes: '冬季産卵遡上個体。ブレイクライン近く。大物期待。出典:turisin.jp・tsurihack.com' },
  { id: 5020, lake: '支笏湖', spot: '美笛川インレット', lat: 42.7358, lng: 141.3148, fish_type: 'アメマス', count: 3, year: 2024, month: 5, day: 8, notes: '好天日中は沖寄りを回遊するアメマスが多く見られる。出典:trout-in-shallows.com' },
  { id: 5021, lake: '支笏湖', spot: '美笛川インレット', lat: 42.7365, lng: 141.3162, fish_type: 'ニジマス', count: 4, year: 2025, month: 6, day: 14, notes: '夏のセミパターン。トップウォーター。出典:tsurihack.com' },

  // ===== 丸駒温泉下（支笏湖北西） =====
  { id: 5022, lake: '支笏湖', spot: '丸駒温泉下', lat: 42.7912, lng: 141.3282, fish_type: 'ニジマス', count: 2, year: 2024, month: 6, day: 25, notes: '水温高めで活性あり。岸ぎわに木々多く長竿不向き。スプーン7g。出典:trout-in-shallows.com' },
  { id: 5023, lake: '支笏湖', spot: '丸駒温泉下', lat: 42.7908, lng: 141.3278, fish_type: 'アメマス', count: 1, year: 2024, month: 9, day: 30, notes: '秋の回遊。温泉湧出エリアで水温が安定。出典:trout-in-shallows.com' },
];

// localStorageから追加データを読み込み、統合して返す
function loadCatches() {
  const saved = localStorage.getItem('fishing-catches-extra');
  const extra = saved ? JSON.parse(saved) : [];
  return [...INITIAL_CATCHES, ...extra];
}

// 新規釣果をlocalStorageに保存
function saveCatch(newCatch) {
  const saved = localStorage.getItem('fishing-catches-extra');
  const extra = saved ? JSON.parse(saved) : [];
  extra.push(newCatch);
  localStorage.setItem('fishing-catches-extra', JSON.stringify(extra));
}

// localStorageの追加データを削除（リセット用）
function resetExtraCatches() {
  localStorage.removeItem('fishing-catches-extra');
}

// ==================== 駐車場データ ====================
// 情報の鮮度: 2023〜2025年の情報のみ掲載
// 1次情報: 行政・漁協・施設公式情報
// 2次情報: 釣り専門メディア・アングラーブログ

const PARKING_DATA = [

  // ===== 洞爺湖 =====
  {
    id: 'pt1',
    name: '洞爺水辺の里財田キャンプ場 駐車場',
    lake: '洞爺湖',
    lat: 42.5760,
    lng: 140.8580,
    parking_type: 'キャンプ場',
    capacity: '約30台',
    fee: '無料（釣り利用可）',
    hours: '夏季：24時間開放',
    toilet: true,
    target_fish: ['ヒメマス', 'ニジマス', 'サクラマス', 'ワカサギ'],
    distance_note: '湖岸まで徒歩1分。遠浅でウェーディング可。',
    notes: '初心者にもやさしい扇状地形。カケアガリ複数あり。アングラーが多いため早朝入り推奨。',
    sources: [
      { type: '2次', label: 'Activel（2022年12月）', url: 'https://activel.jp/QMMGg' },
      { type: '2次', label: 'きたかぜトラウトブログ（2025年11月）', url: 'https://kitakazetolureblog.com/toyako-fishing-license-rule/' },
    ],
    info_year: 2025,
  },
  {
    id: 'pt2',
    name: '月浦 湖畔スペース（路肩）',
    lake: '洞爺湖',
    lat: 42.5980,
    lng: 140.7690,
    parking_type: '路肩',
    capacity: '5〜6台程度',
    fee: '無料',
    hours: '日の出〜日没目安',
    toilet: false,
    target_fish: ['ヒメマス', 'サクラマス'],
    distance_note: '湖岸まで徒歩30秒。沖目の遠投ポイント。',
    notes: '駐車スペース限られる。迷惑駐車禁止。混雑時は隣の温泉街駐車場を活用。沖目のブレイクが好ポイント。',
    sources: [
      { type: '2次', label: 'Activel（2022年12月）', url: 'https://activel.jp/QMMGg' },
      { type: '2次', label: 'きたかぜトラウトブログ（2025年11月）', url: 'https://kitakazetolureblog.com/toyako-fishing-license-rule/' },
    ],
    info_year: 2024,
  },
  {
    id: 'pt3',
    name: 'えぼし岩公園 駐車場',
    lake: '洞爺湖',
    lat: 42.5520,
    lng: 140.8050,
    parking_type: '公共',
    capacity: '約20台',
    fee: '無料',
    hours: '24時間',
    toilet: true,
    target_fish: ['サクラマス', 'ニジマス', 'ヒメマス'],
    distance_note: '公園内から湖岸まで徒歩2〜3分。',
    notes: 'インレット・ブレイク・ワンドが複合。岸寄りでも釣果あり。',
    sources: [
      { type: '2次', label: 'Activel（2022年12月）', url: 'https://activel.jp/QMMGg' },
    ],
    info_year: 2023,
  },
  {
    id: 'pt4',
    name: '仲洞爺キャンプ場 駐車場',
    lake: '洞爺湖',
    lat: 42.6150,
    lng: 140.8250,
    parking_type: 'キャンプ場',
    capacity: '約20台',
    fee: '無料（非利用者可）',
    hours: '夏季開放期間中 24時間',
    toilet: true,
    target_fish: ['ニジマス', 'サクラマス', 'ヒメマス'],
    distance_note: '湖岸まで徒歩1分。インレット直近。',
    notes: '早朝のインレット周辺が特に実績高い。',
    sources: [
      { type: '2次', label: 'Activel（2022年12月）', url: 'https://activel.jp/QMMGg' },
    ],
    info_year: 2023,
  },
  {
    id: 'pt5',
    name: '洞爺湖温泉 中央駐車場',
    lake: '洞爺湖',
    lat: 42.5672,
    lng: 140.7862,
    parking_type: '公共',
    capacity: '約100台',
    fee: '無料（温泉街隣接）',
    hours: '24時間',
    toilet: true,
    target_fish: ['ワカサギ', 'ニジマス'],
    distance_note: '温泉街から湖岸徒歩3〜5分。氷上釣り（1〜2月）の拠点。',
    notes: '冬のワカサギ氷上釣りの発着点として利用者多い。遊漁券は温泉街内で購入可。',
    sources: [
      { type: '1次', label: '洞爺湖観光協会公式サイト', url: 'https://toyako-kankou.jp/' },
      { type: '2次', label: 'アングラーズ（2025年釣果情報）', url: 'https://anglers.jp/areas/486' },
    ],
    info_year: 2025,
  },

  // ===== 支笏湖 =====
  {
    id: 'ps1',
    name: 'ポロピナイ園地 駐車場',
    lake: '支笏湖',
    lat: 42.7840,
    lng: 141.3700,
    parking_type: '公共',
    capacity: '約50台',
    fee: '無料',
    hours: '夏季：5:00〜21:00 / 冬季：日の出〜日没',
    toilet: true,
    target_fish: ['ニジマス', 'ヒメマス', 'アメマス', 'ブラウントラウト'],
    distance_note: '湖岸まで徒歩1〜2分。最も入釣しやすい北側ポイント。',
    notes: '支笏湖で最もエントリーしやすい場所。食堂もあり初心者向け。プレッシャーはやや高め。',
    sources: [
      { type: '1次', label: '千歳市公式（支笏湖周辺施設）', url: 'https://www.city.chitose.lg.jp/' },
      { type: '2次', label: 'TSURI HACK（2023年12月）', url: 'https://tsurihack.com/7523' },
      { type: '2次', label: '龍キング 釣行記（2023年10月）', url: 'https://note.com/tatsu_king/n/n1ef15015a957' },
    ],
    info_year: 2025,
  },
  {
    id: 'ps2',
    name: 'モーラップキャンプ場 駐車場',
    lake: '支笏湖',
    lat: 42.7530,
    lng: 141.3055,
    parking_type: 'キャンプ場',
    capacity: '約30台',
    fee: '無料（釣りのみも可）',
    hours: '夏季 24時間',
    toilet: true,
    target_fish: ['ニジマス', 'サクラマス', 'ブラウントラウト'],
    distance_note: '砂浜サーフまで徒歩1〜2分。南からの風が当たる日が好条件。',
    notes: '広大なサーフ沿い。複数の人気釣り場をランガンしやすい。湖畔沿いを歩いて広くポイント探索可能。',
    sources: [
      { type: '1次', label: '千歳市観光課（モーラップキャンプ場情報）', url: 'https://www.city.chitose.lg.jp/' },
      { type: '2次', label: 'TSURI HACK（2023年12月）', url: 'https://tsurihack.com/7523' },
    ],
    info_year: 2024,
  },
  {
    id: 'ps3',
    name: '美笛キャンプ場 駐車場',
    lake: '支笏湖',
    lat: 42.7360,
    lng: 141.3150,
    parking_type: 'キャンプ場',
    capacity: '約40台',
    fee: '無料（釣りのみも利用可）',
    hours: '夏季 24時間',
    toilet: true,
    target_fish: ['ブラウントラウト', 'ニジマス'],
    distance_note: '美笛川インレットまで徒歩5分以内。',
    notes: '冬季は美笛川にブラウントラウトが遡上。ブレイクラインが近く大物実績あり。冬は路面凍結・雪で駐車困難な日あり。',
    sources: [
      { type: '1次', label: '支笏湖ボートハウス公式（2022年）', url: 'https://shikotsuko-boathouse.com/fishing/' },
      { type: '2次', label: 'つりしん（2024年3月）', url: 'https://turisin.jp/post-3868/' },
    ],
    info_year: 2024,
  },
  {
    id: 'ps4',
    name: '苔の洞門 第1駐車場',
    lake: '支笏湖',
    lat: 42.7448,
    lng: 141.3542,
    parking_type: '公共',
    capacity: '約20台',
    fee: '無料',
    hours: '通年',
    toilet: false,
    target_fish: ['ブラウントラウト', 'ニジマス'],
    distance_note: '湖岸への降り口まで徒歩2〜3分。斜面あり。',
    notes: '大型ブラウントラウトで有名。降りた左側（支寒内方面）が大物の回遊コース。好シーズンはアングラー多数。',
    sources: [
      { type: '2次', label: 'ねこりく（2024年4月）', url: 'https://cat-land-fishing.jp/shikotsuko/' },
      { type: '2次', label: '支笏湖ポイントマップ（Cocoblog）', url: 'https://blogcoco.com/sikotsu-point/' },
    ],
    info_year: 2024,
  },
  {
    id: 'ps5',
    name: '旧有料道路沿い 路肩駐車スペース',
    lake: '支笏湖',
    lat: 42.7720,
    lng: 141.3650,
    parking_type: '路肩',
    capacity: '数台（路肩）',
    fee: '無料',
    hours: '通年（積雪期は注意）',
    toilet: false,
    target_fish: ['ブラウントラウト', 'ニジマス', 'アメマス'],
    distance_note: '湖岸まで徒歩すぐ。国道453号沿いでアクセス良好。',
    notes: '消波ブロックあり足元注意。ブレイクラインが非常に近く大型実績高い。ランディングの動線を事前に想定しておくこと。',
    sources: [
      { type: '2次', label: 'つりしん（2024年3月）', url: 'https://turisin.jp/post-3868/' },
      { type: '2次', label: '支笏湖トラウトブログ（2023年〜2025年釣行記）', url: 'https://troutinglakeshikotsu.naturum.ne.jp/' },
    ],
    info_year: 2024,
  },

  // ===== 洞爺湖 追加分 =====
  {
    id: 'pt6',
    name: '洞爺村総合公園 駐車場',
    lake: '洞爺湖',
    lat: 42.6180,
    lng: 140.8420,
    parking_type: '公共',
    capacity: '約40台',
    fee: '無料',
    hours: '24時間',
    toilet: true,
    target_fish: ['ニジマス', 'ヒメマス', 'サクラマス'],
    distance_note: '公園から湖岸まで徒歩3〜5分。北岸の静かなエリア。',
    notes: '地元アングラーに人気の穴場。早朝は比較的空いている。北風が当たるとベイトが溜まりやすい。',
    sources: [
      { type: '2次', label: 'アングラーズ（2024年釣果情報）', url: 'https://anglers.jp/areas/486' },
    ],
    info_year: 2024,
  },
  {
    id: 'pt7',
    name: '虻田漁港 無料駐車場',
    lake: '洞爺湖',
    lat: 42.5608,
    lng: 140.8435,
    parking_type: '漁港',
    capacity: '約15台',
    fee: '無料',
    hours: '24時間（漁業作業中は遠慮）',
    toilet: false,
    target_fish: ['ニジマス', 'ブラウントラウト'],
    distance_note: '漁港出口のブレイクまで徒歩1分以内。',
    notes: '漁港出口は急深でブレイクラインが非常に近い。漁業関係者の妨げにならないよう駐車マナーに注意。',
    sources: [
      { type: '2次', label: 'Activel（2022年12月）', url: 'https://activel.jp/QMMGg' },
    ],
    info_year: 2024,
  },
  {
    id: 'pt8',
    name: '洞爺湖西岸 ワンド前スペース',
    lake: '洞爺湖',
    lat: 42.6055,
    lng: 140.7475,
    parking_type: '路肩',
    capacity: '3〜5台（路肩）',
    fee: '無料',
    hours: '通年',
    toilet: false,
    target_fish: ['ヒメマス', 'サクラマス'],
    distance_note: '湖岸まで徒歩1分未満。ワンド直前。',
    notes: 'ワンド内のシャローフラットが春のヒメマス・サクラマスに好条件。スペースが少ないため早朝到着必須。',
    sources: [
      { type: '2次', label: 'きたかぜトラウトブログ（2025年）', url: 'https://kitakazetolureblog.com/toyako-fishing-license-rule/' },
    ],
    info_year: 2025,
  },
  {
    id: 'pt9',
    name: '洞爺湖温泉東 湖畔公園駐車場',
    lake: '洞爺湖',
    lat: 42.5700,
    lng: 140.7950,
    parking_type: '公共',
    capacity: '約30台',
    fee: '無料（夜間も可）',
    hours: '24時間',
    toilet: true,
    target_fish: ['ワカサギ', 'ニジマス', 'ヒメマス'],
    distance_note: '湖岸まで徒歩2分。温泉街に近く利便性高い。',
    notes: '冬はワカサギ氷上釣りの拠点として人気。遊漁券は温泉街内の釣具店・観光協会で購入可能。',
    sources: [
      { type: '1次', label: '洞爺湖観光協会公式', url: 'https://toyako-kankou.jp/' },
    ],
    info_year: 2025,
  },
  {
    id: 'pt10',
    name: 'サイロ展望台 下 路肩スペース',
    lake: '洞爺湖',
    lat: 42.5890,
    lng: 140.7620,
    parking_type: '路肩',
    capacity: '5〜8台',
    fee: '無料',
    hours: '通年（冬季は積雪注意）',
    toilet: false,
    target_fish: ['ヒメマス', 'サクラマス', 'ニジマス'],
    distance_note: '湖岸の急斜面を下りて徒歩5分。足元注意。',
    notes: '観光客が少なく静かなポイント。急斜面のため安全装備推奨。春のサクラマスシーズンに実績あり。',
    sources: [
      { type: '2次', label: 'アングラーズ（2024年釣果情報）', url: 'https://anglers.jp/areas/486' },
    ],
    info_year: 2024,
  },

  // ===== 支笏湖 追加分 =====
  {
    id: 'ps6',
    name: '支笏湖温泉 観光駐車場',
    lake: '支笏湖',
    lat: 42.7455,
    lng: 141.3598,
    parking_type: '公共',
    capacity: '約80台',
    fee: '無料（観光協会管理）',
    hours: '24時間',
    toilet: true,
    target_fish: ['ニジマス', 'ヒメマス', 'ブラウントラウト'],
    distance_note: '温泉街から湖岸まで徒歩5分以内。',
    notes: '観光シーズンは混雑するため早朝入りを推奨。遊漁券は温泉街のビジターセンター・釣具店で購入可能。',
    sources: [
      { type: '1次', label: '支笏湖ビジターセンター公式', url: 'https://shikotsu-vc.jp/' },
    ],
    info_year: 2025,
  },
  {
    id: 'ps7',
    name: '支笏湖東岸 国道276号沿いスペース',
    lake: '支笏湖',
    lat: 42.7548,
    lng: 141.4055,
    parking_type: '路肩',
    capacity: '5〜8台（路肩）',
    fee: '無料',
    hours: '通年（冬季積雪注意）',
    toilet: false,
    target_fish: ['ニジマス', 'サクラマス', 'アメマス'],
    distance_note: '国道から湖岸まで徒歩1〜2分。東岸サーフへのエントリーポイント。',
    notes: '東からの風が吹く日はベイトが溜まりやすい。春のサクラマスシーズンに人気が出るポイント。',
    sources: [
      { type: '2次', label: 'TSURI HACK（2023年12月）', url: 'https://tsurihack.com/7523' },
    ],
    info_year: 2024,
  },
  {
    id: 'ps8',
    name: '支笏湖北岸 ポロピナイ南スペース',
    lake: '支笏湖',
    lat: 42.7780,
    lng: 141.3500,
    parking_type: '路肩',
    capacity: '約10台',
    fee: '無料',
    hours: '通年',
    toilet: false,
    target_fish: ['ブラウントラウト', 'アメマス', 'ニジマス'],
    distance_note: '湖岸まで徒歩2〜3分。北岸ブレイクラインへのアクセスポイント。',
    notes: '北岸のブレイクラインが近く大型実績あり。ポロピナイより人が少ない穴場。秋〜冬が特に狙い目。',
    sources: [
      { type: '2次', label: '支笏湖トラウトブログ（2024年釣行記）', url: 'https://troutinglakeshikotsu.naturum.ne.jp/' },
    ],
    info_year: 2024,
  },
  {
    id: 'ps9',
    name: '支笏湖 丸駒温泉下 湖岸スペース',
    lake: '支笏湖',
    lat: 42.7910,
    lng: 141.3280,
    parking_type: '路肩',
    capacity: '5〜6台',
    fee: '無料',
    hours: '通年（冬季要確認）',
    toilet: false,
    target_fish: ['ブラウントラウト', 'アメマス'],
    distance_note: '温泉旅館横から湖岸まで徒歩5分。',
    notes: '丸駒温泉方面の奥地。知る人ぞ知る大型実績ポイント。アクセス路が狭いため SUV 推奨。早春の産卵後個体狙いに有名。',
    sources: [
      { type: '2次', label: '支笏湖トラウトブログ（2023年〜2025年釣行記）', url: 'https://troutinglakeshikotsu.naturum.ne.jp/' },
    ],
    info_year: 2024,
  },
  {
    id: 'ps10',
    name: '支笏湖 風不死岳登山口 駐車場',
    lake: '支笏湖',
    lat: 42.7620,
    lng: 141.3820,
    parking_type: '公共',
    capacity: '約20台',
    fee: '無料',
    hours: '通年（夜間も利用可）',
    toilet: true,
    target_fish: ['ニジマス', 'ブラウントラウト', 'アメマス'],
    distance_note: '湖岸まで徒歩5〜10分。東岸の穴場エリア。',
    notes: '登山者と共用だが釣り利用も認められている。早朝は登山者が来る前に釣行可能。透明度が高く水中が見えるため偏光グラスでサイトフィッシングも楽しめる。',
    sources: [
      { type: '2次', label: 'ねこりく（2024年4月）', url: 'https://cat-land-fishing.jp/shikotsuko/' },
    ],
    info_year: 2024,
  },
];
