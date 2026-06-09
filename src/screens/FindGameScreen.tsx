import { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { Pressable, Text, TextInput, View } from "react-native";

import { LoadingCardPlaceholder } from "../components/LoadingCardPlaceholder";
import { MatchResultCard } from "../components/MatchResultCard";

type FindGameScreenProps = {
  onBack?: () => void;
};

type Match = {
  id: string;
  title: string;
  starts_at: string;
  max_players: number;
  sport_name: string;
  venue_name: string;
  city: string;
  host_name: string;
  joined_players: number;
};

const API_BASE_URL = "http://localhost:4000";

export function FindGameScreen({ onBack }: FindGameScreenProps) {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSearch() {
    const city = search.trim();

    if (!city) {
      setHasSearched(false);
      setMatches([]);
      setError("Enter a city name, then press Search.");
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
      setError("Could not load matches from API.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-surface px-6 pb-10 pt-[72px]">
      <StatusBar style="dark" />

      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-[32px] font-extrabold text-foreground">
          Find a Game
        </Text>

        <Pressable
          accessibilityRole="button"
          className="rounded-xl border border-border bg-white px-3 py-2"
          onPress={onBack}
        >
          <Text className="text-[14px] font-semibold text-foreground">
            Back
          </Text>
        </Pressable>
      </View>

      <TextInput
        className="mb-5 min-h-[56px] rounded-2xl border border-border bg-white px-4 text-[16px] text-foreground"
        placeholder="where do you want to play"
        placeholderTextColor="#6e8676"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />

      <Pressable
        accessibilityRole="button"
        className="mb-5 min-h-[48px] items-center justify-center rounded-2xl border border-primary bg-foreground"
        onPress={handleSearch}
      >
        <Text className="text-[16px] font-bold text-primary-foreground">
          Search
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
        <View className="rounded-2xl border border-border bg-white p-4">
          <Text className="text-[14px] text-muted">
            Search by city to load games from the API.
          </Text>
        </View>
      ) : null}

      {hasSearched && !isLoading && !error ? (
        <View className="flex-row flex-wrap justify-between gap-y-3.5">
          {matches.length ? (
            matches.map((match) => (
              <View className="w-[48%]" key={match.id}>
                <MatchResultCard
                  title={match.title}
                  sportName={match.sport_name}
                  venueName={match.venue_name}
                  city={match.city}
                  startsAt={match.starts_at}
                  joinedPlayers={match.joined_players}
                  maxPlayers={match.max_players}
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
    </View>
  );
}
