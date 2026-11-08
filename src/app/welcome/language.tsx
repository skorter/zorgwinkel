// 4.1x Choose your language. Tapping a language switches the app at
// once and goes back to Welcome, now in that language.
import { useRouter } from "expo-router";
import { Globe } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { OptionButton } from "../../components/OptionButton";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import {
  languageNames,
  languages,
  useDisplay,
} from "../../context/DisplayContext";
import { useAppTheme } from "../../theme";

export default function ChooseLanguage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language, update } = useDisplay();
  const { colors, text, spacing, radius } = useAppTheme().app;

  return (
    <Screen topBar={<TopBar variant="back" showBasket={false} />}>
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}
      >
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.sm,
            backgroundColor: colors.iconBox,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Globe size={22} color={colors.primary} strokeWidth={2} />
        </View>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text, flex: 1 }]}
        >
          {t("language.title")}
        </Text>
      </View>

      <View accessibilityRole="radiogroup" style={{ gap: spacing.sm }}>
        {languages.map((code) => (
          <OptionButton
            key={code}
            label={languageNames[code]}
            selected={language === code}
            onPress={() => {
              update({ language: code });
              router.back();
            }}
          />
        ))}
      </View>
    </Screen>
  );
}
