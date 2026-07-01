import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { AttendingMatchDisplay } from "../types/findGame";
import ProfileAccordionSection from "../common/ProfileAccordionSection";

type CalendarSectionProps = {
  isOpen: boolean;
  onToggle: () => void;
  upcomingMatches: AttendingMatchDisplay[];
};

export default function CalendarSection({
  isOpen,
  onToggle,
  upcomingMatches,
}: CalendarSectionProps) {
  return (
    <ProfileAccordionSection
      title="calendar"
      isOpen={isOpen}
      onToggle={onToggle}
      expandLabel="Expand calendar"
      collapseLabel="Collapse calendar"
    >
      {upcomingMatches.length > 0 ? (
        upcomingMatches.map((match) => (
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
          No upcoming attended matches yet.
        </Text>
      )}

      <Link href="/match-history" asChild>
        <Pressable accessibilityRole="link">
          <Text className="text-sm font-semibold text-purpleaccent underline">
            view match history
          </Text>
        </Pressable>
      </Link>
    </ProfileAccordionSection>
  );
}
