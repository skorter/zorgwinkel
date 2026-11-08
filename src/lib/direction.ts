// Reading direction. Arabic is read from right to left, so the whole
// layout must be mirrored. React Native can only switch direction by
// restarting the app, so we tell the patient first, then restart.
import { Alert, DevSettings, I18nManager } from "react-native";
import type { Language } from "../context/DisplayContext";
import i18n from "./i18n";

export const isRightToLeft = (language: Language) => language === "ar";

export function switchDirectionIfNeeded(language: Language) {
  const rtl = isRightToLeft(language);
  if (I18nManager.isRTL === rtl) return; // already the right direction

  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);

  // The message in the NEW language, because that is what the patient chose.
  const t = i18n.getFixedT(language);
  Alert.alert("", t("language.reloadText"), [
    // DevSettings.reload works in Expo Go. A real build would use
    // expo-updates (Updates.reloadAsync) instead.
    { text: t("common.ok"), onPress: () => DevSettings.reload() },
  ]);
}
