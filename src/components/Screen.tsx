// The frame of every screen: the top bar, the scrolling content, and
// "Ask a real person" fixed at the bottom so it is always in reach.
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../theme";
import { AskButton } from "./AskButton";

type Props = {
  topBar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode; // default: the Ask a real person button
  showAsk?: boolean; // false on the help screen itself
};

export function Screen({ topBar, children, footer, showAsk = true }: Props) {
  const { colors, spacing } = useAppTheme().app;

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {topBar}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          gap: spacing.md,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {(footer || showAsk) && (
        <View
          style={{
            paddingHorizontal: spacing.md,
            paddingTop: spacing.sm,
            paddingBottom: spacing.md,
            gap: spacing.sm,
          }}
        >
          {footer}
          {showAsk && <AskButton />}
        </View>
      )}
    </SafeAreaView>
  );
}
