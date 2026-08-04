/* =========================================================
   Carlos ERP – Store (v2)
   Datenmodell + lokale Speicherung (localStorage) + Auswertungen
   Alles bleibt lokal auf dem Gerät. Basiswährung: EUR.
   ========================================================= */
const Store = (function () {
  "use strict";

  const KEY = "wealthmanager_data_v2";

  /* ---------------------------------------------------------
     Konfiguration
     --------------------------------------------------------- */
  const BEREICHE = {
    privat:        { label: "Privat" },
    geschaeftlich: { label: "Business" }
  };

  // Kategorien mit Label & Farbe (SAP-Fiori-Diagrammpalette)
  const KATEGORIEN = {
    bank:        { label: "Bankkonten",        singular: "Bankkonto",   color: "#1b90ff" },
    wertpapiere: { label: "Wertpapiere",       singular: "Wertpapier",  color: "#7858ff" },
    krypto:      { label: "Kryptowährungen",   singular: "Position",    color: "#e76500" },
    edelmetalle: { label: "Edelmetalle",       singular: "Position",    color: "#d9a400" },
    uhren:       { label: "Wertgegenstände",   singular: "Wertgegenstand", color: "#049f9a" },
    immobilien:  { label: "Immobilien",        singular: "Objekt",     color: "#36a41d" },
    forderungen: { label: "Forderungen / Verbindlichkeiten", singular: "Position", color: "#fa4f96" },
    sonstiges:   { label: "Sonstiges",         singular: "Position",    color: "#5b738b" }
  };

  const ROLLEN = [
    "Bank / Finanzierer", "Notar", "Steuerberater", "Mieter",
    "Gesellschafter", "Makler", "Handwerker / Dienstleister"
  ];

  const NEWS_TAGS = {
    zinsen:     { label: "Zinsen / EZB",   color: "#0070f2" },
    immobilien: { label: "Immobilienmarkt", color: "#36a41d" },
    kurse:      { label: "Kurse",           color: "#7858ff" }
  };

  /* ---------------------------------------------------------
     Formular-Schemata je Kategorie
     (erstes Feld hat immer key "name" = Anzeigename)
     Typen: text | num | select ; "val:true" = Feld ist direkt der Wert
     --------------------------------------------------------- */
  const SCHEMAS = {
    bank: [
      { k: "name", label: "Kontobezeichnung", type: "text", req: true },
      { k: "bank", label: "Bank", type: "text" },
      { k: "stand", label: "Aktueller Kontostand (€)", type: "num" }
    ],
    wertpapiere: [
      { k: "name", label: "Bezeichnung", type: "text", req: true },
      { k: "isin", label: "ISIN / Ticker", type: "text" },
      { k: "stueck", label: "Stückzahl", type: "num" },
      { k: "einstand", label: "Einstandskurs (€)", type: "num" },
      { k: "kurs", label: "Aktueller Kurs (€)", type: "num" },
      { k: "depot", label: "Depot", type: "text" }
    ],
    krypto: [
      { k: "name", label: "Coin / Token", type: "text", req: true },
      { k: "menge", label: "Menge", type: "num" },
      { k: "einstand", label: "Einstandskurs (€)", type: "num" },
      { k: "kurs", label: "Aktueller Kurs (€)", type: "num" },
      { k: "wallet", label: "Wallet / Börse", type: "text" }
    ],
    edelmetalle: [
      { k: "name", label: "Bezeichnung", type: "text", req: true },
      { k: "art", label: "Art", type: "select", opts: ["Gold", "Silber", "Platin", "Palladium"] },
      { k: "menge", label: "Menge", type: "num" },
      { k: "einheit", label: "Einheit", type: "select", opts: ["g", "oz"] },
      { k: "einstand", label: "Einstandspreis / Einheit (€)", type: "num" },
      { k: "kurs", label: "Aktueller Kurs / Einheit (€)", type: "num" }
    ],
    uhren: [
      { k: "name", label: "Bezeichnung / Marke", type: "text", req: true },
      { k: "kaufpreis", label: "Kaufpreis (€)", type: "num" },
      { k: "wert", label: "Geschätzter aktueller Wert (€)", type: "num" }
    ],
    immobilien: [
      { k: "name", label: "Bezeichnung / Adresse", type: "text", req: true },
      { k: "kaufpreis", label: "Kaufpreis (€)", type: "num" },
      { k: "marktwert", label: "Aktueller Marktwert (€)", type: "num" },
      { k: "restschuld", label: "Kredit / Restschuld (€)", type: "num" },
      { k: "kosten", label: "Monatliche Kosten (€)", type: "num" }
    ],
    forderungen: [
      { k: "name", label: "Bezeichnung", type: "text", req: true },
      { k: "art", label: "Art", type: "select", opts: ["Forderung", "Verbindlichkeit", "Kalkulatorische Miete"] },
      { k: "gegenpartei", label: "Gegenpartei (Business Partner)", type: "partner" },
      { k: "betrag", label: "Betrag (€)", type: "num" },
      { k: "miete", label: "Monatliche Miete (€)", type: "num" },
      { k: "start", label: "Startdatum", type: "date" }
    ],
    sonstiges: [
      { k: "name", label: "Bezeichnung", type: "text", req: true },
      { k: "wert", label: "Wert (€)", type: "num" }
    ]
  };

  // Vermietete KG-Immobilien: erweiterte Felder (Basis für Cashflow & Bilanz)
  const STREAMS = [
    { key: "stream1", label: "Stream 1: KG Rent" },
    { key: "stream2", label: "Stream 2: Marbella Rent" }
  ];
  function streamOf(a) { return (a && a.fields && a.fields.stream) || "stream1"; }

  const KG_IMMO_SCHEMA = [
    { k: "name", label: "Bezeichnung / Adresse", type: "text", req: true },
    { k: "kaufpreis", label: "Kaufpreis (€)", type: "num" },
    { k: "marktwert", label: "Aktueller Marktwert (€)", type: "num" },
    { k: "kaltmiete", label: "Kaltmiete / Monat (€)", type: "num" },
    { k: "nebenkosten", label: "Nebenkosten / Monat (durchlaufend, €)", type: "num" },
    { k: "kreditrate", label: "Kreditrate / Monat (€)", type: "num" },
    { k: "restschuld", label: "Restschuld (€)", type: "num" },
    { k: "instandhaltung", label: "Instandhaltungsrücklage / Monat (€)", type: "num" },
    { k: "einheiten", label: "Anzahl Einheiten", type: "num" },
    { k: "mieter", label: "Mieter (Business Partner)", type: "partner" },
    { k: "mietbeginn", label: "Mieter seit", type: "date" },
    { k: "stream", label: "Stream", type: "stream" }
  ];

  function schemaFor(bereich, kategorie) {
    if (kategorie === "immobilien" && bereich === "geschaeftlich") return KG_IMMO_SCHEMA;
    return SCHEMAS[kategorie] || SCHEMAS.sonstiges;
  }

  // Welche Kategorien gibt es je Bereich? (für Übersichten)
  const KATS_PRIVAT = ["bank", "wertpapiere", "krypto", "edelmetalle", "uhren", "immobilien", "forderungen", "sonstiges"];
  const KATS_GESCHAEFT = ["bank", "immobilien"]; // bewertbare Asset-Kategorien der KG

  /* ---------------------------------------------------------
     Zustand
     --------------------------------------------------------- */
  const DEFAULT_STATE = {
    version: 2,
    assets: [],
    partners: [],
    buchungskreise: [],
    termine: [],
    snapshots: [],
    settings: {}
  };
  let state = clone(DEFAULT_STATE);

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function nowIso() { return new Date().toISOString(); }
  function num(v) { return Number(v) || 0; }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        state = {
          version: 2,
          assets: Array.isArray(p.assets) ? p.assets : [],
          partners: Array.isArray(p.partners) ? p.partners : [],
          buchungskreise: Array.isArray(p.buchungskreise) ? p.buchungskreise : [],
          termine: Array.isArray(p.termine) ? p.termine : [],
          snapshots: Array.isArray(p.snapshots) ? p.snapshots : [],
          settings: p.settings || {}
        };
      }
    } catch (e) {
      console.warn("Carlos ERP: Laden fehlgeschlagen.", e);
    }
    migratePartners();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Carlos ERP: Speichern fehlgeschlagen.", e);
      alert("Achtung: Speichern nicht möglich (Speicher voll oder blockiert).");
    }
    if (cloudSync) { try { cloudSync(); } catch (e) { /* Sync best effort */ } }
  }

  /* ---------------------------------------------------------
     Cloud-Sync (Supabase) – wird von auth.js verdrahtet
     --------------------------------------------------------- */
  let cloudSync = null;
  function setCloudSync(fn) { cloudSync = fn; }      // Callback, das save() nach jeder Änderung aufruft
  function getRawState() { return state; }            // aktuellen Zustand für den Upload holen
  function setRawState(obj) {                          // Zustand aus der Cloud übernehmen (ohne Rück-Sync)
    if (!obj || typeof obj !== "object") return;
    state = {
      version: 2,
      assets: Array.isArray(obj.assets) ? obj.assets : [],
      partners: Array.isArray(obj.partners) ? obj.partners : [],
      buchungskreise: Array.isArray(obj.buchungskreise) ? obj.buchungskreise : [],
      termine: Array.isArray(obj.termine) ? obj.termine : [],
      snapshots: Array.isArray(obj.snapshots) ? obj.snapshots : [],
      settings: obj.settings || {}
    };
    migratePartners();
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* Cache best effort */ }
  }
  function clearLocalCache() {                          // beim Logout: nichts auf dem Gerät zurücklassen
    state = clone(DEFAULT_STATE);
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------
     Berechnungen
     --------------------------------------------------------- */
  function titleOf(a) {
    return (a.fields && a.fields.name) ? a.fields.name : "(ohne Namen)";
  }

  // Angefangene Monate seit Startdatum (erste Miete ist ab dem Starttag fällig).
  // Beispiel: Start 15.01., heute 20.07. → 7 fällige Monatsmieten.
  function monthsSince(ymd) {
    if (!ymd) return 0;
    const s = new Date(ymd + "T00:00:00");
    if (isNaN(s.getTime())) return 0;
    const now = new Date();
    let m = (now.getFullYear() - s.getFullYear()) * 12 + (now.getMonth() - s.getMonth());
    if (now.getDate() < s.getDate()) m -= 1;
    return Math.max(0, m + 1);
  }

  // Aktueller Wert (EUR). Immobilien: Eigenkapital = Marktwert − Restschuld.
  function computeValue(a) {
    const f = a.fields || {};
    switch (a.kategorie) {
      case "bank":        return num(f.stand);
      case "wertpapiere": return num(f.stueck) * num(f.kurs);
      case "krypto":      return num(f.menge) * num(f.kurs);
      case "edelmetalle": return num(f.menge) * num(f.kurs);
      case "uhren":       return num(f.wert);
      case "immobilien":  return num(f.marktwert) - num(f.restschuld);
      case "forderungen":
        // Kalkulatorische Miete ist eine auflaufende Verbindlichkeit → negativ
        if (f.art === "Kalkulatorische Miete") return -(monthsSince(f.start) * num(f.miete));
        return (f.art === "Verbindlichkeit" ? -1 : 1) * num(f.betrag);
      case "sonstiges":   return num(f.wert);
      default:            return num(f.wert);
    }
  }

  // Wertveränderung als Anteil (z. B. 0.12 = +12 %) oder null
  function computeChange(a) {
    const f = a.fields || {};
    let base = 0, curr = 0;
    switch (a.kategorie) {
      case "wertpapiere":
      case "krypto":
      case "edelmetalle": base = num(f.einstand); curr = num(f.kurs); break;
      case "uhren":       base = num(f.kaufpreis); curr = num(f.wert); break;
      case "immobilien":  base = num(f.kaufpreis); curr = num(f.marktwert); break;
      default: return null;
    }
    if (base <= 0) return null;
    return (curr - base) / base;
  }

  // Monatlicher Cashflow (EUR). Nebenkosten sind durchlaufend → neutral.
  function computeCashflow(a) {
    const f = a.fields || {};
    if (a.kategorie !== "immobilien") return 0;
    if (a.bereich === "geschaeftlich") {
      return num(f.kaltmiete) - num(f.kreditrate) - num(f.instandhaltung);
    }
    return -num(f.kosten);
  }

  /* ---------------------------------------------------------
     Assets (CRUD)
     --------------------------------------------------------- */
  function getAssets(filter) {
    // filter: {bereich?, kategorie?}
    filter = filter || {};
    return state.assets.filter(function (a) {
      if (filter.bereich && a.bereich !== filter.bereich) return false;
      if (filter.kategorie && a.kategorie !== filter.kategorie) return false;
      return true;
    });
  }
  function getAsset(id) { return state.assets.find(function (a) { return a.id === id; }); }

  function addAsset(bereich, kategorie, fields, dokumente) {
    const a = { id: uid(), bereich: bereich, kategorie: kategorie, fields: fields || {}, dokumente: dokumente || [], createdAt: nowIso(), updatedAt: nowIso() };
    state.assets.push(a);
    save();
    return a;
  }
  function updateAsset(id, fields, dokumente) {
    const a = getAsset(id);
    if (a) {
      a.fields = fields;
      if (dokumente !== undefined) a.dokumente = dokumente;
      a.updatedAt = nowIso();
      save();
    }
  }
  function deleteAsset(id) {
    state.assets = state.assets.filter(function (a) { return a.id !== id; });
    save();
  }

  /* ---------------------------------------------------------
     Summen / KPIs
     --------------------------------------------------------- */
  // bereich: "alles" | "privat" | "geschaeftlich"
  function totals(bereich) {
    const list = state.assets.filter(function (a) {
      return bereich === "alles" ? true : a.bereich === bereich;
    });
    let netWorth = 0, cashflow = 0, lastUpdate = null;
    const byKategorie = {};
    list.forEach(function (a) {
      const v = computeValue(a);
      netWorth += v;
      cashflow += computeCashflow(a);
      byKategorie[a.kategorie] = (byKategorie[a.kategorie] || 0) + v;
      if (!lastUpdate || a.updatedAt > lastUpdate) lastUpdate = a.updatedAt;
    });
    return { netWorth: netWorth, cashflow: cashflow, count: list.length, lastUpdate: lastUpdate, byKategorie: byKategorie };
  }

  /* ---------------------------------------------------------
     KG-Auswertungen (Cashflow & Bilanz/GuV) aus vermieteten Immobilien
     --------------------------------------------------------- */
  function kgImmobilien(stream) {
    return getAssets({ bereich: "geschaeftlich", kategorie: "immobilien" })
      .filter(function (a) { return !stream || streamOf(a) === stream; });
  }

  function kgCashflow(stream) {
    let kaltmiete = 0, nebenkosten = 0, kreditrate = 0, instandhaltung = 0, einheiten = 0;
    kgImmobilien(stream).forEach(function (a) {
      const f = a.fields || {};
      kaltmiete += num(f.kaltmiete);
      nebenkosten += num(f.nebenkosten);
      kreditrate += num(f.kreditrate);
      instandhaltung += num(f.instandhaltung);
      einheiten += num(f.einheiten);
    });
    const netto = kaltmiete - kreditrate - instandhaltung;
    return { kaltmiete: kaltmiete, nebenkosten: nebenkosten, kreditrate: kreditrate, instandhaltung: instandhaltung, netto: netto, einheiten: einheiten };
  }

  function kgBilanz() {
    const cf = kgCashflow();
    let marktwert = 0, restschuld = 0, bankGuthaben = 0;
    kgImmobilien().forEach(function (a) { marktwert += num(a.fields.marktwert); restschuld += num(a.fields.restschuld); });
    getAssets({ bereich: "geschaeftlich", kategorie: "bank" }).forEach(function (a) { bankGuthaben += num(a.fields.stand); });
    return {
      // GuV (Jahr)
      mieteinnahmen: cf.kaltmiete * 12,
      betriebskosten: cf.nebenkosten * 12,
      kreditraten: cf.kreditrate * 12,
      instandhaltung: cf.instandhaltung * 12,
      ergebnis: cf.netto * 12,
      // Bilanz (Stichtag)
      aktivaImmobilien: marktwert,
      aktivaBank: bankGuthaben,
      aktiva: marktwert + bankGuthaben,
      verbindlichkeiten: restschuld,
      eigenkapital: marktwert + bankGuthaben - restschuld
    };
  }

  /* ---------------------------------------------------------
     Business Partner (Stammdaten + Notizen mit Zeitstempel + Dokumente)
     --------------------------------------------------------- */
  // Bestehende Partner auf das aktuelle Format bringen (einmalig, idempotent).
  function migratePartners() {
    state.partners.forEach(function (p) {
      if (p.notiz && (!Array.isArray(p.notizen) || !p.notizen.length)) {
        p.notizen = [{ id: uid(), text: p.notiz, ts: p.createdAt || nowIso() }];
      }
      if ("notiz" in p) delete p.notiz;
      if (!Array.isArray(p.notizen)) p.notizen = [];
      if (!Array.isArray(p.dokumente)) p.dokumente = [];
    });
  }

  function getPartners() { return state.partners.slice(); }
  function getPartner(id) { return state.partners.find(function (p) { return p.id === id; }); }
  function addPartner(data) {
    const p = { id: uid(), name: data.name || "", typ: data.typ || "person", rollen: data.rollen || [], notizen: [], dokumente: [], createdAt: nowIso() };
    state.partners.push(p); save(); return p;
  }
  function updatePartner(id, data) {
    const p = getPartner(id);
    if (p) { p.name = data.name; p.typ = data.typ; p.rollen = data.rollen; save(); }
  }
  function deletePartner(id) { state.partners = state.partners.filter(function (p) { return p.id !== id; }); save(); }

  // Notizen mit Zeitstempel
  function addPartnerNote(id, text) {
    const p = getPartner(id);
    if (!p || !text) return;
    if (!Array.isArray(p.notizen)) p.notizen = [];
    p.notizen.push({ id: uid(), text: String(text), ts: nowIso() });
    save();
  }
  function deletePartnerNote(id, noteId) {
    const p = getPartner(id);
    if (!p || !Array.isArray(p.notizen)) return;
    p.notizen = p.notizen.filter(function (n) { return n.id !== noteId; });
    save();
  }

  // Dokumente (lokal als Data-URL gespeichert). Bei Speicherüberlauf: Rollback.
  function addPartnerDocument(id, doc) {
    const p = getPartner(id);
    if (!p) return { ok: false, error: "Partner nicht gefunden." };
    if (!Array.isArray(p.dokumente)) p.dokumente = [];
    const entry = { id: uid(), name: doc.name || "Dokument", type: doc.type || "", size: doc.size || 0, dataUrl: doc.dataUrl || "", ts: nowIso() };
    p.dokumente.push(entry);
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      p.dokumente.pop(); // Rollback, damit In-Memory und Speicher konsistent bleiben
      return { ok: false, error: "Speicher voll – Datei zu groß für die lokale Ablage." };
    }
    return { ok: true, entry: entry };
  }
  function deletePartnerDocument(id, docId) {
    const p = getPartner(id);
    if (!p || !Array.isArray(p.dokumente)) return;
    p.dokumente = p.dokumente.filter(function (d) { return d.id !== docId; });
    save();
  }

  /* ---------------------------------------------------------
     Termine
     --------------------------------------------------------- */
  function getTermine() {
    return state.termine.slice().sort(function (a, b) { return (a.datum || "").localeCompare(b.datum || ""); });
  }
  function getTermin(id) { return state.termine.find(function (t) { return t.id === id; }); }
  function addTermin(data) {
    const t = { id: uid(), titel: data.titel || "", datum: data.datum || "", notiz: data.notiz || "" };
    state.termine.push(t); save(); return t;
  }
  function updateTermin(id, data) {
    const t = getTermin(id);
    if (t) { t.titel = data.titel; t.datum = data.datum; t.notiz = data.notiz; save(); }
  }
  function deleteTermin(id) { state.termine = state.termine.filter(function (t) { return t.id !== id; }); save(); }

  /* ---------------------------------------------------------
     Buchungskreise (SAP-Logik; später Basis für Auswertungen)
     --------------------------------------------------------- */
  function getBuchungskreise() {
    return (state.buchungskreise || []).slice().sort(function (a, b) { return (a.schluessel || "").localeCompare(b.schluessel || "", "de"); });
  }
  function getBuchungskreis(id) { return (state.buchungskreise || []).find(function (b) { return b.id === id; }); }
  function addBuchungskreis(data) {
    const b = { id: uid(), schluessel: data.schluessel || "", name: data.name || "", waehrung: data.waehrung || "EUR", notiz: data.notiz || "", createdAt: nowIso() };
    if (!Array.isArray(state.buchungskreise)) state.buchungskreise = [];
    state.buchungskreise.push(b); save(); return b;
  }
  function updateBuchungskreis(id, data) {
    const b = getBuchungskreis(id);
    if (b) { b.schluessel = data.schluessel; b.name = data.name; b.waehrung = data.waehrung; b.notiz = data.notiz; save(); }
  }
  function deleteBuchungskreis(id) { state.buchungskreise = (state.buchungskreise || []).filter(function (b) { return b.id !== id; }); save(); }

  /* ---------------------------------------------------------
     News (kuratierter Beispiel-Feed – live-Feed folgt später)
     --------------------------------------------------------- */
  function getNews() {
    return [
      { tag: "zinsen",     titel: "EZB belässt Leitzins bei 3,25 % – Signale für erste Senkung im Herbst", zeit: "vor 2 Std." },
      { tag: "immobilien", titel: "Mietspiegel-Update: Angebotsmieten in Großstädten +4,1 % zum Vorjahr", zeit: "vor 6 Std." },
      { tag: "kurse",      titel: "Bitcoin über 55.000 € – ruhiger Wochenausklang an den Kryptomärkten", zeit: "gestern" },
      { tag: "kurse",      titel: "MSCI World nahe Allzeithoch, Tech-Werte stützen den Index", zeit: "gestern" },
      { tag: "immobilien", titel: "Baufinanzierung: Bauzinsen seitwärts, Nachfrage zieht leicht an", zeit: "vor 2 Tagen" },
      { tag: "zinsen",     titel: "Tagesgeld-Vergleich: Top-Konditionen weiter über 3 %", zeit: "vor 3 Tagen" }
    ];
  }

  /* ---------------------------------------------------------
     Snapshots (Nettovermögen-Verlauf)
     --------------------------------------------------------- */
  function getSnapshots() {
    return state.snapshots.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
  }
  function addSnapshot() {
    const all = totals("alles");
    const snap = {
      id: uid(), date: nowIso(),
      total: all.netWorth,
      privat: totals("privat").netWorth,
      geschaeftlich: totals("geschaeftlich").netWorth
    };
    state.snapshots.push(snap); save(); return snap;
  }
  function deleteSnapshot(id) { state.snapshots = state.snapshots.filter(function (s) { return s.id !== id; }); save(); }

  /* ---------------------------------------------------------
     Export / Backup
     --------------------------------------------------------- */
  function exportJSON() { return JSON.stringify(state, null, 2); }
  function importJSON(json) {
    const p = (typeof json === "string") ? JSON.parse(json) : json;
    if (!p || !Array.isArray(p.assets)) throw new Error("Ungültige Backup-Datei.");
    state = {
      version: 2,
      assets: p.assets,
      partners: Array.isArray(p.partners) ? p.partners : [],
      buchungskreise: Array.isArray(p.buchungskreise) ? p.buchungskreise : [],
      termine: Array.isArray(p.termine) ? p.termine : [],
      snapshots: Array.isArray(p.snapshots) ? p.snapshots : [],
      settings: p.settings || {}
    };
    migratePartners();
    save();
  }
  function csvCell(v) {
    v = (v === null || v === undefined) ? "" : String(v);
    if (/[";\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
    return v;
  }
  function exportCSV() {
    const head = ["Bereich", "Buchungskreis", "Kategorie", "Name", "Wert_EUR", "Cashflow_mtl_EUR", "Veränderung_%"];
    const rows = state.assets.map(function (a) {
      const ch = computeChange(a);
      return [
        BEREICHE[a.bereich] ? BEREICHE[a.bereich].label : a.bereich,
        (a.fields && a.fields.buchungskreis) ? a.fields.buchungskreis : "",
        KATEGORIEN[a.kategorie] ? KATEGORIEN[a.kategorie].label : a.kategorie,
        titleOf(a),
        computeValue(a).toFixed(2).replace(".", ","),
        computeCashflow(a).toFixed(2).replace(".", ","),
        ch === null ? "" : (ch * 100).toFixed(1).replace(".", ",")
      ];
    });
    return [head].concat(rows).map(function (r) { return r.map(csvCell).join(";"); }).join("\r\n");
  }

  function clearAll() {
    state.assets = []; state.partners = []; state.buchungskreise = []; state.termine = []; state.snapshots = [];
    save();
  }

  /* ---------------------------------------------------------
     Beispieldaten
     --------------------------------------------------------- */
  function loadSample() {
    const ago = function (days) { return new Date(Date.now() - days * 86400000).toISOString(); };
    const N = function (text, days) { return { id: uid(), text: text, ts: ago(days || 0) }; };
    const DOC = function (name, text) {
      return { id: uid(), name: name, type: "text/plain", size: text.length, ts: nowIso(),
        dataUrl: "data:text/plain;base64," + btoa(unescape(encodeURIComponent(text))) };
    };
    const A = function (bereich, kategorie, fields, dokumente) { return { id: uid(), bereich: bereich, kategorie: kategorie, fields: fields, dokumente: dokumente || [], createdAt: nowIso(), updatedAt: nowIso() }; };
    state.assets = [
      // ---- Privat ----
      A("privat", "bank", { name: "Girokonto", bank: "Sparkasse", stand: 8450 }),
      A("privat", "bank", { name: "Tagesgeld", bank: "ING", stand: 25000 }),
      A("privat", "wertpapiere", { name: "ETF MSCI World", isin: "IE00B4L5Y983", stueck: 450, einstand: 78, kurs: 94, depot: "comdirect" }),
      A("privat", "wertpapiere", { name: "Apple Inc.", isin: "US0378331005", stueck: 25, einstand: 150, kurs: 190, depot: "Trade Republic" }),
      A("privat", "wertpapiere", { name: "Tesla Inc.", isin: "US88160R1014", stueck: 15, einstand: 240, kurs: 205, depot: "Trade Republic" }),
      A("privat", "krypto", { name: "Bitcoin", menge: 0.35, einstand: 42000, kurs: 55000, wallet: "Ledger" }),
      A("privat", "krypto", { name: "Ethereum", menge: 3, einstand: 2200, kurs: 2900, wallet: "Kraken" }),
      A("privat", "edelmetalle", { name: "Goldbarren 100 g", art: "Gold", menge: 100, einheit: "g", einstand: 55, kurs: 68 }),
      A("privat", "edelmetalle", { name: "Silbermünzen", art: "Silber", menge: 2000, einheit: "g", einstand: 0.70, kurs: 0.85 }),
      A("privat", "uhren", { name: "Rolex Submariner", kaufpreis: 9000, wert: 13500 }),
      A("privat", "uhren", { name: "Omega Speedmaster", kaufpreis: 5500, wert: 6200 }),
      A("privat", "immobilien", { name: "Eigentumswohnung München", kaufpreis: 280000, marktwert: 320000, restschuld: 150000, kosten: 350 }),
      A("privat", "forderungen", { name: "Privatdarlehen an T. Krüger", art: "Forderung", gegenpartei: "Thomas Krüger", betrag: 15000 }),
      A("privat", "forderungen", { name: "Restzahlung Einbauküche", art: "Verbindlichkeit", gegenpartei: "Küchenstudio Nord", betrag: 4200 }),
      A("privat", "forderungen", { name: "Kalkulatorische Miete ETW München", art: "Kalkulatorische Miete", gegenpartei: "Thomas Krüger", miete: 950, start: new Date(Date.now() - 268 * 86400000).toISOString().slice(0, 10) }),
      A("privat", "sonstiges", { name: "Oldtimer (Porsche 911)", wert: 28000 }),
      // ---- Business (KG) ----
      A("geschaeftlich", "bank", { name: "Geschäftskonto KG", bank: "Commerzbank", stand: 34000 }),
      A("geschaeftlich", "bank", { name: "Rücklagenkonto", bank: "DKB", stand: 60000 }),
      A("geschaeftlich", "immobilien", { name: "MFH Berlin-Neukölln", kaufpreis: 850000, marktwert: 1100000, kaltmiete: 4200, nebenkosten: 1400, kreditrate: 2600, restschuld: 620000, instandhaltung: 400, einheiten: 6, mieter: "Familie Weber", mietbeginn: "2021-05-01" },
        [DOC("Mietvertrag_WE3.txt", "Mietvertrag MFH Berlin-Neukölln, WE 3\nMieter: Familie Weber\nMietbeginn: 01.05.2021\nKaltmiete: 1.150 EUR/Monat")]),
      A("geschaeftlich", "immobilien", { name: "DHH Leipzig", kaufpreis: 240000, marktwert: 290000, kaltmiete: 1250, nebenkosten: 300, kreditrate: 780, restschuld: 180000, instandhaltung: 120, einheiten: 1, mietbeginn: "2023-09-15" })
    ];

    state.partners = [
      { id: uid(), name: "Sparkasse KölnBonn", typ: "org", rollen: ["Bank / Finanzierer"],
        notizen: [N("Objektfinanzierung Berlin, Zinsbindung bis 2031.", 40), N("Anschlussfinanzierung Leipzig angefragt.", 5)],
        dokumente: [DOC("Kreditvertrag_Berlin.txt", "Kreditvertrag Objekt Berlin (Entwurf)\nDarlehenssumme: 620.000 EUR\nZinssatz: 3,4 %\nZinsbindung bis 2031.")], createdAt: nowIso() },
      { id: uid(), name: "Notariat Dr. Meier", typ: "person", rollen: ["Notar"], notizen: [], dokumente: [], createdAt: nowIso() },
      { id: uid(), name: "Steuerkanzlei Schulz & Partner", typ: "org", rollen: ["Steuerberater"],
        notizen: [N("Jahresabschluss KG bis Ende Q3 einreichen.", 12)], dokumente: [], createdAt: nowIso() },
      { id: uid(), name: "Familie Weber", typ: "person", rollen: ["Mieter"],
        notizen: [N("MFH Berlin, WE 3 – pünktlicher Mieter.", 20)], dokumente: [], createdAt: nowIso() },
      { id: uid(), name: "Thomas Krüger", typ: "person", rollen: ["Gesellschafter"],
        notizen: [N("50 % KG-Anteil. Privatdarlehen 15.000 EUR offen.", 60)], dokumente: [], createdAt: nowIso() },
      { id: uid(), name: "Hausverwaltung Nord GmbH", typ: "org", rollen: ["Handwerker / Dienstleister", "Makler"], notizen: [], dokumente: [], createdAt: nowIso() }
    ];

    const inDays = function (d) { const x = new Date(); x.setDate(x.getDate() + d); return x.toISOString().slice(0, 10); };
    state.termine = [
      { id: uid(), titel: "Notartermin Ankauf Objekt Dresden", datum: inDays(9), notiz: "10:00 Uhr, Notariat Dr. Meier" },
      { id: uid(), titel: "Kündigungsfrist Mietvertrag WE 3 (Berlin)", datum: inDays(24), notiz: "" },
      { id: uid(), titel: "Steuererklärung KG einreichen", datum: inDays(41), notiz: "über Kanzlei Schulz" },
      { id: uid(), titel: "Gesellschafterversammlung", datum: inDays(60), notiz: "Jahresplanung" },
      { id: uid(), titel: "Anschlussfinanzierung prüfen (Leipzig)", datum: inDays(120), notiz: "Zinsbindung läuft aus" }
    ];

    state.buchungskreise = [
      { id: uid(), schluessel: "PRIV", name: "Privatvermögen", waehrung: "EUR", notiz: "Persönliche Konten & Anlagen", createdAt: nowIso() },
      { id: uid(), schluessel: "KG01", name: "Immobilien-KG", waehrung: "EUR", notiz: "Vermietete Objekte & Geschäftskonten", createdAt: nowIso() }
    ];
    // Beispiel-Zuordnung: privat → PRIV, geschäftlich → KG01
    state.assets.forEach(function (a) { a.fields.buchungskreis = a.bereich === "geschaeftlich" ? "KG01" : "PRIV"; });

    // Verlauf: einige Snapshots in der Vergangenheit
    const now = Date.now(), DAY = 86400000;
    const t = totals("alles"), tp = totals("privat"), tg = totals("geschaeftlich");
    state.snapshots = [];
    [[150, 0.88], [120, 0.91], [90, 0.93], [60, 0.96], [30, 0.98], [0, 1]].forEach(function (pair) {
      state.snapshots.push({
        id: uid(),
        date: new Date(now - pair[0] * DAY).toISOString(),
        total: Math.round(t.netWorth * pair[1]),
        privat: Math.round(tp.netWorth * pair[1]),
        geschaeftlich: Math.round(tg.netWorth * pair[1])
      });
    });

    save();
  }

  /* ---------------------------------------------------------
     Öffentliche Schnittstelle
     --------------------------------------------------------- */
  return {
    load: load, save: save,
    // Assets
    getAssets: getAssets, getAsset: getAsset, addAsset: addAsset, updateAsset: updateAsset, deleteAsset: deleteAsset,
    computeValue: computeValue, computeChange: computeChange, computeCashflow: computeCashflow, titleOf: titleOf, monthsSince: monthsSince,
    totals: totals, kgCashflow: kgCashflow, kgBilanz: kgBilanz, kgImmobilien: kgImmobilien, streamOf: streamOf, STREAMS: STREAMS,
    // Partner / Termine / News / Snapshots
    getPartners: getPartners, getPartner: getPartner, addPartner: addPartner, updatePartner: updatePartner, deletePartner: deletePartner,
    addPartnerNote: addPartnerNote, deletePartnerNote: deletePartnerNote,
    addPartnerDocument: addPartnerDocument, deletePartnerDocument: deletePartnerDocument,
    getTermine: getTermine, getTermin: getTermin, addTermin: addTermin, updateTermin: updateTermin, deleteTermin: deleteTermin,
    getBuchungskreise: getBuchungskreise, getBuchungskreis: getBuchungskreis, addBuchungskreis: addBuchungskreis, updateBuchungskreis: updateBuchungskreis, deleteBuchungskreis: deleteBuchungskreis,
    getNews: getNews,
    getSnapshots: getSnapshots, addSnapshot: addSnapshot, deleteSnapshot: deleteSnapshot,
    // Export & Cloud-Sync
    exportJSON: exportJSON, importJSON: importJSON, exportCSV: exportCSV, clearAll: clearAll, loadSample: loadSample,
    setCloudSync: setCloudSync, getRawState: getRawState, setRawState: setRawState, clearLocalCache: clearLocalCache,
    // Config
    schemaFor: schemaFor, SCHEMAS: SCHEMAS,
    BEREICHE: BEREICHE, KATEGORIEN: KATEGORIEN, ROLLEN: ROLLEN, NEWS_TAGS: NEWS_TAGS,
    KATS_PRIVAT: KATS_PRIVAT, KATS_GESCHAEFT: KATS_GESCHAEFT
  };
})();
