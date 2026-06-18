import { Text, View } from "react-native";
import type { MatchCardData } from "../types/findGame";
import MatchCard from "./MatchCard";

type MatchListProps = {
  matches: MatchCardData[];
  location: string;
  hasSearched: boolean;
};

export default function MatchList({
  matches,
  location,
  hasSearched,
}: MatchListProps) {
  if (!hasSearched) {
    return null;
  }

  if (matches.length === 0) {
    return (
      <Text className="w-full max-w-xl text-left text-sm text-defaulttext">
        no open games found for your selected sports.
      </Text>
    );
  }

  return (
    <View className="w-full items-center gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} location={location} />
      ))}
    </View>
  );
}
