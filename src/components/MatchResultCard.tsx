import { Pressable, Text, View } from "react-native";

type MatchResultCardProps = {
  sportName: string;
  venueName: string;
  city: string;
  startsAt: string;
  joinedPlayers: number;
  maxPlayers: number;
  selected?: boolean;
  onPress?: () => void;
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
  sportName,
  venueName,
  city,
  startsAt,
  joinedPlayers,
  maxPlayers,
  selected,
  onPress,
}: MatchResultCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`h-[158px] flex-1 rounded-2xl border bg-white p-3.5 ${
        selected ? "border-primary" : "border-border"
      }`}
    >
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
    </Pressable>
  );
}
