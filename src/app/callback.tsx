// 3.4 Callback requested: confirms that the practice will call back.
// Simulated: nothing is sent to a practice in this prototype.
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { useAppTheme } from "../theme";

export default function CallbackRequested() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;

  // Tell screen reader users straight away that it worked.
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(t("callback.title"));
  }, [t]);

  return (
    <Screen showAsk={false}>
      <View
        style={{ alignItems: "center", gap: spacing.md, marginTop: spacing.xl }}
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
          {t("callback.title")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("callback.text")}
        </Text>
      </View>

      {/* Back to Home, closing the help screens so Back doesn't return here. */}
      <AppButton
        label={t("common.backToHome")}
        onPress={() => router.dismissTo("/")}
      />
    </Screen>
  );
}
