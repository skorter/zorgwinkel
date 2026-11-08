// 1.7 / 2.5 Done. Only shown after submit_basket succeeded.
// Shows what was sent (lastSent from the basket) and is announced by
// the screen reader, so a blind patient also knows it worked.
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { BasketItemCard } from "../components/BasketItemCard";
import { Screen } from "../components/Screen";
import { useBasket } from "../context/BasketContext";
import { useProfile } from "../lib/useProfile";
import { useAppTheme } from "../theme";

export default function Receipt() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;
  const { lastSent } = useBasket();
  const profile = useProfile();

  // Announce once, when the screen opens.
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      `${t("receipt.title")} ${t("receipt.text")}`,
    );
  }, [t]);

  return (
    // No top bar and no Ask button, as in Figma 1.7: one clear way on.
    <Screen
      showAsk={false}
      footer={
        <AppButton
          label={t("common.backToHome")}
          onPress={() => router.dismissTo("/")}
        />
      }
    >
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
          {t("receipt.title")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("receipt.text")}
        </Text>
      </View>

      <Text
        accessibilityRole="header"
        style={[text.label, { color: colors.textMuted }]}
      >
        {t("receipt.whatYouSent")}
      </Text>
      {lastSent.map((item) => (
        <BasketItemCard key={item.id} item={item} gpName={profile?.gp_name} />
      ))}
    </Screen>
  );
}
