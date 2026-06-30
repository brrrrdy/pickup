import { Pressable, ScrollView, Text, View } from "react-native";

type TimeWheelFieldProps = {
  label: string;
  selectedDate: string;
  selectedHour: string;
  selectedMinute: string;
  onSelectHour: (value: string) => void;
  onSelectMinute: (value: string) => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const MINUTES = ["00", "15", "30", "45"];

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNextQuarterTime() {
  const next = new Date();

  next.setSeconds(0, 0);

  const remainder = next.getMinutes() % 15;

  if (remainder !== 0) {
    next.setMinutes(next.getMinutes() + (15 - remainder));
  }

  return next;
}

function getAvailableHours(selectedDate: string) {
  if (!selectedDate) {
    return HOURS;
  }

  const today = toLocalDateString(new Date());

  if (selectedDate !== today) {
    return HOURS;
  }

  const nextQuarterTime = getNextQuarterTime();

  if (toLocalDateString(nextQuarterTime) !== today) {
    return [];
  }

  return HOURS.filter((hour) => Number(hour) >= nextQuarterTime.getHours());
}

function getAvailableMinutes(selectedDate: string, selectedHour: string) {
  if (!selectedDate || !selectedHour) {
    return MINUTES;
  }

  const today = toLocalDateString(new Date());

  if (selectedDate !== today) {
    return MINUTES;
  }

  const nextQuarterTime = getNextQuarterTime();
  const selectedHourNumber = Number(selectedHour);

  if (selectedHourNumber > nextQuarterTime.getHours()) {
    return MINUTES;
  }

  if (selectedHourNumber < nextQuarterTime.getHours()) {
    return [];
  }

  return MINUTES.filter(
    (minute) => Number(minute) >= nextQuarterTime.getMinutes(),
  );
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
      <Text className="text-xs font-semibold uppercase tracking-wide text-defaulttext/60">
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
                className={`text-center ${
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
  onSelectHour,
  onSelectMinute,
}: TimeWheelFieldProps) {
  const availableHours = getAvailableHours(selectedDate);
  const availableMinutes = getAvailableMinutes(selectedDate, selectedHour);

  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-defaulttext/80">
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
          <Text className="text-sm text-defaulttext/70">
            no future time slots are available for the selected date.
          </Text>
        </View>
      )}
    </View>
  );
}
