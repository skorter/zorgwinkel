// The choices of "Make the app easy to read": language, text size and
// colours. Used twice: in the welcome flow (4.5) and in Language and
// display (3.5). Every choice takes effect at once and is saved.
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import {
  languageNames,
  languages,
  useDisplay,
} from "../context/DisplayContext";
import { useAppTheme, type ColourMode, type TextSize } from "../theme";
import { ColourOption } from "./ColourOption";
import { OptionButton } from "./OptionButton";

const sizes: TextSize[] = ["normal", "large", "extraLarge"];
const modes: ColourMode[] = ["light", "dark", "highContrast"];

export function DisplaySettingsForm() {
  const { t } = useTranslation();
  const { colors, text, spacing, radius, size } = useAppTheme().app;
  const { language, textSize, colourMode, update } = useDisplay();

  // Side by side only at normal text size; one per line when larger,
  // so no word is ever cut in two.
  const sideBySide = size === "normal";

  const label = (key: string) => (
    <Text
      accessibilityRole="header"
      style={[text.label, { color: colors.textMuted, marginTop: spacing.sm }]}
    >
      {t(key)}
    </Text>
  );

  return (
    <View style={{ gap: spacing.sm }}>
      {label("display.language")}
      <View
        accessibilityRole="radiogroup"
        style={{
          flexDirection: sideBySide ? "row" : "column",
          flexWrap: "wrap",
          gap: spacing.sm,
        }}
      >
        {languages.map((code) => (
          <View
            key={code}
            style={{ width: sideBySide ? "48%" : "100%", flexGrow: 1 }}
          >
            <OptionButton
              label={languageNames[code]}
              selected={language === code}
              onPress={() => update({ language: code })}
            />
          </View>
        ))}
      </View>

      {label("display.textSize")}
      <View accessibilityRole="radiogroup" style={{ gap: spacing.sm }}>
        {sizes.map((option) => (
          <OptionButton
            key={option}
            label={t(`display.${option}`)}
            selected={textSize === option}
            onPress={() => update({ textSize: option })}
          />
        ))}
      </View>
      <View
        style={{
          padding: spacing.md,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Text style={[text.body, { color: colors.text }]}>
          {t("display.preview")}
        </Text>
      </View>

      {label("display.colours")}
      <View
        accessibilityRole="radiogroup"
        style={{
          flexDirection: sideBySide ? "row" : "column",
          gap: spacing.sm,
        }}
      >
        {modes.map((mode) => (
          <ColourOption
            key={mode}
            mode={mode}
            label={t(`display.${mode}`)}
            selected={colourMode === mode}
            onPress={() => update({ colourMode: mode })}
            layout={sideBySide ? "column" : "row"}
          />
        ))}
      </View>
    </View>
  );
}
