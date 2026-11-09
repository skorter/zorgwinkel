// 1.6b DigiD (simulated). The patient types a 5-digit PIN on a big
// keypad; any 5 digits work. The PIN is never saved or sent: once 5
// digits are in, the app logs in the test patient (signIn in lib/api.ts).
// This is a stand-in for the real DigiD, and the screen says so.
import { useLocalSearchParams, useRouter } from "expo-router";
import { Delete, KeyRound } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { AppButton } from "../../components/AppButton";
import { Screen } from "../../components/Screen";
import { TopBar } from "../../components/TopBar";
import { signIn } from "../../lib/api";
import { useAppTheme } from "../../theme";

const PIN_LENGTH = 5;
// The keypad as on Figma 1.6b; "" is the empty spot left of 0.
const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

export default function DigiD() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;
  const { remember, next } = useLocalSearchParams<{
    remember?: string;
    next?: string;
  }>();

  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function logIn() {
    setBusy(true);
    setFailed(false);
    try {
      await signIn();
      // replace: Back on the next screen should not return to the PIN.
      router.replace({
        pathname: "/confirm/welcome",
        params: { remember: remember ?? "1", next: next ?? "send" },
      });
    } catch {
      setFailed(true);
      setPin("");
      AccessibilityInfo.announceForAccessibility(t("digid.error"));
    } finally {
      setBusy(false);
    }
  }

  function press(key: string) {
    if (busy) return;
    if (key === "delete") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + key;
    setPin(next);
    if (next.length === PIN_LENGTH) logIn(); // log in as soon as it is complete
  }

  return (
    <Screen
      topBar={<TopBar variant="back" showBasket={false} />}
      showAsk={false}
      footer={
        <AppButton
          label={t("confirm.noDigid")}
          variant="outline"
          onPress={() => router.push("/help")}
        />
      }
    >
      {/* Our own simple mark, not the real DigiD logo: this is a simulation. */}
      <View style={{ alignItems: "center", gap: spacing.sm }}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{
            width: 56,
            height: 56,
            borderRadius: radius.md,
            backgroundColor: colors.iconBox,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <KeyRound size={30} color={colors.primary} strokeWidth={2} />
        </View>
        <Text
          accessibilityRole="header"
          style={[text.title, { color: colors.text }]}
        >
          {t("digid.title")}
        </Text>
        <Text style={[text.body, { color: colors.text, textAlign: "center" }]}>
          {t("digid.enterPin")}
        </Text>
        <Text
          style={[text.body, { color: colors.textMuted, textAlign: "center" }]}
        >
          {t("digid.simulation")}
        </Text>
      </View>

      {/* Five boxes, a dot in each filled one. Read out as "2 of 5 digits
          entered", never the digits themselves. */}
      <View
        accessible
        accessibilityLabel={t("digid.pinProgress", { count: pin.length })}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.sm,
        }}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 44,
              height: 52,
              borderRadius: radius.sm,
              borderWidth: i === pin.length ? 2 : 1,
              borderColor:
                i === pin.length ? colors.primary : colors.borderStrong,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {i < pin.length && (
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: colors.text,
                }}
              />
            )}
          </View>
        ))}
      </View>

      {busy && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: spacing.sm,
          }}
        >
          <ActivityIndicator color={colors.primary} />
          <Text style={[text.body, { color: colors.text }]}>
            {t("digid.loggingIn")}
          </Text>
        </View>
      )}
      {failed && (
        <Text
          accessibilityLiveRegion="polite"
          style={[
            text.bodyStrong,
            { color: colors.danger, textAlign: "center" },
          ]}
        >
          {t("digid.error")}
        </Text>
      )}

      {/* The keypad: 3 keys per row, big enough for older hands.
          direction ltr: the numbers stay in phone order, also in Arabic. */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.sm,
          direction: "ltr",
        }}
      >
        {keys.map((key, i) =>
          key === "" ? (
            <View key={i} style={{ flexBasis: "30%", flexGrow: 1 }} />
          ) : (
            <Pressable
              key={i}
              onPress={() => press(key)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={
                key === "delete" ? t("digid.deleteA11y") : key
              }
              style={({ pressed }) => ({
                flexBasis: "30%",
                flexGrow: 1,
                minHeight: minTouch + 12,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: spacing.xs,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.borderStrong,
                backgroundColor: pressed ? colors.selected : colors.surface,
              })}
            >
              {key === "delete" ? (
                <>
                  <Delete
                    size={text.bodyStrong.fontSize}
                    color={colors.text}
                    strokeWidth={2}
                  />
                  <Text style={[text.bodyStrong, { color: colors.text }]}>
                    {t("digid.delete")}
                  </Text>
                </>
              ) : (
                <Text style={[text.heading, { color: colors.text }]}>
                  {key}
                </Text>
              )}
            </Pressable>
          ),
        )}
      </View>
    </Screen>
  );
}
