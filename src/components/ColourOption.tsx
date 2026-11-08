// One of the three colour choices on screen 4.5: a small preview of the
// colours (as in Figma) with its name below, or beside it for large text.
import { Pressable, Text, View } from "react-native";
import { palettes, useAppTheme, type ColourMode } from "../theme";
import { CheckBadge } from "./OptionButton";

type Props = {
  mode: ColourMode;
  label: string;
  selected: boolean;
  onPress: () => void;
  layout: "column" | "row";
};

export function ColourOption({
  mode,
  label,
  selected,
  onPress,
  layout,
}: Props) {
  const { colors, text, spacing, radius } = useAppTheme().app;
  const preview = palettes[mode]; // always show the colours of that mode

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => ({
        flex: layout === "column" ? 1 : undefined,
        flexDirection: layout,
        alignItems: "center",
        gap: spacing.sm,
        padding: spacing.sm + 4,
        borderRadius: radius.md,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.primary : colors.borderStrong,
        backgroundColor: selected ? colors.selected : colors.surface,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {/* The preview: background with two lines in that mode's colours. */}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          width: 56,
          height: 56,
          borderRadius: radius.sm,
          borderWidth: 1,
          borderColor: preview.borderStrong,
          backgroundColor: preview.background,
          justifyContent: "center",
          paddingHorizontal: 10,
          gap: 6,
        }}
      >
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: preview.primary,
          }}
        />
        <View
          style={{
            height: 6,
            width: "70%",
            borderRadius: 3,
            backgroundColor: preview.text,
          }}
        />
      </View>
      <Text
        style={[
          text.bodyStrong,
          {
            color: colors.text,
            textAlign: layout === "column" ? "center" : "left",
            flex: layout === "row" ? 1 : undefined,
          },
        ]}
      >
        {label}
      </Text>
      {selected && (
        <View
          style={
            layout === "column"
              ? { position: "absolute", top: 6, right: 6 }
              : undefined
          }
        >
          <CheckBadge />
        </View>
      )}
    </Pressable>
  );
}
