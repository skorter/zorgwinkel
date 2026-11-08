// The patient's display settings: language, text size and colours
// (screens 4.1x, 4.5 and 3.5), and whether the first-time setup is done.
// Saved on the phone with AsyncStorage, not in Supabase: the setup
// happens before the patient logs in, and the settings belong to this phone.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import i18n from "../lib/i18n";
import type { ColourMode, TextSize } from "../theme";

export type Language = "en" | "nl" | "tr" | "ar";
export const languages: Language[] = ["en", "nl", "tr", "ar"];

// Each language in its own language, so everyone can find theirs.
export const languageNames: Record<Language, string> = {
  en: "English",
  nl: "Nederlands",
  tr: "Türkçe",
  ar: "العربية",
};

export type DisplaySettings = {
  language: Language;
  textSize: TextSize;
  colourMode: ColourMode;
  setupDone: boolean; // false = show the welcome flow on start
};

// On first start, use the phone's language if the app has it, else English.
function phoneLanguage(): Language {
  const code = getLocales()[0]?.languageCode;
  return languages.includes(code as Language) ? (code as Language) : "en";
}

const defaults: DisplaySettings = {
  language: phoneLanguage(),
  textSize: "normal",
  colourMode: "light",
  setupDone: false,
};

const STORAGE_KEY = "zorgwinkel.display";

type DisplayContextValue = DisplaySettings & {
  loaded: boolean; // false while reading the saved settings
  update: (changes: Partial<DisplaySettings>) => void;
};

const DisplayContext = createContext<DisplayContextValue | null>(null);

export function DisplayProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DisplaySettings>(defaults);
  const [loaded, setLoaded] = useState(false);

  // Read the saved settings once, when the app starts.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        const restored = saved
          ? { ...defaults, ...JSON.parse(saved) }
          : defaults;
        setSettings(restored);
        i18n.changeLanguage(restored.language);
      })
      .catch(() => {
        // Unreadable storage: just start with the defaults.
        i18n.changeLanguage(defaults.language);
      })
      .finally(() => setLoaded(true));
  }, []);

  // Change one or more settings and save them straight away.
  function update(changes: Partial<DisplaySettings>) {
    const next = { ...settings, ...changes };
    setSettings(next);
    if (changes.language) i18n.changeLanguage(changes.language);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      // Saving failed: the change still works until the app closes.
    });
  }

  return (
    <DisplayContext.Provider value={{ ...settings, loaded, update }}>
      {children}
    </DisplayContext.Provider>
  );
}

// In a screen: const { textSize, update } = useDisplay();
export function useDisplay() {
  const value = useContext(DisplayContext);
  if (!value) throw new Error("useDisplay must be used inside DisplayProvider");
  return value;
}
