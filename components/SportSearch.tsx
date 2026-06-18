import { Pressable, Text, View } from "react-native";
import type { SportOption } from "./types/findGame";

type SportSearchProps = {
  location: string;
  sports: SportOption[];
  selectedIds: string[];
  onToggleSport: (sportId: string) => void;
  onShowGames: () => void;
};

export default function SportSearch({
  location,
  sports,
  selectedIds,
  onToggleSport,
  onShowGames,
}: SportSearchProps) {
  const canShowGames = selectedIds.length > 0;

  return (
    <View className="w-full max-w-xl rounded-2xl bg-secondary p-4">
      <Text className="text-lg font-semibold text-defaulttext">
        available games in {location || "your area"}
      </Text>

      <View className="mt-4 flex-row flex-wrap gap-2">
        {sports.map((sport) => {
          const isSelected = selectedIds.includes(sport.id);

          return (
            <Pressable
              key={sport.id}
              onPress={() => onToggleSport(sport.id)}
              className={`rounded-full border px-3 py-2 ${
                isSelected
                  ? "border-greenaccent bg-greenaccent"
                  : "border-border bg-secondary"
              }`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`select ${sport.name}`}
            >
              <Text className="text-sm font-medium text-defaulttext">
                {sport.name} ({sport.availableGames})
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onShowGames}
        disabled={!canShowGames}
        className={`mt-4 rounded-xl px-4 py-3 ${
          canShowGames ? "bg-greenaccent" : "bg-secondary"
        }`}
        accessibilityRole="button"
        accessibilityLabel="show games for selected sports"
      >
        <Text className="text-center text-base font-semibold text-defaulttext">
          show games for selected sports
        </Text>
      </Pressable>
    </View>
  );
}
