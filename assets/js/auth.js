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

  /* ---- Cloud-Zugriffe ---- */
  async function fetchState(uid) {
    const { data, error } = await sb.from("app_state").select("data").eq("user_id", uid).maybeSingle();
    if (error) throw error;
    return data ? data.data : null;
  }
  // Schutz: Ein leerer/Default-Zustand darf NIEMALS die Cloud überschreiben (verhindert Datenverlust)
  function hasData(d) {
    if (!d) return false;
    return ["assets", "partners", "buchungskreise", "kontenplaene", "streamPnl", "termine", "snapshots"]
      .some(function (k) { return Array.isArray(d[k]) && d[k].length > 0; });
  }
  async function upload(uid) {
    const data = Store.getRawState();
    if (!hasData(data)) { console.warn("Upload übersprungen: leerer Zustand (Cloud-Schutz)."); return; }
    const { error } = await sb.from("app_state").upsert({ user_id: uid, data: data }, { onConflict: "user_id" });
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
    if (!user || !accessToken) return;
    if (!hasData(Store.getRawState())) return; // Cloud-Schutz: nie leeren Zustand speichern
    try {
      fetch(cfg.SUPABASE_URL + "/rest/v1/app_state", {
        method: "POST",
        headers: {
          "apikey": cfg.SUPABASE_ANON_KEY,
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({ user_id: user.id, data: Store.getRawState() }),
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
      const cloud = await fetchState(user.id);
      if (cloud) {
        Store.setRawState(cloud);                 // Cloud ist führend
      } else {
        Store.load();                             // Erstanmeldung: lokale Daten hochladen
        await upload(user.id);
      }
    } catch (e) {
      console.warn("Cloud-Daten konnten nicht geladen werden – nutze lokalen Cache:", e && e.message);
      Store.load();
    }
    setBusy(false);
    const ue = $("userEmail"); if (ue) ue.textContent = user.email || "";
    App.render();
    showApp();
  }
  function leave() {
    clearTimeout(syncTimer); syncTimer = null;
    user = null; accessToken = null;
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

  /* ---- Sitzung / Auth-Status ---- */
  sb.auth.onAuthStateChange(function (event, session) {
    accessToken = session ? session.access_token : null;
    if (session && session.user) enter(session);
    else if (user) leave();
    else showLogin();
  });

  // Sicherheitsnetz, falls kein Auth-Event kommt (z. B. offline): nach kurzer Zeit Login zeigen
  setTimeout(function () { if (!user) showLogin(); }, 2500);
})();
