// 1.4 / 2.2 Added to your basket. Shown after Add to basket (1.3) and,
// in US02, after Reorder on a medicine. It shows the item just added
// (its id comes in as a route parameter) and reminds the patient that
// nothing has been sent yet.
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { BasketItemCard } from "../components/BasketItemCard";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { useBasket } from "../context/BasketContext";
import { useProfile } from "../lib/useProfile";
import { useAppTheme } from "../theme";

export default function AddedToBasket() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;
  const { items } = useBasket();
  const profile = useProfile();

  const { id } = useLocalSearchParams<{ id?: string }>();
  const item = items.find((i) => i.id === id);

  return (
    <Screen topBar={<TopBar variant="back" />}>
      {/* The big green check from Figma */}
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
          {t("added.title")}
        </Text>
      </View>

      {item && <BasketItemCard item={item} gpName={profile?.gp_name} />}

      <Text
        style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
      >
        {t("added.notSentYet")}
      </Text>

      <AppButton
        label={t("added.goToBasket")}
        onPress={() => router.push("/basket")}
      />
      <AppButton
        label={t("common.backToHome")}
        onPress={() => router.dismissTo("/")}
        variant="outline"
      />
    </Screen>
  );
}
