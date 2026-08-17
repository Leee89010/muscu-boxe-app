// ============================================================
// MUSCU × BOXE — Couche de données
// ============================================================

const STORAGE_KEY = 'muscuBoxeData';
const APP_VERSION = '1.0.0';

// ---- Définitions des séances de musculation (§14-16 du cahier des charges)
const WORKOUT_PROGRAM = {
  A: {
    label: 'SÉANCE A — Force + haut du corps',
    icon: '🏋️',
    color: 'blue',
    exercises: [
      { id: 'a1', name: 'Lancer med-ball poitrine', sets: 3, repsMin: 4, repsMax: 5, rest: 75, muscles: 'Pectoraux, épaules, triceps, gainage', perSide: true, pattern: 'rotate', muscleGroups: ['pectoraux', 'epaules', 'bras', 'abdominaux'] },
      { id: 'a2', name: 'Développé incliné haltères', sets: 4, repsMin: 6, repsMax: 8, rest: 150, muscles: 'Pectoraux sup., deltoïdes ant., triceps', pattern: 'push', muscleGroups: ['pectoraux', 'epaules', 'bras'] },
      { id: 'a3', name: 'Tractions / tirage vertical', sets: 4, repsMin: 6, repsMax: 10, rest: 120, muscles: 'Grand dorsal, biceps, haut du dos', pattern: 'pull', muscleGroups: ['dos', 'bras'] },
      { id: 'a4', name: 'Développé militaire haltères', sets: 3, repsMin: 6, repsMax: 8, rest: 120, muscles: 'Deltoïdes, triceps', pattern: 'push', muscleGroups: ['epaules', 'bras'] },
      { id: 'a5', name: 'Rowing poitrine appuyée', sets: 3, repsMin: 8, repsMax: 10, rest: 90, muscles: 'Dorsaux, rhomboïdes, trapèzes, biceps', pattern: 'pull', muscleGroups: ['dos', 'bras'] },
      { id: 'a6', name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, rest: 60, muscles: 'Deltoïde moyen', pattern: 'raise', muscleGroups: ['epaules'] },
      { id: 'a7', name: 'Curl incliné haltères', sets: 3, repsMin: 8, repsMax: 12, rest: 75, muscles: 'Biceps', pattern: 'pull', muscleGroups: ['bras'] },
      { id: 'a8', name: 'Pallof press', sets: 3, repsMin: 10, repsMax: 12, rest: 50, muscles: 'Abdos, obliques, anti-rotation', perSide: true, pattern: 'hold', muscleGroups: ['abdominaux'] },
    ],
  },
  B: {
    label: 'SÉANCE B — Jambes + explosivité',
    icon: '🦵',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Box jump', sets: 4, repsMin: 3, repsMax: 3, rest: 75, muscles: 'Quadriceps, fessiers, mollets — explosivité', pattern: 'squat', muscleGroups: ['quadriceps', 'ischiosfessiers', 'mollets'] },
      { id: 'b2', name: 'Hack squat', sets: 3, repsMin: 6, repsMax: 8, rest: 150, muscles: 'Quadriceps, fessiers', pattern: 'squat', muscleGroups: ['quadriceps', 'ischiosfessiers'] },
      { id: 'b3', name: 'Bulgarian split squat', sets: 3, repsMin: 8, repsMax: 8, rest: 90, muscles: 'Quadriceps, fessiers, ischios, gainage', perSide: true, pattern: 'squat', muscleGroups: ['quadriceps', 'ischiosfessiers', 'abdominaux'] },
      { id: 'b4', name: 'Hip thrust', sets: 3, repsMin: 8, repsMax: 10, rest: 90, muscles: 'Fessiers, ischio-jambiers', pattern: 'squat', muscleGroups: ['ischiosfessiers'] },
      { id: 'b5', name: 'Leg curl', sets: 3, repsMin: 10, repsMax: 12, rest: 75, muscles: 'Ischio-jambiers', pattern: 'pull', muscleGroups: ['ischiosfessiers'] },
      { id: 'b6', name: 'Mollets', sets: 3, repsMin: 10, repsMax: 15, rest: 60, muscles: 'Mollets', pattern: 'raise', muscleGroups: ['mollets'] },
      { id: 'b7', name: 'Hanging knee raise', sets: 3, repsMin: 8, repsMax: 12, rest: 60, muscles: 'Abdos, fléchisseurs de hanche', pattern: 'raise', muscleGroups: ['abdominaux'] },
    ],
  },
  C: {
    label: 'SÉANCE C — Full body + hypertrophie',
    icon: '🔥',
    color: 'green',
    exercises: [
      { id: 'c1', name: 'Med-ball rotational throw', sets: 3, repsMin: 4, repsMax: 4, rest: 60, muscles: 'Rotation explosive', perSide: true, pattern: 'rotate', muscleGroups: ['abdominaux', 'bras', 'epaules'] },
      { id: 'c2', name: 'Développé incliné', sets: 3, repsMin: 8, repsMax: 10, rest: 120, muscles: 'Pectoraux', pattern: 'push', muscleGroups: ['pectoraux'] },
      { id: 'c3', name: 'Tirage vertical prise neutre', sets: 3, repsMin: 8, repsMax: 10, rest: 120, muscles: 'Dos', pattern: 'pull', muscleGroups: ['dos'] },
      { id: 'c4', name: 'Presse à cuisses', sets: 3, repsMin: 8, repsMax: 12, rest: 120, muscles: 'Quadriceps, fessiers', pattern: 'squat', muscleGroups: ['quadriceps', 'ischiosfessiers'] },
      { id: 'c5', name: 'Rowing poulie basse', sets: 3, repsMin: 8, repsMax: 12, rest: 90, muscles: 'Dos', pattern: 'pull', muscleGroups: ['dos'] },
      { id: 'c6', name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 20, rest: 60, muscles: 'Deltoïde moyen', pattern: 'raise', muscleGroups: ['epaules'] },
      { id: 'c7', name: 'Curl pupitre', sets: 3, repsMin: 10, repsMax: 12, rest: 60, muscles: 'Biceps', pattern: 'pull', muscleGroups: ['bras'] },
      { id: 'c8', name: 'Extension triceps poulie', sets: 3, repsMin: 10, repsMax: 15, rest: 60, muscles: 'Triceps', pattern: 'push', muscleGroups: ['bras'] },
      { id: 'c9', name: 'Crunch câble', sets: 3, repsMin: 10, repsMax: 15, rest: 45, muscles: 'Abdos', pattern: 'raise', muscleGroups: ['abdominaux'] },
    ],
  },
};
const PATTERN_LABELS = { push: 'Poussée', pull: 'Tirage', squat: 'Flexion jambes', raise: 'Élévation', rotate: 'Rotation', hold: 'Gainage isométrique' };
const EXERCISE_MEDIA = {
  a2: 'Dumbbell_Incline_Bench_Press',
  a3: 'Pullups',
  a4: 'Dumbbell_Shoulder_Press',
  a5: 'Seated_Cable_Rows',
  a6: 'Side_Lateral_Raise',
  a7: 'Alternate_Incline_Dumbbell_Curl',
  b1: 'Box_Jump_Multiple_Response',
  b2: 'Barbell_Hack_Squat',
  b3: 'Dumbbell_Bulgarian_Split_Squat',
  b4: 'Barbell_Hip_Thrust',
  b5: 'Lying_Leg_Curls',
  b6: 'Standing_Calf_Raises',
  b7: 'Hanging_Leg_Raise',
  c2: 'Barbell_Incline_Bench_Press_-_Medium_Grip',
  c3: 'Close-Grip_Front_Lat_Pulldown',
  c4: 'Leg_Press',
  c5: 'Seated_Cable_Rows',
  c6: 'Side_Lateral_Raise',
  c7: 'Preacher_Curl',
  c8: 'Triceps_Pushdown',
  c9: 'Cable_Crunch',
  // a1, a8, c1 : pas de correspondance fiable trouvée -> pictogramme abstrait conservé
};
const PLANNING_DEFAULT = {
  LUN: 'boxe', MAR: 'boxe', MER: 'A', JEU: 'boxe', VEN: 'B', SAM: 'repos', DIM: 'C',
};
const DAY_LABELS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const FOOD_DATABASE = [
  // ---- Petit déjeuner ----
  { name: 'Café (noir)', unit: 'ml', kcal100: 2, protein100: 0.3, carbs100: 0, fat100: 0, categories: ['petitDej'] },
  { name: 'Œuf entier', unit: 'g', kcal100: 143, protein100: 12.6, carbs100: 1.1, fat100: 10.6, categories: ['petitDej', 'diner'] },
  { name: "Blanc d'œuf", unit: 'g', kcal100: 52, protein100: 10.9, carbs100: 0.7, fat100: 0.2, categories: ['petitDej'] },
  { name: 'Avocat', unit: 'g', kcal100: 160, protein100: 2.0, carbs100: 8.5, fat100: 14.7, categories: ['petitDej', 'diner'] },
  { name: 'Pain complet', unit: 'g', kcal100: 247, protein100: 12.5, carbs100: 41.0, fat100: 4.2, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Pain blanc', unit: 'g', kcal100: 266, protein100: 8.9, carbs100: 49.0, fat100: 3.2, categories: ['petitDej'] },
  { name: "Flocons d'avoine", unit: 'g', kcal100: 389, protein100: 13.5, carbs100: 60.0, fat100: 6.5, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Muesli nature', unit: 'g', kcal100: 360, protein100: 10.0, carbs100: 65.0, fat100: 6.0, categories: ['petitDej'] },
  { name: 'Granola nature', unit: 'g', kcal100: 400, protein100: 10.0, carbs100: 64.0, fat100: 12.0, categories: ['petitDej'] },
  { name: 'Skyr', unit: 'g', kcal100: 63, protein100: 10.6, carbs100: 3.8, fat100: 0.2, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Fromage blanc 0%', unit: 'g', kcal100: 48, protein100: 8.0, carbs100: 4.0, fat100: 0.2, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Yaourt grec 0%', unit: 'g', kcal100: 59, protein100: 10.0, carbs100: 3.6, fat100: 0.4, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Lait demi-écrémé', unit: 'ml', kcal100: 46, protein100: 3.4, carbs100: 4.8, fat100: 1.5, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Beurre de cacahuète', unit: 'g', kcal100: 588, protein100: 25.0, carbs100: 20.0, fat100: 50.0, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Amandes', unit: 'g', kcal100: 579, protein100: 21.2, carbs100: 21.7, fat100: 49.9, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Noix', unit: 'g', kcal100: 654, protein100: 15.2, carbs100: 13.7, fat100: 65.2, categories: ['petitDej'] },
  { name: 'Banane', unit: 'g', kcal100: 89, protein100: 1.1, carbs100: 22.8, fat100: 0.3, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Pomme', unit: 'g', kcal100: 52, protein100: 0.3, carbs100: 13.8, fat100: 0.2, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Fraises', unit: 'g', kcal100: 32, protein100: 0.7, carbs100: 7.7, fat100: 0.3, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Myrtilles', unit: 'g', kcal100: 57, protein100: 0.7, carbs100: 14.5, fat100: 0.3, categories: ['petitDej', 'collation', 'gouter'] },
  { name: 'Kiwi', unit: 'g', kcal100: 61, protein100: 1.1, carbs100: 14.7, fat100: 0.5, categories: ['petitDej'] },
  { name: 'Miel', unit: 'g', kcal100: 304, protein100: 0.3, carbs100: 82.4, fat100: 0.0, categories: ['petitDej'] },

  // ---- Déjeuner / Dîner ----
  { name: 'Poulet cru', unit: 'g', kcal100: 110, protein100: 23.1, carbs100: 0.0, fat100: 1.2, categories: ['dejeuner', 'diner'] },
  { name: 'Poulet cuit', unit: 'g', kcal100: 165, protein100: 31.0, carbs100: 0.0, fat100: 3.6, categories: ['dejeuner'] },
  { name: 'Dinde crue', unit: 'g', kcal100: 114, protein100: 23.7, carbs100: 0.0, fat100: 1.5, categories: ['dejeuner', 'diner'] },
  { name: 'Steak haché 5%', unit: 'g', kcal100: 137, protein100: 21.0, carbs100: 0.0, fat100: 5.0, categories: ['dejeuner', 'diner'] },
  { name: 'Bœuf maigre', unit: 'g', kcal100: 137, protein100: 21.0, carbs100: 0.0, fat100: 5.0, categories: ['dejeuner'] },
  { name: 'Filet de porc', unit: 'g', kcal100: 120, protein100: 21.0, carbs100: 0.0, fat100: 4.0, categories: ['dejeuner'] },
  { name: 'Jambon blanc', unit: 'g', kcal100: 115, protein100: 20.0, carbs100: 1.5, fat100: 3.0, categories: ['dejeuner'] },
  { name: 'Thon au naturel', unit: 'g', kcal100: 116, protein100: 26.0, carbs100: 0.0, fat100: 1.0, categories: ['dejeuner', 'diner'] },
  { name: 'Saumon', unit: 'g', kcal100: 208, protein100: 20.0, carbs100: 0.0, fat100: 13.0, categories: ['dejeuner', 'diner'] },
  { name: 'Cabillaud', unit: 'g', kcal100: 82, protein100: 18.0, carbs100: 0.0, fat100: 0.7, categories: ['dejeuner', 'diner'] },
  { name: 'Crevettes', unit: 'g', kcal100: 99, protein100: 24.0, carbs100: 0.2, fat100: 0.3, categories: ['dejeuner', 'diner'] },
  { name: 'Sardines', unit: 'g', kcal100: 208, protein100: 24.6, carbs100: 0.0, fat100: 11.5, categories: ['dejeuner'] },
  { name: 'Tofu ferme', unit: 'g', kcal100: 144, protein100: 17.0, carbs100: 2.0, fat100: 9.0, categories: ['dejeuner', 'diner'] },
  { name: 'Lentilles cuites', unit: 'g', kcal100: 116, protein100: 9.0, carbs100: 20.0, fat100: 0.4, categories: ['dejeuner', 'diner'] },
  { name: 'Pois chiches cuits', unit: 'g', kcal100: 164, protein100: 8.9, carbs100: 27.4, fat100: 2.6, categories: ['dejeuner', 'diner'] },
  { name: 'Haricots rouges cuits', unit: 'g', kcal100: 127, protein100: 8.7, carbs100: 22.8, fat100: 0.5, categories: ['dejeuner'] },
  { name: 'Quinoa cru', unit: 'g', kcal100: 368, protein100: 14.1, carbs100: 64.2, fat100: 6.1, categories: ['dejeuner', 'diner'] },
  { name: 'Riz blanc cru', unit: 'g', kcal100: 365, protein100: 7.1, carbs100: 80.0, fat100: 0.7, categories: ['dejeuner', 'diner'] },
  { name: 'Riz basmati cru', unit: 'g', kcal100: 350, protein100: 8.0, carbs100: 78.0, fat100: 0.7, categories: ['dejeuner', 'diner'] },
  { name: 'Riz complet cru', unit: 'g', kcal100: 370, protein100: 7.5, carbs100: 76.0, fat100: 2.7, categories: ['dejeuner'] },
  { name: 'Pâtes sèches', unit: 'g', kcal100: 350, protein100: 12.5, carbs100: 71.0, fat100: 1.5, categories: ['dejeuner', 'diner'] },
  { name: 'Pâtes complètes sèches', unit: 'g', kcal100: 348, protein100: 13.0, carbs100: 67.0, fat100: 2.5, categories: ['dejeuner'] },
  { name: 'Pommes de terre', unit: 'g', kcal100: 77, protein100: 2.0, carbs100: 17.0, fat100: 0.1, categories: ['dejeuner', 'diner'] },
  { name: 'Patate douce', unit: 'g', kcal100: 86, protein100: 1.6, carbs100: 20.1, fat100: 0.1, categories: ['dejeuner', 'diner'] },
  { name: 'Couscous sec', unit: 'g', kcal100: 376, protein100: 12.8, carbs100: 77.0, fat100: 0.6, categories: ['dejeuner'] },
  { name: "Huile d'olive", unit: 'g', kcal100: 884, protein100: 0.0, carbs100: 0.0, fat100: 100.0, categories: ['dejeuner', 'diner'] },
  { name: 'Brocoli', unit: 'g', kcal100: 34, protein100: 2.8, carbs100: 6.6, fat100: 0.4, categories: ['dejeuner', 'diner'] },
  { name: 'Courgette', unit: 'g', kcal100: 17, protein100: 1.2, carbs100: 3.1, fat100: 0.3, categories: ['dejeuner', 'diner'] },
  { name: 'Carotte', unit: 'g', kcal100: 41, protein100: 0.9, carbs100: 9.6, fat100: 0.2, categories: ['dejeuner'] },
  { name: 'Haricots verts', unit: 'g', kcal100: 31, protein100: 1.8, carbs100: 7.0, fat100: 0.1, categories: ['dejeuner', 'diner'] },
  { name: 'Poivron rouge', unit: 'g', kcal100: 31, protein100: 1.0, carbs100: 6.0, fat100: 0.3, categories: ['dejeuner', 'diner'] },
  { name: 'Tomate', unit: 'g', kcal100: 18, protein100: 0.9, carbs100: 3.9, fat100: 0.2, categories: ['dejeuner', 'diner'] },
  { name: 'Concombre', unit: 'g', kcal100: 15, protein100: 0.7, carbs100: 3.6, fat100: 0.1, categories: ['dejeuner', 'diner'] },
  { name: 'Épinards', unit: 'g', kcal100: 23, protein100: 2.9, carbs100: 3.6, fat100: 0.4, categories: ['dejeuner', 'diner'] },
  { name: 'Champignons', unit: 'g', kcal100: 22, protein100: 3.1, carbs100: 3.3, fat100: 0.3, categories: ['dejeuner'] },

  // ---- Collation / Goûter ----
  { name: 'Whey protéine', unit: 'g', kcal100: 390, protein100: 75.0, carbs100: 8.0, fat100: 6.0, categories: ['collation', 'gouter'] },
  { name: 'Orange', unit: 'g', kcal100: 47, protein100: 0.9, carbs100: 11.8, fat100: 0.1, categories: ['collation', 'gouter'] },
  { name: 'Poire', unit: 'g', kcal100: 57, protein100: 0.4, carbs100: 15.0, fat100: 0.1, categories: ['collation', 'gouter'] },
  { name: 'Galettes de riz', unit: 'g', kcal100: 387, protein100: 7.0, carbs100: 81.0, fat100: 2.8, categories: ['collation', 'gouter'] },
  { name: 'Noix de cajou', unit: 'g', kcal100: 553, protein100: 18.2, carbs100: 30.2, fat100: 43.9, categories: ['collation', 'gouter'] },
  { name: 'Noisettes', unit: 'g', kcal100: 628, protein100: 15.0, carbs100: 16.7, fat100: 61.0, categories: ['collation', 'gouter'] },
  { name: 'Chocolat noir 70%', unit: 'g', kcal100: 598, protein100: 7.8, carbs100: 34.0, fat100: 42.0, categories: ['collation', 'gouter'] },
  { name: 'Compote sans sucres', unit: 'g', kcal100: 50, protein100: 0.3, carbs100: 11.0, fat100: 0.1, categories: ['collation', 'gouter'] },
  { name: 'Boisson soja', unit: 'ml', kcal100: 33, protein100: 3.3, carbs100: 0.7, fat100: 1.8, categories: ['collation', 'gouter'] },
];
function defaultData() {
  return {
    version: APP_VERSION,
    profile: {
      name: '',
      height: 178,
      startWeight: 78,
      startWaist: 83,
      goal: 'Recomposition corporelle : perte de gras + prise de muscle + force/explosivité + performance boxe',
      calorieTarget: 2700,
      proteinTarget: 155,
      carbTarget: 330,
      fatTarget: 75,
      waterTarget: 2.8,
      creatineTarget: 4,
    },
    planning: { ...PLANNING_DEFAULT },
    dailyLogs: {},   // date -> {weight, waist, water, sleepHours, sleepQuality, energy, hunger, fatigue, motivation, creatine, wheyCount, notes}
    meals: {},       // date -> {petitDej:[], dejeuner:[], gouter:[], diner:[], collation:[]}
    favoriteMeals: [],
    workouts: [],     // {id, date, kind:'muscu'|'boxe', program:'A'|'B'|'C', durationMin, intensity, sparring, rounds, energy, fatigue, notes, sets:[{exerciseId,setNumber,weight,reps,rir}]}
  };
}

const Store = {
  _data: null,

  load() {
    if (this._data) return this._data;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._data = raw ? Object.assign(defaultData(), JSON.parse(raw)) : defaultData();
    } catch (e) {
      console.error('Erreur de lecture du stockage local', e);
      this._data = defaultData();
    }
    return this._data;
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  today() {
    return new Date().toISOString().slice(0, 10);
  },

  getDailyLog(date) {
    const d = this.load();
    if (!d.dailyLogs[date]) {
      d.dailyLogs[date] = {
        weight: null, waist: null, water: 0, sleepHours: null, sleepQuality: null,
        energy: null, hunger: null, fatigue: null, motivation: null,
        creatine: false, wheyCount: 0, notes: '',
      };
    }
    return d.dailyLogs[date];
  },

  getMealsForDate(date) {
    const d = this.load();
    if (!d.meals[date]) {
      d.meals[date] = { petitDej: [], dejeuner: [], gouter: [], diner: [], collation: [] };
    }
    return d.meals[date];
  },

  totalsForDate(date) {
    const meals = this.getMealsForDate(date);
    const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(meals).forEach(list => {
      list.forEach(item => {
        totals.kcal += Number(item.kcal) || 0;
        totals.protein += Number(item.protein) || 0;
        totals.carbs += Number(item.carbs) || 0;
        totals.fat += Number(item.fat) || 0;
      });
    });
    return totals;
  },

  addWorkout(workout) {
    const d = this.load();
    workout.id = 'w_' + Date.now();
    d.workouts.push(workout);
    this.save();
    return workout;
  },

  lastNDates(n) {
    const dates = [];
    const now = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - i);
      dates.push(dt.toISOString().slice(0, 10));
    }
    return dates;
  },

  weightAverage7d(fromDate) {
    const dates = this.lastNDates(7);
    const d = this.load();
    const weights = dates.map(dt => d.dailyLogs[dt] && d.dailyLogs[dt].weight).filter(w => w != null && w !== '');
    if (!weights.length) return null;
    return weights.reduce((a, b) => a + Number(b), 0) / weights.length;
  },

  bestPerformance(exerciseId) {
    const d = this.load();
    let best = null;
    d.workouts.forEach(w => {
      (w.sets || []).forEach(s => {
        if (s.exerciseId === exerciseId && s.weight) {
          const score = Number(s.weight) * (1 + Number(s.reps || 0) / 30); // estimation simple
          if (!best || score > best.score) best = { score, weight: s.weight, reps: s.reps, date: w.date };
        }
      });
    });
    return best;
  },
};
