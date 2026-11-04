import { useState } from "react";
import { Text, View } from "react-native";
import matchCardContent from "../../content/matchcard.json";
import { cancelMatch, joinMatch, leaveMatch } from "../../lib/matches/api";
import {
  formatMatchLocation,
  formatMatchTime,
  formatPlayerCount,
  isMatchFull,
} from "../../lib/matches/format";
import type { MatchSummary } from "../../types/find-game";
import ActionButton from "./ActionButton";
import JoinGameButton from "../buttons/JoinGameButton";

const copy = matchCardContent.en;

type MatchCardProps = {
  match: MatchSummary;
  // called after a successful join, leave or cancel so the list can refresh
  onChanged?: () => void;
};

type Action = "join" | "leave" | "cancel";

const runAction: Record<Action, (matchId: string) => Promise<void>> = {
  join: joinMatch,
  leave: leaveMatch,
  cancel: cancelMatch,
};

export default function MatchCard({ match, onChanged }: MatchCardProps) {
  const [pending, setPending] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Cancelling can't be undone, so it takes a second tap.
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const isFull = isMatchFull(match);

  const handleAction = async (action: Action) => {
    if (action === "cancel" && !confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }

    setPending(action);
    setError(null);
    try {
      await runAction[action](match.id);
      setConfirmingCancel(false);
      onChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(null);
    }
  };

  const badge = match.isHost
    ? copy.hostingBadge
    : match.hasJoined
      ? copy.joinedBadge
      : isFull
        ? copy.fullBadge
        : null;

  return (
    <View className="w-full max-w-4xl rounded-xl border border-transparent bg-surface p-4">
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-base font-semibold font-sans text-defaulttext">
          {match.sportName} at {match.venueName}
        </Text>
        {badge ? (
          <Text className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold font-sans uppercase tracking-wide text-defaulttext">
            {badge}
          </Text>
        ) : null}
      </View>
      <Text className="mt-1 text-base font-sans text-defaulttext">
        {copy.startsLabel}: {formatMatchTime(match.startsAt, match.timezone)}
      </Text>
      <Text className="mt-1 text-base font-sans text-defaulttext">
        {copy.durationLabel}: {match.durationMinutes} min
      </Text>
      <Text className="mt-1 text-base font-sans text-defaulttext">
        {copy.locationLabel}: {formatMatchLocation(match)}
      </Text>
      <Text className="mt-1 text-base font-sans text-defaulttext">
        {copy.playersLabel}: {formatPlayerCount(match)}
      </Text>
      <Text className="mt-1 text-base font-sans text-defaulttext">
        {copy.hostLabel}: {match.hostName ?? copy.deletedHost}
      </Text>
      {match.notes ? (
        <Text className="mt-1 text-base font-sans text-defaulttext">
          {copy.notesLabel}: {match.notes}
        </Text>
      ) : null}

      <View className="mt-4 flex-row gap-3">
        {match.isHost ? (
          <ActionButton
            label={
              pending === "cancel"
                ? copy.working
                : confirmingCancel
                  ? copy.confirmCancel
                  : copy.cancelGame
            }
            onPress={() => handleAction("cancel")}
            disabled={pending !== null}
            className="flex-1 border border-defaulttext/20 bg-secondary px-4"
            textClassName="text-base font-semibold font-sans text-defaulttext"
          />
        ) : match.hasJoined ? (
          <ActionButton
            label={pending === "leave" ? copy.working : copy.leaveGame}
            onPress={() => handleAction("leave")}
            disabled={pending !== null}
            className="flex-1 border border-defaulttext/20 bg-secondary px-4"
            textClassName="text-base font-semibold font-sans text-defaulttext"
          />
        ) : (
          <JoinGameButton
            label={pending === "join" ? copy.working : undefined}
            onPress={() => handleAction("join")}
            disabled={pending !== null || isFull}
          />
        )}
      </View>

      {error ? (
        <Text
          className="mt-3 text-sm font-sans text-defaulttext"
          accessibilityLiveRegion="polite"
        >
          {copy.actionError} {error}
        </Text>
      ) : null}
    </View>
  );
}
