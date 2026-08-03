-- =========================================================
-- Carlos · Personal ERP – Supabase-Schema (Auth + RLS)
-- Ausführen im Supabase SQL-Editor (einmalig).
-- Ansatz: ein JSON-Zustand pro Benutzer (minimaler Umbau);
-- RLS stellt sicher, dass NUR der eingeloggte Benutzer seine
-- eigene Zeile lesen/schreiben kann.
-- =========================================================

-- 1) Tabelle: eine Zeile pro Benutzer, gesamter App-State als JSON
create table if not exists public.app_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2) Row Level Security aktivieren
alter table public.app_state enable row level security;

-- 3) Policies – nur der eingeloggte Benutzer (auth.uid()) darf auf SEINE Zeile
drop policy if exists "app_state_select_own" on public.app_state;
create policy "app_state_select_own" on public.app_state
  for select using (auth.uid() = user_id);

drop policy if exists "app_state_insert_own" on public.app_state;
create policy "app_state_insert_own" on public.app_state
  for insert with check (auth.uid() = user_id);

drop policy if exists "app_state_update_own" on public.app_state;
create policy "app_state_update_own" on public.app_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "app_state_delete_own" on public.app_state;
create policy "app_state_delete_own" on public.app_state
  for delete using (auth.uid() = user_id);

-- 4) updated_at automatisch pflegen
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_app_state_updated_at on public.app_state;
create trigger trg_app_state_updated_at
  before update on public.app_state
  for each row execute function public.set_updated_at();

-- Ergebnis prüfen:
-- select * from pg_policies where tablename = 'app_state';
