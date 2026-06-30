import { Text, View } from "react-native";
import matchCardContent from "../../content/matchcard.json";
import type { MatchCardData } from "../types/findGame";

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
    <View className="w-full max-w-xl rounded-xl border border-border bg-white p-4">
      <Text className="text-base font-semibold text-defaulttext">
        {match.title}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        {copy.sportLabel}: {match.sportName}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        {copy.startsLabel}: {formatStartTime(match.startsAt)}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        {copy.durationLabel}:{" "}
        {match.durationMinutes > 0
          ? `${match.durationMinutes} min`
          : copy.durationTbd}
      </Text>
      <Text className="mt-1 text-sm text-defaulttext">
        {copy.locationLabel}: {location || copy.fallbackLocation}
      </Text>
    </View>
  );
}
