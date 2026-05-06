// ==================== 定数 ====================

const LAKES = {
  toya:     { name: '洞爺湖',  center: { lat: 42.5979, lng: 140.7800 }, zoom: 12 },
  shikotsu: { name: '支笏湖', center: { lat: 42.7400, lng: 141.3600 }, zoom: 12 },
};

const FISH_ICONS = {
  'ワカサギ':       '🫧',
  'ヒメマス':       '🐡',
  'ニジマス':       '🌈',
  'アメマス':       '❄️',
  'ブラウントラウト': '🟤',
  'サクラマス':     '🌸',
  'その他':        '🐟',
};

function getFishIcon(fishType) {
  return FISH_ICONS[fishType] || '🐟';
}

const MONTH_COLORS = [
  '',        // 0 (未使用)
  '#1565C0', // 1月 - 冬・深青
  '#1976D2', // 2月 - 冬・青
  '#388E3C', // 3月 - 春・濃緑
  '#66BB6A', // 4月 - 春・緑
  '#AED581', // 5月 - 春・黄緑
  '#FFD600', // 6月 - 夏・黄
  '#FF8F00', // 7月 - 夏・橙
  '#E53935', // 8月 - 夏・赤
  '#EF6C00', // 9月 - 秋・橙赤
  '#795548', // 10月 - 秋・茶
  '#546E7A', // 11月 - 秋終・グレー
  '#37474F', // 12月 - 冬・濃紺
];

const MONTH_NAMES = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const YEAR_PALETTE = ['#F44336', '#9C27B0', '#2196F3', '#009688', '#FF5722', '#FFC107'];

// ==================== 状態管理 ====================

let map = null;
let advancedMarkers = [];
let parkingMarkers = [];
let catches = [];
let selectedYears = new Set();
let selectedMonths = new Set();
let selectedFishTypes = new Set();
let showParking = true;
let isSelectingPosition = false;
let tempMarker = null;

// ==================== ユーティリティ ====================

function getYearColor(year) {
  const years = [...new Set(catches.map(c => c.year))].sort();
  const idx = years.indexOf(year) % YEAR_PALETTE.length;
  return YEAR_PALETTE[idx];
}

function getUniqueYears() {
  return [...new Set(catches.map(c => c.year))].sort((a, b) => b - a);
}

function getFilteredCatches() {
  return catches.filter(c => {
    const yearOk = selectedYears.size === 0 || selectedYears.has(c.year);
    const monthOk = selectedMonths.size === 0 || selectedMonths.has(c.month);
    const fishOk = selectedFishTypes.size === 0 || selectedFishTypes.has(c.fish_type);
    const drillLakeOk = dashboardDrillLakes.size === 0 || dashboardDrillLakes.has(c.lake);
    const drillSpotOk = dashboardDrillSpots.size === 0 || dashboardDrillSpots.has(c.spot);
    const drillMonthOk = dashboardDrillMonths.size === 0 || dashboardDrillMonths.has(c.month);
    const drillFishOk = dashboardDrillFishes.size === 0 || dashboardDrillFishes.has(c.fish_type);
    return yearOk && monthOk && fishOk && drillLakeOk && drillSpotOk && drillMonthOk && drillFishOk;
  });
}

function getUniqueFishTypes() {
  const fromData = [...new Set(catches.map(c => c.fish_type))].sort();
  const allTypes = ['ワカサギ', 'ヒメマス', 'ニジマス', 'アメマス', 'ブラウントラウト', 'サクラマス', 'その他'];
  // データにある魚種 + フォームの選択肢を統合
  const merged = [...new Set([...allTypes, ...fromData])];
  return merged;
}

// ==================== マーカー生成 ====================

function createFishMarkerElement(catchData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'fish-marker';
  wrapper.title = `${catchData.lake} ${catchData.spot}`;

  const monthColor = MONTH_COLORS[catchData.month];
  const yearColor = getYearColor(catchData.year);

  wrapper.style.setProperty('--month-color', monthColor);
  wrapper.style.setProperty('--year-color', yearColor);

  const fishIcon = getFishIcon(catchData.fish_type);

  wrapper.innerHTML = `
    <div class="fish-body">${fishIcon}</div>
    <div class="fish-count">${catchData.count}</div>
    <div class="fish-tip" style="border-top-color: ${monthColor}"></div>
  `;
  return wrapper;
}

function clearMarkers() {
  advancedMarkers.forEach(m => { m.map = null; });
  advancedMarkers = [];
}

function clearParkingMarkers() {
  parkingMarkers.forEach(m => { m.map = null; });
  parkingMarkers = [];
}

function addSingleMarker(c) {
  const el = createFishMarkerElement(c);
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { lat: c.lat, lng: c.lng },
    content: el,
    title: `${c.fish_type} ${c.count}匹`,
  });
  marker.addListener('click', () => showInfoPanel(c));
  advancedMarkers.push(marker);
}

function renderMarkers() {
  clearMarkers();
  const filtered = getFilteredCatches();
  filtered.forEach(addSingleMarker);
  updateStats(filtered);
  buildStatsDashboard();
}

// ==================== 情報パネル ====================

function buildInfoDateRow(c) {
  const yearColor = getYearColor(c.year);
  const monthColor = MONTH_COLORS[c.month];
  return `
    <div class="info-row">
      <span>📅</span>
      <span style="color:${yearColor};font-weight:bold">${c.year}年</span>
      <span style="color:${monthColor};font-weight:bold">${c.month}月</span>
      <span>${c.day}日</span>
    </div>`;
}

function buildInfoHTML(c) {
  const monthColor = MONTH_COLORS[c.month];
  const notesHtml = c.notes
    ? `<div class="info-row"><span>📝</span><span>${c.notes}</span></div>` : '';
  return `
    <div class="info-header" style="border-left:4px solid ${monthColor}">
      <span class="info-fish">${getFishIcon(c.fish_type)} ${c.fish_type}</span>
      <span class="info-count" style="background:${monthColor}">${c.count}匹</span>
    </div>
    <div class="info-row"><span>📍</span><span>${c.lake} ${c.spot}</span></div>
    ${buildInfoDateRow(c)}
    ${notesHtml}
    <button class="btn-close-info" onclick="closeInfoPanel()">✕ 閉じる</button>
  `;
}

function showInfoPanel(c) {
  const panel = document.getElementById('info-panel');
  panel.innerHTML = buildInfoHTML(c);
  panel.classList.add('active');
}

function closeInfoPanel() {
  document.getElementById('info-panel').classList.remove('active');
}

// ==================== 統計更新 ====================

function updateStats(filtered) {
  const total = filtered.reduce((sum, c) => sum + c.count, 0);
  const spots = new Set(filtered.map(c => `${c.lake}-${c.spot}`)).size;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-records').textContent = filtered.length;
  document.getElementById('stat-spots').textContent = spots;
}

// ==================== 統計ダッシュボード ====================

function buildBarRow(label, value, max, color) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return `
    <div class="bar-row">
      <div class="bar-label">${label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct}%; background:${color}"></div>
      </div>
      <div class="bar-value">${value}</div>
    </div>`;
}

let dashboardDrillMonths = new Set();
let dashboardDrillFishes = new Set();
let dashboardDrillLakes = new Set();
let dashboardDrillSpots = new Set();

function buildSubBarRow(label, cnt, max, color, drillAttr) {
  const pct = max > 0 ? Math.round(cnt / max * 100) : 0;
  const isActive = drillAttr ? ' bar-row-drillable bar-row-sub-active' : ' bar-row-sub';
  const attrs = drillAttr || '';
  return `
    <div class="bar-row${isActive}" ${attrs}>
      <div class="bar-label">${label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${pct}%; background:${color}"></div>
      </div>
      <div class="bar-value">${cnt}</div>
    </div>`;
}

function drillClear() {
  dashboardDrillLakes.clear();
  dashboardDrillSpots.clear();
  dashboardDrillMonths.clear();
  dashboardDrillFishes.clear();
}

function buildStatsDashboard() {
  // ダッシュボードはフィルター適用済みデータ全体から集計（ドリル状態は別途マップ側に反映）
  const base = catches.filter(c => {
    const yearOk = selectedYears.size === 0 || selectedYears.has(c.year);
    const monthOk = selectedMonths.size === 0 || selectedMonths.has(c.month);
    const fishOk = selectedFishTypes.size === 0 || selectedFishTypes.has(c.fish_type);
    return yearOk && monthOk && fishOk;
  });

  // ===== 湖別（複数選択可、展開でスポット選択） =====
  const lakeMap = {};
  base.forEach(c => { lakeMap[c.lake] = (lakeMap[c.lake] || 0) + c.count; });
  const lakeMax = Math.max(...Object.values(lakeMap), 1);
  const lakeColors = { '洞爺湖': '#1a6bcc', '支笏湖': '#00838f' };
  let lakeHtml = '';
  Object.entries(lakeMap).sort((a, b) => b[1] - a[1]).forEach(([lake, cnt]) => {
    const isSelected = dashboardDrillLakes.has(lake);
    const color = lakeColors[lake] || '#4dd0e1';
    lakeHtml += `
      <div class="bar-row bar-row-drillable${isSelected ? ' bar-row-open' : ''}" data-drill-lake="${lake}">
        <div class="bar-label">${isSelected ? '✓ ' : ''}${lake}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.round(cnt/lakeMax*100)}%; background:${color}"></div>
        </div>
        <div class="bar-value">${cnt} <span class="drill-arrow">${isSelected ? '▲' : '▼'}</span></div>
      </div>`;
    if (isSelected) {
      const spotMap = {};
      base.filter(c => c.lake === lake).forEach(c => { spotMap[c.spot] = (spotMap[c.spot] || 0) + c.count; });
      const spotMax = Math.max(...Object.values(spotMap), 1);
      const spotsHtml = Object.entries(spotMap).sort((a, b) => b[1] - a[1]).map(([spot, sc]) => {
        const isSelSpot = dashboardDrillSpots.has(spot);
        return buildSubBarRow(
          `${isSelSpot ? '✓ ' : ''}${spot}`, sc, spotMax, isSelSpot ? color : `${color}99`,
          `data-drill-spot="${spot}"`
        );
      }).join('');
      lakeHtml += `<div class="drill-detail">${spotsHtml}</div>`;
    }
  });
  document.getElementById('chart-lake').innerHTML = lakeHtml || '<div class="chart-empty">データなし</div>';

  document.querySelectorAll('[data-drill-lake]').forEach(el => {
    el.addEventListener('click', () => {
      const lake = el.dataset.drillLake;
      dashboardDrillLakes.has(lake) ? dashboardDrillLakes.delete(lake) : dashboardDrillLakes.add(lake);
      if (!dashboardDrillLakes.has(lake)) {
        // 閉じたときはその湖のスポット選択を解除
        base.filter(c => c.lake === lake).forEach(c => dashboardDrillSpots.delete(c.spot));
      }
      renderMarkers();
    });
  });

  document.querySelectorAll('[data-drill-spot]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const spot = el.dataset.drillSpot;
      dashboardDrillSpots.has(spot) ? dashboardDrillSpots.delete(spot) : dashboardDrillSpots.add(spot);
      renderMarkers();
    });
  });

  // ===== 月別（複数選択可、展開で魚種内訳） =====
  const monthMap = {};
  base.forEach(c => { monthMap[c.month] = (monthMap[c.month] || 0) + c.count; });
  const monthMax = Math.max(...Object.values(monthMap), 1);
  let monthHtml = '';
  for (let m = 1; m <= 12; m++) {
    const cnt = monthMap[m] || 0;
    if (cnt === 0) continue;
    const isSelected = dashboardDrillMonths.has(m);
    monthHtml += `
      <div class="bar-row bar-row-drillable${isSelected ? ' bar-row-open' : ''}" data-drill-month="${m}">
        <div class="bar-label">${isSelected ? '✓ ' : ''}${MONTH_NAMES[m]}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.round(cnt/monthMax*100)}%; background:${MONTH_COLORS[m]}"></div>
        </div>
        <div class="bar-value">${cnt} <span class="drill-arrow">${isSelected ? '▲' : '▼'}</span></div>
      </div>`;
    if (isSelected) {
      const subFishMap = {};
      base.filter(c => c.month === m).forEach(c => { subFishMap[c.fish_type] = (subFishMap[c.fish_type] || 0) + c.count; });
      const subMax = Math.max(...Object.values(subFishMap), 1);
      const subHtml = Object.entries(subFishMap).sort((a, b) => b[1] - a[1])
        .map(([ft, sc]) => buildSubBarRow(`${getFishIcon(ft)} ${ft}`, sc, subMax, '#4dd0e1', null))
        .join('');
      monthHtml += `<div class="drill-detail">${subHtml}</div>`;
    }
  }
  document.getElementById('chart-month').innerHTML = monthHtml || '<div class="chart-empty">データなし</div>';

  document.querySelectorAll('[data-drill-month]').forEach(el => {
    el.addEventListener('click', () => {
      const m = Number(el.dataset.drillMonth);
      dashboardDrillMonths.has(m) ? dashboardDrillMonths.delete(m) : dashboardDrillMonths.add(m);
      renderMarkers();
    });
  });

  // ===== 魚種別（複数選択可、展開で月別内訳） =====
  const fishMap = {};
  base.forEach(c => { fishMap[c.fish_type] = (fishMap[c.fish_type] || 0) + c.count; });
  const fishMax = Math.max(...Object.values(fishMap), 1);
  let fishHtml = '';
  Object.entries(fishMap).sort((a, b) => b[1] - a[1]).forEach(([ft, cnt]) => {
    const isSelected = dashboardDrillFishes.has(ft);
    fishHtml += `
      <div class="bar-row bar-row-drillable${isSelected ? ' bar-row-open' : ''}" data-drill-fish="${ft}">
        <div class="bar-label">${isSelected ? '✓ ' : ''}${getFishIcon(ft)} ${ft}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.round(cnt/fishMax*100)}%; background:#4dd0e1"></div>
        </div>
        <div class="bar-value">${cnt} <span class="drill-arrow">${isSelected ? '▲' : '▼'}</span></div>
      </div>`;
    if (isSelected) {
      const subMonthMap = {};
      base.filter(c => c.fish_type === ft).forEach(c => { subMonthMap[c.month] = (subMonthMap[c.month] || 0) + c.count; });
      const subMax = Math.max(...Object.values(subMonthMap), 1);
      let subHtml = '';
      for (let m = 1; m <= 12; m++) {
        if (subMonthMap[m]) subHtml += buildSubBarRow(MONTH_NAMES[m], subMonthMap[m], subMax, MONTH_COLORS[m], null);
      }
      fishHtml += `<div class="drill-detail">${subHtml}</div>`;
    }
  });
  document.getElementById('chart-fish').innerHTML = fishHtml || '<div class="chart-empty">データなし</div>';

  document.querySelectorAll('[data-drill-fish]').forEach(el => {
    el.addEventListener('click', () => {
      const ft = el.dataset.drillFish;
      dashboardDrillFishes.has(ft) ? dashboardDrillFishes.delete(ft) : dashboardDrillFishes.add(ft);
      renderMarkers();
    });
  });
}

// ==================== フィルターUI ====================

function buildYearFilters() {
  const container = document.getElementById('year-filter-chips');
  container.innerHTML = '';

  getUniqueYears().forEach(year => {
    const color = getYearColor(year);
    const chip = document.createElement('label');
    chip.className = 'filter-chip';
    chip.style.setProperty('--chip-color', color);
    chip.innerHTML = `<input type="checkbox" value="${year}"><span>${year}年</span>`;
    chip.querySelector('input').addEventListener('change', e => {
      e.target.checked ? selectedYears.add(year) : selectedYears.delete(year);
      renderMarkers();
    });
    container.appendChild(chip);
  });
}

function buildMonthChip(month) {
  const color = MONTH_COLORS[month];
  const chip = document.createElement('label');
  chip.className = 'filter-chip';
  chip.style.setProperty('--chip-color', color);
  chip.innerHTML = `<input type="checkbox" value="${month}"><span>${MONTH_NAMES[month]}</span>`;
  chip.querySelector('input').addEventListener('change', e => {
    e.target.checked ? selectedMonths.add(month) : selectedMonths.delete(month);
    renderMarkers();
  });
  return chip;
}

function buildMonthFilters() {
  const container = document.getElementById('month-filter-chips');
  container.innerHTML = '';
  for (let m = 1; m <= 12; m++) {
    container.appendChild(buildMonthChip(m));
  }
}

function buildFishFilterChip(fishType) {
  const chip = document.createElement('label');
  chip.className = 'filter-chip';
  chip.style.setProperty('--chip-color', '#4dd0e1');
  chip.innerHTML = `<input type="checkbox" value="${fishType}"><span>${fishType}</span>`;
  chip.querySelector('input').addEventListener('change', e => {
    e.target.checked ? selectedFishTypes.add(fishType) : selectedFishTypes.delete(fishType);
    renderMarkers();
  });
  return chip;
}

function buildFishFilters() {
  const container = document.getElementById('fish-filter-chips');
  container.innerHTML = '';
  getUniqueFishTypes().forEach(fishType => {
    container.appendChild(buildFishFilterChip(fishType));
  });
}

// ==================== 釣果追加フォーム ====================

function openAddForm() {
  document.getElementById('add-modal').classList.add('active');
  setDefaultFormDate();
}

function closeAddForm() {
  document.getElementById('add-modal').classList.remove('active');
  cancelPositionSelect();
}

function setDefaultFormDate() {
  const today = new Date();
  document.getElementById('f-year').value = today.getFullYear();
  document.getElementById('f-month').value = today.getMonth() + 1;
  document.getElementById('f-day').value = today.getDate();
}

function startPositionSelect() {
  isSelectingPosition = true;
  document.getElementById('position-hint').style.display = 'block';
  document.getElementById('add-modal').classList.remove('active');
  map.getDiv().style.cursor = 'crosshair';
}

function cancelPositionSelect() {
  isSelectingPosition = false;
  document.getElementById('position-hint').style.display = 'none';
  map.getDiv().style.cursor = '';
  if (tempMarker) { tempMarker.map = null; tempMarker = null; }
}

function handleMapClick(e) {
  if (!isSelectingPosition) return;

  const lat = e.latLng.lat().toFixed(6);
  const lng = e.latLng.lng().toFixed(6);

  document.getElementById('f-lat').value = lat;
  document.getElementById('f-lng').value = lng;
  document.getElementById('coord-display').textContent = `📍 ${lat}, ${lng}`;

  if (tempMarker) tempMarker.map = null;
  tempMarker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: e.latLng,
  });

  cancelPositionSelect();
  document.getElementById('add-modal').classList.add('active');
}

function buildCatchFromForm() {
  return {
    id: Date.now(),
    lake: document.getElementById('f-lake').value,
    spot: document.getElementById('f-spot').value,
    lat: parseFloat(document.getElementById('f-lat').value),
    lng: parseFloat(document.getElementById('f-lng').value),
    fish_type: document.getElementById('f-fish').value,
    count: parseInt(document.getElementById('f-count').value),
    year: parseInt(document.getElementById('f-year').value),
    month: parseInt(document.getElementById('f-month').value),
    day: parseInt(document.getElementById('f-day').value),
    notes: document.getElementById('f-notes').value,
  };
}

function validateAndSaveCatch(newCatch) {
  if (isNaN(newCatch.lat) || isNaN(newCatch.lng)) {
    alert('地図をクリックして釣った場所を選んでください。');
    return false;
  }
  saveCatch(newCatch);
  catches = loadCatches();
  return true;
}

function submitCatch(e) {
  e.preventDefault();
  const newCatch = buildCatchFromForm();
  if (!validateAndSaveCatch(newCatch)) return;

  buildYearFilters();
  buildFishFilters();
  renderMarkers();
  closeAddForm();
  if (tempMarker) { tempMarker.map = null; tempMarker = null; }
  document.getElementById('add-form').reset();
}

// ==================== 凡例 ====================

function buildLegend() {
  const fishLegend = document.getElementById('fish-legend');
  Object.entries(FISH_ICONS).forEach(([name, icon]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-icon">${icon}</span><span>${name}</span>`;
    fishLegend.appendChild(item);
  });

  const monthLegend = document.getElementById('month-legend');
  MONTH_NAMES.slice(1).forEach((name, i) => {
    const month = i + 1;
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background:${MONTH_COLORS[month]}"></span>
      <span>${name}</span>
    `;
    monthLegend.appendChild(item);
  });
}

// ==================== 駐車場マーカー ====================

const PARKING_TYPE_CONFIG = {
  '公共':     { icon: '🅿', color: '#1565C0', label: '公共駐車場' },
  'キャンプ場': { icon: '🏕', color: '#2E7D32', label: 'キャンプ場' },
  '路肩':     { icon: '⚠', color: '#E65100', label: '路肩スペース' },
  '漁港':     { icon: '⚓', color: '#1A237E', label: '漁港駐車場' },
};

function getParkingTypeConfig(type) {
  return PARKING_TYPE_CONFIG[type] || { icon: '🅿', color: '#546E7A', label: type || '駐車場' };
}

function createParkingMarkerElement(p) {
  const cfg = getParkingTypeConfig(p.parking_type);
  const el = document.createElement('div');
  el.className = 'parking-marker';
  el.style.setProperty('--parking-color', cfg.color);
  el.title = p.name;
  el.innerHTML = `
    <div class="parking-icon">${cfg.icon}</div>
    <div class="parking-label">${p.name.replace(/\s.+/, '').substring(0, 8)}</div>
  `;
  return el;
}

function buildSourceBadges(sources) {
  return sources.map(s => {
    const cls = s.type === '1次' ? 'badge-primary' : 'badge-secondary';
    return `<a class="source-badge ${cls}" href="${s.url}" target="_blank" rel="noopener">
      ${s.type}情報: ${s.label}
    </a>`;
  }).join('');
}

function buildParkingHeader(p) {
  const cfg = getParkingTypeConfig(p.parking_type);
  return `
    <div class="info-header" style="border-left:4px solid ${cfg.color}">
      <span class="info-fish">${cfg.icon} ${p.name}</span>
      <span class="parking-type-badge" style="background:${cfg.color}">${cfg.label}</span>
    </div>
    <div class="info-row"><span>📍</span><span>${p.lake}</span></div>
    <div class="info-row"><span>🚗</span><span>${p.capacity} / ${p.fee}</span></div>
    <div class="info-row"><span>🕐</span><span>${p.hours}</span></div>
    <div class="info-row"><span>🚻</span><span>${p.toilet ? 'トイレあり' : 'トイレなし'}</span></div>
    <div class="info-row"><span>🎯</span><span>${p.distance_note}</span></div>
  `;
}

function buildParkingInfoHTML(p) {
  const fishTags = p.target_fish.map(f => `<span class="fish-tag">🐟 ${f}</span>`).join('');
  return `
    ${buildParkingHeader(p)}
    <div class="fish-tags">${fishTags}</div>
    <div class="info-row" style="font-size:0.72rem;color:#8892a4">${p.notes}</div>
    <div class="source-badges">${buildSourceBadges(p.sources)}</div>
    <div class="info-freshness">情報年度: ${p.info_year}年確認</div>
    <button class="btn-close-info" onclick="closeInfoPanel()">✕ 閉じる</button>
  `;
}

function addParkingMarker(p) {
  const el = createParkingMarkerElement(p);
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: { lat: p.lat, lng: p.lng },
    content: el,
    title: p.name,
  });
  marker.addListener('click', () => {
    document.getElementById('info-panel').innerHTML = buildParkingInfoHTML(p);
    document.getElementById('info-panel').classList.add('active');
  });
  parkingMarkers.push(marker);
}

function renderParkingMarkers() {
  clearParkingMarkers();
  if (!showParking) return;
  PARKING_DATA.forEach(addParkingMarker);
}



function createMap(Map) {
  return new Map(document.getElementById('map'), {
    center: { lat: 42.6800, lng: 141.0900 },
    zoom: 10,
    mapId: 'f3e4a689c89e3ce5adb21313',
    mapTypeId: 'hybrid',
    mapTypeControl: true,
    fullscreenControl: true,
  });
}

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  await google.maps.importLibrary('marker');

  map = createMap(Map);
  map.addListener('click', handleMapClick);

  catches = loadCatches();
  buildYearFilters();
  buildMonthFilters();
  buildFishFilters();
  buildLegend();
  renderMarkers();
  renderParkingMarkers();
  setupEventListeners();
}

// ==================== イベントリスナー ====================

function setupLakeListeners() {
  document.getElementById('btn-toya').addEventListener('click', () => {
    map.setCenter(LAKES.toya.center);
    map.setZoom(LAKES.toya.zoom);
  });
  document.getElementById('btn-shikotsu').addEventListener('click', () => {
    map.setCenter(LAKES.shikotsu.center);
    map.setZoom(LAKES.shikotsu.zoom);
  });
}

function setupFormListeners() {
  document.getElementById('btn-add').addEventListener('click', openAddForm);
  document.getElementById('btn-cancel-add').addEventListener('click', closeAddForm);
  document.getElementById('btn-select-pos').addEventListener('click', startPositionSelect);
  document.getElementById('add-form').addEventListener('submit', submitCatch);
}

function setupParkingToggle() {
  const toggle = document.getElementById('parking-toggle');
  if (!toggle) return;
  toggle.addEventListener('change', e => {
    showParking = e.target.checked;
    renderParkingMarkers();
  });
}

function setupEventListeners() {
  setupLakeListeners();
  setupFormListeners();
  setupParkingToggle();
  document.getElementById('btn-reset-filter').addEventListener('click', () => {
    selectedYears.clear();
    selectedMonths.clear();
    selectedFishTypes.clear();
    drillClear();
    document.querySelectorAll('.filter-chip input').forEach(el => { el.checked = false; });
    renderMarkers();
  });
}

window.initMap = initMap;
