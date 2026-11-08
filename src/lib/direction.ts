// Reading direction. Arabic is read from right to left, so the whole
// layout must be mirrored. React Native can only switch direction by
// restarting the app, so we tell the patient first, then restart.
//
// LIMITATION: this does not work in Expo Go. Expo Go resets the
// direction every time it opens a project (Expo localization guide).
// So in Expo Go the Arabic texts show, but the layout stays left to
// right. In a real build (development build or app store build) the
// code below mirrors the layout.
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Alert, DevSettings, I18nManager } from "react-native";
import type { Language } from "../context/DisplayContext";
import i18n from "./i18n";

export const isRightToLeft = (language: Language) => language === "ar";

const inExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// On every start: make sure the direction setting matches the saved
// language. Takes effect at the next start; no restart is forced here,
// so the app can never get stuck restarting.
export function keepDirectionInSync(language: Language) {
  if (inExpoGo) return;
  const rtl = isRightToLeft(language);
  if (I18nManager.isRTL !== rtl) {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
  }
}

// When the patient picks a language with another direction.
export function switchDirectionIfNeeded(language: Language) {
  if (inExpoGo) return; // would restart for nothing: Expo Go resets it
  const rtl = isRightToLeft(language);
  if (I18nManager.isRTL === rtl) return; // already the right direction

  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);

  // The message in the NEW language, because that is what the patient chose.
  const t = i18n.getFixedT(language);
  Alert.alert("", t("language.reloadText"), [
    // A real build would use expo-updates (Updates.reloadAsync) here.
    { text: t("common.ok"), onPress: () => DevSettings.reload() },
  ]);
}
