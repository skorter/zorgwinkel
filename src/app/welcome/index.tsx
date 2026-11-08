// 4.1 Welcome: what the app does, then Get started.
import { useRouter } from "expo-router";
import {
  CalendarDays,
  Check,
  Globe,
  Pill,
  ShoppingBasket,
  Store,
  type LucideIcon,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { Screen } from "../../components/Screen";
import { languageNames, useDisplay } from "../../context/DisplayContext";
import { useAppTheme } from "../../theme";

export default function Welcome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useDisplay();
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;

  const feature = (Icon: LucideIcon, key: string) => (
    <View
      key={key}
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
        <Icon size={22} color={colors.primary} strokeWidth={2} />
      </View>
      <Text style={[text.bodyStrong, { color: colors.text, flex: 1 }]}>
        {t(key)}
      </Text>
    </View>
  );

  const topBar = (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          flexShrink: 1,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.sm,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={20} color={colors.onPrimary} strokeWidth={3} />
        </View>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          style={[text.heading, { color: colors.text, flexShrink: 1 }]}
        >
          {t("common.appName")}
        </Text>
      </View>
      <Pressable
        onPress={() => router.push("/welcome/language")}
        accessibilityRole="button"
        accessibilityLabel={`${languageNames[language]}. ${t("common.changeLanguage")}`}
        style={({ pressed }) => ({
          minHeight: minTouch,
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          borderWidth: 2,
          borderColor: colors.primary,
          backgroundColor: colors.surface,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Globe
          size={text.bodyStrong.fontSize}
          color={colors.primary}
          strokeWidth={2}
        />
        <Text style={[text.bodyStrong, { color: colors.primary }]}>
          {languageNames[language]}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Screen
      topBar={topBar}
      footer={
        <AppButton
          label={t("welcome.getStarted")}
          onPress={() => router.push("/welcome/display")}
        />
      }
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          alignSelf: "center",
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: colors.iconBox,
          marginTop: spacing.sm,
        }}
      >
        <Store size={72} color={colors.primary} strokeWidth={1.5} />
      </View>

      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text, textAlign: "center" }]}
      >
        {t("welcome.title")}
      </Text>
      <Text
        style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
      >
        {t("welcome.subtitle")}
      </Text>

      <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
        {feature(CalendarDays, "welcome.featureAppointment")}
        {feature(Pill, "welcome.featureMedicine")}
        {feature(ShoppingBasket, "welcome.featureCheck")}
      </View>

      <Text style={[text.body, { color: colors.textMuted }]}>
        {t("welcome.disclaimer")}
      </Text>
    </Screen>
  );
}
