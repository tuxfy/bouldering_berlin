// Workout-Timer — Controller. Dünne DOM-Anbindung an die reinen Module:
// timeline.js (Abfolge/Format), engine.js (Fortschritt/Anzeige/Töne gegen die
// Uhr), audio.js (Signale), wakelock.js (Bildschirm wach). Texte/Werte/Logik
// aus dem freigegebenen Entwurf (_requirements/mockups/workout-timer/Main.dc.html).
import {
  FIELDS,
  defaults,
  buildTimeline,
  totalSeconds,
  clampField,
  formatTime,
} from "./timeline.js";
import { activeSeconds, locate, signalsFor, view } from "./engine.js";
import { createAudio } from "./audio.js";
import { createWakeLock } from "./wakelock.js";

const STORE = "bb:workout-timer";

const $ = (id) => document.getElementById(id);
const config = $("config");
const stage = $("stage");
const sheet = $("sheet");
const groupA = $("group-a");
const groupB = $("group-b");
const total = $("total");
const rep = $("rep");
const set = $("set");
const label = $("label");
const value = $("value");
const caption = $("caption");
const ringProg = $("ring-prog");
const segments = $("segments");
const hint = $("hint");
const hintDot = $("hint-dot");
const controls = $("controls");

const audio = createAudio();
const wake = createWakeLock();

let cfg = loadConfig();
let tl = [];
let mode = "config"; // config | run | done
let clock = { startedAt: 0, pausedAccum: 0, pausedAt: null };
let prevLoc = null;
let wasPaused = false;
let mainBtn = null;

const paused = () => clock.pausedAt != null;

// ── Einstellungen laden/speichern ──────────────────────────────────────────
function loadConfig() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const o = JSON.parse(raw);
      const c = defaults();
      for (const f of FIELDS) {
        if (typeof o[f.key] !== "undefined")
          c[f.key] = clampField(f.key, o[f.key]);
      }
      return c;
    }
  } catch {
    // defekter/gesperrter Speicher → Vorgaben
  }
  return defaults();
}

function saveConfig() {
  try {
    localStorage.setItem(STORE, JSON.stringify(cfg));
  } catch {
    // ignorieren — Speichern ist optionaler Komfort
  }
}

// ── Einstell-Ansicht ────────────────────────────────────────────────────────
function buildRow(f) {
  const row = document.createElement("div");
  row.className = "cfg-row";
  if (f.tone) row.dataset.tone = f.tone;

  const lbl = document.createElement("span");
  lbl.className = "cfg-row__label";
  lbl.textContent = f.label;

  const stepper = document.createElement("div");
  stepper.className = "stepper";
  const dec = document.createElement("button");
  dec.type = "button";
  dec.setAttribute("aria-label", f.label + " weniger");
  dec.textContent = "−";
  const input = document.createElement("input");
  input.className = "stepper__value";
  input.type = "text";
  input.inputMode = "numeric";
  input.pattern = "[0-9]*";
  input.setAttribute("aria-label", f.label);
  input.value = cfg[f.key];
  const inc = document.createElement("button");
  inc.type = "button";
  inc.setAttribute("aria-label", f.label + " mehr");
  inc.textContent = "+";

  const setVal = (v) => {
    const n = clampField(f.key, v);
    cfg[f.key] = n;
    input.value = n;
    saveConfig();
    updateTotal();
  };
  dec.addEventListener("click", () => setVal(cfg[f.key] - f.step));
  inc.addEventListener("click", () => setVal(cfg[f.key] + f.step));
  input.addEventListener("change", () => {
    // Rohwert parsen (Vorzeichen bleibt erhalten), dann clampField klemmen —
    // so landet eine Eingabe unter dem Minimum auf dem Minimum, nicht auf ihrem Betrag.
    const n = parseInt(String(input.value).trim(), 10);
    if (Number.isNaN(n)) input.value = cfg[f.key];
    else setVal(n);
  });

  stepper.append(dec, input, inc);
  const unit = document.createElement("span");
  unit.className = "cfg-row__unit";
  unit.textContent = f.unit;
  row.append(lbl, stepper, unit);
  return row;
}

function renderConfig() {
  groupA.textContent = "";
  groupB.textContent = "";
  for (const f of FIELDS) (f.group === 0 ? groupA : groupB).append(buildRow(f));
  updateTotal();
}

function updateTotal() {
  total.textContent = formatTime(totalSeconds(cfg));
}

// ── Lauf-Ansicht ──────────────────────────────────────────────────────────
function buildSegments(n) {
  segments.textContent = "";
  for (let i = 0; i < n; i++) {
    const bar = document.createElement("div");
    bar.className = "segments__bar";
    const fill = document.createElement("div");
    fill.className = "segments__fill";
    bar.append(fill);
    segments.append(bar);
  }
}

function renderSegments(fills) {
  const bars = segments.children;
  if (bars.length !== fills.length) buildSegments(fills.length);
  for (let i = 0; i < fills.length; i++) {
    const pct = Math.round(fills[i] * 1000) / 10;
    segments.children[i].firstChild.style.setProperty("--fill", pct + "%");
  }
}

function renderControls(forMode) {
  if (forMode === "run") {
    controls.innerHTML =
      '<button type="button" class="btn btn--icon btn--destructive btn--large" id="reset" aria-label="Reset"><span class="btn__glyph" aria-hidden="true">↺</span><span class="btn__label">Reset</span></button>' +
      '<button type="button" class="btn btn--primary btn--large" id="main">Pause</button>' +
      '<button type="button" class="btn btn--icon btn--secondary btn--large" id="skip" aria-label="Überspringen"><span class="btn__glyph" aria-hidden="true">⇥</span><span class="btn__label">Skip</span></button>';
    controls.querySelector("#reset").addEventListener("click", askReset);
    controls.querySelector("#skip").addEventListener("click", skip);
  } else {
    controls.innerHTML =
      '<button type="button" class="btn btn--icon btn--secondary btn--large" id="back" aria-label="Zurück zum Einstellen"><span class="btn__glyph" aria-hidden="true">←</span><span class="btn__label">Zurück</span></button>' +
      '<button type="button" class="btn btn--primary btn--large" id="main">Nochmal</button>' +
      '<span aria-hidden="true"></span>';
    controls.querySelector("#back").addEventListener("click", back);
  }
  mainBtn = controls.querySelector("#main");
  mainBtn.addEventListener("click", onMain);
}

function render(loc) {
  const v = view(tl, loc, cfg, { paused: paused(), live: true });
  stage.dataset.tone = v.tone;
  segments.dataset.tone = v.segTone;
  rep.textContent = v.repLabel;
  set.textContent = v.setLabel;
  label.textContent = v.label;
  value.textContent = v.value;
  value.classList.toggle("pulse", v.pulse);
  caption.textContent = v.caption;
  ringProg.setAttribute("stroke-dasharray", v.circ.toFixed(2));
  ringProg.setAttribute("stroke-dashoffset", v.offset.toFixed(2));
  renderSegments(v.segments);
  hint.textContent = v.hint;
  if (v.hintTone) hintDot.dataset.tone = v.hintTone;
  else delete hintDot.dataset.tone;
  if (mode === "run" && mainBtn)
    mainBtn.textContent = paused() ? "Weiter" : "Pause";
}

// ── Ablaufsteuerung ─────────────────────────────────────────────────────────
function showStage() {
  config.hidden = true;
  stage.hidden = false;
}
function showConfig() {
  stage.hidden = true;
  sheet.hidden = true;
  config.hidden = false;
}

function setElapsed(seconds) {
  const now = performance.now();
  const startedAt = now - seconds * 1000;
  clock = { startedAt, pausedAccum: 0, pausedAt: paused() ? now : null };
}

function start() {
  tl = buildTimeline(cfg);
  audio.unlock(); // synchron in der Start-Geste (iOS)
  audio.signal("tick");
  clock = { startedAt: performance.now(), pausedAccum: 0, pausedAt: null };
  mode = "run";
  prevLoc = null;
  buildSegments(cfg.reps);
  wake.enable();
  showStage();
  renderControls("run");
  frame();
}

function frame() {
  if (mode !== "run") return;
  const loc = locate(tl, activeSeconds(clock, performance.now()));
  for (const k of signalsFor(prevLoc, loc)) audio.signal(k);
  prevLoc = loc;
  if (loc.done) {
    finish();
    return;
  }
  render(loc);
}

function finish() {
  mode = "done";
  wake.disable();
  renderControls("done");
  render(locate(tl, totalSeconds(cfg) + 1));
}

function onMain() {
  if (mode === "done") {
    start();
    return;
  }
  audio.unlock();
  const now = performance.now();
  if (paused()) {
    clock.pausedAccum += now - clock.pausedAt;
    clock.pausedAt = null;
  } else {
    clock.pausedAt = now;
  }
  frame();
}

function skip() {
  const loc = locate(tl, activeSeconds(clock, performance.now()));
  if (loc.done) return;
  let cum = 0;
  for (let i = 0; i <= loc.idx; i++) cum += tl[i].dur;
  prevLoc = loc;
  audio.unlock();
  setElapsed(cum);
  frame();
}

function askReset() {
  wasPaused = paused();
  if (!paused()) clock.pausedAt = performance.now();
  sheet.hidden = false;
  frame();
}

function back() {
  mode = "config";
  wake.disable();
  showConfig();
}

function init() {
  renderConfig();
  setInterval(frame, 100);
  $("start").addEventListener("click", start);
  $("sheet-confirm").addEventListener("click", () => {
    sheet.hidden = true;
    mode = "config";
    wake.disable();
    showConfig();
  });
  const closeSheet = () => {
    sheet.hidden = true;
    if (!wasPaused && paused()) {
      clock.pausedAccum += performance.now() - clock.pausedAt;
      clock.pausedAt = null;
    }
    frame();
  };
  $("sheet-cancel").addEventListener("click", closeSheet);
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) closeSheet();
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("../../sw.js").catch((err) => {
        console.error("Service-Worker-Registrierung fehlgeschlagen:", err);
      });
    });
  }
}

init();
