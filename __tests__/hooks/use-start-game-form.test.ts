import { act, renderHook } from "@testing-library/react-native";
import { useStartGameForm } from "../../hooks/use-start-game-form";
import {
  PADEL,
  singleChoiceOptions,
  startGameOptions,
} from "../fixtures/sport-data";

type StartGameHook = ReturnType<typeof useStartGameForm>;

async function fillForm(form: StartGameHook, date: string, hour: string) {
  await act(() => form.handleSelectSport("padel"));
  await act(() => form.handleSelectCity("Monforte de Lemos"));
  await act(() => form.handleSelectVenue("Lemos Padel"));
  await act(() => form.setFieldValue("players", "4"));
  await act(() => form.setFieldValue("date", date));
  await act(() => form.setFieldValue("hour", hour));
  await act(() => form.setFieldValue("minute", "30"));
}

describe("useStartGameForm", () => {
  beforeEach(() => {
    // 12:05 in Madrid (CEST), so the minimum slot is 2026-06-10 13:15 Madrid time.
    jest.useFakeTimers().setSystemTime(new Date("2026-06-10T10:05:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderForm(onResetToTop?: () => void) {
    return renderHook(() =>
      useStartGameForm({ data: startGameOptions, onResetToTop }),
    );
  }

  it("is valid when every field is filled with a future slot", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "09");

    expect(result.current.isFormValid).toBe(true);
  });

  it("defaults the duration to 90 minutes", async () => {
    const { result } = await renderForm();

    expect(result.current.values.duration).toBe("90");

    await act(() => result.current.handleSelectDuration("120"));
    expect(result.current.values.duration).toBe("120");
  });

  it("uses the selected city's timezone for the minimum slot", async () => {
    const { result } = await renderForm();

    await act(() => result.current.handleSelectCity("Monforte de Lemos"));

    expect(result.current.timezone).toBe("Europe/Madrid");
    expect(result.current.minimumSlot).toEqual({
      date: "2026-06-10",
      hour: "13",
      minute: "15",
    });
  });

  it("clears an hour that is too soon on the selected date", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-10", "12");

    expect(result.current.values.hour).toBe("");
    expect(result.current.isFormValid).toBe(false);
  });

  it("requires a whole number of at least two players", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "09");

    for (const players of ["0", "1", "2.5"]) {
      await act(() => result.current.setFieldValue("players", players));
      expect(result.current.isFormValid).toBe(false);
    }

    await act(() => result.current.setFieldValue("players", "2"));
    expect(result.current.isFormValid).toBe(true);
  });

  it("clears the venue when the sport or city changes", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "09");
    await act(() => result.current.handleSelectSport("football"));
    expect(result.current.values.venue).toBe("");

    await act(() => result.current.handleSelectVenue("Club Fluvial"));
    await act(() => result.current.handleSelectCity("Lugo"));
    expect(result.current.values.venue).toBe("");
  });

  it("only offers venues for the chosen sport and city", async () => {
    const { result } = await renderForm();

    await act(() => result.current.handleSelectSport("football"));
    await act(() => result.current.handleSelectCity("Monforte de Lemos"));

    expect(result.current.validVenues).toEqual(["Club Fluvial"]);
  });

  it("preselects the sport and city when there is only one of each", async () => {
    const { result } = await renderHook(() =>
      useStartGameForm({ data: singleChoiceOptions }),
    );

    expect(result.current.values.sport).toBe("Padel");
    expect(result.current.values.city).toBe("Monforte de Lemos");
    expect(result.current.validVenues).toEqual(["Lemos Padel"]);
  });

  it("builds the match to insert, with the start time in UTC", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "19");
    await act(() => result.current.setFieldValue("notes", "bring balls"));

    expect(result.current.buildMatchInput("user-1")).toEqual({
      hostUserId: "user-1",
      sportId: PADEL,
      venueId: "venue-lemos",
      startsAt: "2026-06-11T17:30:00.000Z",
      durationMinutes: 90,
      maxPlayers: 4,
      notes: "bring balls",
    });
  });

  it("builds nothing while the form is invalid", async () => {
    const { result } = await renderForm();

    expect(result.current.buildMatchInput("user-1")).toBeNull();
  });

  it("resets everything and calls onResetToTop", async () => {
    const onResetToTop = jest.fn();
    const { result } = await renderForm(onResetToTop);

    await fillForm(result.current, "2026-06-11", "09");
    await act(() => result.current.handleReset());

    expect(result.current.values.sport).toBe("");
    expect(result.current.values.duration).toBe("90");
    expect(result.current.isFormValid).toBe(false);
    expect(onResetToTop).toHaveBeenCalled();
  });
});
