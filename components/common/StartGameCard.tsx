import { useState } from "react";
import { Text, View } from "react-native";
import { useStartGameForm } from "../../hooks/use-start-game-form";
import { useStartGameOptions } from "../../hooks/use-start-game-options";
import { useAuth } from "../../lib/auth/AuthProvider";
import { createMatch } from "../../lib/start-game/api";
import { DURATION_OPTIONS } from "../../lib/start-game/options";
import type { StartGameOptions } from "../../types/find-game";
import startGameCardContent from "../../content/startgamecard.json";
import ResetButton from "../buttons/ResetButton";
import SaveTemplateButton from "../buttons/SaveTemplateButton";
import StartGameButton from "../buttons/StartGameButton";
import FormField from "./FormField";
import CalendarField from "./CalendarField";
import SportDropdown from "./SportDropdown";
import TimeWheelField from "./TimeWheelField";

const copy = startGameCardContent.en;

type StartGameCardProps = {
  onResetToTop?: () => void;
};

const cardClassName =
  "w-full max-w-4xl rounded-2xl border border-transparent bg-secondary p-5";

export default function StartGameCard({ onResetToTop }: StartGameCardProps) {
  const { data, error } = useStartGameOptions();

  if (error) {
    return (
      <View className={cardClassName}>
        <Text className="text-sm font-sans text-defaulttext">
          {copy.loaderror} {error}
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className={cardClassName}>
        <Text className="text-sm font-sans text-defaulttext/70">
          {copy.loading}
        </Text>
      </View>
    );
  }

  return <StartGameForm data={data} onResetToTop={onResetToTop} />;
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "created"; summary: string }
  | { kind: "error"; message: string };

function StartGameForm({
  data,
  onResetToTop,
}: StartGameCardProps & { data: StartGameOptions }) {
  const { user } = useAuth();
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
  });

  const {
    values,
    setFieldValue,
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
  } = useStartGameForm({ data, onResetToTop });

  const isSaving = submitState.kind === "saving";

  const handleCreate = async () => {
    const input = user ? buildMatchInput(user.id) : null;
    if (!input) {
      return;
    }

    // Captured before the reset clears the form.
    const summary = `${values.venue}, ${formatDate(values.date)} at ${values.hour}:${values.minute}`;

    setSubmitState({ kind: "saving" });
    try {
      await createMatch(input);
      handleReset();
      setSubmitState({ kind: "created", summary });
    } catch (err) {
      setSubmitState({
        kind: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const handleResetPress = () => {
    setSubmitState({ kind: "idle" });
    handleReset();
  };

  return (
    <View className={cardClassName}>
      {submitState.kind === "created" ? (
        <View
          className="mb-4 rounded-xl border border-purpleaccent bg-surface px-4 py-3"
          accessibilityLiveRegion="polite"
        >
          <Text className="text-base font-semibold font-sans text-defaulttext">
            {copy.created}
          </Text>
          <Text className="mt-1 text-sm font-sans text-defaulttext/80">
            {submitState.summary}
          </Text>
        </View>
      ) : null}
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
        <SportDropdown
          label={copy.durationheader}
          options={DURATION_OPTIONS}
          selectedValue={values.duration}
          isOpen={isDurationDropdownOpen}
          onToggle={() => setIsDurationDropdownOpen((prev) => !prev)}
          onSelect={handleSelectDuration}
          placeholder={copy.durationheaderdesc}
          accessibilityLabel="choose a duration in minutes"
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

      {!isFormValid && submitState.kind !== "created" ? (
        <Text className="mt-4 text-sm font-sans text-defaulttext/70">
          {copy.invalidformmessage} {timezone}.
        </Text>
      ) : null}

      <StartGameButton
        label={isSaving ? copy.creating : copy.submitbutton}
        disabled={!isFormValid || isSaving}
        onPress={handleCreate}
      />

      {submitState.kind === "error" ? (
        <Text
          className="mt-3 text-sm font-sans text-defaulttext"
          accessibilityLiveRegion="polite"
        >
          {copy.createerror} {submitState.message}
        </Text>
      ) : null}

      <SaveTemplateButton />
      <ResetButton onPress={handleResetPress} />
    </View>
  );
}
