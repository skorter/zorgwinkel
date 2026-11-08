// 1.1 Who do you want to see? Step 1 of booking an appointment.
// The patient picks their GP or the practice nurse, then Next.
// Nothing goes in the basket yet: the choice travels to the next step
// as a route parameter, and only 1.3 (Add to basket) puts the
// appointment in the basket.
// "Change" on the basket screen opens this screen with ?editId=...,
// so the earlier choice is already selected.
import { useLocalSearchParams, useRouter } from "expo-router";
import { Stethoscope, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { AppButton } from "../../components/AppButton";
import { OptionButton } from "../../components/OptionButton";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import { type Provider, useBasket } from "../../context/BasketContext";
import { getProfile } from "../../lib/api";
import { useAppTheme } from "../../theme";

export default function WhoDoYouWantToSee() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius } = useAppTheme().app;
  const { items } = useBasket();

  // When changing an appointment from the basket: start with its choice.
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const editing = items.find(
    (i) => i.id === editId && i.kind === "appointment",
  );
  const [provider, setProvider] = useState<Provider | null>(
    editing?.kind === "appointment" ? editing.appointment.provider : null,
  );

  // The GP's name, "Dr Sarah de Vries". Only known once the patient has
  // logged in with DigiD; before that the option just says "Your own doctor".
  const [gpName, setGpName] = useState<string | null>(null);
  useEffect(() => {
    getProfile()
      .then((profile) => setGpName(profile?.gp_name ?? null))
      .catch(() => {
        // No connection: the screen still works without the name.
      });
  }, []);

  function goNext() {
    if (!provider) return;
    router.push({
      pathname: "/appointment/reason",
      params: editId ? { provider, editId } : { provider },
    });
  }

  // The square behind the icon, as on the Figma options.
  function iconBox(Icon: typeof User) {
    return (
      <View
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
    );
  }

  return (
    <Screen topBar={<TopBar variant="back" />}>
      <Text
        accessibilityRole="header"
        style={[text.title, { color: colors.text }]}
      >
        {t("appointment.whoTitle")}
      </Text>

      <View accessibilityRole="radiogroup" style={{ gap: spacing.sm }}>
        <OptionButton
          label={t("appointment.gp")}
          description={gpName ?? t("appointment.gpNoName")}
          leading={iconBox(Stethoscope)}
          selected={provider === "gp"}
          onPress={() => setProvider("gp")}
        />
        <OptionButton
          label={t("appointment.nurse")}
          description={t("appointment.nurseNote")}
          leading={iconBox(User)}
          selected={provider === "nurse"}
          onPress={() => setProvider("nurse")}
        />
      </View>

      {/* Next only works once a choice is made. */}
      <AppButton
        label={t("common.next")}
        onPress={goNext}
        disabled={!provider}
        accessibilityHint={provider ? undefined : t("appointment.chooseFirst")}
      />
    </Screen>
  );
}
