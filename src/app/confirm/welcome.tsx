// 1.6c Welcome, Mrs Jansen. Shown right after logging in, so the
// patient sees that the app now knows who they are.
// "Continue and send request" sends the basket (useSendBasket). If that
// fails, the patient stays here with the basket intact and can try again.
import { useLocalSearchParams, useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Screen } from "../../components/Screen";
import { SendError } from "../../components/SendError";
import { TopBar } from "../../components/TopBar";
import { useProfile } from "../../lib/useProfile";
import { useSendBasket } from "../../lib/useSendBasket";
import { useAppTheme } from "../../theme";

export default function WelcomeAfterLogin() {
  const { t } = useTranslation();
  const { colors, text, spacing } = useAppTheme().app;
  const profile = useProfile();
  const { send, sending, failed } = useSendBasket();
  // "0" when Remember me was not ticked on 1.6: then the patient is
  // logged out again right after sending.
  const router = useRouter();
  const { remember, next } = useLocalSearchParams<{
    remember?: string;
    next?: string;
  }>();
  // From Your medicines: only log in, there is nothing to send yet.
  const onlyLogin = next === "medicines";

  function goToMedicines() {
    router.dismissAll(); // close the login screens, so Back goes home
    router.push("/medicines");
  }

  return (
    <Screen topBar={<TopBar variant="back" showBasket={false} />}>
      <View style={{ alignItems: "center", gap: spacing.md }}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={40} color={colors.onPrimary} strokeWidth={3} />
        </View>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text, textAlign: "center" }]}
        >
          {profile
            ? t("welcomeBack.title", { name: profile.full_name })
            : t("welcomeBack.titleNoName")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("welcomeBack.text")}
        </Text>
      </View>

      {onlyLogin ? (
        <AppButton
          label={t("welcomeBack.continueOnly")}
          onPress={goToMedicines}
        />
      ) : (
        <>
          {failed && <SendError />}
          <AppButton
            label={
              sending
                ? t("send.sending")
                : failed
                  ? t("send.tryAgain")
                  : t("welcomeBack.continue")
            }
            onPress={() => send(remember !== "0")}
            disabled={sending}
          />
        </>
      )}
    </Screen>
  );
}
