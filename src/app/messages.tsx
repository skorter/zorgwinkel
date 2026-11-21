// Messages: not built in this prototype (outside US01 and US02).
// A simple "Coming soon" screen, so the Messages tile on Home never ends
// on Expo's "Unmatched route" page. It says plainly what isn't possible
// yet and where to go instead: "Ask a real person" stays at the bottom.
import { useRouter } from "expo-router";
import { MessageSquareText } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { useAppTheme } from "../theme";

export default function Messages() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;

  return (
    <Screen topBar={<TopBar variant="back" />}>
      <View
        style={{ alignItems: "center", gap: spacing.md, marginTop: spacing.xl }}
      >
        {/* Decoration only: hidden from screen readers. */}
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.iconBox,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageSquareText size={36} color={colors.primary} strokeWidth={2} />
        </View>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text, textAlign: "center" }]}
        >
          {t("home.messages")}
        </Text>
        <Text
          style={[text.bodyStrong, { color: colors.text, textAlign: "center" }]}
        >
          {t("messages.comingSoon")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("messages.text")}
        </Text>
      </View>

      {/* Back to Home, closing this screen so Back doesn't return here. */}
      <AppButton
        label={t("common.backToHome")}
        variant="outline"
        onPress={() => router.dismissTo("/")}
      />
    </Screen>
  );
}
