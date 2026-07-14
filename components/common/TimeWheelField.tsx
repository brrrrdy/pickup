import { Pressable, ScrollView, Text, View } from "react-native";

type TimeWheelFieldProps = {
  label: string;
  selectedDate: string;
  selectedHour: string;
  selectedMinute: string;
  minimumDate: string;
  minimumHour: string;
  minimumMinute: string;
  onSelectHour: (value: string) => void;
  onSelectMinute: (value: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const MINUTES = ["00", "15", "30", "45"];

function getAvailableHours(
  selectedDate: string,
  minimumDate: string,
  minimumHour: string,
) {
  if (!selectedDate) {
    return HOURS;
  }

  if (selectedDate > minimumDate) {
    return HOURS;
  }

  if (selectedDate < minimumDate) {
    return [];
  }

  return HOURS.filter((hour) => Number(hour) >= Number(minimumHour));
}

function getAvailableMinutes(
  selectedDate: string,
  selectedHour: string,
  minimumDate: string,
  minimumHour: string,
  minimumMinute: string,
) {
  if (!selectedDate || !selectedHour) {
    return MINUTES;
  }

  if (selectedDate > minimumDate) {
    return MINUTES;
  }

  if (selectedDate < minimumDate) {
    return [];
  }

  const selectedHourNumber = Number(selectedHour);
  const minimumHourNumber = Number(minimumHour);

  if (selectedHourNumber > minimumHourNumber) {
    return MINUTES;
  }

  if (selectedHourNumber < minimumHourNumber) {
    return [];
  }

  return MINUTES.filter((minute) => Number(minute) >= Number(minimumMinute));
}

type WheelColumnProps = {
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
};

function WheelColumn({
  title,
  options,
  selectedValue,
  onSelect,
}: WheelColumnProps) {
  return (
    <View className="flex-1 gap-2">
      <Text className="text-sm font-semibold font-sans uppercase tracking-wide text-defaulttext/60">
        {title}
      </Text>

      <ScrollView
        className="h-40 rounded-xl border border-border bg-white"
        showsVerticalScrollIndicator={false}
      >
        {options.map((option) => {
          const isSelected = option === selectedValue;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              className={`px-4 py-3 ${
                isSelected ? "bg-greenaccent" : "bg-white"
              }`}
            >
              <Text
                className={`text-center font-sans ${
                  isSelected
                    ? "font-semibold text-defaulttext"
                    : "text-defaulttext/80"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function TimeWheelField({
  label,
  selectedDate,
  selectedHour,
  selectedMinute,
  minimumDate,
  minimumHour,
  minimumMinute,
  onSelectHour,
  onSelectMinute,
}: TimeWheelFieldProps) {
  const availableHours = getAvailableHours(
    selectedDate,
    minimumDate,
    minimumHour,
  );
  const availableMinutes = getAvailableMinutes(
    selectedDate,
    selectedHour,
    minimumDate,
    minimumHour,
    minimumMinute,
  );

  return (
    <View className="w-full gap-2">
      <Text className="text-base font-semibold font-sans uppercase tracking-wide text-defaulttext/80">
        {label}
      </Text>

      {availableHours.length > 0 ? (
        <View className="flex-row gap-3">
          <WheelColumn
            title="hour"
            options={availableHours}
            selectedValue={selectedHour}
            onSelect={onSelectHour}
          />
          <WheelColumn
            title="minute"
            options={availableMinutes}
            selectedValue={selectedMinute}
            onSelect={onSelectMinute}
          />
        </View>
      ) : (
        <View className="rounded-xl border border-border bg-white px-4 py-3">
          <Text className="text-base font-sans text-defaulttext/70">
            no future time slots are available for the selected date.
          </Text>
        </View>
      )}
    </View>
  );
}
