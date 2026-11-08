// Every call to Supabase in one place, so the screens never talk to the
// database directly (technical design, API section).
// The other functions (signIn, submitBasket, getNextAppointment, ...)
// are added here in the next steps.
import { supabase } from "./supabase";

export type Profile = {
  full_name: string; // "Mrs Jansen"
  gp_name: string; // "Dr Sarah de Vries"
};

// The patient's name and their GP's name.
// Returns null when nobody is logged in yet: the first time, the patient
// only logs in with DigiD at the end, when sending the basket.
// No filter on the patient here: row level security only returns
// the logged-in patient's own row.
export async function getProfile(): Promise<Profile | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, gp_name")
    .single();

  if (error) throw error;
  return data;
}
