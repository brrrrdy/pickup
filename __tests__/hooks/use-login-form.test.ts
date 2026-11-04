import { act, renderHook } from "@testing-library/react-native";
import { safeRedirect, useLoginForm } from "../../hooks/use-login-form";

const mockReplace = jest.fn();
let mockParams: { redirectTo?: string } = {};
const mockSignIn = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock("../../lib/auth/AuthProvider", () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

const content = {
  errors: {
    missingDetails: { message: "fill everything in" },
    invalidEmail: { message: "bad email" },
    shortPassword: { message: "8+ characters" },
    invalidCredentials: { message: "wrong email or password" },
    signInFailed: { message: "try again later" },
  },
};

async function fillIn(email: string, password: string) {
  const hook = await renderHook(() => useLoginForm({ content }));
  await act(() => hook.result.current.setFieldValue("email", email));
  await act(() => hook.result.current.setFieldValue("password", password));
  return hook;
}

describe("useLoginForm", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockSignIn.mockReset();
    mockParams = {};
  });

  it("can't submit until both fields are filled and the password is 8+ characters", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));
    expect(result.current.canSubmit).toBe(false);

    await act(() => result.current.setFieldValue("email", "maria@x.com"));
    await act(() => result.current.setFieldValue("password", "short"));
    expect(result.current.canSubmit).toBe(false);

    await act(() => result.current.setFieldValue("password", "longenough"));
    expect(result.current.canSubmit).toBe(true);
  });

  it("shows an error for missing details", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));
    await act(() => result.current.handleSubmit());

    expect(result.current.error).toBe("fill everything in");
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("shows an error for an invalid email", async () => {
    const { result } = await fillIn("maria", "longenough");
    await act(() => result.current.handleSubmit());

    expect(result.current.error).toBe("bad email");
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("shows an error for a short password", async () => {
    const { result } = await fillIn("maria@x.com", "short");
    await act(() => result.current.handleSubmit());

    expect(result.current.error).toBe("8+ characters");
  });

  it("shows a friendly error for wrong credentials and keeps the form", async () => {
    mockSignIn.mockResolvedValue({ error: "Invalid login credentials" });
    const { result } = await fillIn("maria@x.com", "longenough");
    await act(() => result.current.handleSubmit());

    expect(mockSignIn).toHaveBeenCalledWith("maria@x.com", "longenough");
    expect(result.current.error).toBe("wrong email or password");
    expect(result.current.values.email).toBe("maria@x.com");
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows a generic error for other sign-in failures", async () => {
    mockSignIn.mockResolvedValue({ error: "Network request failed" });
    const { result } = await fillIn("maria@x.com", "longenough");
    await act(() => result.current.handleSubmit());

    expect(result.current.error).toBe("try again later");
  });

  it("clears the error when a field changes", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));
    await act(() => result.current.handleSubmit());
    expect(result.current.error).not.toBeNull();

    await act(() => result.current.setFieldValue("email", "m"));
    expect(result.current.error).toBeNull();
  });

  it("signs in, clears the form and goes home", async () => {
    mockSignIn.mockResolvedValue({ error: null });
    const { result } = await fillIn("maria@x.com", "longenough");
    await act(() => result.current.handleSubmit());

    expect(result.current.values).toEqual({ email: "", password: "" });
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("returns to the page that sent the user to log in", async () => {
    mockParams = { redirectTo: "/start-game" };
    mockSignIn.mockResolvedValue({ error: null });
    const { result } = await fillIn("maria@x.com", "longenough");
    await act(() => result.current.handleSubmit());

    expect(mockReplace).toHaveBeenCalledWith("/start-game");
  });
});

describe("safeRedirect", () => {
  it.each([
    [undefined, "/"],
    ["/find-game", "/find-game"],
    [["/profile", "/other"], "/profile"],
    ["https://evil.example", "/"],
    ["//evil.example", "/"],
    ["/login", "/"],
    ["/register", "/"],
  ])("%p → %p", (input, expected) => {
    expect(safeRedirect(input)).toBe(expected);
  });
});
