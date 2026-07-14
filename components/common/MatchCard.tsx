import { Text, View } from "react-native";
import matchCardContent from "../../content/matchcard.json";
import JoinGameButton from "../buttons/JoinGameButton";
import ViewGameButton from "../buttons/ViewGameButton";
import type { MatchCardData } from "../../types/find-game";

type MatchCardProps = {
  match: MatchCardData;
  location: string;
};

function formatStartTime(startsAt: string): string {
  const parsed = new Date(startsAt);

  if (Number.isNaN(parsed.getTime())) {
    return startsAt;
  }

  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MatchCard({ match, location }: MatchCardProps) {
  const copy = matchCardContent.en;

  return (
    <View className="w-full max-w-4xl rounded-xl border border-transparent bg-white p-4">
      <Text className="text-base font-semibold font-sans text-defaulttext">
        {match.title}
      </Text>
      <Text className="mt-1 text-base text-defaulttext">
        {copy.sportLabel}: {match.sportName}
      </Text>
      <Text className="mt-1 text-base text-defaulttext">
        {copy.startsLabel}: {formatStartTime(match.startsAt)}
      </Text>
      <Text className="mt-1 text-base text-defaulttext">
        {copy.durationLabel}:{" "}
        {match.durationMinutes > 0
          ? `${match.durationMinutes} min`
          : copy.durationTbd}
      </Text>
      <Text className="mt-1 text-base text-defaulttext">
        {copy.locationLabel}: {location || copy.fallbackLocation}
      </Text>

      <View className="mt-4 flex-row gap-3">
        <ViewGameButton />
        <JoinGameButton />
      </View>
    </View>
  );
}
