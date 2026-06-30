import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import profile from "../../mockdata/profile.json";
import mockFindSportData from "../../mockdata/find-sport-data.json";
import StartGameButton from "../buttons/StartGameButton";
import CalendarField from "./CalendarField";
import SportDropdown from "./SportDropdown";
import TimeWheelField from "./TimeWheelField";

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "number-pad";
};

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = "default",
}: FieldProps) {
  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-defaulttext/80">
        {label}
      </Text>
      <TextInput
        className={`w-full rounded-xl border border-border bg-white px-4 py-3 text-defaulttext ${
          multiline ? "min-h-28" : ""
        }`.trim()}
        placeholder={placeholder}
        placeholderTextColor="#35513f"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

type TimeSlot = {
  date: string;
  hour: string;
  minute: string;
};

function addOneDay(dateString: string) {
  const date = new Date(`${dateString}T00:00:00Z`);

  date.setUTCDate(date.getUTCDate() + 1);

  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}

function getZonedDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const partValue = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    year: partValue("year"),
    month: partValue("month"),
    day: partValue("day"),
    hour: partValue("hour"),
    minute: partValue("minute"),
  };
}

function getMinimumTimeSlot(timeZone: string): TimeSlot {
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  const parts = getZonedDateParts(oneHourFromNow, timeZone);

  const date = `${parts.year}-${parts.month}-${parts.day}`;
  let hour = Number(parts.hour);
  let minute = Number(parts.minute);
  let finalDate = date;

  const roundedMinute = Math.ceil(minute / 15) * 15;

  if (roundedMinute === 60) {
    minute = 0;
    hour += 1;

    if (hour === 24) {
      hour = 0;
      finalDate = addOneDay(finalDate);
    }
  } else {
    minute = roundedMinute;
  }

  return {
    date: finalDate,
    hour: String(hour).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
  };
}

function getValidTimeOptions(selectedDate: string, minimumSlot: TimeSlot) {
  const allHours = Array.from({ length: 24 }, (_, index) =>
    String(index).padStart(2, "0"),
  );
  const allMinutes = ["00", "15", "30", "45"];

  if (!selectedDate) {
    return {
      hours: allHours,
      minutesByHour: new Map(allHours.map((hour) => [hour, allMinutes])),
    };
  }

  if (selectedDate > minimumSlot.date) {
    return {
      hours: allHours,
      minutesByHour: new Map(allHours.map((hour) => [hour, allMinutes])),
    };
  }

  if (selectedDate < minimumSlot.date) {
    return {
      hours: [],
      minutesByHour: new Map<string, string[]>(),
    };
  }

  const minimumHour = Number(minimumSlot.hour);
  const minimumMinute = Number(minimumSlot.minute);
  const hours = allHours.filter((hour) => Number(hour) >= minimumHour);
  const minutesByHour = new Map(
    hours.map((hour) => [
      hour,
      Number(hour) === minimumHour
        ? allMinutes.filter((minute) => Number(minute) >= minimumMinute)
        : allMinutes,
    ]),
  );

  return { hours, minutesByHour };
}

export default function StartGameCard() {
  const [sport, setSport] = useState("");
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");
  const [players, setPlayers] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [notes, setNotes] = useState("");
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);

  const currentTimezone = profile.currentTimezone;
  const minimumSlot = getMinimumTimeSlot(currentTimezone);

  const validSports = (mockFindSportData.sports ?? [])
    .map((sportRow) => sportRow.sportname?.trim() ?? "")
    .filter((sportName) => sportName.length > 0);

  const sportIdByName = new Map(
    (mockFindSportData.sports ?? [])
      .filter((sportRow) => sportRow.sportname)
      .map((sportRow) => [sportRow.sportname?.trim() ?? "", sportRow.id]),
  );

  const validCities = Array.from(
    new Set(
      (mockFindSportData.venues ?? [])
        .map((venueRow) => venueRow.city.trim())
        .filter((cityName) => cityName.length > 0),
    ),
  );

  const selectedSportId = sportIdByName.get(sport) ?? "";

  const venueSportIdsByVenueId = new Map(
    (mockFindSportData.venues ?? []).map((venueRow) => [
      venueRow.id,
      (venueRow.sport_ids ?? []).filter((sportId) => sportId.length > 0),
    ]),
  );

  const venueIdsForSelectedSport = new Set(
    (mockFindSportData.venues ?? [])
      .filter((venueRow) => {
        const configuredSportIds =
          venueSportIdsByVenueId.get(venueRow.id) ?? [];

        if (configuredSportIds.length > 0) {
          return configuredSportIds.includes(selectedSportId);
        }

        return (mockFindSportData.matches ?? []).some(
          (matchRow) =>
            matchRow.venue_id === venueRow.id &&
            matchRow.sport_id === selectedSportId,
        );
      })
      .map((venueRow) => venueRow.id),
  );

  const validVenues = (mockFindSportData.venues ?? [])
    .filter(
      (venueRow) =>
        venueRow.city === city && venueIdsForSelectedSport.has(venueRow.id),
    )
    .map((venueRow) => venueRow.venuename?.trim() ?? "")
    .filter((venueName) => venueName.length > 0);

  const validTimeOptions = getValidTimeOptions(date, minimumSlot);
  const availableMinutesForHour = hour
    ? (validTimeOptions.minutesByHour.get(hour) ?? [])
    : [];

  useEffect(() => {
    if (!date) {
      return;
    }

    if (!validTimeOptions.hours.includes(hour)) {
      setHour("");
      setMinute("");
      return;
    }

    if (!availableMinutesForHour.includes(minute)) {
      setMinute("");
    }
  }, [availableMinutesForHour, date, hour, minute, validTimeOptions.hours]);

  const hasValidPlayers =
    Number.isInteger(Number(players)) && Number(players) > 0;
  const hasDate = date.length > 0;
  const hasTime = hour.length > 0 && minute.length > 0;
  const selectedSlot = hasDate && hasTime ? `${date}T${hour}:${minute}` : "";
  const minimumSlotString = `${minimumSlot.date}T${minimumSlot.hour}:${minimumSlot.minute}`;
  const isAtLeastOneHourInFuture =
    hasDate && hasTime ? selectedSlot >= minimumSlotString : false;
  const isFormValid =
    sport.length > 0 &&
    city.length > 0 &&
    venue.length > 0 &&
    hasValidPlayers &&
    hasDate &&
    hasTime &&
    isAtLeastOneHourInFuture;

  const handleSelectSport = (selectedSport: string) => {
    setSport(selectedSport);
    setVenue("");
    setIsSportDropdownOpen(false);
    setIsVenueDropdownOpen(false);
  };

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setVenue("");
    setIsCityDropdownOpen(false);
    setIsVenueDropdownOpen(false);
  };

  const handleSelectVenue = (selectedVenue: string) => {
    setVenue(selectedVenue);
    setIsVenueDropdownOpen(false);
  };

  return (
    <View className="w-full max-w-xl rounded-2xl border border-border bg-secondary p-5">
      <Text className="text-xl font-semibold text-defaulttext">
        start a game
      </Text>
      <Text className="mt-2 text-sm text-defaulttext/80">
        Add the basics for your game and share the details with nearby players.
      </Text>

      <View className="mt-5 gap-4">
        <SportDropdown
          label="sport"
          options={validSports}
          selectedValue={sport}
          isOpen={isSportDropdownOpen}
          onToggle={() => setIsSportDropdownOpen((prev) => !prev)}
          onSelect={handleSelectSport}
          placeholder="select a sport"
          accessibilityLabel="choose a sport"
        />
        <SportDropdown
          label="city"
          options={validCities}
          selectedValue={city}
          isOpen={isCityDropdownOpen}
          onToggle={() => setIsCityDropdownOpen((prev) => !prev)}
          onSelect={handleSelectCity}
          placeholder="select a city"
          accessibilityLabel="choose a city"
        />
        <SportDropdown
          label="venue"
          options={validVenues}
          selectedValue={venue}
          isOpen={isVenueDropdownOpen}
          onToggle={() => setIsVenueDropdownOpen((prev) => !prev)}
          onSelect={handleSelectVenue}
          placeholder={
            !sport
              ? "select a sport first"
              : !city
                ? "select a city first"
                : validVenues.length > 0
                  ? "select a venue"
                  : "no venues for this sport in this city"
          }
          accessibilityLabel="choose a venue"
          disabled={!sport || !city || validVenues.length === 0}
        />
        <Field
          label="players"
          placeholder="e.g. 10"
          value={players}
          onChangeText={setPlayers}
          keyboardType="number-pad"
        />
        <CalendarField
          label="date"
          selectedDate={date}
          minSelectableDate={minimumSlot.date}
          onSelectDate={setDate}
        />
        <TimeWheelField
          label="time"
          selectedDate={date}
          selectedHour={hour}
          selectedMinute={minute}
          minimumDate={minimumSlot.date}
          minimumHour={minimumSlot.hour}
          minimumMinute={minimumSlot.minute}
          onSelectHour={setHour}
          onSelectMinute={setMinute}
        />
        <Field
          label="notes"
          placeholder="Add anything players should know"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {!isFormValid ? (
        <Text className="mt-4 text-sm text-defaulttext/70">
          Select a sport, city, venue, players, date, and time at least one hour
          ahead in {currentTimezone}.
        </Text>
      ) : null}

      <StartGameButton label="create game" disabled={!isFormValid} />
    </View>
  );
}
