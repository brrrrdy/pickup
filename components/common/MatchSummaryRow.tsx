import { Text, View } from "react-native";
import {
  formatMatchLocation,
  formatMatchTime,
  formatPlayerCount,
} from "../../lib/matches/format";
import type { MatchSummary } from "../../types/find-game";

/** Compact match line for the profile calendar and match history. */
export default function MatchSummaryRow({ match }: { match: MatchSummary }) {
  return (
    <View className="gap-1 rounded-xl border border-border bg-surface px-3 py-3">
      <Text className="text-sm font-semibold font-sans uppercase tracking-wide text-defaulttext/70">
        {match.sportName}
        {match.isHost ? " · hosting" : ""}
      </Text>
      <Text className="text-base font-sans text-defaulttext">
        {formatMatchTime(match.startsAt, match.timezone)} ·{" "}
        {match.durationMinutes} min
      </Text>
      <Text className="text-sm font-sans text-defaulttext/80">
        {formatMatchLocation(match)} · {formatPlayerCount(match)}
      </Text>
    </View>
  );
}
