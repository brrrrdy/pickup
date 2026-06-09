import { Text, View } from "react-native";

type MatchResultCardProps = {
  title: string;
  sportName: string;
  venueName: string;
  city: string;
  startsAt: string;
  joinedPlayers: number;
  maxPlayers: number;
};

function formatStartsAt(startsAt: string) {
  const date = new Date(startsAt);

  if (Number.isNaN(date.getTime())) {
    return "TBD";
  }

  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MatchResultCard({
  title,
  sportName,
  venueName,
  city,
  startsAt,
  joinedPlayers,
  maxPlayers,
}: MatchResultCardProps) {
  return (
    <View className="h-[158px] flex-1 rounded-2xl border border-border bg-white p-3.5">
      <Text
        className="mb-1 text-[15px] font-extrabold text-foreground"
        numberOfLines={1}
      >
        {title}
      </Text>

      <Text
        className="mb-1 text-[13px] font-semibold text-muted"
        numberOfLines={1}
      >
        {sportName}
      </Text>

      <Text className="mb-1 text-[12px] text-muted" numberOfLines={1}>
        {venueName} · {city}
      </Text>

      <Text className="mb-3 text-[12px] text-muted" numberOfLines={1}>
        {formatStartsAt(startsAt)}
      </Text>

      <View className="mt-auto rounded-lg bg-secondary px-2.5 py-1.5">
        <Text className="text-[12px] font-semibold text-foreground">
          {joinedPlayers}/{maxPlayers} players
        </Text>
      </View>
    </View>
  );
}
