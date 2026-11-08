// 1.3 When would you like to come? Step 3 of booking an appointment.
// The patient picks a day and morning or afternoon, then Add to basket.
// This is the only step that puts something in the basket: the
// provider, reason and note from 1.1 and 1.2 come in as route parameters.
// The patient asks for a day and part of the day, not a fixed time:
// the practice picks the exact time when it confirms (technical design).
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { OptionButton } from "../../components/OptionButton";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import {
  type AppointmentRequest,
  type PartOfDay,
  type Provider,
  type Reason,
  useBasket,
} from "../../context/BasketContext";
import { useAppTheme } from "../../theme";

// How many working days the patient can choose from.
const DAYS_TO_SHOW = 5;

// "2026-11-09", in the phone's own time zone. (toISOString() uses UTC,
// which can give yesterday's date shortly after midnight.)
function toDateString(d: Date) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// The next working days, starting tomorrow: submit_basket only accepts
// dates after today, and a GP practice is closed at the weekend.
function nextWorkingDays(count: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    const weekday = d.getDay(); // 0 = Sunday, 6 = Saturday
    if (weekday !== 0 && weekday !== 6) days.push(new Date(d));
  }
  return days;
}

export default function WhenWouldYouLikeToCome() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;
  const { items, add, change } = useBasket();

  const params = useLocalSearchParams<{
    provider: string;
    reason: string;
    note?: string;
    editId?: string;
  }>();

  // When changing an appointment from the basket: start with its answers.
  const editing = items.find((i) => i.id === params.editId);
  const before = editing?.kind === "appointment" ? editing.appointment : null;

  const days = nextWorkingDays(DAYS_TO_SHOW);
  const [date, setDate] = useState<string | null>(
    // Only keep the old day if it can still be chosen.
    days.some((d) => toDateString(d) === before?.preferredDate)
      ? before!.preferredDate
      : null,
  );
  const [partOfDay, setPartOfDay] = useState<PartOfDay | null>(
    before?.partOfDay ?? null,
  );

  // English in the British order (Tuesday 17 June), as on Home.
  const locale = i18n.language === "en" ? "en-GB" : i18n.language;
  const dayLabel = (d: Date) =>
    d.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  function addToBasket() {
    if (!date || !partOfDay) return;

    const appointment: AppointmentRequest = {
      provider: params.provider as Provider,
      reason: params.reason as Reason,
      note: params.note || undefined, // empty note: leave it out
      preferredDate: date,
      partOfDay,
    };

    if (editing) {
      // Changed from the basket: update the item and go back to the basket.
      change(editing.id, { kind: "appointment", appointment });
      router.dismissTo("/basket");
    } else {
      add({ kind: "appointment", appointment });
      // Close the three steps, so Back on the next screen does not
      // lead into the finished flow again, then show 1.4.
      router.dismissAll();
      router.push("/added");
    }
  }

  return (
    <Screen topBar={<TopBar variant="back" />}>
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("appointment.whenTitle")}
      </Text>

      {/* The day */}
      <Text
        accessibilityRole="header"
        style={[text.label, { color: colors.textMuted }]}
      >
        {t("appointment.chooseDay")}
      </Text>
      <View accessibilityRole="radiogroup" style={{ gap: spacing.sm }}>
        {days.map((d) => {
          const value = toDateString(d);
          return (
            <OptionButton
              key={value}
              label={dayLabel(d)}
              selected={date === value}
              onPress={() => setDate(value)}
            />
          );
        })}
      </View>

      {/* Morning or afternoon, side by side as in Figma.
          flexWrap: with extra large text they go under each other. */}
      <Text
        accessibilityRole="header"
        style={[text.label, { color: colors.textMuted }]}
      >
        {t("appointment.chooseTime")}
      </Text>
      <View
        accessibilityRole="radiogroup"
        style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
      >
        {(["morning", "afternoon"] as PartOfDay[]).map((p) => (
          <View key={p} style={{ flexGrow: 1, flexBasis: 140 }}>
            <OptionButton
              label={t(`appointment.${p}`)}
              selected={partOfDay === p}
              onPress={() => setPartOfDay(p)}
            />
          </View>
        ))}
      </View>

      {/* Only works once both a day and a part of the day are chosen. */}
      <AppButton
        label={t("appointment.addToBasket")}
        onPress={addToBasket}
        disabled={!date || !partOfDay}
        accessibilityHint={
          date && partOfDay ? undefined : t("appointment.chooseFirst")
        }
      />
    </Screen>
  );
}
