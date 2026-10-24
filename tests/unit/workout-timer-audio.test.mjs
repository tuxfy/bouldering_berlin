import { describe, it, expect } from "vitest";
import { createAudio } from "../../app/tools/workout-timer/audio.js";

// Töne als Web-Audio, aber über einen injizierten AudioContext prüfbar.
// Frequenzen/Längen aus dem Entwurf (Main.dc.html: signal/beep).

function fakeContext() {
  const param = () => ({
    value: 0,
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
  });
  const oscs = [];
  const ctx = {
    state: "suspended",
    currentTime: 0,
    resumed: 0,
    resume() {
      this.state = "running";
      this.resumed++;
    },
    destination: {},
    createDynamicsCompressor: () => ({
      threshold: param(),
      knee: param(),
      ratio: param(),
      attack: param(),
      release: param(),
      connect() {},
    }),
    createOscillator() {
      const o = {
        type: "",
        frequency: { value: 0 },
        connect() {},
        start() {},
        stop() {},
      };
      oscs.push(o);
      return o;
    },
    createGain: () => ({ gain: param(), connect() {} }),
  };
  return { ctx, oscs };
}

describe("createAudio", () => {
  it("unlock() erzeugt den Context und setzt ihn fort (Start-Geste)", () => {
    const { ctx } = fakeContext();
    const a = createAudio({
      AudioContext: function () {
        return ctx;
      },
    });
    expect(a.unlock()).toBe(true);
    expect(ctx.state).toBe("running");
    expect(ctx.resumed).toBe(1);
  });

  it("signal('work') spielt einen Ton mit 2093 Hz", () => {
    const { ctx, oscs } = fakeContext();
    const a = createAudio({
      AudioContext: function () {
        return ctx;
      },
    });
    a.signal("work");
    expect(oscs).toHaveLength(1);
    expect(oscs[0].frequency.value).toBe(2093);
  });

  it("signal('done') spielt drei aufsteigende Töne", () => {
    const { ctx, oscs } = fakeContext();
    const a = createAudio({
      AudioContext: function () {
        return ctx;
      },
    });
    a.signal("done");
    expect(oscs.map((o) => o.frequency.value)).toEqual([1318, 1760, 2637]);
  });

  it("ohne AudioContext: Stumm-Rückfall ohne Fehler", () => {
    const a = createAudio({ AudioContext: null });
    expect(a.unlock()).toBe(false);
    expect(() => a.signal("work")).not.toThrow();
  });
});
