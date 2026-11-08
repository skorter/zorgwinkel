// A tick box with its text, the whole row tappable (1.6 Remember me).
// Screen readers hear "checkbox, checked" and the full text.
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme";

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Checkbox({ label, checked, onChange }: Props) {
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      style={({ pressed }) => ({
        minHeight: minTouch,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm + 4,
        padding: spacing.md,
        borderRadius: radius.md,
        borderWidth: checked ? 2 : 1,
        borderColor: checked ? colors.primary : colors.borderStrong,
        backgroundColor: checked ? colors.selected : colors.surface,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: colors.primary,
          backgroundColor: checked ? colors.primary : colors.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <Check size={18} color={colors.onPrimary} strokeWidth={3} />
        )}
      </View>
      <Text style={[text.bodyStrong, { color: colors.text, flex: 1 }]}>
        {label}
      </Text>
    </Pressable>
  );
}
