import { Text, View } from "react-native";
import { useStartGameForm } from "../../app/hooks/use-start-game-form";
import type { FindSportMockData } from "../../types/find-game";
import startGameCardContent from "../../content/startgamecard.json";
import profile from "../../mockdata/profile.json";
import mockFindSportData from "../../mockdata/find-sport-data.json";
import ResetButton from "../buttons/ResetButton";
import SaveTemplateButton from "../buttons/SaveTemplateButton";
import StartGameButton from "../buttons/StartGameButton";
import FormField from "./FormField";
import CalendarField from "./CalendarField";
import SportDropdown from "./SportDropdown";
import TimeWheelField from "./TimeWheelField";

type StartGameCardProps = {
  onResetToTop?: () => void;
};

export default function StartGameCard({ onResetToTop }: StartGameCardProps) {
  const copy = startGameCardContent.en;
  const findSportData = mockFindSportData as FindSportMockData;

  const currentTimezone = profile.currentTimezone;

  const {
    values,
    setFieldValue,
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
  } = useStartGameForm({
    data: findSportData,
    currentTimezone,
    onResetToTop,
  });

  return (
    <View className="w-full max-w-4xl rounded-2xl border border-transparent bg-secondary p-5">
      <View className="gap-4">
        <SportDropdown
          label={copy.sportheader}
          options={validSports}
          selectedValue={values.sport}
          isOpen={isSportDropdownOpen}
          onToggle={() => setIsSportDropdownOpen((prev) => !prev)}
          onSelect={handleSelectSport}
          placeholder={copy.sportheaderdesc}
          accessibilityLabel="choose a sport"
        />
        <SportDropdown
          label={copy.cityheader}
          options={validCities}
          selectedValue={values.city}
          isOpen={isCityDropdownOpen}
          onToggle={() => setIsCityDropdownOpen((prev) => !prev)}
          onSelect={handleSelectCity}
          placeholder={copy.cityheaderdesc}
          accessibilityLabel="choose a city"
        />
        <SportDropdown
          label={copy.venueheader}
          options={validVenues}
          selectedValue={values.venue}
          isOpen={isVenueDropdownOpen}
          onToggle={() => setIsVenueDropdownOpen((prev) => !prev)}
          onSelect={handleSelectVenue}
          placeholder={
            !values.sport
              ? copy.venueheaderneedsport
              : !values.city
                ? copy.venueheaderneedscity
                : validVenues.length > 0
                  ? copy.venueheaderdesc
                  : copy.venueheadernoslots
          }
          accessibilityLabel="choose a venue"
          disabled={!values.sport || !values.city || validVenues.length === 0}
        />
        <FormField
          label={copy.numplayersheader}
          placeholder={copy.numplayersheaderdesc}
          value={values.players}
          onChangeText={(value) => setFieldValue("players", value)}
          keyboardType="number-pad"
          inputClassName="text-sm"
        />
        <CalendarField
          label={copy.dateheader}
          selectedDate={values.date}
          minSelectableDate={minimumSlot.date}
          onSelectDate={(value) => setFieldValue("date", value)}
        />
        <TimeWheelField
          label={copy.timeheader}
          selectedDate={values.date}
          selectedHour={values.hour}
          selectedMinute={values.minute}
          minimumDate={minimumSlot.date}
          minimumHour={minimumSlot.hour}
          minimumMinute={minimumSlot.minute}
          onSelectHour={(value) => setFieldValue("hour", value)}
          onSelectMinute={(value) => setFieldValue("minute", value)}
        />
        <FormField
          label={copy.notesheader}
          placeholder={copy.notesheaderdesc}
          value={values.notes}
          onChangeText={(value) => setFieldValue("notes", value)}
          multiline
        />
      </View>

      {!isFormValid ? (
        <Text className="mt-4 text-sm font-sans text-defaulttext/70">
          {copy.invalidformmessage} {currentTimezone}.
        </Text>
      ) : null}

      <StartGameButton label={copy.submitbutton} disabled={!isFormValid} />
      <SaveTemplateButton />
      <ResetButton onPress={handleReset} />
    </View>
  );
}
