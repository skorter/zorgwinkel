// "Ask a real person": at the bottom of every screen, so the patient can
// always switch to a phone call. Opens the help screen (1.6x).
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { AppButton } from "./AppButton";

export function AskButton() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <AppButton
      label={t("common.askRealPerson")}
      onPress={() => router.push("/help")}
      variant="outline"
      size="large"
      icon={User}
    />
  );
}
