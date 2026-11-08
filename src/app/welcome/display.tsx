// 4.5 Make the app easy to read: language, text size and colours.
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import { AppButton } from "../../components/AppButton";
import { DisplaySettingsForm } from "../../components/DisplaySettingsForm";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import { useAppTheme } from "../../theme";

export default function MakeEasyToRead() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text } = useAppTheme().app;

  return (
    <Screen
      topBar={<TopBar variant="back" showBasket={false} />}
      footer={
        <AppButton
          label={t("common.next")}
          onPress={() => router.push("/welcome/ready")}
        />
      }
    >
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("display.title")}
      </Text>
      <Text style={[text.body, { color: colors.textMuted }]}>
        {t("display.subtitle")}
      </Text>
      <DisplaySettingsForm />
    </Screen>
  );
}
