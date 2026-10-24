// Reine Logik des Workout-Timers: Felder/Grenzen, Phasen-Abfolge, Gesamtdauer,
// Klemmen und Zeitformat. Kein DOM, kein Browser — damit per Unit-Test prüfbar.
// Werte und Formeln aus dem freigegebenen Entwurf
// (_requirements/mockups/workout-timer/Main.dc.html).

/** Fester Vorlauf vor dem ersten Work (Sekunden). */
export const PREP_SECONDS = 10;

/**
 * Einstellbare Felder in Anzeigereihenfolge (group: 0 = erste ConfigGroup,
 * 1 = zweite). tone null = ohne Ton-Kante. Grenzen/Schritte aus dem Entwurf.
 */
export const FIELDS = [
  {
    key: "sets",
    label: "Sets",
    tone: null,
    unit: "",
    min: 1,
    max: 20,
    step: 1,
    def: 5,
    group: 0,
  },
  {
    key: "pause",
    label: "Pause",
    tone: "green",
    unit: "s",
    min: 0,
    max: 900,
    step: 15,
    def: 180,
    group: 0,
  },
  {
    key: "work",
    label: "Work",
    tone: "orange",
    unit: "s",
    min: 1,
    max: 600,
    step: 1,
    def: 7,
    group: 1,
  },
  {
    key: "reps",
    label: "Reps",
    tone: "orange",
    unit: "",
    min: 1,
    max: 30,
    step: 1,
    def: 6,
    group: 1,
  },
  {
    key: "rest",
    label: "Rest",
    tone: "green",
    unit: "s",
    min: 1,
    max: 600,
    step: 1,
    def: 3,
    group: 1,
  },
];

/** Vorgabe-Einstellungen. */
export function defaults() {
  const c = {};
  for (const f of FIELDS) c[f.key] = f.def;
  return c;
}

/**
 * Baut die Phasenliste: Vorlauf → je Set Reps×Work mit Rest dazwischen
 * (kein Rest nach dem letzten Work eines Sets), Pause zwischen den Sets
 * (keine Pause nach dem letzten Set; Pause = 0 wird übersprungen).
 * @param {{sets:number,reps:number,work:number,rest:number,pause:number}} c
 * @returns {Array<{kind:string,dur:number,set:number,rep:number}>}
 */
export function buildTimeline(c) {
  const t = [{ kind: "prep", dur: PREP_SECONDS, set: 1, rep: 1 }];
  for (let s = 1; s <= c.sets; s++) {
    for (let r = 1; r <= c.reps; r++) {
      t.push({ kind: "work", dur: c.work, set: s, rep: r });
      if (r < c.reps) t.push({ kind: "rest", dur: c.rest, set: s, rep: r });
    }
    if (s < c.sets && c.pause > 0) {
      t.push({ kind: "pause", dur: c.pause, set: s, rep: c.reps });
    }
  }
  return t;
}

/** Gesamtdauer in Sekunden = Summe über die Timeline (inkl. Vorlauf). */
export function totalSeconds(c) {
  return buildTimeline(c).reduce((a, p) => a + p.dur, 0);
}

/** Klemmt einen Wert auf die Grenzen des Feldes (und auf ganze Zahlen). */
export function clampField(key, value) {
  const f = FIELDS.find((x) => x.key === key);
  if (!f) return value;
  const n = Math.round(Number(value));
  if (Number.isNaN(n)) return f.min;
  return Math.min(f.max, Math.max(f.min, n));
}

/**
 * Formatiert Sekunden als `m:ss`. Aufrunden mit Epsilon wie im Entwurf
 * (`Math.ceil(sec - 1e-9)`), nie negativ.
 */
export function formatTime(sec) {
  const n = Math.max(0, Math.ceil(sec - 1e-9));
  const m = Math.floor(n / 60);
  const r = n % 60;
  return m + ":" + (r < 10 ? "0" : "") + r;
}
