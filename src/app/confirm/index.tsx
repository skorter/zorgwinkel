// 1.6 Confirm it is you. Shown the first time the patient sends the
// basket: they log in once with (simulated) DigiD. With Remember me
// ticked, the login stays on this phone and this screen is skipped
// next time. Remember me is passed on to the next screens as "remember".
import { useRouter } from "expo-router";
import { KeyRound } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Checkbox } from "../../components/Checkbox";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import { useAppTheme } from "../../theme";

export default function ConfirmItIsYou() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing } = useAppTheme().app;
  // Ticked by default, as in Figma: logging in every time is a hurdle.
  const [remember, setRemember] = useState(true);

  return (
    <Screen
      topBar={<TopBar variant="back" />}
      showAsk={false}
      footer={
        <>
          <AppButton
            label={t("confirm.loginDigid")}
            icon={KeyRound}
            onPress={() =>
              router.push({
                pathname: "/confirm/digid",
                params: { remember: remember ? "1" : "0" },
              })
            }
          />
          {/* Without DigiD, the practice can help by phone. */}
          <AppButton
            label={t("confirm.noDigid")}
            variant="outline"
            onPress={() => router.push("/help")}
          />
        </>
      }
    >
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("confirm.title")}
      </Text>
      <View style={{ gap: spacing.sm }}>
        <Text style={[text.body, { color: colors.text }]}>
          {t("confirm.text")}
        </Text>
        <Text style={[text.body, { color: colors.textMuted }]}>
          {t("confirm.privacy")}
        </Text>
      </View>
      <Checkbox
        label={t("confirm.rememberMe")}
        checked={remember}
        onChange={setRemember}
      />
    </Screen>
  );
}
