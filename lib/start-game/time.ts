export type TimeSlot = {
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

export function getMinimumTimeSlot(timeZone: string): TimeSlot {
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

export function getValidTimeOptions(
  selectedDate: string,
  minimumSlot: TimeSlot,
) {
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
