// Every call to Supabase in one place, so the screens never talk to the
// database directly (technical design, API section).
// The US02 functions (medicines, live status) are added in Phase 5.
import type { BasketItem } from "../context/BasketContext";
import { supabase } from "./supabase";

export type Profile = {
  full_name: string; // "Mrs Jansen"
  gp_name: string; // "Dr Sarah de Vries"
};

// Is someone logged in on this phone? (Remember me keeps the session.)
export async function isLoggedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return data.session !== null;
}

// Runs after the simulated DigiD PIN. A real version would log in
// through DigiD; the prototype logs in the one test patient instead.
// The PIN itself is never used, saved or sent.
// Limitation: the test login is inside the app (.env, EXPO_PUBLIC_...),
// acceptable only because it is a made-up test account.
export async function signIn(): Promise<void> {
  const email = process.env.EXPO_PUBLIC_TEST_EMAIL;
  const password = process.env.EXPO_PUBLIC_TEST_PASSWORD;
  if (!email || !password) {
    throw new Error("Test login missing. Check .env and restart Expo.");
  }
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
}

// Log out on this phone. Used when Remember me was not ticked.
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// The patient's name and their GP's name.
// Returns null when nobody is logged in yet: the first time, the patient
// only logs in with DigiD at the end, when sending the basket.
// No filter on the patient here: row level security only returns
// the logged-in patient's own row.
export async function getProfile(): Promise<Profile | null> {
  if (!(await isLoggedIn())) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, gp_name")
    .single();

  if (error) throw error;
  return data;
}

export type NextAppointment = {
  provider: "gp" | "nurse";
  confirmed_time: string; // set by the practice when it confirms
};

// The next confirmed appointment, for Home (0.2). Only confirmed ones:
// a request becomes an appointment once the practice has picked a time.
// null when nobody is logged in or there is none coming up.
export async function getNextAppointment(): Promise<NextAppointment | null> {
  if (!(await isLoggedIn())) return null;

  const { data, error } = await supabase
    .from("appointments")
    .select("provider, confirmed_time")
    .eq("status", "confirmed")
    .gt("confirmed_time", new Date().toISOString())
    .order("confirmed_time")
    .limit(1)
    .maybeSingle(); // no row is fine: then data is null

  if (error) throw error;
  return data;
}

// Send the whole basket in one call to submit_basket (supabase/schema.sql).
// The database saves everything or nothing, so a failed send never
// leaves half a basket behind. Throws when it fails; the screen then
// keeps the basket and shows Try again.
export async function submitBasket(items: BasketItem[]): Promise<void> {
  // The app's camelCase names become the database's snake_case names.
  const appointments = items.flatMap((i) =>
    i.kind === "appointment"
      ? [
          {
            provider: i.appointment.provider,
            reason: i.appointment.reason,
            note: i.appointment.note ?? "",
            preferred_date: i.appointment.preferredDate,
            part_of_day: i.appointment.partOfDay,
          },
        ]
      : [],
  );
  const medicineIds = items.flatMap((i) =>
    i.kind === "medicine" ? [i.medicine.medicineId] : [],
  );

  const { error } = await supabase.rpc("submit_basket", {
    p_appointments: appointments,
    p_medicine_ids: medicineIds,
  });
  if (error) throw error;
}
