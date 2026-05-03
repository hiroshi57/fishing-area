/* ========== リセット・基本 ========== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sidebar-w: 300px;
  --accent: #1a6bcc;
  --bg: #0d1b2a;
  --panel-bg: #112240;
  --panel-border: rgba(255,255,255,0.08);
  --text: #e8eaf0;
  --text-muted: #8892a4;
  --radius: 10px;
  --shadow: 0 4px 20px rgba(0,0,0,0.5);
}

body {
  font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
  background: var(--bg);
  color: var(--text);
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ========== サイドバー ========== */
#sidebar {
  width: var(--sidebar-w);
  background: var(--panel-bg);
  border-right: 1px solid var(--panel-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 10;
  flex-shrink: 0;
}

#sidebar::-webkit-scrollbar { width: 4px; }
#sidebar::-webkit-scrollbar-track { background: transparent; }
#sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

.sidebar-header {
  padding: 20px 16px 14px;
  border-bottom: 1px solid var(--panel-border);
}

.sidebar-header h1 {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
}

.sidebar-header p {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* ========== 統計カード ========== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 12px 8px;
}

.stat-card {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 8px 6px;
  text-align: center;
  border: 1px solid var(--panel-border);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #4dd0e1;
  line-height: 1;
}

.stat-label {
  font-size: 0.62rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* ========== 湖ボタン ========== */
.lake-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--panel-border);
}

.btn-lake {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.15);
  color: var(--text);
  border-radius: 8px;
  padding: 8px 6px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.btn-lake:hover {
  background: rgba(26,107,204,0.3);
  border-color: var(--accent);
  color: #fff;
}

/* ========== フィルターセクション ========== */
.filter-section {
  padding: 10px 12px;
  border-bottom: 1px solid var(--panel-border);
}

.filter-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  cursor: pointer;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 3px 9px;
  transition: all 0.2s;
  user-select: none;
}

.filter-chip:hover {
  border-color: var(--chip-color, #fff);
  color: #fff;
}

.filter-chip input { display: none; }

.filter-chip:has(input:checked) {
  background: var(--chip-color, var(--accent));
  border-color: var(--chip-color, var(--accent));
  color: #fff;
  font-weight: 600;
}

.btn-reset-filter {
  margin-top: 8px;
  font-size: 0.68rem;
  color: var(--text-muted);
  background: none;
  border: 1px dashed var(--panel-border);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset-filter:hover { color: var(--text); border-color: rgba(255,255,255,0.3); }

/* ========== 凡例 ========== */
.legend-section {
  padding: 10px 12px;
  border-bottom: 1px solid var(--panel-border);
}

.legend-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

#month-legend {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  color: var(--text-muted);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* ========== 釣果追加ボタン ========== */
.add-section {
  padding: 12px;
  margin-top: auto;
}

.btn-add-catch {
  width: 100%;
  background: linear-gradient(135deg, #1a6bcc, #0d47a1);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}

.btn-add-catch:hover {
  background: linear-gradient(135deg, #2979ff, #1565C0);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(26,107,204,0.4);
}

/* ========== マップ ========== */
#map {
  flex: 1;
  height: 100%;
}

/* ========== 魚マーカー ========== */
.fish-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.15s;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
}

.fish-marker:hover { transform: scale(1.15); }

.fish-body {
  font-size: 2rem;
  line-height: 1;
  background: var(--month-color, #1a6bcc);
  border: 3px solid var(--year-color, #fff);
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

.fish-count {
  background: var(--year-color, #fff);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 10px;
  margin-top: 2px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  min-width: 24px;
  text-align: center;
}

.fish-tip {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid var(--month-color, #1a6bcc);
  margin-top: -1px;
}

/* ========== 情報パネル ========== */
#info-panel {
  position: absolute;
  bottom: 24px;
  right: 16px;
  width: 280px;
  background: var(--panel-bg);
  border: 1px solid var(--panel-border);
  border-radius: var(--radius);
  padding: 16px;
  z-index: 50;
  display: none;
  box-shadow: var(--shadow);
  animation: slideUp 0.2s ease;
}

#info-panel.active { display: block; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-left: 8px;
}

.info-fish { font-size: 1rem; font-weight: 700; color: #fff; }

.info-count {
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
}

.info-row {
  display: flex;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  align-items: flex-start;
}

.info-row span:first-child { flex-shrink: 0; }

.btn-close-info {
  display: block;
  margin-top: 12px;
  width: 100%;
  font-size: 0.72rem;
  color: var(--text-muted);
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--panel-border);
  border-radius: 6px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-close-info:hover { background: rgba(255,255,255,0.1); color: var(--text); }

/* ========== 追加モーダル ========== */
#add-modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  align-items: center;
  justify-content: center;
}

#add-modal.active { display: flex; }

.modal-box {
  background: #162032;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  width: 360px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  animation: popIn 0.2s ease;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.modal-box h2 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #fff;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 5px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  color: var(--text);
  padding: 9px 12px;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--accent);
}

.form-group select option { background: #162032; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.coord-group {
  background: rgba(255,255,255,0.04);
  border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
}

.coord-group label {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 8px;
  display: block;
}

.btn-select-pos {
  width: 100%;
  background: rgba(26,107,204,0.2);
  border: 1px solid var(--accent);
  color: #64b5f6;
  border-radius: 7px;
  padding: 8px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-select-pos:hover { background: rgba(26,107,204,0.35); }

#coord-display {
  font-size: 0.72rem;
  color: #4dd0e1;
  margin-top: 6px;
  min-height: 16px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
}

.btn-submit {
  background: linear-gradient(135deg, #1a6bcc, #0d47a1);
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover { background: linear-gradient(135deg, #2979ff, #1565C0); }

.btn-cancel {
  background: rgba(255,255,255,0.06);
  color: var(--text-muted);
  border: 1px solid var(--panel-border);
  border-radius: 9px;
  padding: 10px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover { background: rgba(255,255,255,0.1); color: var(--text); }

/* ========== 位置選択ヒント ========== */
#position-hint {
  display: none;
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  background: #e53935;
  color: #fff;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(229,57,53,0.5);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(229,57,53,0.5); }
  50%       { box-shadow: 0 4px 30px rgba(229,57,53,0.9); }
}

/* ========== 駐車場マーカー ========== */
.parking-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.15s;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
}

.parking-marker:hover { transform: scale(1.1); }

.parking-icon {
  font-size: 1.3rem;
  background: #1a237e;
  border: 2px solid #fff;
  border-radius: 8px;
  width: 38px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  color: #fff;
}

.parking-label {
  background: rgba(26,35,126,0.9);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  margin-top: 2px;
  white-space: nowrap;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 駐車場情報パネル（追加要素） ========== */
.fish-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 8px 0;
}

.fish-tag {
  background: rgba(26,107,204,0.2);
  border: 1px solid rgba(26,107,204,0.4);
  color: #90caf9;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
}

.source-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0;
}

.source-badge {
  display: block;
  font-size: 0.65rem;
  padding: 3px 8px;
  border-radius: 4px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.source-badge:hover { opacity: 0.8; }

.badge-primary {
  background: rgba(0,100,50,0.25);
  border: 1px solid rgba(0,180,80,0.4);
  color: #80cbc4;
}

.badge-secondary {
  background: rgba(50,50,50,0.3);
  border: 1px solid rgba(150,150,150,0.3);
  color: #b0bec5;
}

.info-freshness {
  font-size: 0.65rem;
  color: #607d8b;
  margin-bottom: 8px;
  font-style: italic;
}

/* ========== 駐車場トグル ========== */
.parking-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px 10px;
  background: rgba(26,35,126,0.15);
  border: 1px solid rgba(26,35,126,0.3);
  border-radius: 8px;
}

.parking-toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--text);
  user-select: none;
}

.parking-toggle-label input { display: none; }

.toggle-track {
  width: 32px;
  height: 18px;
  background: rgba(255,255,255,0.15);
  border-radius: 9px;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}

.parking-toggle-label input:checked + .toggle-track {
  background: #1a237e;
}

.toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.parking-toggle-label input:checked + .toggle-track .toggle-thumb {
  transform: translateX(14px);
}

.parking-count {
  font-size: 0.65rem;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  #sidebar { width: 100%; height: auto; max-height: 45vh; flex-direction: row; flex-wrap: wrap; }
  body { flex-direction: column; }
  #map { height: 55vh; }
  .modal-box { width: 95vw; }
}
