// 1.2 What is the appointment for? Step 2 of booking an appointment.
// The patient picks one of four reasons and can add a few words.
// The choice from 1.1 (provider) comes in as a route parameter and is
// passed on to 1.3 together with the reason and the note.
// Nothing goes in the basket yet: that happens on 1.3.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { OptionButton } from "../../components/OptionButton";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import { type Reason, useBasket } from "../../context/BasketContext";
import { useAppTheme } from "../../theme";

// The four reasons, in the order of Figma 1.2.
// The same values as the check on appointments.reason in schema.sql.
const reasons: Reason[] = ["checkup", "pain", "other", "tell_doctor"];

// The database allows 500 characters (schema.sql); a few words is enough.
const NOTE_MAX = 500;

export default function WhatIsItFor() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;
  const { items } = useBasket();

  const { provider, editId } = useLocalSearchParams<{
    provider: string;
    editId?: string;
  }>();

  // When changing an appointment from the basket: start with its answers.
  const editing = items.find((i) => i.id === editId);
  const before = editing?.kind === "appointment" ? editing.appointment : null;
  const [reason, setReason] = useState<Reason | null>(before?.reason ?? null);
  const [note, setNote] = useState(before?.note ?? "");

  function goNext() {
    if (!reason) return;
    router.push({
      pathname: "/appointment/when",
      params: {
        provider,
        reason,
        note: note.trim(), // spaces only counts as empty
        ...(editId ? { editId } : {}),
      },
    });
  }

  return (
    <Screen topBar={<TopBar variant="back" />}>
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("appointment.reasonTitle")}
      </Text>

      <View accessibilityRole="radiogroup" style={{ gap: spacing.sm }}>
        {reasons.map((r) => (
          <OptionButton
            key={r}
            label={t(`appointment.reasons.${r}`)}
            selected={reason === r}
            onPress={() => setReason(r)}
          />
        ))}
      </View>

      {/* The optional note. The visible label is also what a screen
          reader reads for the text field. */}
      <View style={{ gap: spacing.sm }}>
        <Text style={[text.bodyStrong, { color: colors.text }]}>
          {t("appointment.noteLabel")}
        </Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t("appointment.notePlaceholder")}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={t("appointment.noteLabel")}
          accessibilityHint={t("appointment.notePlaceholder")}
          maxLength={NOTE_MAX}
          multiline // the text wraps instead of scrolling sideways
          textAlignVertical="top"
          style={[
            text.body,
            {
              color: colors.text,
              minHeight: minTouch + 32,
              padding: spacing.sm + 4,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.borderStrong,
              backgroundColor: colors.surface,
            },
          ]}
        />
      </View>

      {/* Next only works once a reason is chosen; the note may stay empty. */}
      <AppButton
        label={t("common.next")}
        onPress={goNext}
        disabled={!reason}
        accessibilityHint={reason ? undefined : t("appointment.chooseFirst")}
      />
    </Screen>
  );
}
