// "Your medicine is ready": the phone hardware part of US02
// (technical design, Key flows). A LOCAL notification: the app itself
// shows it on this phone, nothing is sent through a server.
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import i18n from "./i18n";

// By default a notification is hidden while the app is open. Zorgwinkel
// shows it anyway: the patient may be on another screen, such as Home.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Ask once whether Zorgwinkel may show notifications. Asks only when
// Android still allows it; after "Don't allow", the phone decides.
// Never throws: without permission the app still works, the patient
// just sees the status on Your medicines instead.
export async function askPermission(): Promise<boolean> {
  try {
    // Android 8+ needs a channel; Android 13+ only shows the question
    // once a channel exists. HIGH = shown at the top of the screen.
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Zorgwinkel",
          importance: Notifications.AndroidImportance.HIGH,
        });
      } catch {
        // Fails inside Expo Go on some phones (a NullPointerException in
        // Android's code). Expo Go has a channel of its own, so carry on.
      }
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;

    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

// Show it right away, in the patient's language.
// name is for example "Simvastatin 20 mg".
export async function showReady(name: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t("notification.readyTitle"),
      body: i18n.t("notification.readyBody", { name }),
      // Where a tap leads: ReadyNotifier reads this and opens the screen.
      data: { url: "/medicines" },
    },
    trigger: null, // null = now, not at a later time
  });
}
