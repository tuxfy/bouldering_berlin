// Einstieg der Hülle: registriert den Service Worker für Offline-Betrieb.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.error("Service-Worker-Registrierung fehlgeschlagen:", err);
    });
  });
}
