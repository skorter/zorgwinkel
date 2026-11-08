// The first-time setup screens share one stack: Welcome, Choose your
// language, Make the app easy to read, You're ready.
import { Stack } from "expo-router";
import { useAppTheme } from "../../theme";

export default function WelcomeLayout() {
  const { colors } = useAppTheme().app;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
