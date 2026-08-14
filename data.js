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
      { id: 'a1', name: 'Lancer med-ball poitrine', sets: 3, repsMin: 4, repsMax: 5, rest: 75, muscles: 'Pectoraux, épaules, triceps, gainage' },
      { id: 'a2', name: 'Développé incliné haltères', sets: 4, repsMin: 6, repsMax: 8, rest: 150, muscles: 'Pectoraux sup., deltoïdes ant., triceps' },
      { id: 'a3', name: 'Tractions / tirage vertical', sets: 4, repsMin: 6, repsMax: 10, rest: 120, muscles: 'Grand dorsal, biceps, haut du dos' },
      { id: 'a4', name: 'Développé militaire haltères', sets: 3, repsMin: 6, repsMax: 8, rest: 120, muscles: 'Deltoïdes, triceps' },
      { id: 'a5', name: 'Rowing poitrine appuyée', sets: 3, repsMin: 8, repsMax: 10, rest: 90, muscles: 'Dorsaux, rhomboïdes, trapèzes, biceps' },
      { id: 'a6', name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 15, rest: 60, muscles: 'Deltoïde moyen' },
      { id: 'a7', name: 'Curl incliné haltères', sets: 3, repsMin: 8, repsMax: 12, rest: 75, muscles: 'Biceps' },
      { id: 'a8', name: 'Pallof press', sets: 3, repsMin: 10, repsMax: 12, rest: 50, muscles: 'Abdos, obliques, anti-rotation', perSide: true },
    ],
  },
  B: {
    label: 'SÉANCE B — Jambes + explosivité',
    icon: '🦵',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Box jump', sets: 4, repsMin: 3, repsMax: 3, rest: 75, muscles: 'Quadriceps, fessiers, mollets — explosivité' },
      { id: 'b2', name: 'Hack squat', sets: 3, repsMin: 6, repsMax: 8, rest: 150, muscles: 'Quadriceps, fessiers' },
      { id: 'b3', name: 'Bulgarian split squat', sets: 3, repsMin: 8, repsMax: 8, rest: 90, muscles: 'Quadriceps, fessiers, ischios, gainage', perSide: true },
      { id: 'b4', name: 'Hip thrust', sets: 3, repsMin: 8, repsMax: 10, rest: 90, muscles: 'Fessiers, ischio-jambiers' },
      { id: 'b5', name: 'Leg curl', sets: 3, repsMin: 10, repsMax: 12, rest: 75, muscles: 'Ischio-jambiers' },
      { id: 'b6', name: 'Mollets', sets: 3, repsMin: 10, repsMax: 15, rest: 60, muscles: 'Mollets' },
      { id: 'b7', name: 'Hanging knee raise', sets: 3, repsMin: 8, repsMax: 12, rest: 60, muscles: 'Abdos, fléchisseurs de hanche' },
    ],
  },
  C: {
    label: 'SÉANCE C — Full body + hypertrophie',
    icon: '🔥',
    color: 'green',
    exercises: [
      { id: 'c1', name: 'Med-ball rotational throw', sets: 3, repsMin: 4, repsMax: 4, rest: 60, muscles: 'Rotation explosive', perSide: true },
      { id: 'c2', name: 'Développé incliné', sets: 3, repsMin: 8, repsMax: 10, rest: 120, muscles: 'Pectoraux' },
      { id: 'c3', name: 'Tirage vertical prise neutre', sets: 3, repsMin: 8, repsMax: 10, rest: 120, muscles: 'Dos' },
      { id: 'c4', name: 'Presse à cuisses', sets: 3, repsMin: 8, repsMax: 12, rest: 120, muscles: 'Quadriceps, fessiers' },
      { id: 'c5', name: 'Rowing poulie basse', sets: 3, repsMin: 8, repsMax: 12, rest: 90, muscles: 'Dos' },
      { id: 'c6', name: 'Élévations latérales', sets: 3, repsMin: 12, repsMax: 20, rest: 60, muscles: 'Deltoïde moyen' },
      { id: 'c7', name: 'Curl pupitre', sets: 3, repsMin: 10, repsMax: 12, rest: 60, muscles: 'Biceps' },
      { id: 'c8', name: 'Extension triceps poulie', sets: 3, repsMin: 10, repsMax: 15, rest: 60, muscles: 'Triceps' },
      { id: 'c9', name: 'Crunch câble', sets: 3, repsMin: 10, repsMax: 15, rest: 45, muscles: 'Abdos' },
    ],
  },
};

const PLANNING_DEFAULT = {
  LUN: 'boxe', MAR: 'boxe', MER: 'A', JEU: 'boxe', VEN: 'B', SAM: 'repos', DIM: 'C',
};
const DAY_LABELS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

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
