import { useState } from "react";
import { Text, View } from "react-native";
import { PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import LocationSearchBar from "../components/LocationSearch";
import SportSearch from "../components/SportSearch";

type SportOption = {
  id: string;
  name: string;
  availableGames: number;
};

// MOCK DATA

const availableSports: SportOption[] = [
  { id: "football", name: "football", availableGames: 4 },
  { id: "basketball", name: "basketball", availableGames: 3 },
  { id: "padel", name: "padel", availableGames: 3 },
  { id: "tennis", name: "tennis", availableGames: 2 },
];

// SPLIT INTO COMPONENT

export default function FindGame() {
  const [location, setLocation] = useState("");
  const [selectedSports, setSelectedSports] = useState<SportOption[]>([]);
  const [showGames, setShowGames] = useState(false);

  const handleShowGames = (sports: SportOption[]) => {
    setSelectedSports(sports);
    setShowGames(true);
  };

  return (
    <PageContent className="w-full justify-start gap-4 px-4 pt-6">
      <View className="w-full flex flex-col items-center justify-center">
        <PageHeader>find a game</PageHeader>
      </View>

      <View className="w-full flex flex-col items-center justify-center">
        <LocationSearchBar value={location} onChangeText={setLocation} />
      </View>

      <View className="w-full flex flex-col items-center justify-center gap-4 px-4">
        <SportSearch
          location={location}
          sports={availableSports}
          onShowGames={handleShowGames}
        />

        {showGames ? (
          <View className="w-full max-w-xl rounded-xl border border-border bg-white p-4">
            <Text className="text-base font-semibold text-defaulttext">
              selected sports
            </Text>
            <Text className="mt-2 text-sm text-defaulttext">
              {selectedSports.map((sport) => sport.name).join(", ") ||
                "No sports selected."}
            </Text>
            <Text className="mt-2 text-xs text-defaulttext">
              backend hook: replace this section with your game list query
              filtered by selected sports and location.
            </Text>
          </View>
        ) : null}
      </View>
    </PageContent>
  );
}
