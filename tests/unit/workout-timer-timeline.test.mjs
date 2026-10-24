import { describe, it, expect } from "vitest";
import {
  FIELDS,
  defaults,
  buildTimeline,
  totalSeconds,
  clampField,
  formatTime,
  PREP_SECONDS,
} from "../../app/tools/workout-timer/timeline.js";

// Reine Logik aus dem freigegebenen Entwurf (Main.dc.html: timeline, fmt, row-Grenzen).

describe("defaults / FIELDS", () => {
  it("liefert die Vorgaben aus dem Entwurf", () => {
    expect(defaults()).toEqual({
      sets: 5,
      pause: 180,
      work: 7,
      reps: 6,
      rest: 3,
    });
  });

  it("kennt alle fünf Felder mit Grenzen", () => {
    const keys = FIELDS.map((f) => f.key);
    expect(keys).toEqual(["sets", "pause", "work", "reps", "rest"]);
    const pause = FIELDS.find((f) => f.key === "pause");
    expect([pause.min, pause.max, pause.step]).toEqual([0, 900, 15]);
  });
});

describe("buildTimeline", () => {
  it("beginnt mit dem Vorlauf (10 s)", () => {
    const t = buildTimeline(defaults());
    expect(t[0]).toEqual({ kind: "prep", dur: PREP_SECONDS, set: 1, rep: 1 });
  });

  it("ein Set, ein Rep: nur Vorlauf und ein Work, kein Rest, keine Pause", () => {
    const t = buildTimeline({ sets: 1, reps: 1, work: 7, rest: 3, pause: 180 });
    expect(t.map((p) => p.kind)).toEqual(["prep", "work"]);
  });

  it("Work und Rest wechseln, kein Rest nach dem letzten Rep, Pause zwischen Sets", () => {
    const t = buildTimeline({ sets: 2, reps: 2, work: 5, rest: 2, pause: 30 });
    expect(t.map((p) => p.kind)).toEqual([
      "prep",
      "work",
      "rest",
      "work",
      "pause",
      "work",
      "rest",
      "work",
    ]);
    // keine Pause nach dem letzten Set
    expect(t.filter((p) => p.kind === "pause").length).toBe(1);
  });

  it("Pause = 0 wird übersprungen", () => {
    const t = buildTimeline({ sets: 2, reps: 1, work: 5, rest: 2, pause: 0 });
    expect(t.map((p) => p.kind)).toEqual(["prep", "work", "work"]);
  });
});

describe("totalSeconds", () => {
  it("summiert inklusive Vorlauf (Vorgaben = 16:55)", () => {
    expect(totalSeconds(defaults())).toBe(1015);
    expect(formatTime(totalSeconds(defaults()))).toBe("16:55");
  });

  it("stimmt mit der Summe der Timeline-Dauern überein", () => {
    const cfg = { sets: 3, reps: 4, work: 20, rest: 10, pause: 60 };
    const sum = buildTimeline(cfg).reduce((a, p) => a + p.dur, 0);
    expect(totalSeconds(cfg)).toBe(sum);
  });
});

describe("clampField", () => {
  it("klemmt an die Grenzen", () => {
    expect(clampField("sets", 0)).toBe(1);
    expect(clampField("sets", 25)).toBe(20);
    expect(clampField("pause", -5)).toBe(0);
    expect(clampField("pause", 1000)).toBe(900);
    expect(clampField("work", 700)).toBe(600);
  });
});

describe("formatTime", () => {
  it("rundet auf und formatiert m:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(4.3)).toBe("0:05");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(-3)).toBe("0:00");
  });
});
