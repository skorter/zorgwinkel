// The root of the app: loads the font and the saved display settings,
// then wraps every screen in the theme.
// The basket and language providers are added here in later steps.
import {
  PublicSans_400Regular,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
  useFonts,
} from "@expo-google-fonts/public-sans";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { DisplayProvider, useDisplay } from "../context/DisplayContext";
import { makeTheme } from "../theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PublicSans_400Regular,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });

  // Show nothing for the split second the font takes to load.
  if (!fontsLoaded) return null;

  return (
    <DisplayProvider>
      <ThemedApp />
    </DisplayProvider>
  );
}

function ThemedApp() {
  const { loaded, colourMode, textSize } = useDisplay();
  if (!loaded) return null;

  const theme = makeTheme(colourMode, textSize);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      {/* No default header*/}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.app.colors.background },
        }}
      />
    </PaperProvider>
  );
}
