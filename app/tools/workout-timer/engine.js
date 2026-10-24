// Reine Ablauf-, Anzeige- und Tonauslöser-Logik des Workout-Timers.
// Uhr-injizierbar und ohne DOM, damit driftfreie Zeit, Pausen und
// Signalpunkte per Unit-Test prüfbar sind. Regeln/Werte aus dem Entwurf
// (_requirements/mockups/workout-timer/Main.dc.html).

import { formatTime, totalSeconds } from "./timeline.js";

const TONE = { prep: "neutral", work: "orange", rest: "green", pause: "green" };
const LABEL = { prep: "GET READY", work: "WORK", rest: "REST", pause: "PAUSE" };
const CAPTION = {
  prep: "Mach dich bereit",
  work: "Gib alles",
  rest: "Durchatmen",
  pause: "Set geschafft — kurz erholen",
};
const NAME = { work: "Work", rest: "Rest", pause: "Pause" };
const RADIUS = 138;
export const RING_CIRC = 2 * Math.PI * RADIUS;

/**
 * Aktiv verstrichene Sekunden aus der Uhr, Pausen herausgerechnet.
 * @param {{startedAt:number,pausedAccum:number,pausedAt:(number|null)}} clock ms
 * @param {number} now ms (z. B. performance.now())
 */
export function activeSeconds(clock, now) {
  const end = clock.pausedAt != null ? clock.pausedAt : now;
  return Math.max(0, end - clock.startedAt - clock.pausedAccum) / 1000;
}

/**
 * Findet die aktuelle Phase zu einer verstrichenen Zeit (Sekunden).
 * @returns {{done:boolean,idx:number,kind:string,set:number,rep:number,rem:number,progress:number}}
 */
export function locate(timeline, elapsed) {
  let cum = 0;
  for (let i = 0; i < timeline.length; i++) {
    const p = timeline[i];
    if (elapsed < cum + p.dur) {
      const into = elapsed - cum;
      return {
        done: false,
        idx: i,
        kind: p.kind,
        set: p.set,
        rep: p.rep,
        rem: cum + p.dur - elapsed,
        progress: p.dur > 0 ? Math.min(1, Math.max(0, into / p.dur)) : 1,
      };
    }
    cum += p.dur;
  }
  const last = timeline[timeline.length - 1];
  return {
    done: true,
    idx: timeline.length - 1,
    kind: last.kind,
    set: last.set,
    rep: last.rep,
    rem: 0,
    progress: 1,
  };
}

/**
 * Welche Töne der Übergang von `prev` nach `next` auslöst (beide locate-Ergebnisse,
 * `prev` darf null sein = Laufbeginn). `tick` nur beim ganzzahligen Übergang 3/2/1.
 */
export function signalsFor(prev, next) {
  if (next.done) return prev && prev.done ? [] : ["done"];
  const out = [];
  if (prev && !prev.done && next.idx !== prev.idx) {
    if (next.kind === "work" || next.kind === "rest" || next.kind === "pause")
      out.push(next.kind);
  }
  const after = Math.ceil(next.rem);
  if (
    prev &&
    !prev.done &&
    after >= 1 &&
    after <= 3 &&
    after < Math.ceil(prev.rem)
  )
    out.push("tick");
  return out;
}

/**
 * Anzeige-Werte für die Lauf-/Fertig-Ansicht. `flags` = {paused, live}.
 * `segments` sind Füllwerte 0..1 je Rep des aktuellen Sets.
 */
export function view(timeline, loc, cfg, flags) {
  const paused = !!(flags && flags.paused);
  const live = !!(flags && flags.live);
  const done = loc.done;
  const cur = done ? null : timeline[loc.idx];
  const progress = done ? 1 : loc.progress;
  const nxt = done ? null : timeline[loc.idx + 1];
  const rem = done ? 0 : loc.rem;
  const total = totalSeconds(cfg);

  const fills = [];
  for (let i = 1; i <= cfg.reps; i++) {
    let f = 0;
    if (done || (cur && cur.kind === "pause")) f = 1;
    else if (cur && cur.kind === "work")
      f = i < cur.rep ? 1 : i === cur.rep ? progress : 0;
    else if (cur && cur.kind === "rest") f = i <= cur.rep ? 1 : 0;
    fills.push(f);
  }

  let hint, hintTone;
  if (done) {
    hint =
      cfg.sets +
      " Sets · " +
      cfg.reps +
      " Reps · " +
      cfg.work +
      " s / " +
      cfg.rest +
      " s";
    hintTone = null;
  } else if (nxt) {
    hint = "Als Nächstes: " + NAME[nxt.kind] + " · " + formatTime(nxt.dur);
    hintTone = TONE[nxt.kind];
  } else {
    hint = "Letzter Rep — gleich geschafft";
    hintTone = null;
  }

  const pulse =
    !done &&
    !paused &&
    live &&
    Math.ceil(rem) <= 3 &&
    Math.ceil(rem) - rem < 0.3;

  return {
    done,
    tone: done ? "neutral" : TONE[cur.kind],
    segTone: done ? "neutral" : cur.kind === "pause" ? "green" : "orange",
    repLabel: (done ? cfg.reps : cur.rep) + " / " + cfg.reps,
    setLabel: (done ? cfg.sets : cur.set) + " / " + cfg.sets,
    circ: RING_CIRC,
    offset: RING_CIRC * (1 - Math.min(1, Math.max(0, progress))),
    label: done ? "DONE" : LABEL[cur.kind],
    value: done ? formatTime(total) : formatTime(rem),
    pulse,
    caption: done
      ? "Workout geschafft"
      : paused
        ? "Angehalten"
        : CAPTION[cur.kind],
    segments: fills,
    hint,
    hintTone,
  };
}
