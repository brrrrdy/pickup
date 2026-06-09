import { useEffect, useMemo, useState } from "react";

import { Picker } from "@react-native-picker/picker";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { API_BASE_URL } from "../config";
import { DatePicker } from "../components/DatePicker";
import type { DevUser } from "../types/user";

type StartGameScreenProps = {
  currentUser: DevUser;
  onCancel?: () => void;
};

type VenueOption = {
  id: string;
  label: string;
  city: string;
};

const SPORT_OPTIONS = [
  { id: "33333333-3333-3333-3333-333333333333", label: "Basketball" },
  { id: "44444444-4444-4444-4444-444444444444", label: "Tennis" },
];

const VENUE_OPTIONS: VenueOption[] = [
  {
    id: "55555555-5555-5555-5555-555555555555",
    label: "Clapham Common Courts",
    city: "London",
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    label: "Brockwell Park Courts",
    city: "London",
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    label: "Public Court",
    city: "Monforte de Lemos",
  },
];

const DURATION_OPTIONS = [
  { label: "30 mins", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

const PLAYERS_OPTIONS = Array.from({ length: 21 }, (_, index) => index + 2);

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function roundUpToNearestHour(date: Date) {
  const rounded = new Date(date);

  if (
    rounded.getMinutes() > 0 ||
    rounded.getSeconds() > 0 ||
    rounded.getMilliseconds() > 0
  ) {
    rounded.setHours(rounded.getHours() + 1);
  }

  rounded.setMinutes(0, 0, 0);
  return rounded;
}

function toTimeLabel(minutesSinceMidnight: number) {
  const hours = Math.floor(minutesSinceMidnight / 60);
  const minutes = minutesSinceMidnight % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function isTodayDateString(dateValue: string) {
  return dateValue === toDateValue(new Date());
}

function getEarliestAllowedTimeForDate(dateValue: string) {
  const lowerBound = 7 * 60;

  if (!isTodayDateString(dateValue)) {
    return lowerBound;
  }

  const now = new Date();
  const plusThirtyMinutes = new Date(now.getTime() + 30 * 60 * 1000);
  const rounded = roundUpToNearestHour(plusThirtyMinutes);
  const roundedMinutes = rounded.getHours() * 60 + rounded.getMinutes();

  return Math.max(lowerBound, roundedMinutes);
}

function getTimeOptions(dateValue: string) {
  const earliest = getEarliestAllowedTimeForDate(dateValue);
  const latest = 23 * 60;
  const options: string[] = [];

  for (let minutes = earliest; minutes <= latest; minutes += 30) {
    options.push(toTimeLabel(minutes));
  }

  return options;
}

function toStartDateTime(dateValue: string, timeValue: string) {
  const [yearStr, monthStr, dayStr] = dateValue.split("-");
  const [hoursStr, minutesStr] = timeValue.split(":");

  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if ([year, month, day, hours, minutes].some(Number.isNaN)) {
    return new Date("invalid");
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function StartGameScreen({
  currentUser,
  onCancel,
}: StartGameScreenProps) {
  const cityOptions = useMemo(
    () => Array.from(new Set(VENUE_OPTIONS.map((venue) => venue.city))),
    [],
  );

  const [sportId, setSportId] = useState(SPORT_OPTIONS[0].id);
  const [city, setCity] = useState(cityOptions[0]);
  const locationOptions = useMemo(
    () => VENUE_OPTIONS.filter((venue) => venue.city === city),
    [city],
  );
  const [locationId, setLocationId] = useState(locationOptions[0]?.id ?? "");
  const [playersNeeded, setPlayersNeeded] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [startDate, setStartDate] = useState(toDateValue(new Date()));
  const timeOptions = useMemo(() => getTimeOptions(startDate), [startDate]);
  const [startTime, setStartTime] = useState(timeOptions[0] ?? "07:00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusKind, setStatusKind] = useState<"ok" | "error" | null>(null);

  useEffect(() => {
    if (!timeOptions.length) {
      setStartTime("");
      return;
    }

    setStartTime((current) =>
      timeOptions.includes(current) ? current : timeOptions[0],
    );
  }, [timeOptions]);

  function handleCityChange(nextCity: string) {
    setCity(nextCity);

    const nextLocation = VENUE_OPTIONS.find((venue) => venue.city === nextCity);
    setLocationId(nextLocation?.id ?? "");
  }

  function handleSaveTemplate() {
    setStatusKind("ok");
    setStatus("Template saving is coming soon.");
  }

  async function handleStartGame() {
    const parsedStart = toStartDateTime(startDate, startTime);
    const minStart = new Date(Date.now() + 30 * 60 * 1000);

    if (Number.isNaN(parsedStart.getTime())) {
      setStatusKind("error");
      setStatus("Please choose a valid start time.");
      return;
    }

    if (parsedStart.getTime() < minStart.getTime()) {
      setStatusKind("error");
      setStatus("Start time must be at least 30 minutes in the future.");
      return;
    }

    if (!locationId) {
      setStatusKind("error");
      setStatus("Please select a location.");
      return;
    }

    const sportLabel =
      SPORT_OPTIONS.find((sport) => sport.id === sportId)?.label ?? "Game";
    const title = `${currentUser.displayName}'s ${sportLabel} Game`;

    setIsSubmitting(true);
    setStatus(null);
    setStatusKind(null);

    try {
      const response = await fetch(`${API_BASE_URL}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostUserId: currentUser.id,
          sportId,
          venueId: locationId,
          title,
          startsAt: parsedStart.toISOString(),
          durationMinutes,
          maxPlayers: playersNeeded,
        }),
      });

      const payload = (await response.json()) as {
        id?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "failed_to_create_match");
      }

      setStatusKind("ok");
      setStatus(`Game created: ${payload.id}`);
      setNotes("");
    } catch (_error) {
      setStatusKind("error");
      setStatus("Could not create game. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-surface pt-[64px]">
      <StatusBar style="dark" />

      <ScrollView
        className="px-6 pb-10"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="mb-6 flex-row items-center justify-between">
          <View>
            <Text className="text-[32px] font-extrabold text-foreground">
              Start a Game
            </Text>
            <Text className="mt-1 text-[14px] text-muted">
              Acting as {currentUser.displayName}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            className="rounded-xl border border-border bg-white px-3 py-2"
            onPress={onCancel}
          >
            <Text className="text-[14px] font-semibold text-foreground">
              Back
            </Text>
          </Pressable>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">
          Select sport
        </Text>
        <View className="mb-4 rounded-xl border border-border bg-white">
          <Picker
            selectedValue={sportId}
            onValueChange={(value) => setSportId(String(value))}
          >
            {SPORT_OPTIONS.map((sport) => (
              <Picker.Item
                key={sport.id}
                label={sport.label}
                value={sport.id}
              />
            ))}
          </Picker>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">
          Select city
        </Text>
        <View className="mb-4 rounded-xl border border-border bg-white">
          <Picker
            selectedValue={city}
            onValueChange={(value) => handleCityChange(String(value))}
          >
            {cityOptions.map((cityName) => (
              <Picker.Item key={cityName} label={cityName} value={cityName} />
            ))}
          </Picker>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">
          Select location
        </Text>
        <View className="mb-4 rounded-xl border border-border bg-white">
          <Picker
            selectedValue={locationId}
            onValueChange={(value) => setLocationId(String(value))}
          >
            {locationOptions.map((venue) => (
              <Picker.Item
                key={venue.id}
                label={venue.label}
                value={venue.id}
              />
            ))}
          </Picker>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">
          Select players needed
        </Text>
        <View className="mb-4 rounded-xl border border-border bg-white">
          <Picker
            selectedValue={playersNeeded}
            onValueChange={(value) => setPlayersNeeded(Number(value))}
          >
            {PLAYERS_OPTIONS.map((count) => (
              <Picker.Item
                key={String(count)}
                label={String(count)}
                value={count}
              />
            ))}
          </Picker>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">Date</Text>
        <View className="mb-4">
          <DatePicker value={startDate} onChange={setStartDate} />
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">
          Start time
        </Text>
        <View className="mb-4 rounded-xl border border-border bg-white">
          <Picker
            selectedValue={startTime}
            onValueChange={(value) => setStartTime(String(value))}
            enabled={timeOptions.length > 0}
          >
            {timeOptions.length ? (
              timeOptions.map((timeValue) => (
                <Picker.Item
                  key={timeValue}
                  label={timeValue}
                  value={timeValue}
                />
              ))
            ) : (
              <Picker.Item label="No times available" value="" />
            )}
          </Picker>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">
          Length of game
        </Text>
        <View className="mb-4 rounded-xl border border-border bg-white">
          <Picker
            selectedValue={durationMinutes}
            onValueChange={(value) => setDurationMinutes(Number(value))}
          >
            {DURATION_OPTIONS.map((option) => (
              <Picker.Item
                key={String(option.value)}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        <Text className="mb-1 text-[14px] font-semibold text-muted">Notes</Text>
        <TextInput
          className="mb-5 min-h-[96px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-foreground"
          multiline
          textAlignVertical="top"
          placeholder="Optional notes for players"
          placeholderTextColor="#6e8676"
          value={notes}
          onChangeText={setNotes}
        />

        <View className="gap-3">
          <Pressable
            accessibilityRole="button"
            className={`min-h-[52px] items-center justify-center rounded-2xl border border-primary bg-foreground ${
              isSubmitting ? "opacity-70" : ""
            }`}
            disabled={isSubmitting}
            onPress={handleStartGame}
          >
            <Text className="text-[16px] font-bold text-primary-foreground">
              Start game
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="min-h-[52px] items-center justify-center rounded-2xl border border-border bg-white"
            onPress={onCancel}
          >
            <Text className="text-[16px] font-bold text-foreground">
              Cancel
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            className="min-h-[52px] items-center justify-center rounded-2xl border border-border bg-secondary"
            onPress={handleSaveTemplate}
          >
            <Text className="text-[16px] font-bold text-foreground">
              Save to template
            </Text>
          </Pressable>
        </View>

        {status ? (
          <View
            className={`mt-4 rounded-xl border bg-white p-3 ${
              statusKind === "error" ? "border-red-200" : "border-border"
            }`}
          >
            <Text
              className={`text-[14px] ${
                statusKind === "error" ? "text-red-700" : "text-foreground"
              }`}
            >
              {status}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
