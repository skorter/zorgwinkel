// TEMPORARY test screen (Phase 2 and 3). Replaced by the real Home later.
// Tests the Supabase connection, the display settings and the languages.
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useDisplay, type Language } from "../context/DisplayContext";
import { supabase } from "../lib/supabase";
import { useAppTheme, type ColourMode, type TextSize } from "../theme";

export default function Index() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { text, colors, spacing } = theme.app;
  const { colourMode, textSize, language, update } = useDisplay();
  const [lines, setLines] = useState<string[]>([]);

  async function testConnection() {
    const result: string[] = [];
    await supabase.auth.signOut();
    const blocked = await supabase.from("medicines").select("name");
    result.push(
      blocked.error || blocked.data?.length === 0
        ? "Without login: blocked (good)"
        : "Without login: data visible (security problem!)",
    );
    const login = await supabase.auth.signInWithPassword({
      email: process.env.EXPO_PUBLIC_TEST_EMAIL ?? "",
      password: process.env.EXPO_PUBLIC_TEST_PASSWORD ?? "",
    });
    if (login.error) {
      setLines([...result, "Login failed: " + login.error.message]);
      return;
    }
    const medicines = await supabase
      .from("medicines")
      .select("name")
      .order("name");
    if (medicines.error) {
      setLines([...result, "Reading failed: " + medicines.error.message]);
      return;
    }
    setLines([...result, ...medicines.data.map((m) => m.name)]);
  }

  const modes: ColourMode[] = ["light", "dark", "highContrast"];
  const sizes: TextSize[] = ["normal", "large", "extraLarge"];
  const languageNames: Record<Language, string> = {
    en: "English",
    nl: "Nederlands",
    tr: "Türkçe",
    ar: "العربية",
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: spacing.lg,
        paddingTop: 64,
        gap: spacing.md,
      }}
    >
      <Text style={[text.title, { color: colors.text }]}>
        {t("home.goodMorning")}
      </Text>
      <Text style={[text.heading, { color: colors.text }]}>
        {t("home.whatDoYouNeed")}
      </Text>
      <Text style={[text.body, { color: colors.textMuted }]}>
        {t("display.preview")}
      </Text>

      <Text style={[text.label, { color: colors.textMuted }]}>
        {t("display.language")}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {(Object.keys(languageNames) as Language[]).map((code) => (
          <Button
            key={code}
            mode={code === language ? "contained" : "outlined"}
            onPress={() => update({ language: code })}
          >
            {languageNames[code]}
          </Button>
        ))}
      </View>

      <Text style={[text.label, { color: colors.textMuted }]}>
        {t("display.colours")}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {modes.map((mode) => (
          <Button
            key={mode}
            mode={mode === colourMode ? "contained" : "outlined"}
            onPress={() => update({ colourMode: mode })}
          >
            {t(`display.${mode}`)}
          </Button>
        ))}
      </View>

      <Text style={[text.label, { color: colors.textMuted }]}>
        {t("display.textSize")}
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
        {sizes.map((size) => (
          <Button
            key={size}
            mode={size === textSize ? "contained" : "outlined"}
            onPress={() => update({ textSize: size })}
          >
            {t(`display.${size}`)}
          </Button>
        ))}
      </View>

      <Button mode="contained" onPress={testConnection}>
        Test connection
      </Button>
      {lines.map((line, i) => (
        <Text key={i} style={[text.body, { color: colors.text }]}>
          {line}
        </Text>
      ))}
    </ScrollView>
  );
}
