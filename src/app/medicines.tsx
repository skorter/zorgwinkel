// 2.1 Your medicines: the patient's own repeat list from Supabase.
// Reorder puts the medicine in the basket and opens Added to your
// basket (2.2); nothing is sent yet.
// Only a logged-in patient can see their medicines (row level
// security), so the first time this screen sends the patient to
// Confirm it is you, with next=medicines so they come back here.
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { useBasket } from "../context/BasketContext";
import { getMyMedicines, type Medicine } from "../lib/api";
import { useAppTheme } from "../theme";

export default function YourMedicines() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius } = useAppTheme().app;
  const { add } = useBasket();

  const [medicines, setMedicines] = useState<Medicine[] | null>(null); // null = loading
  const [failed, setFailed] = useState(false);

  // Load every time the screen comes into view, so a status is fresh
  // after sending the basket and coming back.
  const load = useCallback(() => {
    let active = true; // ignore the answer if the screen already closed
    setFailed(false);
    getMyMedicines()
      .then((list) => {
        if (!active) return;
        if (list === null) {
          // Not logged in: log in first. replace, so Back on the
          // login screen goes home, not back to an empty list.
          router.replace({
            pathname: "/confirm",
            params: { next: "medicines" },
          });
          return;
        }
        setMedicines(list);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [router]);

  useFocusEffect(load);

  function reorder(m: Medicine) {
    const id = add({
      kind: "medicine",
      medicine: { medicineId: m.id, name: m.name, strength: m.strength },
    });
    router.push({ pathname: "/added", params: { id } });
  }

  return (
    <Screen topBar={<TopBar variant="back" />}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text }]}
        >
          {t("medicines.title")}
        </Text>
        <Text style={[text.body, { color: colors.textMuted }]}>
          {t("medicines.subtitle")}
        </Text>
      </View>

      {failed ? (
        <>
          <Text style={[text.bodyStrong, { color: colors.danger }]}>
            {t("medicines.loadError")}
          </Text>
          <AppButton label={t("send.tryAgain")} onPress={load} />
        </>
      ) : medicines === null ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        medicines.map((m) => (
          <View
            key={m.id}
            style={{
              flexDirection: "row",
              flexWrap: "wrap", // with extra large text, Reorder moves below
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.md,
              padding: spacing.md,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            {/* Read as one sentence by a screen reader. */}
            <View
              accessible
              accessibilityLabel={`${m.name} ${m.strength}. ${m.how_often}`}
              style={{ flexGrow: 1, flexShrink: 1, minWidth: 160, gap: 2 }}
            >
              <Text style={[text.heading, { color: colors.text }]}>
                {m.name}
              </Text>
              <Text style={[text.body, { color: colors.text }]}>
                {m.strength}
              </Text>
              <Text style={[text.body, { color: colors.textMuted }]}>
                {m.how_often}
              </Text>
            </View>
            <AppButton
              label={t("medicines.reorder")}
              accessibilityLabel={t("medicines.reorderA11y", {
                name: `${m.name} ${m.strength}`,
              })}
              onPress={() => reorder(m)}
            />
          </View>
        ))
      )}
    </Screen>
  );
}
