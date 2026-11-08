// 0.1 Home: the greeting, the "Book everything here" note, the tiles
// and the GP practice. The next appointment and the patient's name
// (0.2) are added in Phase 4.
import { useRouter } from "expo-router";
import {
  Building2,
  CalendarDays,
  Check,
  Globe,
  MessageSquareText,
  Pill,
  User,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { TileGrid } from "../components/TileGrid";
import { TopBar } from "../components/TopBar";
import { practice } from "../lib/practice";
import { useAppTheme } from "../theme";

// Good morning until 12:00, good afternoon until 18:00, then good evening.
function greetingKey(hour: number) {
  if (hour < 12) return "home.goodMorning";
  if (hour < 18) return "home.goodAfternoon";
  return "home.goodEvening";
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius, mode } = useAppTheme().app;

  const now = new Date();
  // English uses the British order (day before month), as in the Figma design.
  const locale = i18n.language === "en" ? "en-GB" : i18n.language;
  const today = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Screen topBar={<TopBar variant="home" />}>
      {/* Language and display, and today's date */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.sm,
        }}
      >
        <AppButton
          label={t("common.languageAndDisplay")}
          onPress={() => router.push("/settings")}
          variant="outline"
          icon={Globe}
        />
        <Text style={[text.body, { color: colors.textMuted }]}>{today}</Text>
      </View>

      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t(greetingKey(now.getHours()))}
      </Text>
      <Text
        accessibilityRole="header"
        style={[text.heading, { color: colors.text }]}
      >
        {t("home.whatDoYouNeed")}
      </Text>

      {/* "Book everything here. No phone call needed." */}
      <View
        accessible
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          padding: spacing.md,
          borderRadius: radius.md,
          backgroundColor: colors.note,
          borderWidth: 1,
          borderColor: mode === "highContrast" ? colors.noteText : colors.note,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.noteIcon,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={18} color={colors.noteText} strokeWidth={3} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[text.bodyStrong, { color: colors.noteText }]}>
            {t("home.noteTitle")}
          </Text>
          <Text style={[text.body, { color: colors.noteText }]}>
            {t("home.noteText")}
          </Text>
        </View>
      </View>

      <TileGrid
        tiles={[
          {
            key: "appointments",
            label: t("home.appointments"),
            icon: CalendarDays,
            color: colors.tileAppointments,
            onPress: () => router.push("/appointment/who"),
          },
          {
            key: "medicines",
            label: t("home.medicines"),
            icon: Pill,
            color: colors.tileMedicines,
            onPress: () => router.push("/medicines"),
          },
          {
            key: "messages",
            label: t("home.messages"),
            icon: MessageSquareText,
            color: colors.tileMessages,
            onPress: () => router.push("/messages"),
          },
          {
            key: "ask",
            label: t("home.askSomeone"),
            icon: User,
            color: colors.tileAsk,
            onPress: () => router.push("/help"),
          },
        ]}
      />

      {/* The GP practice */}
      <View
        accessible
        accessibilityLabel={`${practice.name}, ${practice.street}, ${practice.postcodeCity}. ${t("practice.openingHours")}`}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.md,
          padding: spacing.md,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.sm,
            backgroundColor: colors.iconBox,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 size={28} color={colors.primary} strokeWidth={1.75} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[text.bodyStrong, { color: colors.text }]}>
            {practice.name}
          </Text>
          <Text style={[text.body, { color: colors.textMuted }]}>
            {practice.street}, {practice.postcodeCity}
          </Text>
          <Text style={[text.body, { color: colors.textMuted }]}>
            {t("practice.openingHours")}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
