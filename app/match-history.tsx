import { Text, View } from "react-native";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import findSportData from "../mockdata/find-sport-data.json";
import { mapAttendingMatchesByTime } from "../lib/mappers/mapFindSports";
import type { FindSportMockData } from "../types/find-game";

const pastMatches = mapAttendingMatchesByTime(
  findSportData as FindSportMockData,
  "past",
);

export default function MatchHistory() {
  return (
    <PageShell>
      <PageShellIntro
        title="match history"
        body="Your previous matches and results."
      />

      <PageShellBody>
        <View className="w-full rounded-2xl border border-border bg-secondary p-5 gap-4">
          {pastMatches.length > 0 ? (
            pastMatches.map((match) => (
              <View
                key={match.id}
                className="gap-1 rounded-xl border border-border bg-white px-3 py-3"
              >
                <Text className="text-sm font-semibold uppercase tracking-wide text-defaulttext/70">
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
      </PageShellBody>
    </PageShell>
  );
}
