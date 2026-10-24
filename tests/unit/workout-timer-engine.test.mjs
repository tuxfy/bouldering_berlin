import { describe, it, expect } from "vitest";
import {
  buildTimeline,
  totalSeconds,
} from "../../app/tools/workout-timer/timeline.js";
import {
  activeSeconds,
  locate,
  signalsFor,
  view,
} from "../../app/tools/workout-timer/engine.js";

// Reine Ablauflogik, uhr-injizierbar. Werte/Regeln aus dem Entwurf (Main.dc.html).

const CFG = { sets: 2, reps: 2, work: 5, rest: 2, pause: 10 };
// Timeline: prep10, work(1,1)5, rest(1,1)2, work(1,2)5, pause10, work(2,1)5, rest(2,1)2, work(2,2)5
const TL = buildTimeline(CFG);
const TOTAL = totalSeconds(CFG); // 10+5+2+5+10+5+2+5 = 44

describe("activeSeconds (Uhr mit Pause-Verrechnung)", () => {
  it("laufend: now − start − akkumulierte Pause", () => {
    expect(
      activeSeconds({ startedAt: 1000, pausedAccum: 0, pausedAt: null }, 4000),
    ).toBeCloseTo(3);
    expect(
      activeSeconds(
        { startedAt: 1000, pausedAccum: 500, pausedAt: null },
        4000,
      ),
    ).toBeCloseTo(2.5);
  });
  it("angehalten: friert bei pausedAt ein", () => {
    const clock = { startedAt: 1000, pausedAccum: 0, pausedAt: 3000 };
    expect(activeSeconds(clock, 9999)).toBeCloseTo(2);
  });
  it("nie negativ", () => {
    expect(
      activeSeconds({ startedAt: 5000, pausedAccum: 0, pausedAt: null }, 1000),
    ).toBe(0);
  });
});

describe("locate (driftfrei)", () => {
  it("Start: Vorlauf, volle Restzeit", () => {
    const l = locate(TL, 0);
    expect(l).toMatchObject({
      done: false,
      idx: 0,
      kind: "prep",
      rep: 1,
      set: 1,
    });
    expect(l.rem).toBeCloseTo(10);
    expect(l.progress).toBeCloseTo(0);
  });
  it("Grenze zum ersten Work", () => {
    const l = locate(TL, 10);
    expect(l).toMatchObject({ idx: 1, kind: "work", set: 1, rep: 1 });
    expect(l.rem).toBeCloseTo(5);
  });
  it("mitten im Work: Restzeit und Fortschritt", () => {
    const l = locate(TL, 12); // 2 s in erstes Work (dur 5)
    expect(l.kind).toBe("work");
    expect(l.rem).toBeCloseTo(3);
    expect(l.progress).toBeCloseTo(0.4);
  });
  it("kurz vor Ende noch nicht fertig, am Ende fertig", () => {
    expect(locate(TL, TOTAL - 0.001).done).toBe(false);
    expect(locate(TL, TOTAL).done).toBe(true);
    expect(locate(TL, TOTAL + 100).done).toBe(true);
  });
});

describe("signalsFor", () => {
  const at = (e) => locate(TL, e);
  it("Phasenbeginn Work/Rest/Pause", () => {
    expect(signalsFor(at(9.9), at(10.1))).toContain("work");
    expect(signalsFor(at(14.9), at(15.1))).toContain("rest");
    expect(signalsFor(at(21.9), at(22.1))).toContain("pause");
  });
  it("Vorlauf-Beginn löst keinen Phasenton aus", () => {
    expect(signalsFor(null, at(0))).toEqual([]);
  });
  it("Countdown nur beim ganzzahligen Übergang 3/2/1", () => {
    // erstes Work: dur 5 bei elapsed 10..15, rem 5..0
    expect(signalsFor(at(11.9), at(12.1))).toContain("tick"); // rem 3.1→2.9, ceil 4→3
    expect(signalsFor(at(12.9), at(13.1))).toContain("tick"); // rem 2.1→1.9, ceil 3→2
    expect(signalsFor(at(12.1), at(12.4))).not.toContain("tick"); // ceil 3→3, kein Übergang
    expect(signalsFor(at(10.9), at(11.1))).not.toContain("tick"); // ceil 5→4, nicht in 1..3
  });
  it("Ende löst done aus", () => {
    expect(signalsFor(at(TOTAL - 0.1), at(TOTAL + 0.1))).toEqual(["done"]);
  });
});

describe("view", () => {
  const flags = { paused: false, live: true };
  it("Work: Label, Ton, Caption, Hint auf nächstes Rest", () => {
    const v = view(TL, locate(TL, 12), CFG, flags);
    expect(v.label).toBe("WORK");
    expect(v.tone).toBe("orange");
    expect(v.caption).toBe("Gib alles");
    expect(v.hint).toBe("Als Nächstes: Rest · 0:02");
    expect(v.hintTone).toBe("green");
    expect(v.repLabel).toBe("1 / 2");
    expect(v.setLabel).toBe("1 / 2");
  });
  it("angehalten: Caption Angehalten", () => {
    const v = view(TL, locate(TL, 12), CFG, { paused: true, live: true });
    expect(v.caption).toBe("Angehalten");
  });
  it("Puls kurz vor dem Sekundenwechsel in den letzten 3 s (laufend)", () => {
    expect(view(TL, locate(TL, 12.1), CFG, flags).pulse).toBe(true); // rem 2.9
    expect(
      view(TL, locate(TL, 12.1), CFG, { paused: true, live: true }).pulse,
    ).toBe(false);
  });
  it("SegmentBar-Füllung: erledigte Reps voll, laufender anteilig", () => {
    const v = view(TL, locate(TL, 19), CFG, flags); // zweites Work des 1. Sets (idx3), rep2
    expect(v.segments[0]).toBeCloseTo(1); // Rep 1 erledigt
    expect(v.segments[1]).toBeGreaterThan(0); // Rep 2 läuft
    expect(v.segments[1]).toBeLessThan(1);
  });
  it("Fertig: DONE, Gesamtdauer, Zusammenfassung, alle Segmente voll", () => {
    const v = view(TL, locate(TL, TOTAL), CFG, { paused: false, live: false });
    expect(v.label).toBe("DONE");
    expect(v.value).toBe("0:44");
    expect(v.caption).toBe("Workout geschafft");
    expect(v.tone).toBe("neutral");
    expect(v.hint).toBe("2 Sets · 2 Reps · 5 s / 2 s");
    expect(v.segments).toEqual([1, 1]);
  });
  it("letztes Work ohne Folgephase: Sonder-Hint", () => {
    const tl1 = buildTimeline({ sets: 1, reps: 1, work: 7, rest: 3, pause: 0 });
    const v = view(
      tl1,
      locate(tl1, 10.5),
      { sets: 1, reps: 1, work: 7, rest: 3, pause: 0 },
      flags,
    );
    expect(v.hint).toBe("Letzter Rep — gleich geschafft");
  });
});
