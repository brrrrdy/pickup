import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { PageHeader } from "../components/typography/Typography";
import PageContent from "../components/layout/PageContent";
import PageSection from "../components/layout/PageSection";
import LocationSearchBar from "../components/LocationSearch";
import SportSearch from "../components/SportSearch";
import MatchCard from "../components/common/MatchCard";
import mockFindSportData from "../mockdata/find-sport-data.json";
import {
  mapOpenMatchesForSelectedSports,
  mapSportsWithOpenGameCounts,
} from "../mockdata/mapFindSports";
import type { SportOption } from "../components/types/findGame";

const availableSports = mapSportsWithOpenGameCounts(mockFindSportData);

export default function FindGame() {
  const [location, setLocation] = useState("");
  const [selectedSports, setSelectedSports] = useState<SportOption[]>([]);
  const [showGames, setShowGames] = useState(false);

  const handleShowGames = (sports: SportOption[]) => {
    setSelectedSports(sports);
    setShowGames(true);
  };

  const openMatches = useMemo(
    () => mapOpenMatchesForSelectedSports(mockFindSportData, selectedSports),
    [selectedSports],
  );

  return (
    <PageContent className="w-full px-4 pt-6">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-4">
          <PageSection>
            <PageHeader>find a game</PageHeader>
          </PageSection>

          <PageSection>
            <LocationSearchBar value={location} onChangeText={setLocation} />
          </PageSection>

          <PageSection className="gap-4 px-4">
            <SportSearch
              location={location}
              sports={availableSports}
              onShowGames={handleShowGames}
            />

            {showGames ? (
              <>
                {openMatches.length > 0 ? (
                  openMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      location={location}
                    />
                  ))
                ) : (
                  <Text className="w-full max-w-xl text-left text-sm text-defaulttext">
                    no open games found for your selected sports.
                  </Text>
                )}
              </>
            ) : null}
          </PageSection>
        </View>
      </ScrollView>
    </PageContent>
  );
}
