import { Calendar } from "react-native-calendars";

// Defined at module level so Fast Refresh detects changes to this object and
// remounts <Calendar> (which only reads theme on initial mount).
const CALENDAR_THEME = {
  backgroundColor: "#ffffff",
  calendarBackground: "#e7ce8b",
  textSectionTitleColor: "#6e8676",
  selectedDayBackgroundColor: "#1a1a1a",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#1a1a1a",
  todayBackgroundColor: "#f3f4f6",
  dayTextColor: "#1a1a1a",
  textDisabledColor: "#c0c0c0",
  arrowColor: "#1a1a1a",
  monthTextColor: "#1a1a1a",
  textDayFontSize: 14,
  textMonthFontSize: 14,
  textDayHeaderFontSize: 12,
  textDayFontWeight: "400" as const,
  textMonthFontWeight: "600" as const,
  textDayHeaderFontWeight: "600" as const,
};

type DatePickerProps = {
  /** YYYY-MM-DD string */
  value: string;
  onChange: (dateValue: string) => void;
  minDate?: Date;
};

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function DatePicker({ value, onChange, minDate }: DatePickerProps) {
  const minDateString = toDateString(minDate ?? new Date());

  return (
    <Calendar
      key={JSON.stringify(CALENDAR_THEME)}
      current={value}
      minDate={minDateString}
      onDayPress={(day) => onChange(day.dateString)}
      markedDates={{
        [value]: { selected: true, disableTouchEvent: true },
      }}
      hideExtraDays
      enableSwipeMonths
      theme={CALENDAR_THEME}
    />
  );
}
