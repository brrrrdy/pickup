import { useEffect, useMemo, useState } from "react";
import type { FindSportMockData } from "../../types/find-game";
import {
  getSportIdByName,
  getValidCities,
  getValidSports,
  getValidVenues,
} from "../../lib/start-game/options";
import {
  getMinimumTimeSlot,
  getValidTimeOptions,
} from "../../lib/start-game/time";
import { useForm } from "./use-form";

type StartGameFormValues = {
  sport: string;
  city: string;
  venue: string;
  players: string;
  date: string;
  hour: string;
  minute: string;
  notes: string;
};

type UseStartGameFormParams = {
  data: FindSportMockData;
  currentTimezone: string;
  onResetToTop?: () => void;
};

export function useStartGameForm({
  data,
  currentTimezone,
  onResetToTop,
}: UseStartGameFormParams) {
  const formState = useForm<StartGameFormValues>({
    sport: "",
    city: "",
    venue: "",
    players: "",
    date: "",
    hour: "",
    minute: "",
    notes: "",
  });

  const { values, setFieldValue } = formState;

  const sport = values.sport;
  const city = values.city;
  const venue = values.venue;
  const players = values.players;
  const date = values.date;
  const hour = values.hour;
  const minute = values.minute;

  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);

  const minimumSlot = useMemo(
    () => getMinimumTimeSlot(currentTimezone),
    [currentTimezone],
  );

  const validSports = useMemo(() => getValidSports(data), [data]);
  const validCities = useMemo(() => getValidCities(data), [data]);

  const selectedSportId = useMemo(
    () => getSportIdByName(data, sport),
    [data, sport],
  );

  const validVenues = useMemo(
    () => getValidVenues(data, city, selectedSportId),
    [city, data, selectedSportId],
  );

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
    setFieldValue("sport", selectedSport);
    setFieldValue("venue", "");
    setIsSportDropdownOpen(false);
    setIsVenueDropdownOpen(false);
  };

  const handleSelectCity = (selectedCity: string) => {
    setFieldValue("city", selectedCity);
    setFieldValue("venue", "");
    setIsCityDropdownOpen(false);
    setIsVenueDropdownOpen(false);
  };

  const handleSelectVenue = (selectedVenue: string) => {
    setFieldValue("venue", selectedVenue);
    setIsVenueDropdownOpen(false);
  };

  const handleReset = () => {
    formState.resetForm();
    setIsSportDropdownOpen(false);
    setIsCityDropdownOpen(false);
    setIsVenueDropdownOpen(false);
    onResetToTop?.();
  };

  return {
    values,
    setFieldValue,
    resetForm: formState.resetForm,
    isSportDropdownOpen,
    isCityDropdownOpen,
    isVenueDropdownOpen,
    validSports,
    validCities,
    validVenues,
    minimumSlot,
    isFormValid,
    setIsSportDropdownOpen,
    setIsCityDropdownOpen,
    setIsVenueDropdownOpen,
    handleSelectSport,
    handleSelectCity,
    handleSelectVenue,
    handleReset,
  };
}
