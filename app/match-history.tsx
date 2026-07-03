import { ScrollView, Text, View } from "react-native";
import PageContent from "../components/layout/PageContent";
import { PageBody, PageHeader } from "../components/typography/Typography";
import findSportData from "../mockdata/find-sport-data.json";
import { mapAttendingMatchesByTime } from "../lib/mappers/mapFindSports";
import type { FindSportMockData } from "../components/types/find-game";

const pastMatches = mapAttendingMatchesByTime(
  findSportData as FindSportMockData,
  "past",
);

export default function MatchHistory() {
  return (
    <PageContent className="w-full px-4 pt-6">
      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-6">
          <PageHeader>match history</PageHeader>
          <PageBody>Your previous matches and results.</PageBody>

          <View className="w-full max-w-xl rounded-2xl border border-border bg-secondary p-5 gap-4">
            {pastMatches.length > 0 ? (
              pastMatches.map((match) => (
                <View
                  key={match.id}
                  className="gap-1 rounded-xl border border-border bg-white px-3 py-3"
                >
                  <Text className="text-xs font-semibold uppercase tracking-wide text-defaulttext/70">
                    {match.sportName}
                  </Text>
                  <Text className="text-base text-defaulttext">
                    {match.displayDateTime}
                  </Text>
                  <Text className="text-sm text-defaulttext/80">
                    {match.location}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-sm text-defaulttext/80">
                No attended match history yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </PageContent>
  );
}
