import { useEffect, useMemo, useState } from "react";
import type { CreateMatchInput } from "../lib/start-game/api";
import {
  DEFAULT_DURATION,
  DEFAULT_TIMEZONE,
  findCity,
  findSport,
  getCityNames,
  getSportNames,
  getVenuesFor,
} from "../lib/start-game/options";
import {
  getMinimumTimeSlot,
  getValidTimeOptions,
  zonedWallTimeToUtcIso,
} from "../lib/start-game/time";
import type { StartGameOptions } from "../types/find-game";
import { useForm } from "./use-form";

type StartGameFormValues = {
  sport: string;
  city: string;
  venue: string;
  players: string;
  duration: string;
  date: string;
  hour: string;
  minute: string;
  notes: string;
};

type UseStartGameFormParams = {
  data: StartGameOptions;
  onResetToTop?: () => void;
};

// With only one sport or city on offer, there is nothing to choose.
function onlyOption(names: string[]) {
  return names.length === 1 ? names[0] : "";
}

export function useStartGameForm({
  data,
  onResetToTop,
}: UseStartGameFormParams) {
  const validSports = useMemo(() => getSportNames(data), [data]);
  const validCities = useMemo(() => getCityNames(data), [data]);

  const formState = useForm<StartGameFormValues>({
    sport: onlyOption(validSports),
    city: onlyOption(validCities),
    venue: "",
    players: "",
    duration: DEFAULT_DURATION,
    date: "",
    hour: "",
    minute: "",
    notes: "",
  });

  const { values, setFieldValue } = formState;
  const { sport, city, venue, players, duration, date, hour, minute } = values;

  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);

  const selectedSport = useMemo(() => findSport(data, sport), [data, sport]);
  const selectedCity = useMemo(() => findCity(data, city), [data, city]);
  const timezone = selectedCity?.timezone ?? DEFAULT_TIMEZONE;

  const venueOptions = useMemo(
    () => getVenuesFor(data, selectedCity?.id, selectedSport?.id),
    [data, selectedCity, selectedSport],
  );
  const validVenues = useMemo(
    () => venueOptions.map((option) => option.name),
    [venueOptions],
  );
  const selectedVenue = venueOptions.find((option) => option.name === venue);

  const minimumSlot = useMemo(() => getMinimumTimeSlot(timezone), [timezone]);

  const validTimeOptions = useMemo(
    () => getValidTimeOptions(date, minimumSlot),
    [date, minimumSlot],
  );

  const availableMinutesForHour = useMemo(
    () => (hour ? (validTimeOptions.minutesByHour.get(hour) ?? []) : []),
    [hour, validTimeOptions.minutesByHour],
  );

  useEffect(() => {
    if (!date) {
      return;
    }

    if (!validTimeOptions.hours.includes(hour)) {
      setFieldValue("hour", "");
      setFieldValue("minute", "");
      return;
    }

    if (!availableMinutesForHour.includes(minute)) {
      setFieldValue("minute", "");
    }
  }, [
    availableMinutesForHour,
    date,
    hour,
    minute,
    setFieldValue,
    validTimeOptions.hours,
  ]);

  // The database requires at least two players.
  const hasValidPlayers =
    Number.isInteger(Number(players)) && Number(players) >= 2;
  const hasValidDuration =
    Number.isInteger(Number(duration)) && Number(duration) > 0;
  const hasDate = date.length > 0;
  const hasTime = hour.length > 0 && minute.length > 0;
  const selectedSlot = hasDate && hasTime ? `${date}T${hour}:${minute}` : "";
  const minimumSlotString = `${minimumSlot.date}T${minimumSlot.hour}:${minimumSlot.minute}`;
  const isAtLeastOneHourInFuture =
    hasDate && hasTime ? selectedSlot >= minimumSlotString : false;

  const isFormValid =
    Boolean(selectedSport) &&
    Boolean(selectedCity) &&
    Boolean(selectedVenue) &&
    hasValidPlayers &&
    hasValidDuration &&
    hasDate &&
    hasTime &&
    isAtLeastOneHourInFuture;

  const buildMatchInput = (hostUserId: string): CreateMatchInput | null => {
    if (!isFormValid || !selectedSport || !selectedVenue) {
      return null;
    }

    return {
      hostUserId,
      sportId: selectedSport.id,
      venueId: selectedVenue.id,
      startsAt: zonedWallTimeToUtcIso(date, hour, minute, timezone),
      durationMinutes: Number(duration),
      maxPlayers: Number(players),
      notes: values.notes,
    };
  };

  const closeDropdowns = () => {
    setIsSportDropdownOpen(false);
    setIsCityDropdownOpen(false);
    setIsVenueDropdownOpen(false);
    setIsDurationDropdownOpen(false);
  };

  const handleSelectSport = (selected: string) => {
    setFieldValue("sport", selected);
    setFieldValue("venue", "");
    closeDropdowns();
  };

  const handleSelectCity = (selected: string) => {
    setFieldValue("city", selected);
    setFieldValue("venue", "");
    closeDropdowns();
  };

  const handleSelectVenue = (selected: string) => {
    setFieldValue("venue", selected);
    closeDropdowns();
  };

  const handleSelectDuration = (selected: string) => {
    setFieldValue("duration", selected);
    closeDropdowns();
  };

  const handleReset = () => {
    formState.resetForm();
    closeDropdowns();
    onResetToTop?.();
  };

  return {
    values,
    setFieldValue,
    resetForm: formState.resetForm,
    isSportDropdownOpen,
    isCityDropdownOpen,
    isVenueDropdownOpen,
    isDurationDropdownOpen,
    validSports,
    validCities,
    validVenues,
    timezone,
    minimumSlot,
    isFormValid,
    buildMatchInput,
    setIsSportDropdownOpen,
    setIsCityDropdownOpen,
    setIsVenueDropdownOpen,
    setIsDurationDropdownOpen,
    handleSelectSport,
    handleSelectCity,
    handleSelectVenue,
    handleSelectDuration,
    handleReset,
  };
}
