import { Link } from "expo-router";
import { Pressable, Text } from "react-native";
import type { MatchSummary } from "../../types/find-game";
import MatchSummaryRow from "../common/MatchSummaryRow";
import ProfileAccordionSection from "../common/ProfileAccordionSection";

type CalendarSectionProps = {
  isOpen: boolean;
  onToggle: () => void;
  // null while loading
  upcomingMatches: MatchSummary[] | null;
  error?: string | null;
};

export default function CalendarSection({
  isOpen,
  onToggle,
  upcomingMatches,
  error,
}: CalendarSectionProps) {
  return (
    <ProfileAccordionSection
      title="calendar"
      isOpen={isOpen}
      onToggle={onToggle}
      expandLabel="Expand calendar"
      collapseLabel="Collapse calendar"
    >
      {error ? (
        <Text className="text-sm font-sans text-defaulttext/80">
          {"couldn't load your games:"} {error}
        </Text>
      ) : upcomingMatches === null ? (
        <Text className="text-sm font-sans text-defaulttext/80">
          Loading your games…
        </Text>
      ) : upcomingMatches.length > 0 ? (
        upcomingMatches.map((match) => (
          <MatchSummaryRow key={match.id} match={match} />
        ))
      ) : (
        <Text className="text-sm font-sans text-defaulttext/80">
          No upcoming games yet. Start one or join one from find a game.
        </Text>
      )}

      <Link href="/match-history" asChild>
        <Pressable accessibilityRole="link">
          <Text className="text-sm font-semibold font-sans text-purpleaccent underline">
            view match history
          </Text>
        </Pressable>
      </Link>
    </ProfileAccordionSection>
  );
}
