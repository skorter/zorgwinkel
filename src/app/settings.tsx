// 3.5 Language and display: the same choices as the welcome flow (4.5),
// reachable from Home.
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import { AppButton } from "../components/AppButton";
import { DisplaySettingsForm } from "../components/DisplaySettingsForm";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { useDisplay } from "../context/DisplayContext";
import { signOut } from "../lib/api";
import { useAppTheme } from "../theme";

export default function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { update } = useDisplay();
  const { colors, text } = useAppTheme().app;

  // Only for testing: start the welcome flow again, logged out.
  // No navigation here: Stack.Protected in _layout.tsx closes Home and
  // Settings once setupDone is false, and opens Welcome.
  async function restartSetup() {
    await signOut();
    update({ setupDone: false });
  }

  return (
    <Screen
      topBar={<TopBar variant="back" />}
      showAsk={false}
      footer={
        <AppButton label={t("common.done")} onPress={() => router.back()} />
      }
    >
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("common.languageAndDisplay")}
      </Text>
      <Text style={[text.body, { color: colors.textMuted }]}>
        {t("display.subtitle")}
      </Text>

      <DisplaySettingsForm />

      {__DEV__ && (
        <AppButton
          label="Restart setup (developer only)"
          variant="outline"
          onPress={restartSetup}
        />
      )}
    </Screen>
  );
}
