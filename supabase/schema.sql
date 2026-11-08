-- =====================================================================
-- Zorgwinkel: database schema
-- Tables, security rules, the submit_basket function and live updates.
-- Run this in the Supabase SQL Editor.
--
-- WARNING: section 0 deletes the tables first, so you can run this file
-- again after a change. That also deletes all data in them, so run
-- seed.sql again afterwards.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 0. Start clean
-- ---------------------------------------------------------------------
drop function if exists public.submit_basket(jsonb, uuid[]);
drop table if exists public.medicine_requests cascade;
drop table if exists public.medicines cascade;
drop table if exists public.appointments cascade;
drop table if exists public.profiles cascade;
drop function if exists public.set_updated_at();


-- ---------------------------------------------------------------------
-- 1. Tables
-- Every row with patient data has a patient_id, which the security
-- rules in section 3 check. The "check" lines only allow the values
-- the app shows, so the app never has to deal with an unknown value.
-- ---------------------------------------------------------------------

-- One patient, linked to their login (auth.users).
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text not null,          -- "Mrs Jansen"
  gp_name    text not null,          -- "Dr Sarah de Vries"
  created_at timestamptz not null default now()
);

-- One appointment request (US01).
create table public.appointments (
  id             uuid primary key default gen_random_uuid(),
  patient_id     uuid not null references public.profiles (id) on delete cascade,
  provider       text not null check (provider in ('gp', 'nurse')),
  reason         text not null check (reason in ('checkup', 'pain', 'other', 'tell_doctor')),
  note           text check (char_length(note) <= 500),
  preferred_date date not null,
  part_of_day    text not null check (part_of_day in ('morning', 'afternoon')),
  status         text not null default 'requested' check (status in ('requested', 'confirmed')),
  confirmed_time timestamptz,        -- filled in by the practice
  created_at     timestamptz not null default now(),
  -- A confirmed appointment must have a time.
  constraint confirmed_has_time check (status <> 'confirmed' or confirmed_time is not null)
);

-- A medicine on the patient's own repeat list (test data).
create table public.medicines (
  id         uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles (id) on delete cascade,
  name       text not null,          -- "Simvastatin"
  strength   text not null,          -- "20 mg"
  how_often  text not null,          -- "Once a day, in the evening"
  created_at timestamptz not null default now()
);

-- One request to repeat a medicine (US02).
-- 'collected' closes the request, so Reorder comes back on the medicine.
create table public.medicine_requests (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references public.profiles (id) on delete cascade,
  medicine_id uuid not null references public.medicines (id) on delete cascade,
  status      text not null default 'requested' check (status in ('requested', 'ready', 'collected')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes on the columns the app and the security rules look up by.
create index on public.appointments (patient_id);
create index on public.medicines (patient_id);
create index on public.medicine_requests (patient_id);
create index on public.medicine_requests (medicine_id);


-- ---------------------------------------------------------------------
-- 2. Keep updated_at up to date
-- When the practice changes a status in the dashboard, updated_at
-- changes with it, so the app can show the latest request.
-- ---------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger medicine_requests_set_updated_at
  before update on public.medicine_requests
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 3. Security
-- Row level security: a patient only ever sees their own rows.
-- Grants: logged-in patients may only READ. There is no insert, update
-- or delete for patients: new rows only come in through submit_basket,
-- and only the practice (the dashboard) changes statuses.
-- Not-logged-in users (anon) get nothing.
-- ---------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.appointments      enable row level security;
alter table public.medicines         enable row level security;
alter table public.medicine_requests enable row level security;

create policy "Patients see their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Patients see their own appointments"
  on public.appointments for select to authenticated
  using ((select auth.uid()) = patient_id);

create policy "Patients see their own medicines"
  on public.medicines for select to authenticated
  using ((select auth.uid()) = patient_id);

create policy "Patients see their own medicine requests"
  on public.medicine_requests for select to authenticated
  using ((select auth.uid()) = patient_id);

revoke all on public.profiles, public.appointments, public.medicines, public.medicine_requests from anon, authenticated;
grant select on public.profiles, public.appointments, public.medicines, public.medicine_requests to authenticated;


-- ---------------------------------------------------------------------
-- 4. submit_basket: send the whole basket in one go
-- Runs as one transaction: if anything fails, nothing is saved.
--
-- p_appointments: a list like
--   [{"provider": "gp", "reason": "other", "note": "",
--     "preferred_date": "2026-11-17", "part_of_day": "morning"}]
-- p_medicine_ids: the ids of the medicines to reorder
--
-- Returns what was saved, for the receipt screen.
--
-- "security definer" means the function runs with the rights of its
-- owner, so it can insert even though patients cannot. That is why it
-- checks everything itself: who is logged in, and that each medicine
-- belongs to this patient.
-- ---------------------------------------------------------------------
create function public.submit_basket(
  p_appointments jsonb  default '[]'::jsonb,
  p_medicine_ids uuid[] default '{}'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_patient     uuid := auth.uid();
  v_item        jsonb;
  v_appointment public.appointments;
  v_medicine_id uuid;
  v_medicine    public.medicines;
  v_request     public.medicine_requests;
  v_saved_appointments jsonb := '[]'::jsonb;
  v_saved_requests     jsonb := '[]'::jsonb;
begin
  -- Only a logged-in patient can send a basket.
  if v_patient is null then
    raise exception 'Not logged in';
  end if;

  p_appointments := coalesce(p_appointments, '[]'::jsonb);
  p_medicine_ids := coalesce(p_medicine_ids, '{}');

  if jsonb_array_length(p_appointments) = 0 and cardinality(p_medicine_ids) = 0 then
    raise exception 'The basket is empty';
  end if;

  -- Appointments. The check lines on the table already stop an unknown
  -- provider, reason or part of the day; the day is checked here.
  for v_item in select * from jsonb_array_elements(p_appointments) loop
    if (v_item ->> 'preferred_date')::date <= current_date then
      raise exception 'The appointment day must be in the future';
    end if;

    insert into public.appointments (patient_id, provider, reason, note, preferred_date, part_of_day)
    values (
      v_patient,
      v_item ->> 'provider',
      v_item ->> 'reason',
      nullif(trim(v_item ->> 'note'), ''),
      (v_item ->> 'preferred_date')::date,
      v_item ->> 'part_of_day'
    )
    returning * into v_appointment;

    v_saved_appointments := v_saved_appointments || to_jsonb(v_appointment);
  end loop;

  -- Medicines. Each one must be on this patient's own list.
  foreach v_medicine_id in array p_medicine_ids loop
    select * into v_medicine
    from public.medicines
    where id = v_medicine_id and patient_id = v_patient;

    if not found then
      raise exception 'This medicine is not on your list';
    end if;

    insert into public.medicine_requests (patient_id, medicine_id)
    values (v_patient, v_medicine_id)
    returning * into v_request;

    -- Add the name and strength, so the receipt can show them.
    v_saved_requests := v_saved_requests || (
      to_jsonb(v_request) || jsonb_build_object('name', v_medicine.name, 'strength', v_medicine.strength)
    );
  end loop;

  return jsonb_build_object(
    'appointments', v_saved_appointments,
    'medicine_requests', v_saved_requests
  );
end;
$$;

-- Only logged-in patients may call it.
revoke execute on function public.submit_basket(jsonb, uuid[]) from public, anon;
grant execute on function public.submit_basket(jsonb, uuid[]) to authenticated;


-- ---------------------------------------------------------------------
-- 5. Live updates
-- Realtime tells the app when a medicine request changes (US02).
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.medicine_requests;