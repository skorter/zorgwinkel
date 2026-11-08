// 1.6c Welcome, Mrs Jansen. Shown right after logging in, so the
// patient sees that the app now knows who they are.
// "Continue and send request" sends the basket. Sending is built in the
// next step; for now the button goes back to the basket.
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import { useProfile } from "../../lib/useProfile";
import { useAppTheme } from "../../theme";

export default function WelcomeAfterLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;
  const profile = useProfile();
  const { remember } = useLocalSearchParams<{ remember?: string }>();

  function continueAndSend() {
    // NEXT STEP: send the basket here (submitBasket), then the receipt.
    // "remember" is "0" when Remember me was not ticked: then the
    // patient is logged out again after sending.
    void remember;
    router.dismissTo("/basket");
  }

  return (
    <Screen topBar={<TopBar variant="back" showBasket={false} />}>
      <View style={{ alignItems: "center", gap: spacing.md }}>
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
          {profile
            ? t("welcomeBack.title", { name: profile.full_name })
            : t("welcomeBack.titleNoName")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("welcomeBack.text")}
        </Text>
      </View>

      <AppButton label={t("welcomeBack.continue")} onPress={continueAndSend} />
    </Screen>
  );
}
