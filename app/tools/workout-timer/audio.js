// Akustische Signale des Workout-Timers über Web Audio. Der AudioContext ist
// injizierbar, damit die Auslöselogik ohne echten Browser prüfbar ist. Ohne
// Context (oder vor der Freischaltung durch eine Nutzer-Geste) bleibt alles
// stumm. Frequenzen/Längen aus dem Entwurf (Main.dc.html: signal/beep).

/**
 * @param {{AudioContext?: (Function|null)}} [opts] AudioContext-Konstruktor
 *   (Standard: Browser `AudioContext`/`webkitAudioContext`).
 */
export function createAudio(opts = {}) {
  const Ctx =
    "AudioContext" in opts
      ? opts.AudioContext
      : typeof window !== "undefined"
        ? window.AudioContext || window.webkitAudioContext
        : null;
  let ac = null;
  let out = null;

  function ensure() {
    if (ac) return ac;
    if (!Ctx) return null;
    try {
      ac = new Ctx();
      // Kompressor hebt den wahrgenommenen Pegel, ohne zu übersteuern.
      out = ac.createDynamicsCompressor();
      out.threshold.value = -24;
      out.knee.value = 6;
      out.ratio.value = 8;
      out.attack.value = 0.002;
      out.release.value = 0.1;
      out.connect(ac.destination);
    } catch {
      ac = null;
      return null;
    }
    return ac;
  }

  /** Context freischalten/fortsetzen — synchron in der ersten Nutzer-Geste aufrufen. */
  function unlock() {
    const c = ensure();
    if (c && c.state === "suspended") c.resume();
    return !!c;
  }

  function beep(freq, ms, delay = 0, wave = "square") {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = wave;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(1.0, t0 + 0.005);
    g.gain.setValueAtTime(1.0, t0 + (ms / 1000) * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
    o.connect(g);
    g.connect(out || c.destination);
    o.start(t0);
    o.stop(t0 + ms / 1000 + 0.02);
  }

  function signal(kind) {
    if (kind === "tick") beep(1760, 180);
    else if (kind === "work") beep(2093, 800);
    else if (kind === "rest" || kind === "pause") beep(1046, 800);
    else if (kind === "done") {
      beep(1318, 250);
      beep(1760, 250, 0.3);
      beep(2637, 900, 0.6);
    }
  }

  return { unlock, signal, beep };
}
