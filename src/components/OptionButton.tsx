// A choice in a list, like "English" or "Large" (screens 4.1x, 4.5, 3.5).
// Selected: green border, light green background and a check mark.
// Screen readers hear it as a radio button: "English, selected".
import { Check } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme";

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionButton({ label, selected, onPress }: Props) {
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: minTouch + 8,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        borderRadius: radius.md,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.primary : colors.borderStrong,
        backgroundColor: selected ? colors.selected : colors.surface,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <Text style={[text.bodyStrong, { color: colors.text, flex: 1 }]}>
        {label}
      </Text>
      {selected && <CheckBadge />}
    </Pressable>
  );
}

// The round green check from the Figma screens.
export function CheckBadge() {
  const { colors } = useAppTheme().app;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check size={16} color={colors.onPrimary} strokeWidth={3} />
    </View>
  );
}
