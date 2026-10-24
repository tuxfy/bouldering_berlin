// Hält den Bildschirm während des Laufs wach (Screen Wake Lock API). Fehlt die
// API oder wird sie abgelehnt, läuft der Timer trotzdem weiter (sauberer
// Rückfall). Bei Rückkehr in den Vordergrund wird erneut angefordert, weil das
// System den Lock beim Verdecken freigibt. navigator/document injizierbar.

/**
 * @param {{navigator?: object, document?: object}} [opts]
 */
export function createWakeLock(opts = {}) {
  const nav =
    opts.navigator ??
    (typeof navigator !== "undefined" ? navigator : undefined);
  const doc =
    opts.document ?? (typeof document !== "undefined" ? document : undefined);
  const hasAPI = !!(
    nav &&
    nav.wakeLock &&
    typeof nav.wakeLock.request === "function"
  );

  let sentinel = null;
  let want = false;

  async function request() {
    if (sentinel) return;
    try {
      const s = await nav.wakeLock.request("screen");
      sentinel = s;
      if (s && typeof s.addEventListener === "function") {
        s.addEventListener("release", () => {
          if (sentinel === s) sentinel = null;
        });
      }
    } catch {
      sentinel = null;
    }
  }

  async function onVisible() {
    if (want && doc && doc.visibilityState === "visible") await request();
  }

  async function enable() {
    want = true;
    if (!hasAPI) return false;
    if (doc && typeof doc.addEventListener === "function") {
      doc.addEventListener("visibilitychange", onVisible);
    }
    await request();
    return !!sentinel;
  }

  async function disable() {
    want = false;
    if (doc && typeof doc.removeEventListener === "function") {
      doc.removeEventListener("visibilitychange", onVisible);
    }
    if (sentinel) {
      try {
        await sentinel.release();
      } catch {
        // ignorieren — Lock ist dann ohnehin weg
      }
      sentinel = null;
    }
  }

  return { enable, disable };
}
