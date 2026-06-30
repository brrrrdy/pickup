import { Text, View } from "react-native";
import sportPillContent from "../content/sportpill.json";
import ActionButton from "./common/ActionButton";
import SportOptionPill from "./common/SportOptionPill";
import type { SportOption } from "./types/findGame";

function formatSportPillLabel(sportName: string, count: number) {
  return sportPillContent.en.labelTemplate
    .replace("{sport}", sportName)
    .replace("{count}", String(count));
}

type SportSearchProps = {
  location: string;
  sports: SportOption[];
  selectedIds: string[];
  onToggleSport: (sportId: string) => void;
  onShowGames: () => void;
  availableGamesInPrefix: string;
  availableGamesInFallback: string;
  showGamesButtonLabel: string;
};

export default function SportSearch({
  location,
  sports,
  selectedIds,
  onToggleSport,
  onShowGames,
  availableGamesInPrefix,
  availableGamesInFallback,
  showGamesButtonLabel,
}: SportSearchProps) {
  const canShowGames = selectedIds.length > 0;

  return (
    <View className="w-full max-w-xl rounded-2xl bg-secondary p-4">
      <Text className="text-lg font-semibold text-defaulttext">
        {availableGamesInPrefix} {location || availableGamesInFallback}
      </Text>

      <View className="mt-4 flex-row flex-wrap gap-2">
        {sports.map((sport) => {
          const isSelected = selectedIds.includes(sport.id);

          return (
            <SportOptionPill
              key={sport.id}
              label={formatSportPillLabel(sport.name, sport.availableGames)}
              selected={isSelected}
              onPress={() => onToggleSport(sport.id)}
              accessibilityLabel={`${sportPillContent.en.selectPrefix} ${sport.name}`}
            />
          );
        })}
      </View>

      <ActionButton
        label={showGamesButtonLabel}
        onPress={onShowGames}
        disabled={!canShowGames}
        className={`mt-4 ${canShowGames ? "bg-greenaccent" : "bg-secondary"}`}
        textClassName="text-base font-semibold text-defaulttext"
      />
    </View>
  );
}
