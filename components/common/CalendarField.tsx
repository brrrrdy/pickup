import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

type CalendarFieldProps = {
  label: string;
  selectedDate: string;
  minSelectableDate: string;
  onSelectDate: (value: string) => void;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isBeforeMonth(left: Date, right: Date) {
  return (
    left.getFullYear() < right.getFullYear() ||
    (left.getFullYear() === right.getFullYear() &&
      left.getMonth() < right.getMonth())
  );
}

function buildCalendarDays(monthDate: Date) {
  const firstDayOfMonth = getMonthStart(monthDate);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const calendarStart = new Date(firstDayOfMonth);

  calendarStart.setDate(firstDayOfMonth.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const currentDate = new Date(calendarStart);

    currentDate.setDate(calendarStart.getDate() + index);

    return currentDate;
  });
}

export default function CalendarField({
  label,
  selectedDate,
  minSelectableDate,
  onSelectDate,
}: CalendarFieldProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (selectedDate) {
      return getMonthStart(new Date(`${selectedDate}T00:00:00`));
    }

    return getMonthStart(new Date());
  });

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    setVisibleMonth(getMonthStart(new Date(`${selectedDate}T00:00:00`)));
  }, [selectedDate]);

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const minDate = minSelectableDate;
  const currentMonth = getMonthStart(new Date(`${minDate}T00:00:00`));
  const canShowPreviousMonth = !isBeforeMonth(
    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
    currentMonth,
  );

  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-semibold uppercase tracking-wide text-defaulttext/80">
        {label}
      </Text>

      <View className="rounded-xl border border-border bg-white p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Pressable
            onPress={() =>
              setVisibleMonth(
                (currentMonth) =>
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1,
                  ),
              )
            }
            disabled={!canShowPreviousMonth}
            className={`rounded-lg border border-border px-3 py-2 ${
              canShowPreviousMonth ? "bg-white" : "bg-white/60"
            }`}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canShowPreviousMonth }}
            accessibilityLabel="show previous month"
          >
            <Text className="text-defaulttext">prev</Text>
          </Pressable>

          <Text className="text-base font-semibold text-defaulttext">
            {MONTH_LABELS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          </Text>

          <Pressable
            onPress={() =>
              setVisibleMonth(
                (currentMonth) =>
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1,
                  ),
              )
            }
            className="rounded-lg border border-border px-3 py-2"
            accessibilityRole="button"
            accessibilityLabel="show next month"
          >
            <Text className="text-defaulttext">next</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap">
          {WEEKDAY_LABELS.map((labelText) => (
            <View key={labelText} className="mb-2 w-1/7 items-center">
              <Text className="text-xs font-semibold uppercase text-defaulttext/60">
                {labelText}
              </Text>
            </View>
          ))}

          {calendarDays.map((day) => {
            const dayValue = toLocalDateString(day);
            const isSelected = dayValue === selectedDate;
            const isMinDate = dayValue === minDate;
            const isOutsideMonth = day.getMonth() !== visibleMonth.getMonth();
            const isPastDate = dayValue < minDate;

            return (
              <View key={dayValue} className="mb-2 w-1/7 items-center">
                <Pressable
                  disabled={isPastDate}
                  onPress={() => onSelectDate(dayValue)}
                  className={`h-7 w-7 items-center justify-center rounded-full border border-transparent ${
                    isSelected
                      ? "bg-greenaccent"
                      : isPastDate
                        ? "bg-white/40"
                        : isMinDate
                          ? "border-greenaccent bg-white"
                          : "bg-white"
                  }`}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: isSelected,
                    disabled: isPastDate,
                  }}
                  accessibilityLabel={`select ${dayValue}`}
                >
                  <Text
                    className={`${
                      isPastDate
                        ? "text-defaulttext/25"
                        : isOutsideMonth
                          ? "text-defaulttext/35"
                          : "text-defaulttext"
                    } ${isSelected ? "font-semibold" : ""}`.trim()}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
