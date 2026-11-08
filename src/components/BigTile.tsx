// The big coloured tiles on Home: Appointments, Medicines, ...
// One tap opens the flow. Two tiles sit side by side in a row.
import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme";

type Props = {
  label: string;
  icon: LucideIcon;
  color: string; // the tile colour from the theme, e.g. colors.tileAppointments
  onPress: () => void;
};

export function BigTile({ label, icon: Icon, color, onPress }: Props) {
  const { colors, text, spacing, radius } = useAppTheme().app;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 136,
        padding: spacing.md,
        gap: spacing.md,
        justifyContent: "space-between",
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: color,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon size={36} color={colors.primary} strokeWidth={1.75} />
      </View>
      <Text style={[text.heading, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}
