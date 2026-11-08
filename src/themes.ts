// The look of Zorgwinkel in one place: colours, text styles, spacing.
// Every screen takes its values from here, so they are checked once
// (contrast, sizes) and used everywhere.
//
// Colours are taken from the Figma design (Design Iteration 2).
// Every text colour has a contrast of at least 4.5:1 on its background,
// and borderStrong at least 3:1 (WCAG 2.2 AA), in all three palettes.
import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  useTheme,
} from "react-native-paper";

// ---------------------------------------------------------------------
// The choices the patient makes on "Make the app easy to read" (4.5)
// ---------------------------------------------------------------------
export type ColourMode = "light" | "dark" | "highContrast";
export type TextSize = "normal" | "large" | "extraLarge";

// ---------------------------------------------------------------------
// Colours
// ---------------------------------------------------------------------
export type Palette = {
  primary: string; // buttons, logo, selected border
  onPrimary: string; // text on a primary button
  text: string; // headings and main text
  textMuted: string; // dates, addresses, section labels
  background: string; // the page
  surface: string; // cards and option buttons
  selected: string; // background of a selected option
  border: string; // soft edges of cards and tiles (decoration)
  borderStrong: string; // edges of buttons, options and inputs (3:1)
  iconBox: string; // square behind an icon
  tileAppointments: string;
  tileMedicines: string;
  tileMessages: string;
  tileAsk: string;
  note: string; // "Book everything here" box
  noteIcon: string;
  noteText: string;
  danger: string; // "Remove"
};

export const palettes: Record<ColourMode, Palette> = {
  light: {
    primary: "#155C47",
    onPrimary: "#FFFFFF",
    text: "#123D30",
    textMuted: "#52665F",
    background: "#FAFAF7",
    surface: "#FFFFFF",
    selected: "#F3F9F6",
    border: "#CFDDD6",
    borderStrong: "#7A948A",
    iconBox: "#E3EFE9",
    tileAppointments: "#E2F1E9",
    tileMedicines: "#E1EDF7",
    tileMessages: "#FAE9D7",
    tileAsk: "#EEE5F4",
    note: "#FFF3C7",
    noteIcon: "#FFE387",
    noteText: "#5A4500",
    danger: "#9A342D",
  },
  dark: {
    primary: "#89D6B7",
    onPrimary: "#0B2219",
    text: "#E8F2ED",
    textMuted: "#A9BDB4",
    background: "#15201B",
    surface: "#1C2A24",
    selected: "#1F3A2F",
    border: "#2E4038",
    borderStrong: "#6E887D",
    iconBox: "#25392F",
    tileAppointments: "#1F3A2F",
    tileMedicines: "#1D3242",
    tileMessages: "#3B2C1E",
    tileAsk: "#32283D",
    note: "#3A3116",
    noteIcon: "#8A7426",
    noteText: "#FFE7A3",
    danger: "#FF9C91",
  },
  // Black and yellow, as in the Figma swatch. No tinted tiles:
  // every surface is black with a white border.
  highContrast: {
    primary: "#FFE45E",
    onPrimary: "#000000",
    text: "#FFFFFF",
    textMuted: "#FFFFFF",
    background: "#000000",
    surface: "#000000",
    selected: "#2B2600",
    border: "#FFFFFF",
    borderStrong: "#FFFFFF",
    iconBox: "#000000",
    tileAppointments: "#000000",
    tileMedicines: "#000000",
    tileMessages: "#000000",
    tileAsk: "#000000",
    note: "#000000",
    noteIcon: "#FFE45E",
    noteText: "#FFE45E",
    danger: "#FF8A80",
  },
};

// ---------------------------------------------------------------------
// Text
// Public Sans, three sizes only: 28 (screen titles), 20 (headings,
// tiles, big buttons) and 16 (everything else). Nothing is smaller
// than 16, so the app stays readable for older adults. Weight, not
// size, makes the other differences.
// ---------------------------------------------------------------------
export const fonts = {
  regular: "PublicSans_400Regular",
  semiBold: "PublicSans_600SemiBold",
  bold: "PublicSans_700Bold",
};

const baseText = {
  title: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22 },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const, // "LANGUAGE", "YOUR NEXT APPOINTMENT"
  },
};
export type TextStyles = typeof baseText;

// Normal, Large and Extra large from screen 4.5. This comes on top of
// the phone's own text size setting, which React Native follows anyway.
export const textScale: Record<TextSize, number> = {
  normal: 1,
  large: 1.25,
  extraLarge: 1.5,
};

function scaleText(scale: number): TextStyles {
  const scaled = {} as TextStyles;
  for (const key of Object.keys(baseText) as (keyof TextStyles)[]) {
    const style = baseText[key];
    scaled[key] = {
      ...style,
      fontSize: style.fontSize * scale,
      lineHeight: Math.round(style.lineHeight * scale),
    } as never;
  }
  return scaled;
}

// ---------------------------------------------------------------------
// Spacing and shapes
// ---------------------------------------------------------------------
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const radius = { sm: 8, md: 12, lg: 16 };
export const minTouch = 48; // every button at least 48 x 48

// ---------------------------------------------------------------------
// The theme for React Native Paper, plus our own values under "app"
// ---------------------------------------------------------------------
export function makeTheme(mode: ColourMode, size: TextSize) {
  const c = palettes[mode];
  const base = mode === "light" ? MD3LightTheme : MD3DarkTheme;

  // Paper's own components (Button, TextInput, ...) use these fonts.
  // On Android a custom font needs its own file per weight, so each
  // style gets the right Public Sans file and a normal weight.
  const paperFontConfig: Record<
    string,
    { fontFamily: string; fontWeight: "normal" }
  > = {};
  for (const variant of Object.keys(base.fonts)) {
    const family = variant.startsWith("body")
      ? fonts.regular
      : variant.startsWith("label")
        ? fonts.semiBold
        : fonts.bold;
    paperFontConfig[variant] = { fontFamily: family, fontWeight: "normal" };
  }

  return {
    ...base,
    dark: mode !== "light",
    roundness: 3, // Paper multiplies this by 4: 12 px corners, as in Figma
    colors: {
      ...base.colors,
      primary: c.primary,
      onPrimary: c.onPrimary,
      primaryContainer: c.selected,
      onPrimaryContainer: c.text,
      secondaryContainer: c.selected,
      onSecondaryContainer: c.text,
      background: c.background,
      onBackground: c.text,
      surface: c.surface,
      onSurface: c.text,
      surfaceVariant: c.surface,
      onSurfaceVariant: c.textMuted,
      outline: c.borderStrong,
      outlineVariant: c.border,
      error: c.danger,
    },
    fonts: configureFonts({ config: paperFontConfig as never }),
    // Our own values, for the components we build ourselves.
    app: {
      mode,
      size,
      colors: c,
      text: scaleText(textScale[size]),
      spacing,
      radius,
      minTouch,
    },
  };
}

export type AppTheme = ReturnType<typeof makeTheme>;

// In a component: const theme = useAppTheme();
// then theme.app.colors.primary, theme.app.text.title, ...
export const useAppTheme = () => useTheme<AppTheme>();
