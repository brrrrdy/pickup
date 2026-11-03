import { act, renderHook } from "@testing-library/react-native";
import useFindGame from "../../hooks/use-find-game";

// useFindGame reads mockdata/find-sport-data.json directly, so these tests
// use cities from that file (London has several venues and open games).

describe("useFindGame", () => {
  it("suggests cities after more than two characters", async () => {
    const { result } = await renderHook(() => useFindGame());

    await act(() => result.current.setLocationInput("lo"));
    expect(result.current.locationSuggestions).toEqual([]);

    await act(() => result.current.setLocationInput("lon"));
    expect(result.current.locationSuggestions).toContain("London");
  });

  it("commits a typed prefix to the matching city", async () => {
    const { result } = await renderHook(() => useFindGame());

    await act(() => result.current.setLocationInput("lond"));
    await act(() => result.current.commitLocation());

    expect(result.current.location).toBe("London");
    expect(result.current.locationInput).toBe("London");
    expect(result.current.hasLocation).toBe(true);
    expect(result.current.availableSports.length).toBeGreaterThan(0);
  });

  it("clears the search when the input doesn't match a city", async () => {
    const { result } = await renderHook(() => useFindGame());

    await act(() => result.current.setLocationInput("zzzz"));
    await act(() => result.current.commitLocation());

    expect(result.current.hasLocation).toBe(false);
    expect(result.current.availableSports).toEqual([]);
  });

  it("shows open games only for the selected sport", async () => {
    const { result } = await renderHook(() => useFindGame());

    await act(() => result.current.selectLocationSuggestion("London"));

    const [sport] = result.current.availableSports;
    await act(() => result.current.toggleSport(sport.id));
    await act(() => result.current.handleShowGames());

    expect(result.current.showGames).toBe(true);
    expect(result.current.openMatches).toHaveLength(sport.availableGames);
    expect(
      result.current.openMatches.every(
        (match) => match.sportName === sport.name,
      ),
    ).toBe(true);
  });

  it("hides results again when the sport selection changes", async () => {
    const { result } = await renderHook(() => useFindGame());

    await act(() => result.current.selectLocationSuggestion("London"));
    const [sport] = result.current.availableSports;
    await act(() => result.current.toggleSport(sport.id));
    await act(() => result.current.handleShowGames());
    await act(() => result.current.toggleSport(sport.id));

    expect(result.current.showGames).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it("clears the active search when the user edits the location", async () => {
    const { result } = await renderHook(() => useFindGame());

    await act(() => result.current.selectLocationSuggestion("London"));
    await act(() => result.current.setLocationInput("Londo"));

    expect(result.current.hasLocation).toBe(false);
  });
});
