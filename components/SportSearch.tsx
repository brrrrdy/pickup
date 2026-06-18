import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

type SportOption = {
  id: string;
  name: string;
  availableGames: number;
};

type SportSearchProps = {
  location: string;
  sports: SportOption[];
  onShowGames?: (selectedSports: SportOption[]) => void;
};

export default function SportSearch({
  location,
  sports,
  onShowGames,
}: SportSearchProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedSports = useMemo(
    () => sports.filter((sport) => selectedIds.includes(sport.id)),
    [sports, selectedIds],
  );

  const toggleSport = (sportId: string) => {
    setSelectedIds((prev) =>
      prev.includes(sportId)
        ? prev.filter((id) => id !== sportId)
        : [...prev, sportId],
    );
  };

  const handleShowGames = () => {
    onShowGames?.(selectedSports);
  };

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
              onPress={() => toggleSport(sport.id)}
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
        onPress={handleShowGames}
        disabled={selectedSports.length === 0}
        className={`mt-4 rounded-xl px-4 py-3 ${
          selectedSports.length === 0 ? "bg-secondary" : "bg-greenaccent"
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
