# Carlos · Personal ERP

Dein persönliches Vermögens-ERP: das komplette finanzielle Leben – **privat und
Business (KG)** – in einer lokalen Web-App im hellen, SAP-inspirierten Design.

> 🔒 **Zugriff & Datenschutz:** Login per E-Mail/Passwort (Supabase Auth). Die Daten liegen
> in Supabase (Postgres) und sind durch **Row Level Security (RLS)** geschützt – nur der
> eingeloggte Benutzer kann seine eigenen Daten lesen/schreiben. `localStorage` dient nur
> noch als Offline-Cache und wird beim Abmelden geleert.

---

## Starten

Die App muss über **HTTP** laufen (Supabase-CORS), nicht per `file://`-Doppelklick. Lokal z. B.:

```bash
python3 -m http.server 8747 --directory .
# dann http://localhost:8747 öffnen
```

Beim ersten Login werden vorhandene lokale Daten in die Cloud übernommen.
Zum Ausprobieren: **Einstellungen → Beispieldaten laden.**

### Konfiguration
`assets/js/config.js` enthält `SUPABASE_URL` + `SUPABASE_ANON_KEY` (öffentlich – RLS schützt die
Daten). Das DB-Schema inkl. RLS-Policies liegt in [`supabase/schema.sql`](supabase/schema.sql).

---

## Module

| Modul | Inhalt |
|---|---|
| **Übersicht** | KPI-Kacheln (Nettovermögen, Cashflow/Monat, Positionen, letztes Update), Filter Alles/Privat/Business, Vermögensaufteilung, Verlauf, Positionsliste |
| **Zentrale Daten** | Carlos Schäuble (persönliche Stammdaten, Platzhalter), Business Partner (Rollen als Freitext, Notizen mit Zeitstempel und lokale Dokumenten-Ablage je Partner) und Buchungskreise (anlegen/bearbeiten mit Schlüssel, Bezeichnung, Währung). Jede Position lässt sich einem Buchungskreis zuordnen (Auswertung nach SAP-Logik folgt; Buchungskreis ist bereits im CSV-Export enthalten) |
| **Privat** | Bankkonten, Wertpapiere, Kryptowährungen, Edelmetalle, Wertgegenstände, Immobilien, Forderungen/Verbindlichkeiten, Sonstiges – je Kategorie eigene Datenfelder und Wertveränderung in %. **Wertpapiere** als Portfolio-Ansicht: Depotwert & Gewinn/Verlust (€/%), Ring-Diagramm der Anteile und Gewinn/Verlust-Balken je Position |
| **Business** | Bankkonten · Gruppe „Stream 1: Real Estate" (Immobilien – Platzhalter; **Vermietung** mit Mieter aus den Business Partnern, „Mieter seit"-Datum und Dokumenten wie Mietvertrag; Einnahmen/Ausgaben – Platzhalter) · Bilanz/GuV (Jahr) · Cashflow (Monat) – live aus den Objekten berechnet |
| **Chatbot** | Stufe 1: beantwortet Fragen zu deinen strukturierten Zahlen (lokal, ohne KI) |
| **News** | Kuratierter Beispiel-Feed (Zinsen/EZB, Immobilienmarkt, Kurse) |
| **Termine** | Fristen & Deadlines mit Fälligkeitsanzeige |

**Rechenlogik:** Immobilienwert = Marktwert − Restschuld · KG-Cashflow = Kaltmiete −
Kreditraten − Instandhaltungsrücklage (Nebenkosten sind durchlaufend) · GuV = Monatswerte × 12 ·
Verbindlichkeiten zählen negativ · **Kalkulatorische Miete** = Monatsmiete × angefangene
Monate seit Startdatum – wird als **Verbindlichkeit (negativ)** geführt und wächst automatisch
jeden Monat weiter; die Gegenpartei wird aus den Business Partnern ausgewählt.

---

## Backups

Die Daten liegen nur lokal im Browser. **Erstelle regelmäßig ein JSON-Backup**
(Einstellungen → Daten & Backup); dort gibt es auch CSV-Export und Import.

---

## Projektstruktur

```
Carlos-ERP/
├─ index.html            → Oberfläche (Sidebar-Layout)
├─ assets/
│  ├─ css/styles.css     → Design (helles SAP-Fiori-Thema)
│  └─ js/
│     ├─ store.js        → Datenmodell, Berechnungen, localStorage, Export
│     ├─ charts.js       → SVG-Diagramme (Donut & Verlauf)
│     └─ app.js          → Navigation, Ansichten, Formulare, Chatbot
└─ README.md
```

---

## Ausblick (spätere Stufen)

Dokumenten-Ablage je Business Partner/Objekt → Chatbot Stufe 2 (Dokumenten-RAG) →
automatische Bankanbindung (PSD2) → Live-Kurse. Datenlogik und Darstellung sind
getrennt, das Backend-Datenmodell liegt als Spezifikation vor.
