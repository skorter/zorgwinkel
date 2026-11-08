// Translations. Every text on screen comes from a file in src/locales,
// never typed into a screen. The language itself is chosen in
// DisplayContext (phone language on first start, or the patient's choice).
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import nl from "../locales/nl.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nl: { translation: nl },
    // tr and ar are added once all screens are done.
  },
  lng: "en",
  fallbackLng: "en", // a missing text shows in English instead of a key
  interpolation: { escapeValue: false }, // React already escapes text
});

export default i18n;
