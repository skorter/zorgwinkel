// Listens for "ready" on every screen, not only on Your medicines:
// the notification matters most when the patient is somewhere else.
// Only while someone is logged in; it shows nothing on screen itself.
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";
import { getMedicine, watchRequests, type RequestChange } from "../lib/api";
import { showReady } from "../lib/notifications";
import { supabase } from "../lib/supabase";

export function ReadyNotifier() {
  useEffect(() => {
    let stopWatching: (() => void) | null = null;

    // Runs once at the start (logged in or not), and again on every
    // login, logout or refreshed login.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      stopWatching?.(); // stop the old listener first, never two at once
      stopWatching = null;
      if (session) stopWatching = watchRequests(notifyIfReady);
    });

    // When the app closes: stop listening for changes and for logins.
    return () => {
      stopWatching?.();
      data.subscription.unsubscribe();
    };
  }, []);

  // Tapping the notification opens Your medicines, where the patient
  // sees "Ready for pickup". Works while the app is open or in the
  // background.
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const url = response.notification.request.content.data?.url;
        if (url === "/medicines") router.navigate("/medicines");
      },
    );
    return () => subscription.remove();
  }, []);

  return null; // nothing to show: this component only listens
}

async function notifyIfReady({ medicineId, status }: RequestChange) {
  if (status !== "ready") return;
  try {
    const medicine = await getMedicine(medicineId);
    if (medicine) await showReady(`${medicine.name} ${medicine.strength}`);
  } catch {
    // No notification is better than a crash. Your medicines still
    // shows "Ready for pickup" the next time it opens.
  }
}
