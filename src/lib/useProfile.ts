// The patient's profile (name and GP), for screens that show it.
// null while loading, when nobody is logged in yet, or without a
// connection: screens then show a general text such as "your GP".
import { useEffect, useState } from "react";
import { getProfile, type Profile } from "./api";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let active = true; // ignore the answer if the screen already closed
    getProfile()
      .then((p) => {
        if (active) setProfile(p);
      })
      .catch(() => {
        // No connection: keep null, the screen still works.
      });
    return () => {
      active = false;
    };
  }, []);

  return profile;
}
