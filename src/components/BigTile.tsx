// The big coloured tiles on Home: Appointments, Medicines, ...
// One tap opens the flow.
// "square": icon on top, label below (two tiles side by side, as in Figma)
// "row":    icon left, label right (one tile per row, for large text)
import type { LucideIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme";

type Props = {
  label: string;
  icon: LucideIcon;
  color: string; // the tile colour from the theme, e.g. colors.tileAppointments
  onPress: () => void;
  layout?: "square" | "row";
  onWordBreak?: () => void; // called when the label had to break a word in two
};

export function BigTile({
  label,
  icon: Icon,
  color,
  onPress,
  layout = "square",
  onWordBreak,
}: Props) {
  const { colors, text, spacing, radius } = useAppTheme().app;
  const square = layout === "square";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flex: square ? 1 : undefined,
        minHeight: square ? 136 : 88,
        flexDirection: square ? "column" : "row",
        alignItems: square ? "flex-start" : "center",
        justifyContent: square ? "space-between" : "flex-start",
        gap: spacing.md,
        padding: square ? spacing.sm + 4 : spacing.md,
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
      <Text
        style={[text.heading, { color: colors.text, flexShrink: 1 }]}
        onTextLayout={(e) => {
          // A line that does not end in a space ends in the middle of a word.
          const lines = e.nativeEvent.lines;
          for (let i = 0; i < lines.length - 1; i++) {
            if (!/\s$/.test(lines[i].text)) onWordBreak?.();
          }
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
