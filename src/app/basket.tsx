// 1.5 / 2.3 Your basket. The patient checks everything before sending.
// Each item has Remove; appointments also have Change, which opens the
// three steps again with the earlier answers filled in (?editId=...).
// Send request is the only way anything leaves the phone.
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { BasketItemCard } from "../components/BasketItemCard";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { type BasketItem, useBasket } from "../context/BasketContext";
import { useProfile } from "../lib/useProfile";
import { useAppTheme } from "../theme";

export default function YourBasket() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, minTouch } = useAppTheme().app;
  const { items, remove } = useBasket();
  const profile = useProfile();

  function changeItem(item: BasketItem) {
    router.push({
      pathname: "/appointment/who",
      params: { editId: item.id },
    });
  }

  // Ask first: removing by accident is exactly the kind of mistake
  // older adults told us they are afraid of.
  function removeItem(item: BasketItem) {
    Alert.alert(t("basket.removeTitle"), undefined, [
      { text: t("basket.keep"), style: "cancel" },
      {
        text: t("basket.remove"),
        style: "destructive",
        onPress: () => remove(item.id),
      },
    ]);
  }

  function sendRequest() {
    // The DigiD confirmation and submit_basket come in the next steps.
    router.push("/confirm");
  }

  // A text button for Change and Remove, at least 48 points high.
  function textButton(
    label: string,
    a11yLabel: string,
    color: string,
    onPress: () => void,
  ) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        hitSlop={8}
        style={({ pressed }) => ({
          minHeight: minTouch,
          justifyContent: "center",
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <Text style={[text.bodyStrong, { color }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    // No Basket button here: the patient is already looking at the basket.
    <Screen topBar={<TopBar variant="back" showBasket={false} />}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text }]}
        >
          {t("basket.title")}
        </Text>
        <Text style={[text.body, { color: colors.textMuted }]}>
          {t("basket.subtitle")}
        </Text>
      </View>

      {items.length === 0 ? (
        <>
          <Text style={[text.bodyStrong, { color: colors.text }]}>
            {t("basket.empty")}
          </Text>
          <AppButton
            label={t("common.backToHome")}
            onPress={() => router.dismissTo("/")}
            variant="outline"
          />
        </>
      ) : (
        <>
          {items.map((item) => (
            <BasketItemCard key={item.id} item={item} gpName={profile?.gp_name}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                {/* A medicine has nothing to change: only Remove. */}
                {item.kind === "appointment" ? (
                  textButton(
                    t("basket.change"),
                    t("basket.changeA11y"),
                    colors.primary,
                    () => changeItem(item),
                  )
                ) : (
                  <View />
                )}
                {textButton(
                  t("basket.remove"),
                  t("basket.removeA11y"),
                  colors.danger,
                  () => removeItem(item),
                )}
              </View>
            </BasketItemCard>
          ))}

          <AppButton label={t("basket.send")} onPress={sendRequest} />
        </>
      )}
    </Screen>
  );
}
