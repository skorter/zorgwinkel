// The bar at the top of every screen, from Figma:
// - on Home: the Zorgwinkel logo on the left
// - elsewhere: "Back" on the left
// and the Basket button with its counter on the right.
import { useRouter } from "expo-router";
import { ArrowLeft, Check, ShoppingBasket } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { useAppTheme } from "../theme";

type Props = {
  variant: "home" | "back";
  onBack?: () => void; // default: go to the previous screen
  showBasket?: boolean; // false on screens like the welcome flow
  basketCount?: number; // comes from the basket in Phase 4
};

export function TopBar({
  variant,
  onBack,
  showBasket = true,
  basketCount = 0,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, text, spacing, radius, minTouch } = useAppTheme().app;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // with very large text, Basket moves to its own line
        gap: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      {variant === "home" ? (
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel={t("common.appName")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            flexShrink: 1,
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: radius.sm,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={20} color={colors.onPrimary} strokeWidth={3} />
          </View>
          {/* The brand name shrinks to fit rather than break: "Zorgwink-el". */}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            style={[text.heading, { color: colors.text, flexShrink: 1 }]}
          >
            {t("common.appName")}
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={8}
          style={{
            minHeight: minTouch,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
          }}
        >
          <ArrowLeft
            size={text.bodyStrong.fontSize}
            color={colors.primary}
            strokeWidth={2}
          />
          <Text style={[text.bodyStrong, { color: colors.primary }]}>
            {t("common.back")}
          </Text>
        </Pressable>
      )}

      {showBasket && (
        <Pressable
          onPress={() => router.push("/basket")}
          accessibilityRole="button"
          accessibilityLabel={t("common.basketCount", { count: basketCount })}
          style={({ pressed }) => ({
            minHeight: minTouch,
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radius.md,
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <ShoppingBasket
            size={text.bodyStrong.fontSize}
            color={colors.primary}
            strokeWidth={2}
          />
          <Text style={[text.bodyStrong, { color: colors.primary }]}>
            {t("common.basket")}
          </Text>
          <View
            style={{
              minWidth: 24,
              height: 24,
              paddingHorizontal: 6,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Fixed size: the counter must stay a small round badge. */}
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: text.bodyStrong.fontFamily,
                fontSize: 14,
                color: colors.onPrimary,
              }}
            >
              {basketCount}
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
