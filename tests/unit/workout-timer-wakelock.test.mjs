import { describe, it, expect } from "vitest";
import { createWakeLock } from "../../app/tools/workout-timer/wakelock.js";

// Bildschirm wach halten, mit sauberen Fehlerpfaden. navigator/document injiziert.

const flush = () => new Promise((r) => setTimeout(r, 0));

function fakeDoc() {
  const listeners = {};
  return {
    visibilityState: "visible",
    addEventListener(t, f) {
      (listeners[t] || (listeners[t] = [])).push(f);
    },
    removeEventListener(t, f) {
      listeners[t] = (listeners[t] || []).filter((x) => x !== f);
    },
    _fire(t) {
      (listeners[t] || []).slice().forEach((f) => f());
    },
  };
}

function fakeNav(behavior) {
  let count = 0;
  const sentinels = [];
  const api =
    behavior === "none"
      ? undefined
      : {
          request() {
            count++;
            if (behavior === "reject")
              return Promise.reject(new Error("denied"));
            const s = {
              released: false,
              _rel: [],
              release() {
                this.released = true;
                this._rel.forEach((f) => f());
                return Promise.resolve();
              },
              addEventListener(t, f) {
                if (t === "release") this._rel.push(f);
              },
            };
            sentinels.push(s);
            return Promise.resolve(s);
          },
        };
  return { wakeLock: api, count: () => count, sentinels };
}

describe("createWakeLock", () => {
  it("fehlende API: enable() wirft nicht und meldet false", async () => {
    const wl = createWakeLock({
      navigator: fakeNav("none"),
      document: fakeDoc(),
    });
    await expect(wl.enable()).resolves.toBe(false);
  });

  it("fordert an und gibt wieder frei", async () => {
    const nav = fakeNav("ok");
    const wl = createWakeLock({ navigator: nav, document: fakeDoc() });
    await wl.enable();
    expect(nav.count()).toBe(1);
    await wl.disable();
    expect(nav.sentinels[0].released).toBe(true);
  });

  it("kein Doppel-Request bei erneutem enable()", async () => {
    const nav = fakeNav("ok");
    const wl = createWakeLock({ navigator: nav, document: fakeDoc() });
    await wl.enable();
    await wl.enable();
    expect(nav.count()).toBe(1);
  });

  it("fordert bei Rückkehr (visible) erneut an, wenn das System freigegeben hat", async () => {
    const nav = fakeNav("ok");
    const doc = fakeDoc();
    const wl = createWakeLock({ navigator: nav, document: doc });
    await wl.enable();
    nav.sentinels[0].release(); // System gibt beim Verdecken frei
    await flush();
    doc.visibilityState = "visible";
    doc._fire("visibilitychange");
    await flush();
    expect(nav.count()).toBe(2);
  });

  it("abgelehnter Request wird abgefangen", async () => {
    const nav = fakeNav("reject");
    const wl = createWakeLock({ navigator: nav, document: fakeDoc() });
    await expect(wl.enable()).resolves.toBe(false);
  });
});
