// One item from the basket as a card: an appointment or a medicine.
// Used on Added to your basket (1.4, 2.2), and later on Your basket
// (1.5, 2.3) and the receipt (1.7, 2.5), so an item looks the same
// everywhere. Extra content, like Change and Remove, goes in children.
//
// Appointment: "Appointment with Dr Sarah de Vries"
//              "Pain or discomfort · Tuesday 10 November, morning"
// Medicine:    "Amlodipine 5 mg"
//              "Repeat medicine"
import { CalendarDays, Pill } from "lucide-react-native";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { BasketItem } from "../context/BasketContext";
import { formatDay, fromDateString } from "../lib/dates";
import { useAppTheme } from "../theme";

type Props = {
  item: BasketItem;
  gpName?: string | null; // "Dr Sarah de Vries", once known
  children?: ReactNode;
};

export function BasketItemCard({ item, gpName, children }: Props) {
  const { t, i18n } = useTranslation();
  const { colors, text, spacing, radius } = useAppTheme().app;

  let title: string;
  let detail: string;
  if (item.kind === "appointment") {
    const a = item.appointment;
    const who =
      a.provider === "nurse"
        ? t("basketItem.nurse")
        : (gpName ?? t("basketItem.yourGp"));
    title = t("basketItem.appointmentWith", { name: who });
    const day = formatDay(fromDateString(a.preferredDate), i18n.language);
    const part = t(`appointment.${a.partOfDay}`).toLocaleLowerCase(
      i18n.language,
    );
    detail = `${t(`appointment.reasons.${a.reason}`)} · ${day}, ${part}`;
  } else {
    title = `${item.medicine.name} ${item.medicine.strength}`;
    detail = t("basketItem.repeatMedicine");
  }
  const Icon = item.kind === "appointment" ? CalendarDays : Pill;

  return (
    <View
      style={{
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
        accessibilityLabel={`${title}. ${detail}`}
        style={{ flexDirection: "row", gap: spacing.sm + 4 }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.sm,
            backgroundColor: colors.iconBox,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[text.bodyStrong, { color: colors.text }]}>{title}</Text>
          <Text style={[text.body, { color: colors.textMuted }]}>{detail}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}
