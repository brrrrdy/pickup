import { act, renderHook } from "@testing-library/react-native";
import { useStartGameForm } from "../../hooks/use-start-game-form";
import { sportData } from "../fixtures/sport-data";

type StartGameHook = ReturnType<typeof useStartGameForm>;

async function fillForm(form: StartGameHook, date: string, hour: string) {
  await act(() => form.handleSelectSport("football"));
  await act(() => form.handleSelectCity("London"));
  await act(() => form.handleSelectVenue("Clapham Common"));
  await act(() => form.setFieldValue("players", "10"));
  await act(() => form.setFieldValue("date", date));
  await act(() => form.setFieldValue("hour", hour));
  await act(() => form.setFieldValue("minute", "30"));
}

describe("useStartGameForm", () => {
  beforeEach(() => {
    // minimum slot is therefore 2026-06-10 11:15 UTC
    jest.useFakeTimers().setSystemTime(new Date("2026-06-10T10:05:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderForm() {
    return renderHook(() =>
      useStartGameForm({ data: sportData, currentTimezone: "UTC" }),
    );
  }

  it("is valid when every field is filled with a future slot", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "09");

    expect(result.current.isFormValid).toBe(true);
  });

  it("clears an hour that is too soon on the selected date", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-10", "10");

    expect(result.current.values.hour).toBe("");
    expect(result.current.isFormValid).toBe(false);
  });

  it("requires a positive whole number of players", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "09");
    await act(() => result.current.setFieldValue("players", "0"));
    expect(result.current.isFormValid).toBe(false);

    await act(() => result.current.setFieldValue("players", "2.5"));
    expect(result.current.isFormValid).toBe(false);
  });

  it("clears the venue when the sport or city changes", async () => {
    const { result } = await renderForm();

    await fillForm(result.current, "2026-06-11", "09");
    await act(() => result.current.handleSelectSport("padel"));
    expect(result.current.values.venue).toBe("");

    await act(() => result.current.handleSelectVenue("Padel Club"));
    await act(() => result.current.handleSelectCity("Bristol"));
    expect(result.current.values.venue).toBe("");
  });

  it("only offers venues for the chosen sport and city", async () => {
    const { result } = await renderForm();

    await act(() => result.current.handleSelectSport("padel"));
    await act(() => result.current.handleSelectCity("London"));

    expect(result.current.validVenues).toEqual(["Padel Club"]);
  });

  it("resets everything and calls onResetToTop", async () => {
    const onResetToTop = jest.fn();
    const { result } = await renderHook(() =>
      useStartGameForm({
        data: sportData,
        currentTimezone: "UTC",
        onResetToTop,
      }),
    );

    await fillForm(result.current, "2026-06-11", "09");
    await act(() => result.current.handleReset());

    expect(result.current.values.sport).toBe("");
    expect(result.current.isFormValid).toBe(false);
    expect(onResetToTop).toHaveBeenCalled();
  });
});
