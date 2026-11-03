import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind } from "uniwind";
import {
  loadThemePreference,
  setThemePreference,
} from "../../lib/theme/theme-preference";

jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};

  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => store[key] ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(async () => {
        store = {};
      }),
    },
  };
});

jest.mock("uniwind", () => ({
  Uniwind: { setTheme: jest.fn() },
}));

describe("theme preference", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it("defaults to light when nothing is saved", async () => {
    await expect(loadThemePreference()).resolves.toBe("light");
  });

  it("applies and saves the chosen theme", async () => {
    setThemePreference("dark");

    expect(Uniwind.setTheme).toHaveBeenCalledWith("dark");
    await expect(loadThemePreference()).resolves.toBe("dark");
  });

  it("falls back to light when storage fails", async () => {
    jest
      .mocked(AsyncStorage.getItem)
      .mockRejectedValueOnce(new Error("storage unavailable"));

    await expect(loadThemePreference()).resolves.toBe("light");
  });
});
