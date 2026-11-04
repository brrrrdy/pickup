import { act, renderHook } from "@testing-library/react-native";
import useFindGame from "../../hooks/use-find-game";
import { cities, upcomingMatches } from "../fixtures/matches";

function renderFindGame(cityNames = cities) {
  return renderHook(() =>
    useFindGame({ cities: cityNames, matches: upcomingMatches }),
  );
}

describe("useFindGame", () => {
  it("suggests cities after more than two characters", async () => {
    const { result } = await renderFindGame();

    await act(() => result.current.setLocationInput("mo"));
    expect(result.current.locationSuggestions).toEqual([]);

    await act(() => result.current.setLocationInput("mon"));
    expect(result.current.locationSuggestions).toEqual(["Monforte de Lemos"]);
  });

  it("commits a typed prefix to the matching city", async () => {
    const { result } = await renderFindGame();

    await act(() => result.current.setLocationInput("monf"));
    await act(() => result.current.commitLocation());

    expect(result.current.location).toBe("Monforte de Lemos");
    expect(result.current.locationInput).toBe("Monforte de Lemos");
    expect(result.current.availableSports).toEqual([
      { id: "sport-football", name: "Football", availableGames: 1 },
      { id: "sport-padel", name: "Padel", availableGames: 2 },
    ]);
  });

  it("starts with the city committed when there is only one", async () => {
    const { result } = await renderFindGame(["Monforte de Lemos"]);

    expect(result.current.hasLocation).toBe(true);
    expect(result.current.locationInput).toBe("Monforte de Lemos");
  });

  it("clears the search when the input doesn't match a city", async () => {
    const { result } = await renderFindGame();

    await act(() => result.current.setLocationInput("zzzz"));
    await act(() => result.current.commitLocation());

    expect(result.current.hasLocation).toBe(false);
    expect(result.current.availableSports).toEqual([]);
  });

  it("shows games only for the selected sport in the city, soonest first", async () => {
    const { result } = await renderFindGame();

    await act(() =>
      result.current.selectLocationSuggestion("Monforte de Lemos"),
    );
    await act(() => result.current.toggleSport("sport-padel"));
    await act(() => result.current.handleShowGames());

    expect(result.current.showGames).toBe(true);
    expect(result.current.openMatches.map((match) => match.id)).toEqual([
      "padel-early",
      "padel-late",
    ]);
  });

  it("hides results again when the sport selection changes", async () => {
    const { result } = await renderFindGame();

    await act(() =>
      result.current.selectLocationSuggestion("Monforte de Lemos"),
    );
    await act(() => result.current.toggleSport("sport-padel"));
    await act(() => result.current.handleShowGames());
    await act(() => result.current.toggleSport("sport-padel"));

    expect(result.current.showGames).toBe(false);
    expect(result.current.selectedIds).toEqual([]);
  });

  it("clears the active search when the user edits the location", async () => {
    const { result } = await renderFindGame();

    await act(() =>
      result.current.selectLocationSuggestion("Monforte de Lemos"),
    );
    await act(() => result.current.setLocationInput("Monforte"));

    expect(result.current.hasLocation).toBe(false);
  });
});
