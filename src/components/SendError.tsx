// The message when sending failed (1.5 and 1.6c). Red edge and text,
// read out by screen readers when it appears.
import { CircleAlert } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useAppTheme } from "../theme";

export function SendError() {
  const { t } = useTranslation();
  const { colors, text, spacing, radius } = useAppTheme().app;

  return (
    <View
      accessibilityLiveRegion="assertive"
      style={{
        flexDirection: "row",
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: colors.danger,
        backgroundColor: colors.surface,
      }}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <CircleAlert
          size={text.bodyStrong.fontSize + 4}
          color={colors.danger}
          strokeWidth={2}
        />
      </View>
      <Text style={[text.bodyStrong, { color: colors.danger, flex: 1 }]}>
        {t("send.error")}
      </Text>
    </View>
  );
}
