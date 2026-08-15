// ============================================================
// MUSCU × BOXE — Application
// ============================================================

const DAY_NAMES_FR = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
const MEAL_LABELS = { petitDej: '🌅 Petit-déjeuner', dejeuner: '☀️ Déjeuner', gouter: '🍎 Goûter', diner: '🌙 Dîner', collation: '➕ Collation' };
const RING_COLORS = { kcal: '#3d7fff', protein: '#34c77b', carbs: '#ff9f43', fat: '#e6394a' };

let state = { trainingTab: 'muscu', currentProgram: 'A', currentSets: {} };

document.addEventListener('DOMContentLoaded', () => {
  Store.load();
  initNav();
  initAccueil();
  initAlimentation();
  initEntrainement();
  initProgression();
  initProfil();
  renderAll();
  registerServiceWorker();
});

function renderAll() {
  renderHeader();
  renderAccueil();
  renderAlimentation();
  renderEntrainement();
  renderProgression();
  renderProfilForm();
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

function fmt(n, d = 0) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
}

// ============================================================
// NAVIGATION
// ============================================================
function initNav() {
  document.querySelectorAll('nav.bottom-nav button').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.querySelectorAll('nav.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo(0, 0);
  if (name === 'progression') renderProgression();
  if (name === 'entrainement') renderEntrainement();
}

function renderHeader() {
  const now = new Date();
  document.getElementById('header-date').textContent = `${DAY_NAMES_FR[now.getDay()]} ${now.getDate()} ${now.toLocaleDateString('fr-FR', { month: 'long' })}`;
}

// ============================================================
// ACCUEIL
// ============================================================
function initAccueil() {
  document.getElementById('chk-creatine').addEventListener('change', e => {
    const log = Store.getDailyLog(Store.today());
    log.creatine = e.target.checked;
    Store.save();
  });
  document.getElementById('whey-minus').addEventListener('click', () => bumpWhey(-1));
  document.getElementById('whey-plus').addEventListener('click', () => bumpWhey(1));
}

function bumpWhey(delta) {
  const log = Store.getDailyLog(Store.today());
  log.wheyCount = Math.max(0, (log.wheyCount || 0) + delta);
  Store.save();
  renderAccueil();
}

function ringSVG(pct, color, size = 62, stroke = 7) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(pct, 1));
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#1c2028" stroke-width="${stroke}"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
  </svg>`;
}

function renderAccueil() {
  const d = Store.load();
  const today = Store.today();
  const log = Store.getDailyLog(today);
  const totals = Store.totalsForDate(today);
  const p = d.profile;

  document.getElementById('today-label').textContent = 'Objectif ' + p.calorieTarget + ' kcal';
  document.getElementById('chk-creatine').checked = !!log.creatine;
  const wheyGrams = (log.wheyCount || 0) * 30;
document.getElementById('whey-count').textContent = (log.wheyCount || 0) + ' (' + wheyGrams + ' g)';

  // Rings
  const ringsData = [
    { key: 'kcal', label: 'Kcal', val: totals.kcal, target: p.calorieTarget, unit: '' },
    { key: 'protein', label: 'Prot.', val: totals.protein, target: p.proteinTarget, unit: 'g' },
    { key: 'carbs', label: 'Gluc.', val: totals.carbs, target: p.carbTarget, unit: 'g' },
    { key: 'fat', label: 'Lip.', val: totals.fat, target: p.fatTarget, unit: 'g' },
  ];
  document.getElementById('macro-rings').innerHTML = ringsData.map(r => `
    <div class="ring-wrap">
      <div style="position:relative;">
        ${ringSVG(r.target ? r.val / r.target : 0, RING_COLORS[r.key])}
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
          <span class="ring-value">${fmt(r.val)}</span>
        </div>
      </div>
      <div class="ring-label">${r.label}</div>
    </div>
  `).join('');

  // Water
  const waterPct = Math.min(100, ((log.water || 0) / p.waterTarget) * 100);
  document.getElementById('water-value').textContent = `${fmt(log.water || 0, 1)} / ${fmt(p.waterTarget, 1)} L`;
  document.getElementById('water-bar').style.width = waterPct + '%';
  document.getElementById('water-bar').onclick = null;

  // Today's training
  const dow = ((new Date().getDay() + 6) % 7); // 0 = Lundi
  const dayKey = DAY_LABELS[dow];
  const planned = d.planning[dayKey];
  const box = document.getElementById('today-training-content');
  if (!planned || planned === 'repos') {
    box.innerHTML = `<p class="muted">😴 Jour de repos.</p>`;
  } else if (planned === 'boxe') {
    box.innerHTML = `<p><strong>🥊 Séance de boxe</strong></p><button class="btn btn-boxe mt-16" onclick="switchView('entrainement'); selectTrainingTab('boxe');">COMMENCER LA SÉANCE</button>`;
  } else {
    const prog = WORKOUT_PROGRAM[planned];
    box.innerHTML = `<p><strong>${prog.icon} ${prog.label}</strong></p><p class="small muted mt-8">${prog.exercises.length} exercices</p><button class="btn btn-primary mt-16" onclick="switchView('entrainement'); selectTrainingTab('muscu'); selectProgram('${planned}');">COMMENCER LA SÉANCE</button>`;
  }

  renderWeekStrip();
}

function renderWeekStrip() {
  const d = Store.load();
  const dates = Store.lastNDates(7);
  const todayStr = Store.today();
  let html = '';
  const kcalList = [], proteinList = [], sleepList = [], energyList = [];
  let boxeCount = 0, muscuCount = 0;

  dates.forEach((dt, i) => {
    const dow = new Date(dt).getDay();
    const label = ['D','L','M','M','J','V','S'][dow];
    const dayWorkouts = d.workouts.filter(w => w.date === dt);
    const hasBoxe = dayWorkouts.some(w => w.kind === 'boxe');
    const hasMuscu = dayWorkouts.some(w => w.kind === 'muscu');
    if (hasBoxe) boxeCount++;
    if (hasMuscu) muscuCount++;
    let cls = 'dot';
    let icon = '';
    if (hasBoxe) { cls += ' done-boxe'; icon = '🥊'; }
    else if (hasMuscu) { cls += ' done-muscu'; icon = '🏋️'; }
    if (dt === todayStr) cls += ' today';
    html += `<div class="week-dot"><div class="day-label">${label}</div><div class="${cls}">${icon}</div></div>`;

    const totals = Store.totalsForDate(dt);
    if (totals.kcal) { kcalList.push(totals.kcal); proteinList.push(totals.protein); }
    const log = d.dailyLogs[dt];
    if (log && log.sleepHours) sleepList.push(Number(log.sleepHours));
    if (log && log.energy != null) energyList.push(Number(log.energy));
  });

  document.getElementById('week-strip').innerHTML = html;

  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : null;
  const avgWeight = Store.weightAverage7d();
  const stats = [
    ['Poids moyen', avgWeight != null ? fmt(avgWeight,1) + ' kg' : '—'],
    ['Séances boxe', boxeCount + ' / 3'],
    ['Séances muscu', muscuCount + ' / 3'],
    ['Calories moy.', avg(kcalList) != null ? fmt(avg(kcalList)) + ' kcal' : '—'],
    ['Protéines moy.', avg(proteinList) != null ? fmt(avg(proteinList)) + ' g' : '—'],
    ['Sommeil moy.', avg(sleepList) != null ? fmt(avg(sleepList),1) + ' h' : '—'],
    ['Énergie moy.', avg(energyList) != null ? fmt(avg(energyList),1) + '/10' : '—'],
  ];
  document.getElementById('week-summary-stats').innerHTML = stats.map(([l,v]) =>
    `<div class="row" style="padding:6px 0; border-bottom:1px solid var(--border);"><span class="small muted">${l}</span><span class="mono" style="font-size:13px;">${v}</span></div>`
  ).join('');
}

function selectTrainingTab(tab) {
  document.querySelectorAll('[data-training-tab]').forEach(c => c.classList.toggle('active', c.dataset.trainingTab === tab));
  document.getElementById('training-muscu-tab').style.display = tab === 'muscu' ? 'block' : 'none';
  document.getElementById('training-boxe-tab').style.display = tab === 'boxe' ? 'block' : 'none';
  document.getElementById('training-history-tab').style.display = tab === 'history' ? 'block' : 'none';
  if (tab === 'history') renderHistory();
}

function selectProgram(letter) {
  state.currentProgram = letter;
  document.querySelectorAll('[data-program]').forEach(c => c.classList.toggle('active', c.dataset.program === letter));
  renderExerciseList();
}

// ============================================================
// ALIMENTATION
// ============================================================
function initAlimentation() {
  // event delegation set up in renderAlimentation via inline handlers
}

function renderAlimentation() {
  const today = Store.today();
  document.getElementById('food-date-label').textContent = "Aujourd'hui";
  const totals = Store.totalsForDate(today);
  const p = Store.load().profile;
  setBar('f-kcal', totals.kcal, p.calorieTarget, ' kcal');
  setBar('f-protein', totals.protein, p.proteinTarget, ' g');
  setBar('f-carbs', totals.carbs, p.carbTarget, ' g');
  setBar('f-fat', totals.fat, p.fatTarget, ' g');

  const meals = Store.getMealsForDate(today);
  const container = document.getElementById('meal-sections');
  container.innerHTML = Object.keys(MEAL_LABELS).map(key => {
    const items = meals[key];
    const itemsHtml = items.length ? items.map((it, idx) => `
      <div class="food-item">
        <div><div class="fi-name">${escapeHtml(it.name)}</div><div class="fi-macro">${it.qty || ''}${it.unit || ''} · ${fmt(it.kcal)} kcal · P${fmt(it.protein)} G${fmt(it.carbs)} L${fmt(it.fat)}</div></div>
        <button class="fi-remove" onclick="removeFood('${key}',${idx})">×</button>
      </div>`).join('') : '<p class="empty-state">Aucun aliment ajouté.</p>';

    return `
      <div class="card meal-section">
        <div class="meal-section-header">
          <h3>${MEAL_LABELS[key]}</h3>
          <button class="btn btn-ghost btn-sm" onclick="openAddFood('${key}')">+ Ajouter</button>
        </div>
        <div id="meal-items-${key}">${itemsHtml}</div>
        <div id="add-food-form-${key}"></div>
      </div>`;
  }).join('');
}

function setBar(prefix, val, target, suffix) {
  document.getElementById(prefix).textContent = `${fmt(val)} / ${fmt(target)}${suffix}`;
  document.getElementById(prefix + '-bar').style.width = Math.min(100, target ? (val / target) * 100 : 0) + '%';
}

function openAddFood(mealKey) {
  const holder = document.getElementById('add-food-form-' + mealKey);
  if (holder.innerHTML) { holder.innerHTML = ''; return; }
  holder.innerHTML = `
    <div class="mt-16" style="border-top:1px solid var(--border); padding-top:12px;">
      <label>Nom de l'aliment</label>
      <input type="text" id="nf-name-${mealKey}" placeholder="Poulet">
      <div class="field-grid">
        <div><label>Quantité</label><input type="number" id="nf-qty-${mealKey}" placeholder="180"></div>
        <div><label>Unité</label><input type="text" id="nf-unit-${mealKey}" placeholder="g" value="g"></div>
      </div>
      <div class="field-grid-3">
        <div><label>Kcal</label><input type="number" id="nf-kcal-${mealKey}"></div>
        <div><label>Prot. (g)</label><input type="number" id="nf-protein-${mealKey}"></div>
        <div><label>Gluc. (g)</label><input type="number" id="nf-carbs-${mealKey}"></div>
      </div>
      <label>Lipides (g)</label><input type="number" id="nf-fat-${mealKey}">
      <button class="btn btn-primary mt-16" onclick="submitFood('${mealKey}')">Ajouter ce repas</button>
    </div>`;
}

function submitFood(mealKey) {
  const g = id => document.getElementById(id + '-' + mealKey);
  const name = g('nf-name').value.trim();
  if (!name) { toast('Indique un nom d\'aliment'); return; }
  const item = {
    name,
    qty: g('nf-qty').value,
    unit: g('nf-unit').value,
    kcal: Number(g('nf-kcal').value) || 0,
    protein: Number(g('nf-protein').value) || 0,
    carbs: Number(g('nf-carbs').value) || 0,
    fat: Number(g('nf-fat').value) || 0,
  };
  Store.getMealsForDate(Store.today())[mealKey].push(item);
  Store.save();
  renderAlimentation();
  renderAccueil();
  toast('Aliment ajouté');
}

function removeFood(mealKey, idx) {
  Store.getMealsForDate(Store.today())[mealKey].splice(idx, 1);
  Store.save();
  renderAlimentation();
  renderAccueil();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ============================================================
// ENTRAINEMENT
// ============================================================
function initEntrainement() {
  document.querySelectorAll('[data-training-tab]').forEach(btn => {
    btn.addEventListener('click', () => selectTrainingTab(btn.dataset.trainingTab));
  });
  document.querySelectorAll('[data-program]').forEach(btn => {
    btn.addEventListener('click', () => selectProgram(btn.dataset.program));
  });
  document.getElementById('save-muscu-session').addEventListener('click', saveMuscuSession);
  document.getElementById('save-boxe-session').addEventListener('click', saveBoxeSession);
}

function renderEntrainement() {
  renderExerciseList();
}

function renderExerciseList() {
  const prog = WORKOUT_PROGRAM[state.currentProgram];
  const list = document.getElementById('exercise-list');
  if (!state.currentSets[state.currentProgram]) state.currentSets[state.currentProgram] = {};
  const sessionSets = state.currentSets[state.currentProgram];

  list.innerHTML = prog.exercises.map(ex => {
    if (!sessionSets[ex.id]) {
      sessionSets[ex.id] = Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', rir: '' }));
    }
    const best = Store.bestPerformance(ex.id);
    const rows = sessionSets[ex.id].map((s, i) => `
      <div class="set-row">
        <span class="set-idx">S${i+1}</span>
        <input type="number" step="0.5" placeholder="kg" value="${s.weight}" oninput="updateSet('${ex.id}',${i},'weight',this.value)">
        <input type="number" placeholder="reps" value="${s.reps}" oninput="updateSet('${ex.id}',${i},'reps',this.value)">
        <input type="number" placeholder="RIR" min="0" max="5" value="${s.rir}" oninput="updateSet('${ex.id}',${i},'rir',this.value)">
        <button class="rm-set" onclick="removeSetRow('${ex.id}',${i})">×</button>
      </div>`).join('');

    return `
      <div class="card exercise-card">
        <div class="card-title"><h3>${ex.name}</h3></div>
        <div class="exercise-target">${ex.sets} × ${ex.repsMin === ex.repsMax ? ex.repsMin : ex.repsMin + '–' + ex.repsMax}${ex.perSide ? '/côté' : ''} · repos ${ex.rest}s · ${ex.muscles}</div>
        ${rows}
        <button class="add-set-btn" onclick="addSetRow('${ex.id}')">+ Ajouter une série</button>
        ${best ? `<div class="pr-badge">🏆 Record : ${best.weight} kg × ${best.reps}</div>` : ''}
      </div>`;
  }).join('');
}

function updateSet(exId, idx, field, val) {
  state.currentSets[state.currentProgram][exId][idx][field] = val;
}
function addSetRow(exId) {
  state.currentSets[state.currentProgram][exId].push({ weight: '', reps: '', rir: '' });
  renderExerciseList();
}
function removeSetRow(exId, idx) {
  state.currentSets[state.currentProgram][exId].splice(idx, 1);
  renderExerciseList();
}

function saveMuscuSession() {
  const prog = state.currentProgram;
  const sessionSets = state.currentSets[prog] || {};
  const sets = [];
  Object.entries(sessionSets).forEach(([exerciseId, rows]) => {
    rows.forEach((r, i) => {
      if (r.weight || r.reps) sets.push({ exerciseId, setNumber: i + 1, weight: r.weight, reps: r.reps, rir: r.rir });
    });
  });
  if (!sets.length) { toast('Renseigne au moins une série'); return; }
  Store.addWorkout({ date: Store.today(), kind: 'muscu', program: prog, sets });
  state.currentSets[prog] = {};
  renderExerciseList();
  renderAccueil();
  toast('Séance ' + prog + ' enregistrée 💪');
}

function saveBoxeSession() {
  const w = {
    date: Store.today(),
    kind: 'boxe',
    durationMin: Number(document.getElementById('boxe-duration').value) || null,
    intensity: Number(document.getElementById('boxe-intensity').value) || null,
    rounds: Number(document.getElementById('boxe-rounds').value) || null,
    sparring: document.getElementById('boxe-sparring').value,
    energy: Number(document.getElementById('boxe-energy').value) || null,
    fatigue: Number(document.getElementById('boxe-fatigue').value) || null,
    notes: document.getElementById('boxe-notes').value,
  };
  Store.addWorkout(w);
  ['boxe-duration','boxe-intensity','boxe-rounds','boxe-energy','boxe-fatigue','boxe-notes'].forEach(id => document.getElementById(id).value = '');
  renderAccueil();
  toast('Séance de boxe enregistrée 🥊');
}

function renderHistory() {
  const d = Store.load();
  const list = [...d.workouts].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 30);
  const box = document.getElementById('history-list');
  if (!list.length) { box.innerHTML = '<p class="empty-state">Aucune séance enregistrée.</p>'; return; }
  box.innerHTML = list.map(w => {
    if (w.kind === 'boxe') {
      return `<div class="card"><div class="row"><h3>🥊 Boxe</h3><span class="small muted">${w.date}</span></div><p class="small muted mt-8">${w.durationMin || '?'} min · Intensité ${w.intensity ?? '?'}/10 · ${w.sparring === 'oui' ? 'Sparring' : 'Sans sparring'}</p>${w.notes ? `<p class="small mt-8">${escapeHtml(w.notes)}</p>` : ''}</div>`;
    }
    const prog = WORKOUT_PROGRAM[w.program];
    const nbSets = (w.sets || []).length;
    return `<div class="card"><div class="row"><h3>${prog ? prog.icon : '🏋️'} Séance ${w.program}</h3><span class="small muted">${w.date}</span></div><p class="small muted mt-8">${nbSets} séries enregistrées</p></div>`;
  }).join('');
}

// ============================================================
// PROGRESSION
// ============================================================
function initProgression() {
  document.getElementById('save-measurements').addEventListener('click', () => {
    const log = Store.getDailyLog(Store.today());
    const w = document.getElementById('input-weight').value;
    const wa = document.getElementById('input-waist').value;
    if (w) log.weight = Number(w);
    if (wa) log.waist = Number(wa);
    Store.save();
    renderProgression();
    renderAccueil();
    toast('Mesures enregistrées');
  });

  document.getElementById('save-wellbeing').addEventListener('click', () => {
    const log = Store.getDailyLog(Store.today());
    log.sleepHours = Number(document.getElementById('input-sleep-hours').value) || log.sleepHours;
    log.sleepQuality = Number(document.getElementById('input-sleep-quality').value) || log.sleepQuality;
    log.energy = Number(document.getElementById('input-energy').value) || log.energy;
    log.hunger = Number(document.getElementById('input-hunger').value) || log.hunger;
    log.fatigue = Number(document.getElementById('input-fatigue').value) || log.fatigue;
    Store.save();
    renderAccueil();
    toast('Sommeil & énergie enregistrés');
  });
}

function renderProgression() {
  const avgWeight = Store.weightAverage7d();
  document.getElementById('weight-avg-label').textContent = avgWeight != null ? `Moy. 7j : ${fmt(avgWeight,1)} kg` : '';

  // Sparkline from last 30 days of weight
  const d = Store.load();
  const dates = Store.lastNDates(30);
  const points = dates.map(dt => d.dailyLogs[dt] && d.dailyLogs[dt].weight).map(w => w != null && w !== '' ? Number(w) : null);
  document.getElementById('chart-weight').innerHTML = sparklineSVG(points);

  renderWeeklyReport();
  renderPRList();
}

function sparklineSVG(points) {
  const valid = points.filter(p => p != null);
  if (valid.length < 2) return `<text x="10" y="30" fill="#8a9099" font-size="11">Pas assez de données</text>`;
  const min = Math.min(...valid), max = Math.max(...valid);
  const range = max - min || 1;
  const w = 300, h = 60, pad = 4;
  const step = (w - pad * 2) / (points.length - 1);
  let path = '';
  let lastX = null, lastY = null;
  points.forEach((p, i) => {
    if (p == null) return;
    const x = pad + i * step;
    const y = h - pad - ((p - min) / range) * (h - pad * 2);
    path += (path ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    lastX = x; lastY = y;
  });
  let dot = lastX != null ? `<circle cx="${lastX}" cy="${lastY}" r="3" fill="#3d7fff"/>` : '';
  return `<path d="${path}" fill="none" stroke="#3d7fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>${dot}`;
}

function renderWeeklyReport() {
  const d = Store.load();
  const dates = Store.lastNDates(7);
  const weights = dates.map(dt => d.dailyLogs[dt] && d.dailyLogs[dt].weight).filter(v => v != null && v !== '').map(Number);
  const waists = dates.map(dt => d.dailyLogs[dt] && d.dailyLogs[dt].waist).filter(v => v != null && v !== '').map(Number);
  const kcalArr = [], proteinArr = [], sleepArr = [], energyArr = [];
  let boxeCount = 0, muscuCount = 0;
  dates.forEach(dt => {
    const t = Store.totalsForDate(dt);
    if (t.kcal) { kcalArr.push(t.kcal); proteinArr.push(t.protein); }
    const log = d.dailyLogs[dt];
    if (log && log.sleepHours) sleepArr.push(Number(log.sleepHours));
    if (log && log.energy != null) energyArr.push(Number(log.energy));
    d.workouts.filter(w => w.date === dt).forEach(w => { if (w.kind === 'boxe') boxeCount++; else muscuCount++; });
  });
  const avg = a => a.length ? a.reduce((x,y)=>x+y,0)/a.length : null;
  const avgW = avg(weights), avgWa = avg(waists), avgK = avg(kcalArr), avgP = avg(proteinArr), avgS = avg(sleepArr), avgE = avg(energyArr);

  // Score /100 — simple heuristic, jamais culpabilisant
  const p = d.profile;
  const scoreNutrition = avgK ? Math.max(0, 100 - Math.min(100, Math.abs(avgK - p.calorieTarget) / p.calorieTarget * 200)) : 50;
  const scoreMuscu = Math.min(100, (muscuCount / 3) * 100);
  const scoreBoxe = Math.min(100, (boxeCount / 3) * 100);
  const scoreRecup = avgE != null ? avgE * 10 : 50;
  const total = Math.round((scoreNutrition + scoreMuscu + scoreBoxe + scoreRecup) / 4);

  let insight = "Continue à renseigner tes données pour débloquer une analyse complète.";
  if (weights.length >= 2) {
    const trend = weights[weights.length - 1] - weights[0];
    if (trend <= 0 && (waists.length < 2 || waists[waists.length-1] <= waists[0])) {
      insight = "🟢 Bonne tendance : poids stable ou en baisse et tour de taille non-croissant. Ne change pas les calories cette semaine.";
    } else if (avgE != null && avgE < 6) {
      insight = "🟡 Ton énergie moyenne est un peu basse. Avant de toucher aux calories, regarde d'abord ton sommeil et ta récupération.";
    }
  }

  document.getElementById('weekly-report').innerHTML = `
    <div class="score-badge">${total}<span class="of100">/100</span></div>
    <div class="mt-16">
      <div class="row" style="padding:6px 0; border-bottom:1px solid var(--border);"><span class="small muted">Poids moyen</span><span class="mono">${avgW != null ? fmt(avgW,1)+' kg' : '—'}</span></div>
      <div class="row" style="padding:6px 0; border-bottom:1px solid var(--border);"><span class="small muted">Tour de taille moyen</span><span class="mono">${avgWa != null ? fmt(avgWa,1)+' cm' : '—'}</span></div>
      <div class="row" style="padding:6px 0; border-bottom:1px solid var(--border);"><span class="small muted">Calories moyennes</span><span class="mono">${avgK != null ? fmt(avgK)+' kcal' : '—'}</span></div>
      <div class="row" style="padding:6px 0; border-bottom:1px solid var(--border);"><span class="small muted">Protéines moyennes</span><span class="mono">${avgP != null ? fmt(avgP)+' g' : '—'}</span></div>
      <div class="row" style="padding:6px 0; border-bottom:1px solid var(--border);"><span class="small muted">Boxe / Muscu</span><span class="mono">${boxeCount}/3 · ${muscuCount}/3</span></div>
      <div class="row" style="padding:6px 0;"><span class="small muted">Sommeil moyen</span><span class="mono">${avgS != null ? fmt(avgS,1)+' h' : '—'}</span></div>
    </div>
    <p class="small mt-16" style="line-height:1.5;">${insight}</p>
  `;
}

function renderPRList() {
  const allExercises = Object.values(WORKOUT_PROGRAM).flatMap(p => p.exercises);
  const withPR = allExercises.map(ex => ({ ex, best: Store.bestPerformance(ex.id) })).filter(x => x.best);
  const box = document.getElementById('pr-list');
  if (!withPR.length) { box.innerHTML = '<p class="empty-state">Enregistre des séries pour voir tes records ici.</p>'; return; }
  box.innerHTML = withPR.map(({ex, best}) => `
    <div class="row" style="padding:8px 0; border-bottom:1px solid var(--border);">
      <span class="small">${ex.name}</span>
      <span class="mono small">${best.weight} kg × ${best.reps}</span>
    </div>`).join('');
}

// ============================================================
// PROFIL
// ============================================================
function initProfil() {
  document.getElementById('save-profile').addEventListener('click', () => {
    const p = Store.load().profile;
    p.name = document.getElementById('p-name').value;
    p.height = Number(document.getElementById('p-height').value) || p.height;
    p.startWeight = Number(document.getElementById('p-start-weight').value) || p.startWeight;
    p.startWaist = Number(document.getElementById('p-start-waist').value) || p.startWaist;
    p.goal = document.getElementById('p-goal').value;
    p.calorieTarget = Number(document.getElementById('p-calorie').value) || p.calorieTarget;
    p.waterTarget = Number(document.getElementById('p-water').value) || p.waterTarget;
    p.proteinTarget = Number(document.getElementById('p-protein').value) || p.proteinTarget;
    p.carbTarget = Number(document.getElementById('p-carb').value) || p.carbTarget;
    p.fatTarget = Number(document.getElementById('p-fat').value) || p.fatTarget;
    Store.save();
    renderAll();
    toast('Profil enregistré');
  });

  document.getElementById('export-csv').addEventListener('click', exportCSV);
  document.getElementById('export-json').addEventListener('click', exportJSON);
  document.getElementById('export-summary').addEventListener('click', exportSummary);
  document.getElementById('reset-data').addEventListener('click', () => {
    if (confirm('Supprimer définitivement toutes les données ?')) {
      localStorage.removeItem(STORAGE_KEY);
      Store._data = null;
      Store.load();
      renderAll();
      toast('Données réinitialisées');
    }
  });
}

function renderProfilForm() {
  const p = Store.load().profile;
  document.getElementById('p-name').value = p.name || '';
  document.getElementById('p-height').value = p.height;
  document.getElementById('p-start-weight').value = p.startWeight;
  document.getElementById('p-start-waist').value = p.startWaist;
  document.getElementById('p-goal').value = p.goal;
  document.getElementById('p-calorie').value = p.calorieTarget;
  document.getElementById('p-water').value = p.waterTarget;
  document.getElementById('p-protein').value = p.proteinTarget;
  document.getElementById('p-carb').value = p.carbTarget;
  document.getElementById('p-fat').value = p.fatTarget;

  const planning = Store.load().planning;
  document.getElementById('planning-editor').innerHTML = DAY_LABELS.map(day => `
    <div class="row" style="padding:6px 0;">
      <span class="small muted">${day}</span>
      <select onchange="updatePlanning('${day}', this.value)" style="width:auto;">
        <option value="repos" ${planning[day]==='repos'?'selected':''}>😴 Repos</option>
        <option value="boxe" ${planning[day]==='boxe'?'selected':''}>🥊 Boxe</option>
        <option value="A" ${planning[day]==='A'?'selected':''}>🏋️ Muscu A</option>
        <option value="B" ${planning[day]==='B'?'selected':''}>🏋️ Muscu B</option>
        <option value="C" ${planning[day]==='C'?'selected':''}>🏋️ Muscu C</option>
      </select>
    </div>`).join('');
}

function updatePlanning(day, value) {
  Store.load().planning[day] = value;
  Store.save();
  renderAccueil();
}

// ============================================================
// EXPORTS
// ============================================================
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const d = Store.load();
  const dates = Object.keys(d.dailyLogs).sort();
  const header = ['date','poids','tour_taille','calories','proteines','glucides','lipides','eau','sommeil','energie','fatigue','boxe','musculation','creatine','whey','notes'];
  const rows = [header.join(',')];
  dates.forEach(dt => {
    const log = d.dailyLogs[dt];
    const totals = Store.totalsForDate(dt);
    const boxe = d.workouts.some(w => w.date === dt && w.kind === 'boxe') ? 1 : 0;
    const muscu = d.workouts.some(w => w.date === dt && w.kind === 'muscu') ? 1 : 0;
    rows.push([
      dt, log.weight ?? '', log.waist ?? '', totals.kcal, totals.protein, totals.carbs, totals.fat,
      log.water ?? '', log.sleepHours ?? '', log.energy ?? '', log.fatigue ?? '',
      boxe, muscu, log.creatine ? 1 : 0, log.wheyCount || 0, '"' + (log.notes || '').replace(/"/g,'""') + '"'
    ].join(','));
  });
  downloadFile('muscu-boxe-export.csv', rows.join('\n'), 'text/csv');
  toast('Export CSV téléchargé');
}

function exportJSON() {
  downloadFile('muscu-boxe-export.json', JSON.stringify(Store.load(), null, 2), 'application/json');
  toast('Export JSON téléchargé');
}

function exportSummary() {
  const d = Store.load();
  const dates = Store.lastNDates(7);
  const weights = dates.map(dt => d.dailyLogs[dt] && d.dailyLogs[dt].weight).filter(v=>v!=null&&v!=='').map(Number);
  const waists = dates.map(dt => d.dailyLogs[dt] && d.dailyLogs[dt].waist).filter(v=>v!=null&&v!=='').map(Number);
  const kcalArr=[], proteinArr=[], carbArr=[], fatArr=[], sleepArr=[], energyArr=[], fatigueArr=[];
  let boxeCount=0, muscuCount=0, creatineDays=0, wheyTotal=0;
  dates.forEach(dt => {
    const t = Store.totalsForDate(dt);
    if (t.kcal) { kcalArr.push(t.kcal); proteinArr.push(t.protein); carbArr.push(t.carbs); fatArr.push(t.fat); }
    const log = d.dailyLogs[dt];
    if (log) {
      if (log.sleepHours) sleepArr.push(Number(log.sleepHours));
      if (log.energy != null) energyArr.push(Number(log.energy));
      if (log.fatigue != null) fatigueArr.push(Number(log.fatigue));
      if (log.creatine) creatineDays++;
      wheyTotal += log.wheyCount || 0;
    }
    d.workouts.filter(w => w.date === dt).forEach(w => { if (w.kind==='boxe') boxeCount++; else muscuCount++; });
  });
  const avg = a => a.length ? (a.reduce((x,y)=>x+y,0)/a.length) : null;
  const f = (n,dec=0) => n!=null ? n.toFixed(dec) : '?';

  const text = `BILAN DE LA SEMAINE

Poids moyen : ${f(avg(weights),1)} kg
Tour de taille moyen : ${f(avg(waists),1)} cm

Calories moyennes : ${f(avg(kcalArr))} kcal
Protéines : ${f(avg(proteinArr))} g
Glucides : ${f(avg(carbArr))} g
Lipides : ${f(avg(fatArr))} g

Boxe : ${boxeCount}/3
Muscu : ${muscuCount}/3

Sommeil : ${f(avg(sleepArr),1)} h
Énergie : ${f(avg(energyArr),1)}/10
Fatigue : ${f(avg(fatigueArr),1)}/10

Créatine : ${creatineDays}/7 jours
Whey : ${wheyTotal} prises
`;
  downloadFile('bilan-semaine.txt', text, 'text/plain');
  toast('Bilan texte téléchargé');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
