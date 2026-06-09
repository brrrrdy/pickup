import { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { API_BASE_URL } from "../config";
import { LoadingCardPlaceholder } from "../components/LoadingCardPlaceholder";
import { MatchResultCard } from "../components/MatchResultCard";
import { SelectedMatchDetail } from "../components/SelectedMatchDetail";
import type { Match } from "../types/match";
import type { DevUser } from "../types/user";

type FindGameScreenProps = {
  currentUser: DevUser;
  onBack?: () => void;
};

export function FindGameScreen({ currentUser, onBack }: FindGameScreenProps) {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const selectedMatch = matches.find((m) => m.id === selectedMatchId) ?? null;
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState<string | null>(null);
  const [joinStatusKind, setJoinStatusKind] = useState<"ok" | "error" | null>(
    null,
  );

  function handleSelectMatch(match: Match) {
    setSelectedMatchId(match.id);
    setJoinStatus(null);
    setJoinStatusKind(null);
  }

  async function handleJoin() {
    if (!selectedMatch) return;

    setIsJoining(true);
    setJoinStatus(null);
    setJoinStatusKind(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/matches/${selectedMatch.id}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.id }),
        },
      );

      const payload = (await response.json()) as {
        ok?: boolean;
        joinedPlayers?: number;
        status?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "failed_to_join");
      }

      setJoinStatusKind("ok");
      setJoinStatus(
        `Joined! ${payload.joinedPlayers ?? ""}/${selectedMatch.max_players} players.`,
      );

      if (payload.joinedPlayers !== undefined) {
        setMatches((prev) =>
          prev.map((m) =>
            m.id === selectedMatch.id
              ? { ...m, joined_players: payload.joinedPlayers! }
              : m,
          ),
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "failed_to_join";
      setJoinStatusKind("error");
      setJoinStatus(
        message === "match_is_full"
          ? "This game is already full."
          : message === "match_is_not_joinable"
            ? "This game is no longer open to join."
            : "Could not join game. Please try again.",
      );
    } finally {
      setIsJoining(false);
    }
  }

  async function handleSearch() {
    const city = search.trim();

    if (!city) {
      setHasSearched(false);
      setMatches([]);
      setError("please enter a city name, then press search.");
      return;
    }

    setHasSearched(true);
    setIsLoading(true);
    setError(null);
    setMatches([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/matches?status=open&city=${encodeURIComponent(city)}`,
      );

      if (!response.ok) {
        throw new Error(`failed_to_fetch_matches_${response.status}`);
      }

      const payload = (await response.json()) as { matches?: Match[] };
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
    } catch (_error) {
      setError("could not load matches from the API.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 72,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="dark" />

      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-[32px] font-extrabold text-primary">
            find a game
          </Text>
          <Text className="mt-1 text-[14px] text-muted">
            acting as {currentUser.displayName}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          className="rounded-xl bg-accentred px-3 py-2"
          onPress={onBack}
        >
          <Text className="text-[14px] font-semibold text-secondary">back</Text>
        </Pressable>
      </View>

      <TextInput
        className="mb-5 min-h-[56px] rounded-2xl bg-white px-4 text-[16px] text-primary"
        placeholder="where do you want to play"
        placeholderTextColor="#6e8676"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <Pressable
        accessibilityRole="button"
        className="mb-5 min-h-[48px] items-center justify-center rounded-2xl bg-foreground"
        onPress={handleSearch}
      >
        <Text className="text-[16px] font-bold text-primary-foreground">
          search
        </Text>
      </Pressable>

      {hasSearched && isLoading ? (
        <>
          <View className="flex-row gap-3.5">
            <LoadingCardPlaceholder />
            <LoadingCardPlaceholder />
          </View>

          <View className="mt-3.5 flex-row gap-3.5">
            <LoadingCardPlaceholder />
            <LoadingCardPlaceholder />
          </View>
        </>
      ) : null}

      {error ? (
        <View className="rounded-2xl border border-border bg-white p-4">
          <Text className="text-[14px] text-foreground">{error}</Text>
        </View>
      ) : null}

      {!hasSearched && !error ? (
        <View className="rounded-2xl p-4">
          <Text className="text-[12px] text-muted">
            search for pickup games happening in your city.
          </Text>
        </View>
      ) : null}

      {hasSearched && !isLoading && !error ? (
        <View className="flex-row flex-wrap justify-between gap-y-3.5">
          {matches.length ? (
            matches.map((match) => (
              <View className="w-[48%]" key={match.id}>
                <MatchResultCard
                  sportName={match.sport_name}
                  venueName={match.venue_name}
                  city={match.city}
                  startsAt={match.starts_at}
                  joinedPlayers={match.joined_players}
                  maxPlayers={match.max_players}
                  selected={selectedMatch?.id === match.id}
                  onPress={() => handleSelectMatch(match)}
                />
              </View>
            ))
          ) : (
            <View className="w-full rounded-2xl border border-border bg-white p-4">
              <Text className="text-[14px] text-muted">
                No games found for that city.
              </Text>
            </View>
          )}
        </View>
      ) : null}

      {selectedMatch ? (
        <SelectedMatchDetail
          match={selectedMatch}
          isJoining={isJoining}
          joinStatus={joinStatus}
          joinStatusKind={joinStatusKind}
          onJoin={handleJoin}
          onDismiss={() => setSelectedMatchId(null)}
        />
      ) : null}
    </ScrollView>
  );
}
