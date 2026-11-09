// The two button styles from Figma: a filled green button ("Next",
// "Send request") and an outline button ("Back to home").
// At least 48 points high, 12 px corners, and a clear name for screen readers.
import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme";

type Props = {
  label: string;
  accessibilityLabel?: string; // when the label alone is not clear, e.g. "Reorder Simvastatin 20 mg"
  onPress: () => void;
  variant?: "primary" | "outline";
  size?: "normal" | "large"; // large = 20 pt text, for "Ask a real person"
  icon?: LucideIcon;
  accessibilityHint?: string; // what happens after pressing, if not obvious
  disabled?: boolean;
};

export function AppButton({
  label,
  accessibilityLabel,
  onPress,
  variant = "primary",
  size = "normal",
  icon: Icon,
  accessibilityHint,
  disabled = false,
}: Props) {
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;
  const filled = variant === "primary";
  const textColor = filled ? colors.onPrimary : colors.primary;
  const textStyle = size === "large" ? text.heading : text.bodyStrong;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        minHeight: minTouch,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.sm,
        paddingVertical: spacing.sm + 4,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: filled ? colors.primary : colors.surface,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
      })}
    >
      {Icon && (
        // The icon is decoration: the label already says what it does.
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Icon size={textStyle.fontSize} color={textColor} strokeWidth={2} />
        </View>
      )}
      <Text
        style={[
          textStyle,
          { color: textColor, textAlign: "center", flexShrink: 1 },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
