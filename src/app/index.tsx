// TEMPORARY test screen (Phase 3). Shows the shared components so they
// can be checked in every colour mode and text size.
// Replaced by the real Home in a later step.
import {
  CalendarDays,
  MessageSquareText,
  Pill,
  User,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { BigTile } from "../components/BigTile";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { useDisplay, type Language } from "../context/DisplayContext";
import { useAppTheme, type ColourMode, type TextSize } from "../theme";

export default function Index() {
  const { t } = useTranslation();
  const { colors, text, spacing } = useAppTheme().app;
  const { colourMode, textSize, language, update } = useDisplay();

  const nothing = () => {};
  const languages: Language[] = ["en", "nl"];
  const modes: ColourMode[] = ["light", "dark", "highContrast"];
  const sizes: TextSize[] = ["normal", "large", "extraLarge"];

  return (
    <Screen topBar={<TopBar variant="home" basketCount={1} />}>
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("home.goodMorning")}
      </Text>
      <Text
        accessibilityRole="header"
        style={[text.heading, { color: colors.text }]}
      >
        {t("home.whatDoYouNeed")}
      </Text>

      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <BigTile
          label={t("home.appointments")}
          icon={CalendarDays}
          color={colors.tileAppointments}
          onPress={nothing}
        />
        <BigTile
          label={t("home.medicines")}
          icon={Pill}
          color={colors.tileMedicines}
          onPress={nothing}
        />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <BigTile
          label={t("home.messages")}
          icon={MessageSquareText}
          color={colors.tileMessages}
          onPress={nothing}
        />
        <BigTile
          label={t("home.askSomeone")}
          icon={User}
          color={colors.tileAsk}
          onPress={nothing}
        />
      </View>

      <AppButton label={t("common.next")} onPress={nothing} />
      <AppButton label={t("common.back")} onPress={nothing} variant="outline" />

      {/* Test switches, removed with this screen. */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {languages.map((code) => (
          <AppButton
            key={code}
            label={code}
            variant={code === language ? "primary" : "outline"}
            onPress={() => update({ language: code })}
          />
        ))}
        {modes.map((mode) => (
          <AppButton
            key={mode}
            label={t(`display.${mode}`)}
            variant={mode === colourMode ? "primary" : "outline"}
            onPress={() => update({ colourMode: mode })}
          />
        ))}
        {sizes.map((size) => (
          <AppButton
            key={size}
            label={t(`display.${size}`)}
            variant={size === textSize ? "primary" : "outline"}
            onPress={() => update({ textSize: size })}
          />
        ))}
      </View>
    </Screen>
  );
}
