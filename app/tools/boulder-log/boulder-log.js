// Boulder Log — Controller. Wert/Texte/Logik aus dem freigegebenen Entwurf
// (_requirements/mockups/boulder-log/Main.dc.html). Reine Formatlogik in format.js.
import { formatLine, appendLine } from "./format.js";

const GRADES = [
  "3",
  "4",
  "5a",
  "5b",
  "5c",
  "6a",
  "6a+",
  "6b",
  "6b+",
  "6c",
  "6c+",
  "7a",
  "7a+",
  "7b",
  "7b+",
  "7c",
  "7c+",
  "8a",
];
const STYLES = [
  "slab",
  "vertical",
  "overhang",
  "roof",
  "dyno",
  "crimp",
  "sloper",
  "pinch",
  "jug",
  "technical",
  "powerful",
];

const $ = (id) => document.getElementById(id);
const gradeEl = $("grade");
const triesEl = $("tries");
const sendEl = $("send");
const addEl = $("add");
const noteEl = $("note");
const logEl = $("log");
const stylesEl = document.querySelector(".bl-styles");
const copyEl = $("copy");
const resetEl = $("reset");
const sheetEl = $("sheet");

const STORAGE_KEY = "boulder-log";

function loadLog() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveLog() {
  try {
    localStorage.setItem(STORAGE_KEY, logEl.value);
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus) — bewusst ignoriert.
  }
}

logEl.value = loadLog();

let tries = 1;
let send = false;
const selectedStyles = new Set();

// Grad-Vorschläge (native Vorschlagsliste)
const datalist = $("fb-grades");
for (const g of GRADES) {
  const opt = document.createElement("option");
  opt.value = g;
  datalist.appendChild(opt);
}

// Style-Tags (Mehrfachauswahl)
const styleButtons = new Map();
for (const s of STYLES) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "toggle";
  btn.textContent = s;
  btn.setAttribute("aria-pressed", "false");
  btn.addEventListener("click", () => toggleStyle(s, btn));
  stylesEl.appendChild(btn);
  styleButtons.set(s, btn);
}

function toggleStyle(s, btn) {
  const on = !selectedStyles.has(s);
  if (on) selectedStyles.add(s);
  else selectedStyles.delete(s);
  btn.classList.toggle("is-on", on);
  btn.setAttribute("aria-pressed", String(on));
}

function setTries(n) {
  tries = Math.min(999, Math.max(1, n));
  triesEl.textContent = String(tries);
}

function setSend(value) {
  send = value;
  sendEl.classList.toggle("is-on", send);
  sendEl.setAttribute("aria-pressed", String(send));
}

function updateAddState() {
  addEl.disabled = gradeEl.value.trim() === "";
}

// Kopieren und Reset nur bei nicht-leerem Log.
function updateActionsState() {
  const empty = logEl.value.trim() === "";
  copyEl.disabled = empty;
  resetEl.disabled = empty;
}

function openSheet() {
  sheetEl.hidden = false;
}

function closeSheet() {
  sheetEl.hidden = true;
}

gradeEl.addEventListener("input", updateAddState);
$("tries-dec").addEventListener("click", () => setTries(tries - 1));
$("tries-inc").addEventListener("click", () => setTries(tries + 1));
sendEl.addEventListener("click", () => setSend(!send));

addEl.addEventListener("click", () => {
  const grade = gradeEl.value.trim();
  if (!grade) return;
  const styles = STYLES.filter((s) => selectedStyles.has(s));
  const line = formatLine({ grade, tries, send, styles, note: noteEl.value });
  logEl.value = appendLine(logEl.value, line);

  // Nach dem Hinzufügen: Grad bleibt, der Rest wird zurückgesetzt.
  setTries(1);
  setSend(false);
  selectedStyles.clear();
  for (const btn of styleButtons.values()) {
    btn.classList.remove("is-on");
    btn.setAttribute("aria-pressed", "false");
  }
  noteEl.value = "";
  updateActionsState();
  saveLog();
});

// Log ist frei editierbar — Aktionszustand mitführen und speichern.
logEl.addEventListener("input", () => {
  updateActionsState();
  saveLog();
});

// Kopieren: ganzes Log in die Zwischenablage, Bestätigung „Kopiert ✓" für 2 s.
let copyTimer;
copyEl.addEventListener("click", () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(logEl.value).catch(() => {});
  }
  copyEl.textContent = "Kopiert ✓";
  copyEl.classList.remove("btn--secondary");
  copyEl.classList.add("btn--success");
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyEl.textContent = "Kopieren";
    copyEl.classList.remove("btn--success");
    copyEl.classList.add("btn--secondary");
  }, 2000);
});

// Reset über ConfirmSheet (destruktiv).
resetEl.addEventListener("click", openSheet);
$("sheet-cancel").addEventListener("click", closeSheet);
$("sheet-confirm").addEventListener("click", () => {
  logEl.value = "";
  closeSheet();
  updateActionsState();
  saveLog();
});
sheetEl.addEventListener("click", (ev) => {
  if (ev.target === sheetEl) closeSheet(); // Klick auf den Scrim schließt
});

updateAddState();
updateActionsState();

// Service Worker registrieren (wie die Shell), damit auch der direkte Einstieg
// ins Tool offline funktioniert. Script liegt im App-Wurzelverzeichnis.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../../sw.js").catch((err) => {
      console.error("Service-Worker-Registrierung fehlgeschlagen:", err);
    });
  });
}
