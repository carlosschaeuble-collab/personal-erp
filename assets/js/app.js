/* =========================================================
   Carlos ERP – App (v2)
   Navigation, Ansichten, Formulare, lokaler Chatbot
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Icons (Inline-SVG, Linienstil) ---------------- */
  const ICONS = {
    uebersicht:   'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    zentrale:     'M12 3c4.4 0 8 1.34 8 3s-3.6 3-8 3-8-1.34-8-3 3.6-3 8-3ZM4 6v12c0 1.66 3.6 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.6 3 8 3s8-1.34 8-3',
    privat:       'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c0-3.6 3.1-6 7-6s7 2.4 7 6',
    geschaeftlich:'M4 8h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18',
    bank:         'M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M4 20h16',
    wertpapiere:  'M4 15l4.5-4.5 3.5 3 6.5-6.5M16 7h4v4',
    krypto:       'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM9.5 8h4a2 2 0 0 1 0 4h-4zM9.5 12h4.5a2 2 0 0 1 0 4h-4.5zM11 6.5v11',
    edelmetalle:  'M4 14h6v5H4zM14 14h6v5h-6zM9 8h6v5H9z',
    uhren:        'M6 3h12l4 6-10 13L2 9ZM11 3 8 9l4 13 4-13-3-6M2 9h20',
    immobilien:   'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-6h4v6',
    forderungen:  'M4 8h12M16 8l-3-3M16 8l-3 3M20 16H8M8 16l3-3M8 16l3 3',
    sonstiges:    'M12 3 21 8v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v9',
    partner:      'M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11ZM2.5 20c0-3.2 2.9-5 6.5-5s6.5 1.8 6.5 5M16 4.6a3.2 3.2 0 0 1 0 6.3M17.5 15.2c2.3.5 4 2.2 4 4.8',
    dokument:     'M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v4h4M9 13h6M9 16h4',
    buchungskreis:'M4 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M14 21V9h5a1 1 0 0 1 1 1v11M3 21h18M7 7h3M7 11h3M7 15h3',
    bilanz:       'M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM14 3v5h5M9 13h7M9 16h5',
    cashflow:     'M4 9a8 8 0 0 1 13.5-3.5L20 8M20 4v4h-4M20 15a8 8 0 0 1-13.5 3.5L4 16M4 20v-4h4',
    chatbot:      'M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 4V6a1 1 0 0 1 1-1ZM8.5 10h7M8.5 13h4',
    news:         'M5 5h12v14H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1ZM17 8h2a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2M8 9h6M8 12h6M8 15h4',
    termine:      'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM4 10h16M9 4v4M15 4v4',
    settings:     'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 4v2M12 18v2M4.9 6.3l1.4 1.4M17.7 16.3l1.4 1.4M19.1 6.3l-1.4 1.4M6.3 16.3 4.9 17.7M4 12h2M18 12h2'
  };
  function icon(key) {
    const d = ICONS[key] || ICONS.sonstiges;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';
  }

  /* ---------------- Navigation ---------------- */
  const NAV = [
    { section: "uebersicht", label: "Übersicht", icon: "uebersicht" },
    { section: "zentrale", label: "Zentrale Daten", icon: "zentrale", children: [
      { kat: "person", label: "Carlos Schäuble" },
      { kat: "partner", label: "Business Partner" },
      { kat: "buchungskreise", label: "Buchungskreise" }
    ] },
    { section: "privat", label: "Privat", icon: "privat", children: [
      { kat: "bank", label: "Bankkonten" }, { kat: "wertpapiere", label: "Wertpapiere" },
      { kat: "krypto", label: "Kryptowährungen" }, { kat: "edelmetalle", label: "Edelmetalle" },
      { kat: "uhren", label: "Wertgegenstände" }, { kat: "immobilien", label: "Immobilien" },
      { kat: "forderungen", label: "Forderungen / Verbindl." }, { kat: "sonstiges", label: "Sonstiges" }
    ] },
    { section: "geschaeftlich", label: "Business", icon: "geschaeftlich", children: [
      { kat: "bank", label: "Bankkonten" },
      { group: "stream1", label: "Stream 1: Real Estate", children: [
        { kat: "immobilienbestand", label: "Immobilien" },
        { kat: "immobilien", label: "Vermietung" },
        { kat: "einnahmen_ausgaben", label: "Einnahmen / Ausgaben" }
      ] },
      { kat: "bilanz", label: "Bilanz / GuV" }, { kat: "cashflow", label: "Cashflow" }
    ] },
    { section: "chatbot", label: "Chatbot", icon: "chatbot" },
    { section: "news", label: "News", icon: "news" },
    { section: "termine", label: "Termine", icon: "termine" }
  ];

  const ui = { section: "uebersicht", kat: null, partnerId: null, filter: "alles", expanded: { zentrale: true, privat: true, geschaeftlich: true, stream1: true }, chat: [] };
  let assetDocs = []; // Arbeitskopie der Dokumente im geöffneten Asset-Formular

  // Welche Assets erlauben Datei-Anhänge (z. B. Mietvertrag)? → vermietete KG-Immobilien
  function assetSupportsDocs(bereich, kat) { return bereich === "geschaeftlich" && kat === "immobilien"; }

  // Formular-Schema = Kategorie-Felder + universelles Buchungskreis-Feld (jede Position)
  function formSchema(bereich, kat) {
    return Store.schemaFor(bereich, kat).concat([{ k: "buchungskreis", label: "Buchungskreis", type: "buchungskreis" }]);
  }

  /* ---------------- Formatierung ---------------- */
  function fmtEur(n, dec) {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }).format(n || 0);
  }
  function fmtNum(n, dec) {
    return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: dec === undefined ? 4 : dec }).format(n || 0);
  }
  function fmtPct(frac) {
    return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(frac * 100) + " %";
  }
  function fmtDate(v) {
    if (!v) return "–";
    return new Date(v).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function relDays(ymd) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const d = new Date(ymd); d.setHours(0, 0, 0, 0);
    const diff = Math.round((d - today) / 86400000);
    if (diff === 0) return "heute";
    if (diff === 1) return "morgen";
    if (diff === -1) return "gestern";
    if (diff > 0) return "in " + diff + " Tagen";
    return "vor " + Math.abs(diff) + " Tagen";
  }
  function fmtDateTime(v) {
    if (!v) return "–";
    return new Date(v).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  function fmtSize(bytes) {
    bytes = Number(bytes) || 0;
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1).replace(".", ",") + " MB";
    if (bytes >= 1024) return Math.round(bytes / 1024) + " KB";
    return bytes + " B";
  }
  function esc(s) {
    return String(s === null || s === undefined ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function el(id) { return document.getElementById(id); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ---------------- Portfolio-Helfer ---------------- */
  const PALETTE = ["#0070f2", "#e76500", "#7858ff", "#049f9a", "#36a41d", "#d9a400", "#fa4f96", "#1b90ff", "#5b738b", "#925ace"];
  // Eingesetztes Kapital (Anschaffungskosten) je Position → Basis für Gewinn/Verlust
  function costBasisOf(a) {
    const f = a.fields || {};
    switch (a.kategorie) {
      case "wertpapiere": return (Number(f.stueck) || 0) * (Number(f.einstand) || 0);
      case "krypto":
      case "edelmetalle": return (Number(f.menge) || 0) * (Number(f.einstand) || 0);
      case "uhren":      return Number(f.kaufpreis) || 0;
      case "immobilien": return Number(f.kaufpreis) || 0;
      default:           return 0;
    }
  }

  /* ---------------- Bausteine ---------------- */
  function subText(a, showBereich) {
    const f = a.fields || {};
    const parts = [];
    if (showBereich) parts.push(Store.BEREICHE[a.bereich].label);
    switch (a.kategorie) {
      case "bank": if (f.bank) parts.push(f.bank); break;
      case "wertpapiere": parts.push(fmtNum(f.stueck) + " × " + fmtEur(f.kurs)); if (f.depot) parts.push(f.depot); break;
      case "krypto": parts.push(fmtNum(f.menge) + " × " + fmtEur(f.kurs)); if (f.wallet) parts.push(f.wallet); break;
      case "edelmetalle": parts.push(fmtNum(f.menge) + " " + (f.einheit || "g") + " × " + fmtEur(f.kurs)); break;
      case "uhren": if (f.kaufpreis) parts.push("Kauf " + fmtEur(f.kaufpreis)); break;
      case "immobilien":
        if (a.bereich === "geschaeftlich") {
          parts.push("Miete " + fmtEur(f.kaltmiete) + "/M");
          parts.push(fmtNum(f.einheiten, 0) + " Einh.");
          if (f.mieter) parts.push("Mieter: " + f.mieter);
        } else parts.push("Marktwert " + fmtEur(f.marktwert) + " − Schuld " + fmtEur(f.restschuld));
        break;
      case "forderungen":
        if (f.art === "Kalkulatorische Miete") {
          parts.push(fmtEur(f.miete) + "/Monat seit " + fmtDate(f.start) + " · " + Store.monthsSince(f.start) + " Monate");
        } else {
          parts.push(f.art || "Forderung");
        }
        if (f.gegenpartei) parts.push(f.gegenpartei);
        break;
    }
    return esc(parts.join("  ·  "));
  }

  function assetRow(a, showBereich) {
    const f = a.fields || {};
    const val = Store.computeValue(a);
    const ch = Store.computeChange(a);
    let changeHtml = '<span class="lr-change"></span>';
    if (ch !== null) {
      const up = ch >= 0;
      changeHtml = '<span class="lr-change ' + (up ? "up" : "down") + '">' + (up ? "▲ " : "▼ ") + fmtPct(Math.abs(ch)) + "</span>";
    }
    // Bankkonten: Bank im Vordergrund, Kontobezeichnung darunter
    let primary, sub;
    if (a.kategorie === "bank") {
      const konto = f.name || "", bank = f.bank || "";
      primary = esc(bank || konto || "(ohne Namen)");
      const p = [];
      if (showBereich) p.push(esc(Store.BEREICHE[a.bereich].label));
      if (bank && konto) p.push(esc(konto));
      sub = p.join("  ·  ");
    } else {
      primary = esc(Store.titleOf(a));
      sub = subText(a, showBereich);
    }
    // Buchungskreis immer als blaues Badge (wie in den Buchungskreisen)
    const bkBadge = f.buchungskreis ? '<span class="bk-key">' + esc(f.buchungskreis) + "</span>" : "";
    return '<div class="ledger-row" data-action="edit-asset" data-id="' + a.id + '">' +
      '<span class="lr-icon">' + icon(a.kategorie) + "</span>" +
      '<span class="lr-main"><span class="lr-name">' + bkBadge + primary + "</span>" +
      '<span class="lr-sub">' + sub + "</span></span>" +
      changeHtml +
      '<span class="lr-value' + (val < 0 ? " neg" : "") + '">' + fmtEur(val) + "</span></div>";
  }

  // Gruppierte Ledger-Liste nach Kategorie
  function ledgerByKategorie(assets, opts) {
    opts = opts || {};
    const groups = {};
    assets.forEach(function (a) { (groups[a.kategorie] = groups[a.kategorie] || []).push(a); });
    let html = "";
    Store.KATS_PRIVAT.forEach(function (kat) {
      const list = groups[kat];
      if (!list || !list.length) return;
      const sum = list.reduce(function (s, a) { return s + Store.computeValue(a); }, 0);
      const meta = Store.KATEGORIEN[kat];
      const addBtn = opts.addBereich
        ? '<button class="icon-btn btn-sm" style="width:26px;height:26px;font-size:15px" data-action="add-asset" data-bereich="' + opts.addBereich + '" data-kat="' + kat + '" title="Hinzufügen">+</button>'
        : '<span class="lg-sum">' + fmtEur(sum) + "</span>";
      html += '<div class="ledger-group"><div class="ledger-group-head">' +
        '<span class="lg-title"><span class="lg-dot" style="background:' + meta.color + '"></span>' + meta.label + "</span>" +
        (opts.addBereich ? '<span style="display:flex;gap:10px;align-items:center"><span class="lg-sum">' + fmtEur(sum) + "</span>" + addBtn + "</span>" : addBtn) +
        "</div>" +
        list.sort(function (a, b) { return Store.computeValue(b) - Store.computeValue(a); })
          .map(function (a) { return assetRow(a, opts.showBereich); }).join("") +
        "</div>";
    });
    return html;
  }

  function kpi(label, value, opts) {
    opts = opts || {};
    return '<div class="kpi"><span class="kpi-label">' + label + "</span>" +
      '<span class="kpi-value' + (opts.accent ? " accent" : "") + '">' + value + "</span>" +
      (opts.foot ? '<span class="kpi-foot ' + (opts.footClass || "") + '">' + opts.foot + "</span>" : "") + "</div>";
  }

  function segmented() {
    function b(v, l) { return '<button data-action="filter" data-filter="' + v + '"' + (ui.filter === v ? ' class="active"' : "") + ">" + l + "</button>"; }
    return '<div class="segmented">' + b("alles", "Alles") + b("privat", "Privat") + b("geschaeftlich", "Business") + "</div>";
  }

  function emptyState(mark, title, text, actions) {
    return '<div class="panel"><div class="empty"><div class="empty-mark">' + mark + "</div>" +
      "<h3>" + title + "</h3><p>" + text + "</p>" + (actions || "") + "</div></div>";
  }

  /* ================= ÜBERSICHT ================= */
  function uebersichtHtml() {
    const t = Store.totals(ui.filter);
    const snaps = Store.getSnapshots();

    const investments = (t.byKategorie.wertpapiere || 0) + (t.byKategorie.krypto || 0) + (t.byKategorie.edelmetalle || 0);
    const liquid = t.byKategorie.bank || 0;

    const kpis = '<div class="kpis kpis-3">' +
      kpi("Net Worth", fmtEur(t.netWorth), { accent: true, foot: "Vermögen abzgl. Schulden" }) +
      kpi("Investments", fmtEur(investments), { foot: "Wertpapiere · Krypto · Edelmetalle" }) +
      kpi("Liquid Assets", fmtEur(liquid), { foot: "Bankkonten" }) +
      "</div>" +
      '<div class="kpis kpis-3 kpis-sub">' +
      kpi("Cashflow / Monat", fmtEur(t.cashflow), { foot: "laufend", footClass: t.cashflow >= 0 ? "up" : "down" }) +
      kpi("Positionen", t.count, { foot: "erfasst" }) +
      kpi("Letztes Update", fmtDate(t.lastUpdate), { foot: "zuletzt geändert" }) +
      "</div>";

    const segs = kategorieSegments(t.byKategorie);
    let donutPanel = "";
    if (segs.length) {
      const legend = '<ul class="legend">' + segs.map(function (s) {
        const p = t.netWorth ? s.value / t.netWorth * 100 : 0;
        return '<li class="legend-item"><span class="legend-dot" style="background:' + s.color + '"></span>' +
          '<span class="legend-label">' + esc(s.label) + "</span>" +
          '<span class="legend-val">' + fmtEur(s.value) + "</span>" +
          '<span class="legend-pct">' + fmtNum(p, 0) + " %</span></li>";
      }).join("") + "</ul>";
      donutPanel = '<div class="panel"><div class="panel-head"><h3 class="panel-title">Aufteilung</h3></div>' +
        '<div class="donut-wrap"><div id="donut"></div>' + legend + "</div></div>";
    }

    let trendPanel = "";
    if (snaps.length >= 2) {
      trendPanel = '<div class="panel"><div class="panel-head"><h3 class="panel-title">Vermögensentwicklung</h3>' +
        '<button class="btn btn-sm" data-action="save-snapshot">＋ Snapshot</button></div>' +
        '<div class="chart-box" id="trendChart"></div>' +
        '<div class="chart-legend">' + legDot("#0070f2", "Gesamt") + legDot("#36a41d", "Privat") + legDot("#e76500", "Business") + "</div></div>";
    }

    const assets = Store.getAssets(ui.filter === "alles" ? {} : { bereich: ui.filter });
    const listPanel = assets.length
      ? '<div class="panel">' + ledgerByKategorie(assets, { showBereich: ui.filter === "alles" }) + "</div>"
      : emptyState("₀", "Noch keine Positionen", "Lege links unter Privat oder Business deine ersten Vermögenswerte an – oder starte mit Beispieldaten.",
          '<button class="btn" data-action="load-sample">Beispieldaten laden</button>');

    return head("Cockpit", "Übersicht", segmented()) + kpis +
      (donutPanel || trendPanel ? '<div class="grid-2">' + (donutPanel || "") + (trendPanel || "") + "</div>" : "") +
      listPanel;
  }

  function kategorieSegments(byKat) {
    return Store.KATS_PRIVAT.filter(function (k) { return byKat[k] > 0; })
      .map(function (k) { return { label: Store.KATEGORIEN[k].label, value: byKat[k], color: Store.KATEGORIEN[k].color }; })
      .sort(function (a, b) { return b.value - a.value; });
  }
  function legDot(c, l) { return '<span class="legend-item"><span class="legend-dot" style="background:' + c + '"></span>' + l + "</span>"; }

  function head(eyebrow, title, right) {
    return '<div class="section-head"><div><p class="eyebrow">' + eyebrow + "</p><h1>" + title + "</h1></div>" + (right || "") + "</div>";
  }

  /* ================= BEREICHS-ÜBERSICHT (Privat / KG) ================= */
  function bereichOverviewHtml(bereich) {
    const t = Store.totals(bereich);
    const label = Store.BEREICHE[bereich].label;
    let kpis = '<div class="kpis">' +
      kpi("Nettovermögen", fmtEur(t.netWorth), { accent: true }) +
      kpi("Cashflow / Monat", fmtEur(t.cashflow), { footClass: t.cashflow >= 0 ? "up" : "down", foot: "laufend" }) +
      kpi("Positionen", t.count, { foot: "erfasst" }) +
      kpi("Letztes Update", fmtDate(t.lastUpdate), {}) + "</div>";

    const assets = Store.getAssets({ bereich: bereich });
    const list = assets.length
      ? '<div class="panel">' + ledgerByKategorie(assets, { addBereich: bereich }) + "</div>"
      : emptyState("₀", "Noch nichts erfasst", "Wähle links eine Kategorie oder füge direkt eine Position hinzu.", "");

    let extra = "";
    if (bereich === "geschaeftlich") {
      extra = '<div class="grid-2">' +
        '<div class="panel"><div class="panel-head"><h3 class="panel-title">Cashflow / Monat</h3>' +
        '<button class="btn btn-sm btn-ghost" data-action="nav" data-section="geschaeftlich" data-kat="cashflow">Details →</button></div>' +
        cashflowMiniTable() + "</div>" +
        '<div class="panel"><div class="panel-head"><h3 class="panel-title">Eigenkapital (Bilanz)</h3>' +
        '<button class="btn btn-sm btn-ghost" data-action="nav" data-section="geschaeftlich" data-kat="bilanz">Details →</button></div>' +
        bilanzMiniTable() + "</div></div>";
    }

    return head(label, label, "") + kpis + extra + list;
  }

  /* ================= KATEGORIE-LISTE ================= */
  function katListHtml(bereich, kat) {
    const meta = Store.KATEGORIEN[kat];
    const label = (bereich === "geschaeftlich" && kat === "immobilien") ? "Vermietung" : meta.label;
    const assets = Store.getAssets({ bereich: bereich, kategorie: kat }).sort(function (a, b) { return Store.computeValue(b) - Store.computeValue(a); });
    const sum = assets.reduce(function (s, a) { return s + Store.computeValue(a); }, 0);

    const right = '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="' + kat + '">＋ Hinzufügen</button>';
    const eyebrow = Store.BEREICHE[bereich].label;

    if (!assets.length) {
      return head(eyebrow, label, right) +
        emptyState(meta.label.charAt(0), "Noch keine " + label, "Füge deine erste Position in dieser Kategorie hinzu.",
          '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="' + kat + '">＋ Erste Position anlegen</button>');
    }

    const rows = assets.map(function (a) { return assetRow(a, false); }).join("");
    const foot = '<div class="ledger-group-head" style="margin-top:14px;border-bottom:none"><span class="lg-title">Summe</span><span class="lg-sum" style="font-size:16px;color:var(--accent-strong)">' + fmtEur(sum) + "</span></div>";
    return head(eyebrow, label, right) + '<div class="panel">' + rows + foot + "</div>";
  }

  /* ================= FORDERUNGEN / VERBINDLICHKEITEN (T-Konto) ================= */
  function tkontoRow(a) {
    const f = a.fields || {};
    const amount = Math.abs(Store.computeValue(a));
    const sub = [];
    if (f.art === "Kalkulatorische Miete") sub.push(fmtEur(f.miete) + "/Monat · " + Store.monthsSince(f.start) + " Monate");
    if (f.gegenpartei) sub.push(esc(f.gegenpartei));
    const bkBadge = f.buchungskreis ? '<span class="bk-key">' + esc(f.buchungskreis) + "</span>" : "";
    return '<div class="tkonto-row" data-action="edit-asset" data-id="' + a.id + '">' +
      '<span class="tkonto-main"><span class="tkonto-name">' + bkBadge + esc(Store.titleOf(a)) + "</span>" +
      (sub.length ? '<span class="tkonto-sub">' + sub.join("  ·  ") + "</span>" : "") + "</span>" +
      '<span class="tkonto-amount">' + fmtEur(amount) + "</span></div>";
  }
  function forderungenHtml(bereich) {
    const meta = Store.KATEGORIEN.forderungen;
    const eyebrow = Store.BEREICHE[bereich].label;
    const right = '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="forderungen">＋ Hinzufügen</button>';
    const assets = Store.getAssets({ bereich: bereich, kategorie: "forderungen" });
    if (!assets.length) {
      return head(eyebrow, meta.label, right) +
        emptyState("T", "Noch keine Einträge", "Erfasse Forderungen und Verbindlichkeiten – sie erscheinen hier als T-Konto.",
          '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="forderungen">＋ Ersten Eintrag anlegen</button>');
    }
    const links = [], rechts = [];
    assets.forEach(function (a) {
      const art = a.fields.art;
      if (art === "Verbindlichkeit" || art === "Kalkulatorische Miete") rechts.push(a);
      else links.push(a);
    });
    const sumL = links.reduce(function (s, a) { return s + Math.abs(Store.computeValue(a)); }, 0);
    const sumR = rechts.reduce(function (s, a) { return s + Math.abs(Store.computeValue(a)); }, 0);
    const saldo = sumL - sumR;

    const col = function (titel, seite, cls, list, sum) {
      const rows = list.length ? list.map(tkontoRow).join("") : '<div class="tkonto-empty">Keine ' + titel + "</div>";
      return '<div class="tkonto-col">' +
        '<div class="tkonto-colhead ' + cls + '">' + titel + " <span>" + seite + "</span></div>" +
        '<div class="tkonto-rows">' + rows + "</div>" +
        '<div class="tkonto-sum"><span>Summe</span><span>' + fmtEur(sum) + "</span></div></div>";
    };

    return head(eyebrow, meta.label, right) +
      '<div class="panel"><div class="tkonto">' +
      col("Forderungen", "Soll", "pos", links, sumL) +
      col("Verbindlichkeiten", "Haben", "neg", rechts, sumR) +
      "</div>" +
      '<div class="tkonto-saldo"><span>Saldo (Netto-Wert)</span><span class="' + (saldo >= 0 ? "pos" : "neg") + '">' + (saldo >= 0 ? "+" : "−") + fmtEur(Math.abs(saldo)) + "</span></div></div>";
  }

  /* ================= BANKKONTEN (Karten-Ansicht) ================= */
  function bankHtml(bereich) {
    const meta = Store.KATEGORIEN.bank;
    const eyebrow = Store.BEREICHE[bereich].label;
    const right = '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="bank">＋ Hinzufügen</button>';
    const accounts = Store.getAssets({ bereich: bereich, kategorie: "bank" }).sort(function (a, b) { return Store.computeValue(b) - Store.computeValue(a); });
    if (!accounts.length) {
      return head(eyebrow, meta.label, right) +
        emptyState("🏦", "Noch keine Bankkonten", "Lege dein erstes Konto an – es erscheint hier als Karte.",
          '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="bank">＋ Erstes Konto anlegen</button>');
    }
    const total = accounts.reduce(function (s, a) { return s + Store.computeValue(a); }, 0);
    const kpis = '<div class="kpis" style="grid-template-columns:repeat(2,1fr)">' +
      kpi("Gesamtsaldo", fmtEur(total), { accent: true }) +
      kpi("Konten", accounts.length, { foot: "erfasst" }) +
      "</div>";
    const cards = '<div class="bank-grid">' + accounts.map(function (a) {
      const f = a.fields || {};
      const bank = f.bank || "", konto = f.name || "";
      const title = bank || konto || "(ohne Namen)";
      const subtitle = (bank && konto) ? konto : "";
      const val = Store.computeValue(a);
      const share = total > 0 ? Math.max(0, val / total * 100) : 0;
      const bkBadge = f.buchungskreis ? '<span class="bk-key">' + esc(f.buchungskreis) + "</span>" : "";
      return '<div class="bank-card" data-action="edit-asset" data-id="' + a.id + '">' +
        '<div class="bank-card-top"><span class="bank-card-bank">' + icon("bank") + "<span>" + esc(title) + "</span></span>" + bkBadge + "</div>" +
        '<div class="bank-card-name">' + (subtitle ? esc(subtitle) : "&nbsp;") + "</div>" +
        '<div class="bank-card-balance' + (val < 0 ? " neg" : "") + '">' + fmtEur(val) + "</div>" +
        '<div class="bank-card-bar"><span style="width:' + share.toFixed(1) + '%"></span></div></div>';
    }).join("") + "</div>";
    return head(eyebrow, meta.label, right) + kpis + cards;
  }

  /* ================= PORTFOLIO-ANSICHT (Wertpapiere) ================= */
  function portfolioData(bereich, kat) {
    const assets = Store.getAssets({ bereich: bereich, kategorie: kat }).slice()
      .sort(function (a, b) { return Store.computeValue(b) - Store.computeValue(a); });
    let totalValue = 0, totalBasis = 0;
    const rows = assets.map(function (a, i) {
      const value = Store.computeValue(a);
      const basis = costBasisOf(a);
      totalValue += value; totalBasis += basis;
      return { a: a, value: value, basis: basis, gv: value - basis, ch: Store.computeChange(a), color: PALETTE[i % PALETTE.length], share: 0 };
    });
    rows.forEach(function (r) { r.share = totalValue > 0 ? r.value / totalValue : 0; });
    const totalGV = totalValue - totalBasis;
    return {
      assets: assets, rows: rows,
      totalValue: totalValue, totalBasis: totalBasis, totalGV: totalGV,
      totalRendite: totalBasis > 0 ? totalGV / totalBasis : null
    };
  }

  function portfolioHtml(bereich, kat) {
    const meta = Store.KATEGORIEN[kat];
    const eyebrow = Store.BEREICHE[bereich].label;
    const right = '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="' + kat + '">＋ Hinzufügen</button>';
    const d = portfolioData(bereich, kat);

    if (!d.assets.length) {
      return head(eyebrow, meta.label, right) +
        emptyState(meta.label.charAt(0), "Noch keine " + meta.label, "Füge deine erste Position in dieser Kategorie hinzu.",
          '<button class="btn btn-primary" data-action="add-asset" data-bereich="' + bereich + '" data-kat="' + kat + '">＋ Erste Position anlegen</button>');
    }

    const gvUp = d.totalGV >= 0;
    const kpis = '<div class="kpis">' +
      kpi("Depotwert", fmtEur(d.totalValue), { accent: true }) +
      kpi("Gewinn / Verlust", (gvUp ? "+" : "−") + fmtEur(Math.abs(d.totalGV)),
        { footClass: gvUp ? "up" : "down", foot: d.totalRendite === null ? "keine Einstände" : ((gvUp ? "▲ " : "▼ ") + fmtPct(Math.abs(d.totalRendite))) }) +
      kpi("Eingesetzt", fmtEur(d.totalBasis), { foot: "Einstand" }) +
      kpi("Positionen", d.assets.length, { foot: "erfasst" }) +
      "</div>";

    // Ring-Diagramm: Anteil am Depot
    const legend = '<ul class="legend">' + d.rows.map(function (r) {
      return '<li class="legend-item"><span class="legend-dot" style="background:' + r.color + '"></span>' +
        '<span class="legend-label">' + esc(Store.titleOf(r.a)) + "</span>" +
        '<span class="legend-val">' + fmtEur(r.value) + "</span>" +
        '<span class="legend-pct">' + fmtNum(r.share * 100, 0) + " %</span></li>";
    }).join("") + "</ul>";
    const donutPanel = '<div class="panel"><div class="panel-head"><h3 class="panel-title">Anteil am Depot</h3></div>' +
      '<div class="donut-wrap"><div id="pfDonut"></div>' + legend + "</div></div>";

    // Balkendiagramm: Gewinn/Verlust je Position (nur wenn vorhanden)
    const hasGV = d.rows.some(function (r) { return Math.abs(r.gv) > 0.005; });
    const barsPanel = hasGV
      ? '<div class="panel"><div class="panel-head"><h3 class="panel-title">Gewinn / Verlust je Position</h3></div>' +
        '<div class="chart-box" id="pfBars"></div></div>'
      : "";

    // Detailtabelle
    const rowsHtml = d.rows.map(function (r) {
      const up = r.gv >= 0;
      const chStr = r.ch === null ? "–" : ((r.ch >= 0 ? "+" : "−") + fmtPct(Math.abs(r.ch)));
      const sub = [];
      if (r.a.fields.isin) sub.push(esc(r.a.fields.isin));
      if (r.a.fields.depot) sub.push(esc(r.a.fields.depot));
      return '<tr data-action="edit-asset" data-id="' + r.a.id + '">' +
        '<td><span class="pf-name"><span class="legend-dot" style="background:' + r.color + ';display:inline-block;margin-right:8px"></span>' + esc(Store.titleOf(r.a)) +
        (r.a.fields.buchungskreis ? ' <span class="bk-key" style="margin-left:8px;margin-right:0">' + esc(r.a.fields.buchungskreis) + "</span>" : "") + "</span>" +
        (sub.length ? '<div class="pf-sub">' + sub.join(" · ") + "</div>" : "") + "</td>" +
        '<td class="num pf-num">' + fmtNum(r.share * 100, 1) + " %</td>" +
        '<td class="num pf-num">' + fmtEur(r.value) + "</td>" +
        '<td class="num pf-num ' + (up ? "pos" : "neg") + '">' + (up ? "+" : "−") + fmtEur(Math.abs(r.gv)) + "</td>" +
        '<td class="num pf-num ' + (r.ch === null ? "" : (r.ch >= 0 ? "pos" : "neg")) + '">' + chStr + "</td></tr>";
    }).join("");
    const totalChStr = d.totalRendite === null ? "–" : ((gvUp ? "+" : "−") + fmtPct(Math.abs(d.totalRendite)));
    const foot = "<tr><td>Summe (" + d.assets.length + ")</td>" +
      '<td class="num pf-num">100 %</td><td class="num pf-num">' + fmtEur(d.totalValue) + "</td>" +
      '<td class="num pf-num ' + (gvUp ? "pos" : "neg") + '">' + (gvUp ? "+" : "−") + fmtEur(Math.abs(d.totalGV)) + "</td>" +
      '<td class="num pf-num ' + (d.totalRendite === null ? "" : (gvUp ? "pos" : "neg")) + '">' + totalChStr + "</td></tr>";
    const tablePanel = '<div class="panel"><div class="table-wrap"><table class="pf-table">' +
      '<thead><tr><th>Position</th><th class="num">Anteil</th><th class="num">Wert</th><th class="num">G/V (€)</th><th class="num">G/V (%)</th></tr></thead>' +
      "<tbody>" + rowsHtml + "</tbody><tfoot>" + foot + "</tfoot></table></div></div>";

    const charts = barsPanel ? '<div class="grid-2">' + donutPanel + barsPanel + "</div>" : donutPanel;
    return head(eyebrow, meta.label, right) + kpis + charts + tablePanel;
  }

  function mountPortfolio(bereich, kat) {
    const d = portfolioData(bereich, kat);
    if (el("pfDonut")) {
      const segs = d.rows.map(function (r) { return { label: Store.titleOf(r.a), value: r.value, color: r.color }; });
      Charts.donut(el("pfDonut"), segs, { centerLabel: Charts.shortNum(d.totalValue) + " €", centerSub: "Depot" });
    }
    if (el("pfBars")) {
      const items = d.rows.map(function (r) { return { label: Store.titleOf(r.a), value: r.gv, valueLabel: (r.gv >= 0 ? "+" : "−") + fmtEur(Math.abs(r.gv)) }; });
      Charts.hbars(el("pfBars"), items, {});
    }
  }

  /* ================= ZENTRALE DATEN ================= */
  function personHtml() {
    return head("Zentrale Daten", "Carlos Schäuble", "") +
      emptyState("CS", "Persönliche Stammdaten", "Dieser Bereich ist für deine persönlichen Daten vorgesehen (z. B. Kontakt, Ausweis, Steuer-ID). Inhalt folgt.", "");
  }

  function buchungskreiseHtml() {
    const list = Store.getBuchungskreise();
    const right = '<button class="btn btn-primary" data-action="add-bk">＋ Buchungskreis</button>';
    if (!list.length) {
      return head("Zentrale Daten", "Buchungskreise", right) +
        emptyState("BK", "Noch keine Buchungskreise", "Lege Buchungskreise nach SAP-Logik an (z. B. Privat, KG). Später ordnest du ihnen Konten, Kosten und Einnahmen zu und wertest je Buchungskreis aus.",
          '<button class="btn btn-primary" data-action="add-bk">＋ Ersten Buchungskreis anlegen</button>');
    }
    const rows = list.map(function (b) {
      return '<div class="ledger-row" data-action="edit-bk" data-id="' + b.id + '">' +
        '<span class="lr-icon">' + icon("buchungskreis") + "</span>" +
        '<span class="lr-main"><span class="lr-name"><span class="bk-key">' + esc(b.schluessel) + "</span>" + esc(b.name) + "</span>" +
        '<span class="lr-sub">' + (b.notiz ? esc(b.notiz) : '<span class="muted">Keine Notiz</span>') + "</span></span>" +
        '<span class="pill">' + esc(b.waehrung || "EUR") + "</span></div>";
    }).join("");
    return head("Zentrale Daten", "Buchungskreise", right) + '<div class="panel">' + rows + "</div>" +
      '<p class="panel-note">Nächster Schritt (später): Konten, Kosten und Einnahmen einem Buchungskreis zuordnen und je Buchungskreis auswerten.</p>';
  }

  function partnerHtml() {
    const partners = Store.getPartners().slice().sort(function (a, b) { return a.name.localeCompare(b.name, "de"); });
    const right = '<button class="btn btn-primary" data-action="add-partner">＋ Partner</button>';
    if (!partners.length) {
      return head("Zentrale Daten", "Business Partner", right) +
        emptyState("BP", "Noch keine Partner", "Erfasse Banken, Notare, Steuerberater, Mieter, Gesellschafter und Dienstleister – mit Rollen, Notizen und Dokumenten.",
          '<button class="btn btn-primary" data-action="add-partner">＋ Ersten Partner anlegen</button>');
    }
    const rows = partners.map(function (p) {
      const roles = (p.rollen || []).map(function (r) { return '<span class="role-tag">' + esc(r) + "</span>"; }).join("");
      const nC = (p.notizen || []).length, dC = (p.dokumente || []).length;
      const meta = [];
      if (nC) meta.push(nC + (nC === 1 ? " Notiz" : " Notizen"));
      if (dC) meta.push(dC + (dC === 1 ? " Dokument" : " Dokumente"));
      const metaHtml = meta.length ? '<span class="muted"> · ' + meta.join(" · ") + "</span>" : "";
      return '<div class="ledger-row" data-action="open-partner" data-id="' + p.id + '">' +
        '<span class="lr-icon">' + icon("partner") + "</span>" +
        '<span class="lr-main"><span class="lr-name">' + esc(p.name) + ' <span class="typ-badge">' + (p.typ === "org" ? "Organisation" : "Person") + "</span></span>" +
        '<span class="lr-sub">' + (roles || '<span class="muted">Keine Rollen</span>') + metaHtml + "</span></span>" +
        '<span class="lr-change">›</span></div>';
    }).join("");
    return head("Zentrale Daten", "Business Partner", right) + '<div class="panel">' + rows + "</div>";
  }

  function partnerDetailHtml(id) {
    const p = Store.getPartner(id);
    if (!p) { ui.partnerId = null; return partnerHtml(); }
    const roles = (p.rollen || []).length
      ? p.rollen.map(function (r) { return '<span class="role-tag">' + esc(r) + "</span>"; }).join("")
      : '<span class="muted">Keine Rollen erfasst</span>';
    const right = '<div class="btn-row">' +
      '<button class="btn btn-ghost" data-action="partner-back">← Zurück</button>' +
      '<button class="btn" data-action="edit-partner" data-id="' + p.id + '">Bearbeiten</button></div>';

    const info = '<div class="panel"><div class="info-row"><span class="typ-badge">' +
      (p.typ === "org" ? "Organisation" : "Person") + "</span>" + roles + "</div></div>";

    // Notizen (neueste zuerst)
    const notizen = (p.notizen || []).slice().sort(function (a, b) { return (b.ts || "").localeCompare(a.ts || ""); });
    const noteList = notizen.length
      ? notizen.map(function (n) {
          return '<div class="note-item"><div class="note-head"><span class="note-ts">' + fmtDateTime(n.ts) + "</span>" +
            '<button class="icon-btn" style="width:26px;height:26px;font-size:12px" data-action="delete-partner-note" data-id="' + n.id + '" title="Notiz löschen">✕</button></div>' +
            '<div class="note-text">' + esc(n.text) + "</div></div>";
        }).join("")
      : '<p class="muted">Noch keine Notizen.</p>';
    const notesPanel = '<div class="panel"><div class="panel-head"><h3 class="panel-title">Notizen</h3></div>' +
      '<form id="noteForm" class="note-add"><textarea id="f_note" rows="2" placeholder="Neue Notiz…" required></textarea>' +
      '<div><button type="submit" class="btn btn-primary btn-sm">＋ Notiz hinzufügen</button></div></form>' +
      noteList + "</div>";

    // Dokumente (neueste zuerst)
    const docs = (p.dokumente || []).slice().sort(function (a, b) { return (b.ts || "").localeCompare(a.ts || ""); });
    const docList = docs.length
      ? docs.map(function (d) {
          return '<div class="doc-item"><span class="doc-icon">' + icon("dokument") + "</span>" +
            '<span class="doc-main"><a class="doc-name" href="' + d.dataUrl + '" download="' + esc(d.name) + '">' + esc(d.name) + "</a>" +
            '<span class="doc-meta">' + fmtSize(d.size) + " · " + fmtDate(d.ts) + "</span></span>" +
            '<button class="icon-btn" style="width:30px;height:30px" data-action="delete-partner-doc" data-id="' + d.id + '" title="Dokument löschen">🗑️</button></div>';
        }).join("")
      : '<p class="muted">Noch keine Dokumente.</p>';
    const docsPanel = '<div class="panel"><div class="panel-head"><h3 class="panel-title">Dokumente</h3>' +
      '<button class="btn btn-sm" data-action="add-partner-doc">＋ Datei</button></div>' +
      '<input type="file" id="partnerDocInput" multiple class="hidden">' +
      docList +
      '<p class="panel-note">Dateien werden lokal in diesem Browser gespeichert (max. ~1,5 MB je Datei).</p></div>';

    return head("Zentrale Daten", p.name, right) + info + notesPanel + docsPanel;
  }

  /* ================= CASHFLOW (KG) ================= */
  function cashflowMiniTable() {
    const cf = Store.kgCashflow();
    return '<table class="ptable"><tbody>' +
      row("Kaltmiete gesamt", fmtEur(cf.kaltmiete), "pos") +
      row("Kreditraten", "− " + fmtEur(cf.kreditrate), "neg") +
      row("Instandhaltungsrücklage", "− " + fmtEur(cf.instandhaltung), "neg") +
      '<tr class="total"><td>Netto-Cashflow / Monat</td><td class="num">' + fmtEur(cf.netto) + "</td></tr>" +
      "</tbody></table>";
  }
  function row(label, val, cls) {
    return "<tr><td>" + label + '</td><td class="num ' + (cls || "") + '">' + val + "</td></tr>";
  }
  function cashflowHtml() {
    const cf = Store.kgCashflow();
    const objs = Store.kgImmobilien();
    const perObj = objs.length ? objs.map(function (a) {
      const f = a.fields, netto = (Number(f.kaltmiete) || 0) - (Number(f.kreditrate) || 0) - (Number(f.instandhaltung) || 0);
      return "<tr><td>" + esc(Store.titleOf(a)) + '</td><td class="num">' + fmtEur(netto) + "</td></tr>";
    }).join("") : '<tr><td class="muted" colspan="2">Keine vermieteten Objekte erfasst.</td></tr>';

    return head("Business", "Cashflow", "") +
      '<div class="grid-2">' +
      '<div class="panel"><div class="panel-head"><h3 class="panel-title">Monatsübersicht</h3></div>' +
      '<table class="ptable"><tbody>' +
      row("Kaltmiete gesamt", fmtEur(cf.kaltmiete), "pos") +
      row("Nebenkosten (durchlaufend)", fmtEur(cf.nebenkosten), "muted") +
      row("Kreditraten", "− " + fmtEur(cf.kreditrate), "neg") +
      row("Instandhaltungsrücklage", "− " + fmtEur(cf.instandhaltung), "neg") +
      '<tr class="total"><td>Netto-Cashflow / Monat</td><td class="num">' + fmtEur(cf.netto) + "</td></tr>" +
      "</tbody></table>" +
      '<p class="panel-note">Nebenkosten sind durchlaufende Posten und fließen nicht in den Netto-Cashflow ein.</p></div>' +
      '<div class="panel"><div class="panel-head"><h3 class="panel-title">Je Objekt (netto / Monat)</h3></div>' +
      '<table class="ptable"><tbody>' + perObj + "</tbody></table></div></div>";
  }

  /* ================= BILANZ / GuV (KG) ================= */
  function bilanzMiniTable() {
    const b = Store.kgBilanz();
    return '<table class="ptable"><tbody>' +
      row("Immobilien (Marktwert)", fmtEur(b.aktivaImmobilien), "") +
      row("Bankguthaben", fmtEur(b.aktivaBank), "") +
      row("Verbindlichkeiten", "− " + fmtEur(b.verbindlichkeiten), "neg") +
      '<tr class="total"><td>Eigenkapital</td><td class="num">' + fmtEur(b.eigenkapital) + "</td></tr>" +
      "</tbody></table>";
  }
  function bilanzHtml() {
    const b = Store.kgBilanz();
    return head("Business", "Bilanz / GuV", "") +
      '<div class="grid-2">' +
      '<div class="panel"><div class="panel-head"><h3 class="panel-title">GuV (Jahr)</h3></div>' +
      '<table class="ptable"><tbody>' +
      row("Mieteinnahmen", fmtEur(b.mieteinnahmen), "pos") +
      row("Betriebskosten (durchlaufend)", fmtEur(b.betriebskosten), "muted") +
      row("Kreditraten", "− " + fmtEur(b.kreditraten), "neg") +
      row("Instandhaltung", "− " + fmtEur(b.instandhaltung), "neg") +
      '<tr class="total"><td>Ergebnis KG (Jahr)</td><td class="num">' + fmtEur(b.ergebnis) + "</td></tr>" +
      "</tbody></table></div>" +
      '<div class="panel"><div class="panel-head"><h3 class="panel-title">Bilanz (Stichtag)</h3></div>' +
      '<table class="ptable"><tbody>' +
      row("Aktiva · Immobilien", fmtEur(b.aktivaImmobilien), "") +
      row("Aktiva · Bank", fmtEur(b.aktivaBank), "") +
      row("Summe Aktiva", fmtEur(b.aktiva), "") +
      row("Verbindlichkeiten", "− " + fmtEur(b.verbindlichkeiten), "neg") +
      '<tr class="total"><td>Eigenkapital</td><td class="num">' + fmtEur(b.eigenkapital) + "</td></tr>" +
      "</tbody></table></div></div>" +
      '<p class="panel-note">Abgeleitet aus deinen vermieteten KG-Objekten und KG-Bankkonten.</p>';
  }

  /* ===== Stream 1: Real Estate – Platzhalter (Inhalt folgt) ===== */
  function reImmobilienHtml() {
    return head("Business", "Immobilien", "") +
      emptyState("🏢", "Immobilien", "Platzhalter für die Immobilien dieses Streams (z. B. Objekte im Bestand). Was genau hier hineinkommt, legen wir als Nächstes fest.", "");
  }
  function einnahmenAusgabenHtml() {
    return head("Business", "Einnahmen / Ausgaben", "") +
      emptyState("±", "Einnahmen / Ausgaben", "Platzhalter für Einnahmen und Ausgaben dieses Streams. Inhalt folgt.", "");
  }

  /* ================= CHATBOT ================= */
  function katSum(kat) {
    return Store.getAssets({ kategorie: kat }).reduce(function (s, a) { return s + Store.computeValue(a); }, 0);
  }
  function localAnswer(qRaw) {
    const q = (qRaw || "").toLowerCase();
    const t = Store.totals("alles");
    if (/(netto|verm[öo]gen|gesamt|wie reich|summe)/.test(q))
      return "Dein Nettovermögen beträgt " + fmtEur(t.netWorth) + ".\nDavon Privat " + fmtEur(Store.totals("privat").netWorth) + " und Business " + fmtEur(Store.totals("geschaeftlich").netWorth) + ".";
    if (/cashflow|miete|pro monat|monatlich/.test(q)) {
      const cf = Store.kgCashflow();
      return "Netto-Cashflow der KG: " + fmtEur(cf.netto) + " pro Monat.\n(Kaltmiete " + fmtEur(cf.kaltmiete) + " − Kreditraten " + fmtEur(cf.kreditrate) + " − Instandhaltung " + fmtEur(cf.instandhaltung) + ".)";
    }
    if (/(wie viele|anzahl|positionen)/.test(q))
      return "Erfasst sind " + t.count + " Positionen (" + Store.totals("privat").count + " Privat, " + Store.totals("geschaeftlich").count + " Business).";
    if (/(gr[öo][ßs]te|top|h[öo]chste|wertvollste)/.test(q)) {
      const a = Store.getAssets().slice().sort(function (x, y) { return Store.computeValue(y) - Store.computeValue(x); })[0];
      return a ? "Größte Position: " + Store.titleOf(a) + " mit " + fmtEur(Store.computeValue(a)) + "." : "Noch keine Positionen erfasst.";
    }
    if (/privat/.test(q)) return "Privatvermögen: " + fmtEur(Store.totals("privat").netWorth) + " über " + Store.totals("privat").count + " Positionen.";
    if (/(gesch[äa]ft|\bkg\b|firma|betrieb|business)/.test(q)) return "Business-Nettovermögen (KG): " + fmtEur(Store.totals("geschaeftlich").netWorth) + ".";
    if (/krypto|bitcoin|coin|ether/.test(q)) return "Kryptowährungen: " + fmtEur(katSum("krypto")) + ".";
    if (/(aktie|wertpapier|etf|depot|fonds)/.test(q)) return "Wertpapiere: " + fmtEur(katSum("wertpapiere")) + ".";
    if (/(gold|silber|edelmetall)/.test(q)) return "Edelmetalle: " + fmtEur(katSum("edelmetalle")) + ".";
    if (/uhr|wertgegen|schmuck/.test(q)) return "Wertgegenstände: " + fmtEur(katSum("uhren")) + ".";
    if (/(immobili|wohnung|haus|objekt|mfh)/.test(q)) return "Immobilien-Eigenkapital (Marktwert − Schuld): " + fmtEur(katSum("immobilien")) + ".";
    if (/(termin|frist|deadline)/.test(q)) {
      const today = new Date().toISOString().slice(0, 10);
      const up = Store.getTermine().filter(function (x) { return x.datum >= today; });
      return up.length ? "Nächster Termin: " + up[0].titel + " am " + fmtDate(up[0].datum) + " (" + relDays(up[0].datum) + ")." : "Keine anstehenden Termine.";
    }
    return "Ich beantworte Fragen zu deinen strukturierten Daten – z. B. „Nettovermögen?“, „Cashflow?“, „Wie viele Positionen?“, „Größte Position?“ oder zu einzelnen Kategorien (Wertpapiere, Krypto, Immobilien …).\n\nVolltext-Suche über Dokumente und echte KI-Antworten folgen in Stufe 2.";
  }
  function chatbotHtml() {
    if (!ui.chat.length) {
      ui.chat.push({ role: "bot", text: "Guten Tag. Ich bin der Assistent deines Personal ERP und kenne deine erfassten Zahlen. Frag mich zum Beispiel nach deinem Nettovermögen oder dem monatlichen Cashflow." });
    }
    const log = ui.chat.map(function (m) { return '<div class="chat-msg ' + m.role + '">' + esc(m.text) + "</div>"; }).join("");
    const chips = ["Nettovermögen?", "Cashflow?", "Wie viele Positionen?", "Größte Position?"]
      .map(function (c) { return '<button type="button" class="chat-chip" data-action="chat-suggest" data-q="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
    return head("Assistent", "Chatbot", "") +
      '<div class="panel"><div class="chat">' +
      '<div class="chat-suggest">' + chips + "</div>" +
      '<div class="chat-log" id="chatLog">' + log + "</div>" +
      '<form id="chatForm" class="chat-input-row"><input id="chatInput" type="text" placeholder="Frage zu deinen Finanzen…" autocomplete="off">' +
      '<button class="btn btn-primary" type="submit">Senden</button></form></div></div>' +
      '<p class="panel-note">Stufe 1: Zugriff auf strukturierte Zahlen (lokal, ohne KI). Stufe 2 folgt mit Dokumenten-Suche &amp; KI.</p>';
  }
  function mountChat() {
    const logEl = el("chatLog");
    if (logEl) logEl.scrollTop = logEl.scrollHeight;
    const inp = el("chatInput");
    if (inp) inp.focus();
  }
  function sendChat(text) {
    text = (text || "").trim();
    if (!text) return;
    ui.chat.push({ role: "user", text: text });
    ui.chat.push({ role: "bot", text: localAnswer(text) });
    render();
  }

  /* ================= NEWS ================= */
  function newsHtml() {
    const items = Store.getNews().map(function (n) {
      const tag = Store.NEWS_TAGS[n.tag] || { label: n.tag, color: "#948d7c" };
      return '<div class="news-item"><span class="news-tag" style="background:' + hexA(tag.color, 0.14) + ";color:" + tag.color + '">' + tag.label + "</span>" +
        '<span class="news-main"><span class="news-title">' + esc(n.titel) + "</span></span>" +
        '<span class="news-time">' + esc(n.zeit) + "</span></div>";
    }).join("");
    return head("Kuratiert", "News", "") +
      '<div class="panel">' + items + "</div>" +
      '<p class="panel-note">Beispiel-Feed. Später kuratiert nach Zinsen/EZB, Immobilienmarkt und deinen gehaltenen Positionen.</p>';
  }
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ================= TERMINE ================= */
  function termineHtml() {
    const ts = Store.getTermine();
    const right = '<button class="btn btn-primary" data-action="add-termin">＋ Termin</button>';
    if (!ts.length) {
      return head("Fristen", "Termine", right) +
        emptyState("📅", "Keine Termine", "Erfasse Fristen und Deadlines – z. B. Kündigungsfristen, Notartermine oder Steuerfristen.",
          '<button class="btn btn-primary" data-action="add-termin">＋ Ersten Termin anlegen</button>');
    }
    const today = new Date().toISOString().slice(0, 10);
    const rows = ts.map(function (t) {
      const over = t.datum && t.datum < today;
      return '<div class="ledger-row" data-action="edit-termin" data-id="' + t.id + '">' +
        '<span class="lr-icon">' + icon("termine") + "</span>" +
        '<span class="lr-main"><span class="lr-name">' + esc(t.titel) + "</span>" +
        '<span class="lr-sub">' + (t.datum ? fmtDate(t.datum) : "ohne Datum") + (t.notiz ? " · " + esc(t.notiz) : "") + "</span></span>" +
        '<span class="lr-change ' + (over ? "down" : "up") + '" style="min-width:90px">' + (t.datum ? relDays(t.datum) : "") + "</span></div>";
    }).join("");
    return head("Fristen", "Termine", right) + '<div class="panel">' + rows + "</div>";
  }

  /* ================= EINSTELLUNGEN ================= */
  function einstellungenHtml() {
    const a = Store.getAssets().length, p = Store.getPartners().length, t = Store.getTermine().length, s = Store.getSnapshots().length, bk = Store.getBuchungskreise().length;
    return head("System", "Einstellungen", "") +
      '<div class="panel"><div class="panel-head"><h3 class="panel-title">Verlauf</h3></div>' +
      '<p class="panel-note">Speichere einen Snapshot deines Nettovermögens, um die Entwicklung über die Zeit zu verfolgen.</p>' +
      '<div class="btn-row" style="margin-top:12px"><button class="btn" data-action="save-snapshot">＋ Snapshot speichern</button></div></div>' +

      '<div class="panel"><div class="panel-head"><h3 class="panel-title">Daten &amp; Backup</h3></div>' +
      '<p class="panel-note">Bestand: ' + a + " Positionen · " + p + " Partner · " + bk + " Buchungskreise · " + t + " Termine · " + s + " Snapshots.</p>" +
      '<p class="panel-note" style="margin-top:8px">🔒 Alles liegt nur lokal in diesem Browser. Erstelle regelmäßig ein JSON-Backup.</p>' +
      '<div class="btn-row" style="margin-top:14px">' +
      '<button class="btn" data-action="export-csv">⬇︎ CSV</button>' +
      '<button class="btn" data-action="export-json">⬇︎ JSON-Backup</button>' +
      '<button class="btn" data-action="import-json">⬆︎ JSON importieren</button>' +
      '<input type="file" id="importFile" accept="application/json,.json" class="hidden">' +
      '<button class="btn" data-action="load-sample">Beispieldaten</button>' +
      '<button class="btn btn-danger" data-action="clear-all">Alles löschen</button></div></div>' +

      '<div class="panel"><div class="panel-head"><h3 class="panel-title">Über</h3></div>' +
      '<p class="panel-note">Carlos · Personal ERP – Version 3.9. Vermögenscockpit mit Login &amp; Cloud-Sync (Supabase, RLS).<br>' +
      "Geplant: automatische Bankanbindung, Live-Kurse, Dokumenten-Upload &amp; -Suche (RAG) für den Chatbot.</p></div>";
  }

  /* ================= FORMULARE ================= */
  function openModal(html) { el("modal").innerHTML = html; el("modalOverlay").classList.remove("hidden"); }
  function closeModal() { el("modalOverlay").classList.add("hidden"); el("modal").innerHTML = ""; }

  function fieldInput(field, val) {
    const id = "f_" + field.k;
    if (field.type === "select") {
      const opts = field.opts.map(function (o) { return "<option" + (String(val) === o ? " selected" : "") + ">" + o + "</option>"; }).join("");
      return '<select id="' + id + '">' + opts + "</select>";
    }
    if (field.type === "partner") {
      // Auswahl aus den Business Partnern; ein alter Freitext-Wert bleibt wählbar
      const current = (val === undefined || val === null) ? "" : String(val);
      const names = Store.getPartners().map(function (p) { return p.name; })
        .sort(function (a, b) { return a.localeCompare(b, "de"); });
      if (current && names.indexOf(current) < 0) names.unshift(current);
      let opts = '<option value="">– keine –</option>';
      names.forEach(function (n) {
        opts += '<option value="' + esc(n) + '"' + (current === n ? " selected" : "") + ">" + esc(n) + "</option>";
      });
      const hint = names.length ? "" : '<span class="hint">Partner legst du unter Business → Business Partner an.</span>';
      return '<select id="' + id + '">' + opts + "</select>" + hint;
    }
    if (field.type === "buchungskreis") {
      const current = (val === undefined || val === null) ? "" : String(val);
      const bks = Store.getBuchungskreise();
      const found = bks.some(function (b) { return b.schluessel === current; });
      let opts = '<option value="">– kein Buchungskreis –</option>';
      if (current && !found) opts += '<option value="' + esc(current) + '" selected>' + esc(current) + "</option>";
      bks.forEach(function (b) {
        const lbl = b.schluessel + (b.name ? " – " + b.name : "");
        opts += '<option value="' + esc(b.schluessel) + '"' + (current === b.schluessel ? " selected" : "") + ">" + esc(lbl) + "</option>";
      });
      const hint = bks.length ? "" : '<span class="hint">Buchungskreise legst du unter Zentrale Daten → Buchungskreise an.</span>';
      return '<select id="' + id + '">' + opts + "</select>" + hint;
    }
    const type = field.type === "num" ? "number" : (field.type === "date" ? "date" : "text");
    const step = field.type === "num" ? ' step="any"' : "";
    return '<input id="' + id + '" type="' + type + '"' + step + (field.req ? " required" : "") + ' value="' + esc(val === undefined || val === null ? "" : val) + '">';
  }

  function openAssetForm(bereich, kat, id) {
    const a = id ? Store.getAsset(id) : null;
    const schema = formSchema(bereich, kat);
    const label = Store.KATEGORIEN[kat].singular;
    const fields = schema.map(function (f) {
      const val = a ? (a.fields || {})[f.k] : "";
      const full = (f.k === "name" || f.type === "partner" || f.type === "buchungskreis") ? " full" : "";
      return '<div class="form-row' + full + '"><label for="f_' + f.k + '">' + f.label + (f.req ? " *" : "") + "</label>" + fieldInput(f, val) + "</div>";
    }).join("");
    const preview = '<div class="form-row full"><span class="hint" id="assetPreview"></span></div>';

    // Dokumente (z. B. Mietvertrag) – aktuell für vermietete KG-Immobilien
    assetDocs = (a && Array.isArray(a.dokumente)) ? a.dokumente.slice() : [];
    const docsSection = assetSupportsDocs(bereich, kat)
      ? '<div class="asset-docs"><span class="asset-docs-label">Dokumente (z. B. Mietvertrag)</span>' +
        '<div id="assetDocList"></div>' +
        '<button type="button" class="btn btn-sm" data-action="asset-doc-add" style="margin-top:10px">＋ Datei</button>' +
        '<input type="file" id="assetDocInput" multiple class="hidden">' +
        '<p class="hint" style="margin-top:8px">Wird lokal gespeichert (max. ~1,5 MB je Datei).</p></div>'
      : "";

    const m = el("modal");
    openModal(
      '<div class="modal-head"><h3>' + (a ? esc(Store.titleOf(a)) : "Neu · " + label) + '</h3><button class="icon-btn" data-action="close-modal">✕</button></div>' +
      '<form id="assetForm"><div class="modal-body"><div class="form-grid">' + fields + preview + "</div>" + docsSection + "</div>" +
      '<div class="modal-foot">' + (a ? '<button type="button" class="btn btn-danger" data-action="delete-asset" data-id="' + a.id + '">Löschen</button>' : "") +
      '<span class="spacer"></span><button type="button" class="btn btn-ghost" data-action="close-modal">Abbrechen</button>' +
      '<button type="submit" class="btn btn-primary">' + (a ? "Speichern" : "Anlegen") + "</button></div></form>"
    );
    m.dataset.form = "asset"; m.dataset.bereich = bereich; m.dataset.kat = kat; m.dataset.editId = id || "";
    updateAssetPreview();
    renderAssetDocs();
    el("f_name").focus();
  }

  function renderAssetDocs() {
    const listEl = el("assetDocList");
    if (!listEl) return;
    if (!assetDocs.length) { listEl.innerHTML = '<p class="muted" style="font-size:13px">Noch keine Dokumente.</p>'; return; }
    listEl.innerHTML = assetDocs.map(function (d) {
      return '<div class="doc-item"><span class="doc-icon">' + icon("dokument") + "</span>" +
        '<span class="doc-main"><a class="doc-name" href="' + d.dataUrl + '" download="' + esc(d.name) + '">' + esc(d.name) + "</a>" +
        '<span class="doc-meta">' + fmtSize(d.size) + "</span></span>" +
        '<button type="button" class="icon-btn" style="width:30px;height:30px" data-action="asset-doc-remove" data-id="' + d.id + '" title="Entfernen">🗑️</button></div>';
    }).join("");
  }
  function handleAssetDocs(files) {
    const list = Array.prototype.slice.call(files);
    const MAX = 1.5 * 1024 * 1024;
    let pending = list.length;
    const done = function () { if (--pending <= 0) renderAssetDocs(); };
    list.forEach(function (file) {
      if (file.size > MAX) { alert("Datei „" + file.name + "“ ist zu groß (max. 1,5 MB)."); done(); return; }
      const reader = new FileReader();
      reader.onload = function () {
        assetDocs.push({ id: uid(), name: file.name, type: file.type, size: file.size, dataUrl: String(reader.result), ts: new Date().toISOString() });
        done();
      };
      reader.onerror = done;
      reader.readAsDataURL(file);
    });
  }
  function collectAssetFields() {
    const m = el("modal");
    const schema = formSchema(m.dataset.bereich, m.dataset.kat);
    const f = {};
    schema.forEach(function (field) {
      const inp = el("f_" + field.k);
      if (!inp) return;
      f[field.k] = field.type === "num" ? (inp.value === "" ? "" : Number(inp.value)) : inp.value.trim();
    });
    return f;
  }
  function updateAssetPreview() {
    const m = el("modal");
    if (!m || m.dataset.form !== "asset") return;
    // Forderungen/Verbindlichkeiten: Felder je nach Art ein-/ausblenden
    if (m.dataset.kat === "forderungen" && el("f_art")) {
      const kalk = el("f_art").value === "Kalkulatorische Miete";
      const toggle = function (id, show) {
        const inp = el(id);
        const row = inp && inp.closest(".form-row");
        if (row) row.classList.toggle("hidden", !show);
      };
      toggle("f_betrag", !kalk);
      toggle("f_miete", kalk);
      toggle("f_start", kalk);
    }
    const tmp = { bereich: m.dataset.bereich, kategorie: m.dataset.kat, fields: collectAssetFields() };
    const prev = el("assetPreview");
    if (prev) {
      const val = Store.computeValue(tmp);
      const cf = Store.computeCashflow(tmp);
      let txt = "Aktueller Wert: " + fmtEur(val);
      if (m.dataset.kat === "forderungen" && tmp.fields.art === "Kalkulatorische Miete") {
        txt += " (" + Store.monthsSince(tmp.fields.start) + " Monate × " + fmtEur(tmp.fields.miete) + ")";
      }
      if (cf) txt += "   ·   Cashflow: " + fmtEur(cf) + " / Monat";
      prev.textContent = txt;
    }
  }
  function submitAssetForm() {
    const m = el("modal");
    const nameEl = el("f_name");
    if (!nameEl.value.trim()) { nameEl.classList.add("field-err"); nameEl.focus(); return; }
    const fields = collectAssetFields();
    const docs = assetSupportsDocs(m.dataset.bereich, m.dataset.kat) ? assetDocs : undefined;
    if (m.dataset.editId) Store.updateAsset(m.dataset.editId, fields, docs);
    else Store.addAsset(m.dataset.bereich, m.dataset.kat, fields, docs || []);
    closeModal(); render();
  }

  function openPartnerForm(id) {
    const p = id ? Store.getPartner(id) : null;
    const typOpts = '<option value="person"' + (p && p.typ === "person" ? " selected" : "") + ">Person</option>" +
                    '<option value="org"' + (p && p.typ === "org" ? " selected" : "") + ">Organisation</option>";
    const rollenVal = p ? (p.rollen || []).join(", ") : "";
    openModal(
      '<div class="modal-head"><h3>' + (p ? esc(p.name) : "Neuer Business Partner") + '</h3><button class="icon-btn" data-action="close-modal">✕</button></div>' +
      '<form id="partnerForm"><div class="modal-body"><div class="form-grid">' +
      '<div class="form-row full"><label for="f_name">Name *</label><input id="f_name" type="text" required value="' + esc(p ? p.name : "") + '"></div>' +
      '<div class="form-row full"><label for="f_typ">Typ</label><select id="f_typ">' + typOpts + "</select></div>" +
      '<div class="form-row full"><label for="f_rollen">Rollen</label><input id="f_rollen" type="text" value="' + esc(rollenVal) + '" placeholder="z. B. Notar, Steuerberater"><span class="hint">Mehrere Rollen mit Komma trennen.</span></div>' +
      "</div></div><div class=\"modal-foot\">" + (p ? '<button type="button" class="btn btn-danger" data-action="delete-partner" data-id="' + p.id + '">Löschen</button>' : "") +
      '<span class="spacer"></span><button type="button" class="btn btn-ghost" data-action="close-modal">Abbrechen</button>' +
      '<button type="submit" class="btn btn-primary">' + (p ? "Speichern" : "Anlegen") + "</button></div></form>"
    );
    el("modal").dataset.form = "partner"; el("modal").dataset.editId = id || "";
    el("f_name").focus();
  }
  function submitPartnerForm() {
    const m = el("modal");
    const nameEl = el("f_name");
    if (!nameEl.value.trim()) { nameEl.classList.add("field-err"); nameEl.focus(); return; }
    const rollen = el("f_rollen").value.split(/[,;]/).map(function (s) { return s.trim(); }).filter(Boolean);
    const data = { name: nameEl.value.trim(), typ: el("f_typ").value, rollen: rollen };
    if (m.dataset.editId) Store.updatePartner(m.dataset.editId, data);
    else Store.addPartner(data);
    closeModal(); render();
  }

  function openTerminForm(id) {
    const t = id ? Store.getTermin(id) : null;
    openModal(
      '<div class="modal-head"><h3>' + (t ? "Termin bearbeiten" : "Neuer Termin") + '</h3><button class="icon-btn" data-action="close-modal">✕</button></div>' +
      '<form id="terminForm"><div class="modal-body"><div class="form-grid">' +
      '<div class="form-row full"><label for="f_titel">Titel *</label><input id="f_titel" type="text" required value="' + esc(t ? t.titel : "") + '"></div>' +
      '<div class="form-row"><label for="f_datum">Datum</label><input id="f_datum" type="date" value="' + esc(t ? t.datum : "") + '"></div>' +
      '<div class="form-row full"><label for="f_notiz">Notiz</label><textarea id="f_notiz">' + esc(t ? t.notiz : "") + "</textarea></div>" +
      "</div></div><div class=\"modal-foot\">" + (t ? '<button type="button" class="btn btn-danger" data-action="delete-termin" data-id="' + t.id + '">Löschen</button>' : "") +
      '<span class="spacer"></span><button type="button" class="btn btn-ghost" data-action="close-modal">Abbrechen</button>' +
      '<button type="submit" class="btn btn-primary">' + (t ? "Speichern" : "Anlegen") + "</button></div></form>"
    );
    el("modal").dataset.form = "termin"; el("modal").dataset.editId = id || "";
    el("f_titel").focus();
  }
  function submitTerminForm() {
    const m = el("modal");
    const titelEl = el("f_titel");
    if (!titelEl.value.trim()) { titelEl.classList.add("field-err"); titelEl.focus(); return; }
    const data = { titel: titelEl.value.trim(), datum: el("f_datum").value, notiz: el("f_notiz").value.trim() };
    if (m.dataset.editId) Store.updateTermin(m.dataset.editId, data);
    else Store.addTermin(data);
    closeModal(); render();
  }

  function openBuchungskreisForm(id) {
    const b = id ? Store.getBuchungskreis(id) : null;
    const curs = ["EUR", "USD", "CHF", "GBP"];
    const cur = b ? (b.waehrung || "EUR") : "EUR";
    const curOpts = curs.map(function (c) { return '<option value="' + c + '"' + (cur === c ? " selected" : "") + ">" + c + "</option>"; }).join("");
    openModal(
      '<div class="modal-head"><h3>' + (b ? esc(b.name) : "Neuer Buchungskreis") + '</h3><button class="icon-btn" data-action="close-modal">✕</button></div>' +
      '<form id="bkForm"><div class="modal-body"><div class="form-grid">' +
      '<div class="form-row"><label for="f_schluessel">Schlüssel *</label><input id="f_schluessel" type="text" maxlength="10" required placeholder="z. B. PRIV, KG01" value="' + esc(b ? b.schluessel : "") + '"></div>' +
      '<div class="form-row"><label for="f_bkwaehrung">Währung</label><select id="f_bkwaehrung">' + curOpts + "</select></div>" +
      '<div class="form-row full"><label for="f_bkname">Bezeichnung *</label><input id="f_bkname" type="text" required placeholder="z. B. Privatvermögen" value="' + esc(b ? b.name : "") + '"></div>' +
      '<div class="form-row full"><label for="f_bknotiz">Notiz</label><textarea id="f_bknotiz" placeholder="Optional…">' + esc(b ? b.notiz : "") + "</textarea></div>" +
      "</div></div><div class=\"modal-foot\">" + (b ? '<button type="button" class="btn btn-danger" data-action="delete-bk" data-id="' + b.id + '">Löschen</button>' : "") +
      '<span class="spacer"></span><button type="button" class="btn btn-ghost" data-action="close-modal">Abbrechen</button>' +
      '<button type="submit" class="btn btn-primary">' + (b ? "Speichern" : "Anlegen") + "</button></div></form>"
    );
    el("modal").dataset.form = "bk"; el("modal").dataset.editId = id || "";
    el("f_schluessel").focus();
  }
  function submitBuchungskreisForm() {
    const m = el("modal");
    const keyEl = el("f_schluessel"), nameEl = el("f_bkname");
    if (!keyEl.value.trim()) { keyEl.classList.add("field-err"); keyEl.focus(); return; }
    if (!nameEl.value.trim()) { nameEl.classList.add("field-err"); nameEl.focus(); return; }
    const data = { schluessel: keyEl.value.trim(), name: nameEl.value.trim(), waehrung: el("f_bkwaehrung").value, notiz: el("f_bknotiz").value.trim() };
    if (m.dataset.editId) Store.updateBuchungskreis(m.dataset.editId, data);
    else Store.addBuchungskreis(data);
    closeModal(); render();
  }

  /* ================= Datei-Download / Import ================= */
  function download(name, content, mime) {
    const blob = new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 500);
  }
  function stamp() { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function importFile(file) {
    const r = new FileReader();
    r.onload = function () { try { Store.importJSON(String(r.result)); render(); alert("Backup eingespielt."); } catch (e) { alert("Import fehlgeschlagen: " + e.message); } };
    r.readAsText(file);
  }
  // Dokumente an den aktuell geöffneten Partner anhängen (lokal, als Data-URL)
  function handlePartnerDocs(files) {
    const pid = ui.partnerId;
    const list = Array.prototype.slice.call(files);
    const MAX = 1.5 * 1024 * 1024;
    let pending = list.length;
    const done = function () { if (--pending <= 0) render(); };
    list.forEach(function (file) {
      if (file.size > MAX) { alert("Datei „" + file.name + "“ ist zu groß (max. 1,5 MB)."); done(); return; }
      const reader = new FileReader();
      reader.onload = function () {
        const res = Store.addPartnerDocument(pid, { name: file.name, type: file.type, size: file.size, dataUrl: String(reader.result) });
        if (!res.ok) alert("„" + file.name + "“ konnte nicht gespeichert werden: " + (res.error || "Speicher voll."));
        done();
      };
      reader.onerror = done;
      reader.readAsDataURL(file);
    });
  }

  /* ================= Rendern ================= */
  function renderNav() {
    const html = NAV.map(function (item) {
      const activeParent = ui.section === item.section && !ui.kat;
      const ico = '<span class="nav-ico">' + icon(item.icon) + "</span>";
      if (!item.children) {
        return '<button class="nav-item' + (ui.section === item.section ? " active" : "") + '" data-action="nav" data-section="' + item.section + '">' + ico + '<span class="nav-label">' + item.label + "</span></button>";
      }
      const expanded = ui.expanded[item.section];
      const navChildHtml = function (c) {
        return '<button class="nav-child' + (ui.section === item.section && ui.kat === c.kat ? " active" : "") + '" data-action="nav" data-section="' + item.section + '" data-kat="' + c.kat + '">' + c.label + "</button>";
      };
      const children = item.children.map(function (c) {
        if (c.children) {
          const gExp = ui.expanded[c.group];
          const sub = c.children.map(navChildHtml).join("");
          return '<div class="nav-subgroup' + (gExp ? " expanded" : "") + '">' +
            '<button class="nav-subhead" data-action="toggle-subgroup" data-group="' + c.group + '"><span class="nav-sublabel">' + c.label + '</span><span class="chevron">›</span></button>' +
            '<div class="nav-subchildren">' + sub + "</div></div>";
        }
        return navChildHtml(c);
      }).join("");
      return '<div class="nav-group' + (expanded ? " expanded" : "") + '">' +
        '<button class="nav-item' + (activeParent ? " active" : "") + '" data-action="nav" data-section="' + item.section + '">' + ico +
        '<span class="nav-label">' + item.label + '</span><span class="chevron" data-action="toggle-group" data-section="' + item.section + '">›</span></button>' +
        '<div class="nav-children">' + children + "</div></div>";
    }).join("");
    el("nav").innerHTML = html;
    el("icoSettings").innerHTML = icon("settings");
  }

  function currentTitle() {
    const item = NAV.find(function (n) { return n.section === ui.section; });
    if (item && item.children && ui.kat) {
      let label = null;
      item.children.forEach(function (c) {
        if (c.children) { c.children.forEach(function (l) { if (l.kat === ui.kat) label = l.label; }); }
        else if (c.kat === ui.kat) label = c.label;
      });
      if (label) return label;
    }
    return item ? item.label : "Einstellungen";
  }

  function viewHtml() {
    switch (ui.section) {
      case "uebersicht": return uebersichtHtml();
      case "zentrale":
        if (ui.kat === "partner") return ui.partnerId ? partnerDetailHtml(ui.partnerId) : partnerHtml();
        if (ui.kat === "buchungskreise") return buchungskreiseHtml();
        return personHtml();
      case "privat":
        if (!ui.kat) return bereichOverviewHtml("privat");
        if (ui.kat === "bank") return bankHtml("privat");
        if (ui.kat === "wertpapiere") return portfolioHtml("privat", "wertpapiere");
        if (ui.kat === "forderungen") return forderungenHtml("privat");
        return katListHtml("privat", ui.kat);
      case "geschaeftlich":
        if (!ui.kat) return bereichOverviewHtml("geschaeftlich");
        if (ui.kat === "bank") return bankHtml("geschaeftlich");
        if (ui.kat === "bilanz") return bilanzHtml();
        if (ui.kat === "cashflow") return cashflowHtml();
        if (ui.kat === "immobilienbestand") return reImmobilienHtml();
        if (ui.kat === "einnahmen_ausgaben") return einnahmenAusgabenHtml();
        return katListHtml("geschaeftlich", ui.kat);
      case "chatbot": return chatbotHtml();
      case "news": return newsHtml();
      case "termine": return termineHtml();
      case "einstellungen": return einstellungenHtml();
      default: return uebersichtHtml();
    }
  }

  function render() {
    renderNav();
    el("topbarTitle").textContent = currentTitle();
    el("viewContainer").innerHTML = viewHtml();

    // Nachbereitung (Diagramme, Chat)
    if (ui.section === "uebersicht") {
      const t = Store.totals(ui.filter);
      const segs = kategorieSegments(t.byKategorie);
      if (el("donut")) Charts.donut(el("donut"), segs, { centerLabel: Charts.shortNum(t.netWorth) + " €", centerSub: ui.filter === "alles" ? "Netto" : Store.BEREICHE[ui.filter].label });
      if (el("trendChart")) Charts.line(el("trendChart"), trendSeries(), {});
    }
    if (el("pfDonut")) mountPortfolio(ui.section, ui.kat);
    if (ui.section === "chatbot") mountChat();
    document.body.classList.remove("nav-open");
  }

  function trendSeries() {
    const snaps = Store.getSnapshots();
    function pts(key) { return snaps.map(function (s) { return { x: new Date(s.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }), y: s[key] || 0, label: fmtEur(s[key] || 0) }; }); }
    return [
      { name: "Gesamt", color: "#0070f2", points: pts("total") },
      { name: "Privat", color: "#36a41d", points: pts("privat") },
      { name: "Business", color: "#e76500", points: pts("geschaeftlich") }
    ];
  }

  /* ================= Events ================= */
  function onClick(e) {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action, id = target.dataset.id;
    switch (action) {
      case "nav":
        ui.section = target.dataset.section;
        ui.kat = target.dataset.kat || null;
        ui.partnerId = null;
        if (ui.expanded.hasOwnProperty(ui.section)) ui.expanded[ui.section] = true;
        render(); break;
      case "toggle-group":
        e.stopPropagation();
        ui.expanded[target.dataset.section] = !ui.expanded[target.dataset.section];
        renderNav(); break;
      case "toggle-subgroup":
        e.stopPropagation();
        ui.expanded[target.dataset.group] = !ui.expanded[target.dataset.group];
        renderNav(); break;
      case "toggle-sidebar": document.body.classList.toggle("nav-open"); break;
      case "close-sidebar": document.body.classList.remove("nav-open"); break;
      case "filter": ui.filter = target.dataset.filter; render(); break;
      case "add-asset": openAssetForm(target.dataset.bereich, target.dataset.kat, null); break;
      case "edit-asset": { const a = Store.getAsset(id); if (a) openAssetForm(a.bereich, a.kategorie, id); } break;
      case "delete-asset": if (confirm("Diese Position wirklich löschen?")) { Store.deleteAsset(id); closeModal(); render(); } break;
      case "asset-doc-add": if (el("assetDocInput")) el("assetDocInput").click(); break;
      case "asset-doc-remove": assetDocs = assetDocs.filter(function (d) { return d.id !== id; }); renderAssetDocs(); break;
      case "add-partner": openPartnerForm(null); break;
      case "open-partner": ui.partnerId = id; render(); break;
      case "partner-back": ui.partnerId = null; render(); break;
      case "edit-partner": openPartnerForm(id); break;
      case "delete-partner": if (confirm("Diesen Partner wirklich löschen?")) { Store.deletePartner(id); ui.partnerId = null; closeModal(); render(); } break;
      case "delete-partner-note": if (confirm("Diese Notiz löschen?")) { Store.deletePartnerNote(ui.partnerId, id); render(); } break;
      case "add-partner-doc": if (el("partnerDocInput")) el("partnerDocInput").click(); break;
      case "delete-partner-doc": if (confirm("Dieses Dokument löschen?")) { Store.deletePartnerDocument(ui.partnerId, id); render(); } break;
      case "add-termin": openTerminForm(null); break;
      case "edit-termin": openTerminForm(id); break;
      case "delete-termin": if (confirm("Diesen Termin löschen?")) { Store.deleteTermin(id); closeModal(); render(); } break;
      case "add-bk": openBuchungskreisForm(null); break;
      case "edit-bk": openBuchungskreisForm(id); break;
      case "delete-bk": if (confirm("Diesen Buchungskreis löschen?")) { Store.deleteBuchungskreis(id); closeModal(); render(); } break;
      case "save-snapshot": Store.addSnapshot(); render(); break;
      case "delete-snapshot": if (confirm("Snapshot löschen?")) { Store.deleteSnapshot(id); render(); } break;
      case "chat-suggest": sendChat(target.dataset.q); break;
      case "close-modal": closeModal(); break;
      case "modal-backdrop": if (e.target.id === "modalOverlay") closeModal(); break;
      case "export-csv": download("carlos_erp_" + stamp() + ".csv", "﻿" + Store.exportCSV(), "text/csv;charset=utf-8"); break;
      case "export-json": download("carlos_erp_backup_" + stamp() + ".json", Store.exportJSON(), "application/json"); break;
      case "import-json": el("importFile").click(); break;
      case "load-sample": if (!Store.getAssets().length || confirm("Beispieldaten laden? Vorhandene Daten werden ersetzt.")) { Store.loadSample(); render(); } break;
      case "clear-all": if (confirm("Wirklich ALLE Daten unwiderruflich löschen?")) { Store.clearAll(); render(); } break;
    }
  }
  function onSubmit(e) {
    if (e.target.id === "assetForm") { e.preventDefault(); submitAssetForm(); }
    else if (e.target.id === "partnerForm") { e.preventDefault(); submitPartnerForm(); }
    else if (e.target.id === "terminForm") { e.preventDefault(); submitTerminForm(); }
    else if (e.target.id === "bkForm") { e.preventDefault(); submitBuchungskreisForm(); }
    else if (e.target.id === "noteForm") { e.preventDefault(); const t = el("f_note").value.trim(); if (t) { Store.addPartnerNote(ui.partnerId, t); render(); } }
    else if (e.target.id === "chatForm") { e.preventDefault(); const i = el("chatInput"); sendChat(i.value); }
  }
  function onInput(e) {
    if (e.target.closest && e.target.closest("#assetForm")) updateAssetPreview();
    if (e.target.classList && e.target.classList.contains("field-err")) e.target.classList.remove("field-err");
  }
  function onChange(e) {
    if (e.target.closest && e.target.closest("#assetForm")) updateAssetPreview();
    if (e.target.id === "importFile" && e.target.files && e.target.files[0]) { importFile(e.target.files[0]); e.target.value = ""; }
    if (e.target.id === "partnerDocInput" && e.target.files && e.target.files.length) { handlePartnerDocs(e.target.files); e.target.value = ""; }
    if (e.target.id === "assetDocInput" && e.target.files && e.target.files.length) { handleAssetDocs(e.target.files); e.target.value = ""; }
  }
  function onKey(e) {
    if (e.key === "Escape" && !el("modalOverlay").classList.contains("hidden")) closeModal();
  }

  /* ================= Init ================= */
  function attachListeners() {
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onChange);
    document.addEventListener("keydown", onKey);
  }
  // Start übernimmt der Auth-/Sync-Layer (auth.js): nach Login werden die Daten
  // aus Supabase geladen (Store.setRawState) und App.render() aufgerufen.
  // Ohne/vor Login bleibt die App verborgen; ist Supabase nicht verfügbar,
  // fällt auth.js auf den lokalen Modus zurück.
  window.App = { render: render, attachListeners: attachListeners };
  attachListeners();
})();
