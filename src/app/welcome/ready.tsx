// 4.8 You're ready. Marks the setup as done, so the next time the app
// opens straight on Home.
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Screen } from "../../components/Screen";
import { useDisplay } from "../../context/DisplayContext";
import { useAppTheme } from "../../theme";

export default function Ready() {
  const { t } = useTranslation();
  const router = useRouter();
  const { update } = useDisplay();
  const { colors, text, spacing } = useAppTheme().app;

  function goHome() {
    update({ setupDone: true });
    router.replace("/");
  }

  return (
    <Screen footer={<AppButton label={t("ready.goHome")} onPress={goHome} />}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.md,
        }}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={40} color={colors.onPrimary} strokeWidth={3} />
        </View>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text, textAlign: "center" }]}
        >
          {t("ready.title")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("ready.text")}
        </Text>
      </View>
    </Screen>
  );
}
