/* =========================================================
   Carlos · Personal ERP – Auth & Sync (Supabase)
   - E-Mail/Passwort-Login (Supabase Auth)
   - lädt/speichert den App-Zustand in Tabelle app_state (RLS-geschützt)
   - localStorage bleibt Offline-Cache
   ========================================================= */
(function () {
  "use strict";
  const cfg = window.APP_CONFIG || {};
  const $ = function (id) { return document.getElementById(id); };

  function showApp() { document.body.classList.add("authed"); }
  function showLogin() { document.body.classList.remove("authed"); const o = $("authOverlay"); if (o) o.classList.remove("checking"); }
  function setErr(msg) { const e = $("authError"); if (e) { e.textContent = msg || ""; e.style.display = msg ? "block" : "none"; } }
  function setInfo(msg) { const c = $("authInfo"); if (c) { c.textContent = msg || ""; c.style.display = msg ? "block" : "none"; } }
  function setBusy(b) { const btn = $("authSubmit"); if (btn) btn.disabled = b; }

  /* ---- Fallback: Supabase nicht verfügbar → lokaler Modus (wie früher) ---- */
  if (!window.supabase || !cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
    console.warn("Supabase nicht verfügbar – lokaler Modus (ohne Login).");
    Store.load(); App.render(); showApp(); document.body.classList.add("local-mode");
    return;
  }

  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  window.__sb = sb; // für Debugging

  let user = null;
  let accessToken = null;
  let syncTimer = null;
  let mode = "signin"; // "signin" | "signup"

  /* ---- Mandanten (100 = Privat, 200 = Business): getrennte Datensätze in EINEM app_state ---- */
  const MANDANT_KEY = "erp_mandant";
  const MANDANT_LABELS = { "100": "Privat", "200": "Business" };
  let cloudData = null;   // { schema:"mandanten-1", mandanten: { "100":{…}, "200":{…} } } – hält IMMER beide
  let mandant = "100";
  try { const _m = localStorage.getItem(MANDANT_KEY); if (_m === "100" || _m === "200") mandant = _m; } catch (e) {}
  function setMandant(m) { mandant = (m === "200") ? "200" : "100"; try { localStorage.setItem(MANDANT_KEY, mandant); } catch (e) {} }
  function normalizeMandanten(raw) {
    if (raw && raw.mandanten && typeof raw.mandanten === "object") {
      return { schema: "mandanten-1", mandanten: { "100": raw.mandanten["100"] || {}, "200": raw.mandanten["200"] || {} } };
    }
    if (raw && Array.isArray(raw.assets)) { // Alt-Format (flach) → wird Mandant 100, 200 leer
      return { schema: "mandanten-1", mandanten: { "100": raw, "200": {} }, _migrated: true };
    }
    return { schema: "mandanten-1", mandanten: { "100": {}, "200": {} } };
  }
  function hasDataObj(d) {
    if (!d) return false;
    return ["assets", "partners", "buchungskreise", "kontenplaene", "streamPnl", "transaktionen", "termine", "snapshots"]
      .some(function (k) { return Array.isArray(d[k]) && d[k].length > 0; });
  }
  function hasDataCombined(cd) { return !!(cd && cd.mandanten && (hasDataObj(cd.mandanten["100"]) || hasDataObj(cd.mandanten["200"]))); }
  function combinedWithActive() {
    const base = (cloudData && cloudData.mandanten) ? cloudData : { mandanten: { "100": {}, "200": {} } };
    const out = { schema: "mandanten-1", mandanten: { "100": base.mandanten["100"] || {}, "200": base.mandanten["200"] || {} } };
    out.mandanten[mandant] = Store.getRawState();   // aktiven Mandanten mergen, anderen aus base behalten
    return out;
  }
  function updateMandantUi() {
    const ind = $("mandantIndicator"); if (ind) ind.textContent = "Mandant " + mandant + " · " + (MANDANT_LABELS[mandant] || "");
    const sw = $("mandantSwitch"); if (sw) sw.value = mandant;
    const am = $("authMandant"); if (am) am.value = mandant;
  }
  function switchMandant(m) {
    m = (m === "200") ? "200" : "100";
    if (!cloudData) { setMandant(m); updateMandantUi(); return; }
    if (m === mandant) return;
    cloudData.mandanten[mandant] = Store.getRawState();   // aktuellen Mandanten sichern
    setMandant(m);
    Store.setRawState(cloudData.mandanten[mandant] || {}); // Ziel-Mandanten laden
    updateMandantUi(); App.render();
    if (user) upload(user.id);                             // beide Mandanten persistieren
  }

  /* ---- Cloud-Zugriffe ---- */
  async function fetchState(uid) {
    const { data, error } = await sb.from("app_state").select("data").eq("user_id", uid).maybeSingle();
    if (error) throw error;
    return data ? data.data : null;
  }
  async function upload(uid) {
    if (!cloudData) return;                                 // noch nichts geladen → NIE schreiben
    const combined = combinedWithActive();
    if (!hasDataCombined(combined)) { console.warn("Upload übersprungen: leer (Cloud-Schutz)."); return; }
    cloudData = combined;                                   // Speicher aktuell halten (beide Mandanten)
    const { error } = await sb.from("app_state").upsert({ user_id: uid, data: combined }, { onConflict: "user_id" });
    if (error) console.warn("Sync-Fehler:", error.message);
  }
  function scheduleSync() {
    if (!user) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { upload(user.id); }, 800);
  }
  Store.setCloudSync(scheduleSync);

  // Letzte Änderung beim Schließen best-effort sichern (keepalive)
  function flushOnUnload() {
    if (!user || !accessToken || !cloudData) return;
    const combined = combinedWithActive();
    if (!hasDataCombined(combined)) return; // Cloud-Schutz
    try {
      fetch(cfg.SUPABASE_URL + "/rest/v1/app_state", {
        method: "POST",
        headers: {
          "apikey": cfg.SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({ user_id: user.id, data: combined }),
        keepalive: true
      });
    } catch (e) { /* best effort */ }
  }
  window.addEventListener("beforeunload", flushOnUnload);

  /* ---- Ein-/Ausloggen ---- */
  async function enter(session) {
    if (user && user.id === session.user.id) return; // schon drin
    user = session.user;
    setBusy(true);
    try {
      const raw = await fetchState(user.id);
      cloudData = normalizeMandanten(raw);
      const migrated = cloudData._migrated; if (migrated) delete cloudData._migrated;
      Store.setRawState(cloudData.mandanten[mandant] || {});   // aktiven Mandanten laden
      if (migrated) await upload(user.id);                      // Alt-Format einmalig in Mandanten-Struktur überführen
    } catch (e) {
      console.warn("Cloud-Daten konnten nicht geladen werden:", e && e.message);
      cloudData = null; Store.load();
    }
    setBusy(false);
    const ue = $("userEmail"); if (ue) ue.textContent = user.email || "";
    updateMandantUi();
    App.render();
    showApp();
  }
  function leave() {
    clearTimeout(syncTimer); syncTimer = null;
    user = null; accessToken = null; cloudData = null;
    if (Store.clearLocalCache) Store.clearLocalCache(); // Cache leeren, App-Inhalt entfernen
    App.render();
    if ($("authPassword")) $("authPassword").value = "";
    setErr(""); setInfo("");
    showLogin();
  }

  /* ---- Formular ---- */
  function friendly(err) {
    const m = (err && err.message) || String(err);
    if (/Invalid login credentials/i.test(m)) return "E-Mail oder Passwort ist falsch.";
    if (/already registered|already exists/i.test(m)) return "Diese E-Mail ist bereits registriert – bitte anmelden.";
    if (/Email not confirmed/i.test(m)) return "E-Mail noch nicht bestätigt. Bitte prüfe dein Postfach.";
    if (/rate limit|too many/i.test(m)) return "Zu viele Versuche – bitte kurz warten.";
    if (/password/i.test(m) && /least|6/i.test(m)) return "Passwort muss mindestens 6 Zeichen haben.";
    if (/Failed to fetch|NetworkError/i.test(m)) return "Keine Verbindung zu Supabase.";
    return m;
  }
  async function submit(e) {
    e.preventDefault();
    setErr(""); setInfo("");
    const email = ($("authEmail").value || "").trim();
    const pw = $("authPassword").value || "";
    if (!email || !pw) return;
    const msel = $("authMandant"); if (msel && msel.value) setMandant(msel.value);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email: email, password: pw });
        if (error) throw error;
        if (!data.session) {
          setInfo("Bestätigungs-E-Mail an " + email + " gesendet. Bestätige den Link und melde dich dann an.");
          setMode("signin");
        }
        // mit Session: onAuthStateChange übernimmt
      } else {
        const { error } = await sb.auth.signInWithPassword({ email: email, password: pw });
        if (error) throw error;
      }
    } catch (err) {
      setErr(friendly(err));
    } finally {
      setBusy(false);
    }
  }
  function setMode(m) {
    mode = m;
    const title = $("authTitle"), submitBtn = $("authSubmit"), toggle = $("authToggle");
    if (m === "signup") {
      if (title) title.textContent = "Konto erstellen";
      if (submitBtn) submitBtn.textContent = "Registrieren";
      if (toggle) toggle.textContent = "Schon ein Konto? Anmelden";
    } else {
      if (title) title.textContent = "Anmelden";
      if (submitBtn) submitBtn.textContent = "Anmelden";
      if (toggle) toggle.textContent = "Neu hier? Konto erstellen";
    }
    setErr("");
  }

  /* ---- Events ---- */
  document.addEventListener("submit", function (e) { if (e.target.id === "authForm") submit(e); });
  document.addEventListener("click", function (e) {
    const t = e.target.closest("[data-auth]");
    if (!t) return;
    const a = t.dataset.auth;
    if (a === "toggle-mode") setMode(mode === "signin" ? "signup" : "signin");
    else if (a === "logout") { if (confirm("Abmelden?")) sb.auth.signOut(); }
  });
  document.addEventListener("change", function (e) { if (e.target.id === "mandantSwitch") switchMandant(e.target.value); });

  /* ---- Sitzung / Auth-Status ---- */
  sb.auth.onAuthStateChange(function (event, session) {
    accessToken = session ? session.access_token : null;
    if (session && session.user) enter(session);
    else if (user) leave();
    else showLogin();
  });

  updateMandantUi(); // Login-Maske/Selector auf gemerkten Mandanten setzen
  // Sicherheitsnetz, falls kein Auth-Event kommt (z. B. offline): nach kurzer Zeit Login zeigen
  setTimeout(function () { if (!user) showLogin(); }, 2500);
})();
