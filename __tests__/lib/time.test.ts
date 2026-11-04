import {
  getMinimumTimeSlot,
  getValidTimeOptions,
  zonedWallTimeToUtcIso,
} from "../../lib/start-game/time";

describe("getMinimumTimeSlot", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("is one hour from now, rounded up to the next quarter hour", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-10T10:05:00Z"));

    expect(getMinimumTimeSlot("UTC")).toEqual({
      date: "2026-06-10",
      hour: "11",
      minute: "15",
    });
  });

  it("keeps an exact quarter hour as-is", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-10T10:30:00Z"));

    expect(getMinimumTimeSlot("UTC")).toEqual({
      date: "2026-06-10",
      hour: "11",
      minute: "30",
    });
  });

  it("uses the given timezone", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-10T10:05:00Z"));

    // Madrid is UTC+2 in summer
    expect(getMinimumTimeSlot("Europe/Madrid")).toEqual({
      date: "2026-06-10",
      hour: "13",
      minute: "15",
    });
  });

  it("rolls over to the next hour when rounding reaches 60", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-10T10:50:00Z"));

    expect(getMinimumTimeSlot("UTC")).toEqual({
      date: "2026-06-10",
      hour: "12",
      minute: "00",
    });
  });

  it("rolls over to the next day after 23:45", () => {
    jest.useFakeTimers().setSystemTime(new Date("2026-06-30T22:50:00Z"));

    expect(getMinimumTimeSlot("UTC")).toEqual({
      date: "2026-07-01",
      hour: "00",
      minute: "00",
    });
  });
});

describe("getValidTimeOptions", () => {
  const minimumSlot = { date: "2026-06-10", hour: "13", minute: "15" };

  it("offers every slot when no date is selected", () => {
    const options = getValidTimeOptions("", minimumSlot);

    expect(options.hours).toHaveLength(24);
    expect(options.minutesByHour.get("00")).toEqual(["00", "15", "30", "45"]);
  });

  it("offers every slot on a later date", () => {
    const options = getValidTimeOptions("2026-06-11", minimumSlot);

    expect(options.hours).toHaveLength(24);
    expect(options.minutesByHour.get("00")).toEqual(["00", "15", "30", "45"]);
  });

  it("offers nothing on an earlier date", () => {
    const options = getValidTimeOptions("2026-06-09", minimumSlot);

    expect(options.hours).toEqual([]);
    expect(options.minutesByHour.size).toBe(0);
  });

  it("only offers slots from the minimum onwards on the same date", () => {
    const options = getValidTimeOptions("2026-06-10", minimumSlot);

    expect(options.hours[0]).toBe("13");
    expect(options.hours.at(-1)).toBe("23");
    expect(options.minutesByHour.get("13")).toEqual(["15", "30", "45"]);
    expect(options.minutesByHour.get("14")).toEqual(["00", "15", "30", "45"]);
  });
});

describe("zonedWallTimeToUtcIso", () => {
  it("converts Madrid winter time (CET, UTC+1)", () => {
    expect(
      zonedWallTimeToUtcIso("2026-11-05", "19", "00", "Europe/Madrid"),
    ).toBe("2026-11-05T18:00:00.000Z");
  });

  it("converts Madrid summer time (CEST, UTC+2)", () => {
    expect(
      zonedWallTimeToUtcIso("2026-06-11", "19", "30", "Europe/Madrid"),
    ).toBe("2026-06-11T17:30:00.000Z");
  });

  it("handles the days either side of the October clock change", () => {
    // Clocks go back at 03:00 on 2026-10-25.
    expect(
      zonedWallTimeToUtcIso("2026-10-24", "10", "00", "Europe/Madrid"),
    ).toBe("2026-10-24T08:00:00.000Z");
    expect(
      zonedWallTimeToUtcIso("2026-10-25", "10", "00", "Europe/Madrid"),
    ).toBe("2026-10-25T09:00:00.000Z");
  });

  it("handles midnight and UTC", () => {
    expect(
      zonedWallTimeToUtcIso("2026-01-01", "00", "15", "Europe/Madrid"),
    ).toBe("2025-12-31T23:15:00.000Z");
    expect(zonedWallTimeToUtcIso("2026-01-01", "00", "15", "UTC")).toBe(
      "2026-01-01T00:15:00.000Z",
    );
  });
});
