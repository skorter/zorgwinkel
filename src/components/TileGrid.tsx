// Places the Home tiles: two side by side when they fit, as in Figma,
// one per row when they do not. A long word like "Appointments" must
// never be broken in the middle, in any language or text size.
//
// How: the tiles start side by side. If a tile reports that its label
// broke a word, the grid switches to one tile per row. That is checked
// again whenever the text size, phone width or language changes.
import type { LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions, View } from "react-native";
import { useAppTheme } from "../theme";
import { BigTile } from "./BigTile";

export type Tile = {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  onPress: () => void;
};

export function TileGrid({ tiles }: { tiles: Tile[] }) {
  const { size, spacing } = useAppTheme().app;
  const { width, fontScale } = useWindowDimensions(); // fontScale = the phone's own text size
  const { i18n } = useTranslation();

  // The situation the current layout was chosen for.
  const situation = `${size}-${fontScale}-${width}-${i18n.language}`;
  const [brokeIn, setBrokeIn] = useState<string | null>(null);

  const twoColumns =
    size === "normal" &&
    fontScale <= 1.3 &&
    width >= 320 &&
    brokeIn !== situation;

  const gap = spacing.sm + 4; // 12: a little tighter than elsewhere, so labels fit

  if (!twoColumns) {
    return (
      <View style={{ gap }}>
        {tiles.map(({ key, ...tile }) => (
          <BigTile key={key} {...tile} layout="row" />
        ))}
      </View>
    );
  }

  // Pairs: [[tile1, tile2], [tile3, tile4]]
  const rows: Tile[][] = [];
  for (let i = 0; i < tiles.length; i += 2) rows.push(tiles.slice(i, i + 2));

  return (
    <View style={{ gap }}>
      {rows.map((row) => (
        <View key={row[0].key} style={{ flexDirection: "row", gap }}>
          {row.map(({ key, ...tile }) => (
            <BigTile
              key={key}
              {...tile}
              layout="square"
              onWordBreak={() => setBrokeIn(situation)}
            />
          ))}
          {row.length === 1 && <View style={{ flex: 1 }} />}
        </View>
      ))}
    </View>
  );
}
