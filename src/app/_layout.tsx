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
        {/* First start: Welcome ... Once the setup is done, Welcome is
            closed and goes to Home. */}
        <Stack.Protected guard={!setupDone} redirectTo="/">
          <Stack.Screen name="welcome" />
        </Stack.Protected>
        {/* After the setup: Home and Settings. Before the setup is done
            (first start, or after Restart setup), they send the patient to
            Welcome. Without redirectTo, Expo Router picks the shortest
            screen name that is open, which was /help. */}
        <Stack.Protected guard={setupDone} redirectTo="/welcome">
          <Stack.Screen name="index" />
          <Stack.Screen name="settings" />
        </Stack.Protected>
      </Stack>
    </PaperProvider>
  );
}
