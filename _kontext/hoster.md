# Hoster: GitHub Pages

Die App wird als statischer Ordner `app/` über GitHub Actions nach GitHub Pages ausgeliefert. Keine Zugangsdaten im Repo — der Deploy läuft über OIDC (`id-token`), die Rechte vergibt GitHub Pages selbst.

## Einmalig einrichten (Nutzer)

1. **Repo anlegen** und als Remote setzen:
   ```bash
   git remote add origin git@github.com:<konto>/<repo>.git
   git push -u origin main
   ```
2. **Submodul** ist mitverknüpft; nach einem frischen Clone:
   ```bash
   git submodule update --init
   ```
   Das Submodul `_kontext/designsystem` wird **nur lokal** für `npm run ds:copy` bzw. ein DS-Update gebraucht. **CI und Deploy fassen es nicht an** — sie arbeiten mit der eingecheckten Kopie unter `app/vendor/designsystem/`; ihre Checkouts ziehen bewusst keine Submodule (siehe Anforderung `002-ci-submodul-designsystem`).
3. **Pages aktivieren:** GitHub → Repo → **Settings → Pages → Build and deployment → Source: „GitHub Actions"**.

Danach ist nichts weiter zu tun — CI läuft bei jedem Push, der Deploy bei jedem Release-Tag.

## Ausliefern (Release)

Auslieferung ist an das Release-Tag gebunden (Release-Modell `rc/<version>` → Tag `v<version>`, siehe `_anweisungen/08-release.md`):

```bash
git tag v<version>
git push origin v<version>
```

Der Workflow `deploy.yml` fährt zuerst **alle Prüfungen** (`npm test`) und liefert nur bei grünem Ergebnis aus. Die Service-Worker-Cache-Kennung wird dabei automatisch auf das Tag gesetzt, damit installierte PWAs die neuen Dateien bekommen.

## Zurückrollen

Kein Rebuild nötig — den vorherigen, funktionierenden Stand erneut veröffentlichen:

- GitHub → **Actions → Deploy** → den Lauf des **vorherigen Tags** öffnen → **„Re-run all jobs"**. Das veröffentlicht genau diesen Tag-Stand wieder.

Alternativ einen Korrektur-Release mit neuem Tag ausliefern.

## URL

Projekt-Pages liegen unter `https://<konto>.github.io/<repo>/` (Unterpfad). Deshalb nutzt die App ausschließlich **relative** Pfade; am Hoster ist dafür nichts einzustellen.
