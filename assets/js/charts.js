/* =========================================================
   Carlos ERP – Charts
   Eigene, minimalistische SVG-Diagramme (offline, ohne Framework)
   ========================================================= */
const Charts = (function () {
  "use strict";

  function escapeXml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Kurzformat für Achsen: 1,2 Mio · 45k · 320
  function shortNum(v) {
    const a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toFixed(1).replace(".", ",") + " Mio";
    if (a >= 1e3) return Math.round(v / 1e3) + "k";
    return String(Math.round(v));
  }

  /* ---------------- Ring-Diagramm (Donut) ---------------- */
  // segments: [{ label, value, color }]
  function donut(el, segments, opts) {
    if (!el) return;
    opts = opts || {};
    const size = 220, stroke = 30;
    const r = (size - stroke) / 2, cx = size / 2, cy = size / 2;
    const circ = 2 * Math.PI * r;
    const total = segments.reduce(function (s, x) { return s + (x.value || 0); }, 0);

    let arcs = "";
    if (total <= 0) {
      arcs = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r +
             '" fill="none" stroke="var(--line)" stroke-width="' + stroke + '"/>';
    } else {
      let offset = 0;
      segments.forEach(function (seg) {
        const val = seg.value || 0;
        if (val <= 0) return;
        const len = (val / total) * circ;
        // kleine Lücke zwischen den Segmenten für sauberere Optik
        const gap = segments.length > 1 ? Math.min(2, len * 0.02) : 0;
        arcs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r +
                '" fill="none" stroke="' + seg.color + '" stroke-width="' + stroke +
                '" stroke-dasharray="' + Math.max(0, len - gap) + ' ' + (circ - Math.max(0, len - gap)) +
                '" stroke-dashoffset="' + (-offset) +
                '" transform="rotate(-90 ' + cx + " " + cy + ')">' +
                "<title>" + escapeXml(seg.label) + "</title></circle>";
        offset += len;
      });
    }

    const top = opts.centerLabel || "";
    const sub = opts.centerSub || "";
    el.innerHTML =
      '<svg viewBox="0 0 ' + size + " " + size + '" class="donut-svg" role="img" aria-label="Vermögensaufteilung">' +
      arcs +
      '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" class="donut-center">' + escapeXml(top) + "</text>" +
      '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" class="donut-sub">' + escapeXml(sub) + "</text>" +
      "</svg>";
  }

  /* ---------------- Linien-Diagramm (Verlauf) ---------------- */
  // series: [{ name, color, points: [{ x: <label>, y: <number> }] }]
  function line(el, series, opts) {
    if (!el) return;
    opts = opts || {};
    const W = 660, H = 280;
    const pad = { l: 58, r: 18, t: 18, b: 40 };
    const iw = W - pad.l - pad.r;
    const ih = H - pad.t - pad.b;

    const base = (series[0] && series[0].points) ? series[0].points : [];
    const n = base.length;
    if (n === 0) { el.innerHTML = ""; return; }

    let yMax = 0;
    series.forEach(function (s) {
      s.points.forEach(function (p) { if (p.y > yMax) yMax = p.y; });
    });
    if (yMax <= 0) yMax = 1;
    yMax = niceMax(yMax);

    const xAt = function (i) { return pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw); };
    const yAt = function (v) { return pad.t + ih - (v / yMax) * ih; };

    // Gitterlinien + Y-Beschriftung (4 Stufen)
    let grid = "";
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const val = (yMax / steps) * i;
      const y = yAt(val);
      grid += '<line x1="' + pad.l + '" y1="' + y + '" x2="' + (W - pad.r) + '" y2="' + y +
              '" stroke="var(--line)" stroke-width="1"/>';
      grid += '<text x="' + (pad.l - 8) + '" y="' + (y + 4) + '" text-anchor="end" class="chart-axis">' +
              escapeXml(shortNum(val)) + "</text>";
    }

    // X-Beschriftung (nicht überladen: max ~6 Labels)
    let xlabels = "";
    const every = Math.max(1, Math.ceil(n / 6));
    for (let i = 0; i < n; i++) {
      if (i % every !== 0 && i !== n - 1) continue;
      xlabels += '<text x="' + xAt(i) + '" y="' + (H - pad.b + 20) + '" text-anchor="middle" class="chart-axis">' +
                 escapeXml(base[i].x) + "</text>";
    }

    // Linien (+ dezente Fläche unter der ersten Serie)
    let paths = "";
    series.forEach(function (s, si) {
      if (!s.points.length) return;
      let d = "";
      s.points.forEach(function (p, i) {
        d += (i === 0 ? "M" : "L") + xAt(i).toFixed(1) + " " + yAt(p.y).toFixed(1) + " ";
      });
      if (si === 0 && n > 1) {
        const area = d + "L" + xAt(n - 1).toFixed(1) + " " + yAt(0) + " L" + xAt(0).toFixed(1) + " " + yAt(0) + " Z";
        paths += '<path d="' + area + '" fill="' + s.color + '" opacity="0.10"/>';
      }
      paths += '<path d="' + d.trim() + '" fill="none" stroke="' + s.color +
               '" stroke-width="' + (si === 0 ? 2.6 : 1.8) + '" stroke-linejoin="round" stroke-linecap="round"/>';
      // Punkte
      s.points.forEach(function (p, i) {
        paths += '<circle cx="' + xAt(i).toFixed(1) + '" cy="' + yAt(p.y).toFixed(1) +
                 '" r="' + (si === 0 ? 3.2 : 2.4) + '" fill="' + s.color + '"><title>' +
                 escapeXml(s.name + ": " + p.label) + "</title></circle>";
      });
    });

    el.innerHTML =
      '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Vermögensverlauf">' +
      grid + xlabels + paths + "</svg>";
  }

  // Runde die Obergrenze auf einen "schönen" Wert (für gerade Achsen)
  function niceMax(v) {
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const norm = v / mag;
    let nice;
    if (norm <= 1) nice = 1;
    else if (norm <= 2) nice = 2;
    else if (norm <= 2.5) nice = 2.5;
    else if (norm <= 5) nice = 5;
    else nice = 10;
    return nice * mag;
  }

  /* ---------------- Horizontale Balken (Gewinn/Verlust je Position) ---------------- */
  // items: [{ label, value, valueLabel }]  – grün bei value>=0, rot bei value<0
  function hbars(el, items, opts) {
    if (!el) return;
    opts = opts || {};
    const W = 660, rowH = 30, padT = 10, padB = 10, gutter = 150, valW = 70;
    const n = items.length;
    if (!n) { el.innerHTML = ""; return; }
    const H = padT + padB + n * rowH;
    const plotL = gutter, plotR = W - valW, iw = plotR - plotL;
    let maxAbs = 0;
    items.forEach(function (it) { if (Math.abs(it.value) > maxAbs) maxAbs = Math.abs(it.value); });
    if (maxAbs <= 0) maxAbs = 1;

    let svg = "";
    items.forEach(function (it, i) {
      const cy = padT + i * rowH + rowH / 2;
      const len = Math.abs(it.value) / maxAbs * iw;
      const color = it.value >= 0 ? "#107e3e" : "#d20a0a";
      const label = it.label.length > 20 ? it.label.slice(0, 19) + "…" : it.label;
      svg += '<text x="' + (gutter - 12) + '" y="' + (cy + 4) + '" text-anchor="end" class="hbar-label">' + escapeXml(label) + "</text>";
      svg += '<line x1="' + plotL + '" y1="' + cy + '" x2="' + plotR + '" y2="' + cy + '" stroke="var(--line)" stroke-width="1"/>';
      svg += '<rect x="' + plotL + '" y="' + (cy - 8) + '" width="' + len.toFixed(1) + '" height="16" rx="3" fill="' + color + '"/>';
      svg += '<text x="' + (W - 6) + '" y="' + (cy + 4) + '" text-anchor="end" class="hbar-val" fill="' + color + '">' + escapeXml(it.valueLabel) + "</text>";
    });
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Gewinn und Verlust je Position">' + svg + "</svg>";
  }

  return { donut: donut, line: line, hbars: hbars, shortNum: shortNum };
})();
