// Sending the basket, shared by Your basket (1.5, when already logged in)
// and Welcome, Mrs Jansen (1.6c, the first time).
//
// On success: empty the basket, log out again if Remember me was not
// ticked, and open the receipt.
// On failure: nothing was saved (submit_basket is all or nothing), the
// basket stays as it was, and the screen shows the error and Try again.
// It never shows the receipt for a failed request.
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AccessibilityInfo } from "react-native";
import { useBasket } from "../context/BasketContext";
import { signOut, submitBasket } from "./api";

export function useSendBasket() {
  const { t } = useTranslation();
  const router = useRouter();
  const { items, empty } = useBasket();
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  // remember: false when Remember me was not ticked on 1.6.
  async function send(remember = true) {
    if (sending || items.length === 0) return;
    setSending(true);
    setFailed(false);
    try {
      await submitBasket(items);
      empty(); // only now: the server said it worked
      if (!remember) await signOut();
      // Close the basket and login screens, so Back on the receipt
      // goes home instead of to an empty basket.
      router.dismissAll();
      router.push("/receipt");
    } catch {
      setFailed(true);
      AccessibilityInfo.announceForAccessibility(t("send.error"));
    } finally {
      setSending(false);
    }
  }

  return { send, sending, failed };
}
