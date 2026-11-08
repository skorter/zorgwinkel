// 3.3 / 1.6x Ask a real person: the safety net behind every "Ask a real
// person" button. The patient can ask to be called back, or call the
// practice themselves (opens the phone's dialler).
import { useRouter } from "expo-router";
import { Phone } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Linking, Text, View } from "react-native";
import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { practice } from "../lib/practice";
import { useAppTheme } from "../theme";

export default function AskARealPerson() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius } = useAppTheme().app;

  // Phone hardware (LO4): opens the dialler with the number filled in.
  // The patient still taps the call button themselves.
  function callPractice() {
    Linking.openURL(practice.phoneLink).catch(() => {
      // No dialler (e.g. a tablet): the number is on screen to call another way.
    });
  }

  return (
    <Screen topBar={<TopBar variant="back" basketCount={0} />} showAsk={false}>
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("help.title")}
      </Text>
      <Text style={[text.body, { color: colors.textMuted }]}>
        {t("help.subtitle")}
      </Text>

      {/* The practice's phone number and opening hours */}
      <View
        accessible
        accessibilityLabel={`${t("help.callThePractice")}: ${practice.phone}. ${t("practice.days")}, ${t("practice.hours")}`}
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
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
            width: 48,
            height: 48,
            borderRadius: radius.sm,
            backgroundColor: colors.iconBox,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Phone size={24} color={colors.primary} strokeWidth={1.75} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[text.label, { color: colors.textMuted }]}>
            {t("help.callThePractice")}
          </Text>
          <Text style={[text.heading, { color: colors.text }]}>
            {practice.phone}
          </Text>
          <Text style={[text.body, { color: colors.textMuted }]}>
            {t("practice.days")}
          </Text>
          <Text style={[text.body, { color: colors.textMuted }]}>
            {t("practice.hours")}
          </Text>
        </View>
      </View>

      {/* As in Figma: the two choices straight under the card. */}
      {/* SIMULATED: a real version would send the call-back request to the practice. */}
      <AppButton
        label={t("help.callMeBack")}
        onPress={() => router.push("/callback")}
      />
      <AppButton
        label={t("help.callThePractice")}
        onPress={callPractice}
        variant="outline"
        icon={Phone}
      />
    </Screen>
  );
}
