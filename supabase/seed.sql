-- =====================================================================
-- Zorgwinkel: test data
-- One test patient (Mrs Jansen), her three repeat medicines from
-- Figma 2.1, and one confirmed appointment for the home screen (0.2).
--
-- Before running: create the test user in Authentication -> Users ->
-- Add user, with the email below and "Auto Confirm User" ticked.
-- You can run this file again at any time: it resets her data.
-- =====================================================================

do $$
declare
  v_email   text := 'mrs.jansen@example.com';   -- the test user's email
  v_patient uuid;
begin
  -- Find the test user's id, so you never have to copy it by hand.
  select id into v_patient from auth.users where email = v_email;

  if v_patient is null then
    raise exception 'No user with email %. Create it first under Authentication -> Users.', v_email;
  end if;

  -- Start clean: deleting the profile also deletes her appointments,
  -- medicines and requests (on delete cascade in schema.sql).
  delete from public.profiles where id = v_patient;

  -- The patient.
  insert into public.profiles (id, full_name, gp_name)
  values (v_patient, 'Mrs Jansen', 'Dr Sarah de Vries');

  -- Her repeat medicines, as in Figma 2.1.
  insert into public.medicines (patient_id, name, strength, how_often) values
    (v_patient, 'Amlodipine',  '5 mg',  'Once a day'),
    (v_patient, 'Simvastatin', '20 mg', 'Once a day, in the evening'),
    (v_patient, 'Omeprazole',  '20 mg', 'Once a day');

  -- One confirmed appointment a week from now at 10:15 Dutch time,
  -- so the home screen has a "Your next appointment" card.
  insert into public.appointments
    (patient_id, provider, reason, preferred_date, part_of_day, status, confirmed_time)
  values (
    v_patient, 'gp', 'checkup', current_date + 7, 'morning', 'confirmed',
    ((current_date + 7) + time '10:15') at time zone 'Europe/Amsterdam'
  );
end;
$$;