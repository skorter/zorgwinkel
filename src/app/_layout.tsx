// The root of the app: loads the font and the saved display settings,
// then wraps every screen in the theme.
// On first start only the welcome flow is open; once the patient taps
// "Go to the home screen" (setupDone), only the app itself is open.
// The basket wraps everything, so every screen and the Basket button
// in the top bar see the same items.
import {
  PublicSans_400Regular,
  PublicSans_600SemiBold,
  PublicSans_700Bold,
  useFonts,
} from "@expo-google-fonts/public-sans";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { BasketProvider } from "../context/BasketContext";
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
      <BasketProvider>
        <ThemedApp />
      </BasketProvider>
    </DisplayProvider>
  );
}

function ThemedApp() {
  const { loaded, colourMode, textSize, setupDone, language } = useDisplay();
  if (!loaded) return null;

  const theme = makeTheme(colourMode, textSize, language);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      {/* No default header: every screen has its own top bar from Figma. */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.app.colors.background },
        }}
      >
        {/* First start: Welcome, Choose your language, Make the app easy to read, You're ready. */}
        <Stack.Protected guard={!setupDone}>
          <Stack.Screen name="welcome" />
        </Stack.Protected>
        {/* After the setup: Home. More screens are added here in later steps. */}
        <Stack.Protected guard={setupDone}>
          <Stack.Screen name="index" />
        </Stack.Protected>
      </Stack>
    </PaperProvider>
  );
}
