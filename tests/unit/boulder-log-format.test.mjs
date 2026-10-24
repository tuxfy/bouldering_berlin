import { describe, it, expect } from "vitest";
import { formatLine, appendLine } from "../../app/tools/boulder-log/format.js";

// Reine Logik aus dem freigegebenen Entwurf (Main.dc.html, add-Logik).
// Format: `- <grad>: <n> tries[ (send)][ - <tags>]`, `1 try` bei genau einem Versuch.

describe("formatLine", () => {
  it("formatiert mehrere Versuche mit send, ohne Styles", () => {
    expect(
      formatLine({ grade: "6a", tries: 2, send: true, styles: [], note: "" }),
    ).toBe("- 6a: 2 tries (send)");
  });

  it("nutzt den Singular bei genau einem Versuch", () => {
    expect(
      formatLine({ grade: "6b", tries: 1, send: false, styles: [], note: "" }),
    ).toBe("- 6b: 1 try");
  });

  it("lässt (send) weg, wenn nicht geschafft", () => {
    expect(
      formatLine({ grade: "6b", tries: 2, send: false, styles: [], note: "" }),
    ).toBe("- 6b: 2 tries");
  });

  it("hängt Styles nach dem Gedankenstrich an", () => {
    expect(
      formatLine({
        grade: "6c",
        tries: 3,
        send: true,
        styles: ["crimp", "sloper"],
        note: "",
      }),
    ).toBe("- 6c: 3 tries (send) - crimp, sloper");
  });

  it("hängt 'Weitere Angaben' an die Styles an", () => {
    expect(
      formatLine({
        grade: "6b",
        tries: 1,
        send: false,
        styles: ["overhang", "sloper", "pinch"],
        note: "test",
      }),
    ).toBe("- 6b: 1 try - overhang, sloper, pinch, test");
  });

  it("nimmt 'Weitere Angaben' auch ohne Styles", () => {
    expect(
      formatLine({
        grade: "6a",
        tries: 1,
        send: false,
        styles: [],
        note: "sit start",
      }),
    ).toBe("- 6a: 1 try - sit start");
  });

  it("trimmt den Grad", () => {
    expect(
      formatLine({
        grade: "  7a ",
        tries: 1,
        send: false,
        styles: [],
        note: "",
      }),
    ).toBe("- 7a: 1 try");
  });

  it("ignoriert 'Weitere Angaben' aus nur Leerzeichen", () => {
    expect(
      formatLine({
        grade: "6a",
        tries: 1,
        send: false,
        styles: [],
        note: "   ",
      }),
    ).toBe("- 6a: 1 try");
  });

  it("erzeugt keine ' - '-Liste, wenn Styles und Note leer sind", () => {
    expect(
      formatLine({ grade: "5c", tries: 2, send: false, styles: [], note: "" }),
    ).toBe("- 5c: 2 tries");
  });
});

describe("appendLine", () => {
  it("gibt bei leerem Log keine führende Leerzeile", () => {
    expect(appendLine("", "- 6a: 1 try")).toBe("- 6a: 1 try");
  });

  it("behandelt ein Log aus nur Leerzeichen wie leer", () => {
    expect(appendLine("   \n ", "- 6a: 1 try")).toBe("- 6a: 1 try");
  });

  it("hängt an ein vorhandenes Log mit genau einem Zeilenumbruch an", () => {
    expect(appendLine("- 5c: 2 tries", "- 6a: 1 try")).toBe(
      "- 5c: 2 tries\n- 6a: 1 try",
    );
  });

  it("verdoppelt einen vorhandenen Trailing-Zeilenumbruch nicht", () => {
    expect(appendLine("- 5c: 2 tries\n", "- 6a: 1 try")).toBe(
      "- 5c: 2 tries\n- 6a: 1 try",
    );
  });
});
