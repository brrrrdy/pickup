import { Text, View } from "react-native";
import type { MatchSummary } from "../../types/find-game";
import MatchCard from "./MatchCard";

type MatchListProps = {
  matches: MatchSummary[];
  hasSearched: boolean;
  emptyMessage: string;
  onChanged?: () => void;
};

export default function MatchList({
  matches,
  hasSearched,
  emptyMessage,
  onChanged,
}: MatchListProps) {
  if (!hasSearched) {
    return null;
  }

  if (matches.length === 0) {
    return (
      <Text className="w-full max-w-4xl text-left font-sans text-base text-defaulttext">
        {emptyMessage}
      </Text>
    );
  }

  return (
    <View className="w-full items-center gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} onChanged={onChanged} />
      ))}
    </View>
  );
}
