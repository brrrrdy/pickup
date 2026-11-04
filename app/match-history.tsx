import RequireAuth from "../lib/auth/RequireAuth";
import { Text, View } from "react-native";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import matchhistory from "../content/matchhistory.json";
import MatchSummaryRow from "../components/common/MatchSummaryRow";
import { useMatches } from "../hooks/use-matches";

function MatchHistory() {
  const content = matchhistory.en;
  const { matches, error } = useMatches("past");
  const pastMatches = matches?.filter((match) => match.hasJoined) ?? [];
  return (
    <PageShell>
      <PageShellIntro title={content.intro.title} body={content.intro.body} />

      <PageShellBody>
        <View className="w-full rounded-2xl border border-border bg-secondary p-5 gap-4">
          {error ? (
            <Text className="text-sm font-sans text-defaulttext/80">
              {"couldn't load your match history:"} {error}
            </Text>
          ) : matches === null ? (
            <Text className="text-sm font-sans text-defaulttext/80">
              Loading your match history…
            </Text>
          ) : pastMatches.length > 0 ? (
            pastMatches.map((match) => (
              <MatchSummaryRow key={match.id} match={match} />
            ))
          ) : (
            <Text className="text-sm font-sans text-defaulttext/80">
              No attended match history yet.
            </Text>
          )}
        </View>
      </PageShellBody>
    </PageShell>
  );
}

export default function MatchHistoryPage() {
  return (
    <RequireAuth>
      <MatchHistory />
    </RequireAuth>
  );
}
