import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useLoginForm } from "../../hooks/use-login-form";

const content = {
  alerts: {
    missingDetails: { title: "missing", message: "fill everything in" },
    shortPassword: { title: "short", message: "8+ characters" },
    success: { title: "success", message: "logged in" },
  },
};

describe("useLoginForm", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("can't submit until both fields are filled and the password is 8+ characters", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));

    expect(result.current.canSubmit).toBe(false);

    await act(() => result.current.setFieldValue("username", "maria"));
    await act(() => result.current.setFieldValue("password", "short"));
    expect(result.current.canSubmit).toBe(false);

    await act(() => result.current.setFieldValue("password", "longenough"));
    expect(result.current.canSubmit).toBe(true);
  });

  it("warns about missing details", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));

    await act(() => result.current.handleSubmit());

    expect(alertSpy).toHaveBeenCalledWith("missing", "fill everything in");
  });

  it("warns about a short password", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));

    await act(() => result.current.setFieldValue("username", "maria"));
    await act(() => result.current.setFieldValue("password", "short"));
    await act(() => result.current.handleSubmit());

    expect(alertSpy).toHaveBeenCalledWith("short", "8+ characters");
  });

  it("clears the form after a successful submit", async () => {
    const { result } = await renderHook(() => useLoginForm({ content }));

    await act(() => result.current.setFieldValue("username", "maria"));
    await act(() => result.current.setFieldValue("password", "longenough"));
    await act(() => result.current.handleSubmit());

    expect(alertSpy).toHaveBeenCalledWith("success", "logged in");
    expect(result.current.values).toEqual({ username: "", password: "" });
  });
});
