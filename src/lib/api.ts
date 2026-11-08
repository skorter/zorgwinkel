// Every call to Supabase in one place, so the screens never talk to the
// database directly (technical design, API section).
// The other functions (submitBasket, getNextAppointment, ...) are added
// here in the next steps.
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
