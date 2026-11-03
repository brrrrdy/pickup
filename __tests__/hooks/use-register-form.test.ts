import { act, renderHook } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useRegisterForm } from "../../hooks/use-register-form";

const alert = (title: string) => ({ title, message: `${title} message` });

const content = {
  alerts: {
    missingDetails: alert("missing"),
    passwordMismatch: alert("mismatch"),
    shortPassword: alert("short"),
    consentRequired: alert("consent"),
    success: alert("success"),
  },
};

type RegisterHook = ReturnType<typeof useRegisterForm>;

async function fillValidForm(form: RegisterHook) {
  await act(() => form.setFieldValue("firstName", "Maria"));
  await act(() => form.setFieldValue("lastName", "Lopez"));
  await act(() => form.setFieldValue("username", "mariaplay"));
  await act(() => form.setFieldValue("email", "maria@example.com"));
  await act(() => form.setFieldValue("password", "longenough"));
  await act(() => form.setFieldValue("confirmPassword", "longenough"));
}

describe("useRegisterForm", () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("requires consent before it can submit", async () => {
    const { result } = await renderHook(() => useRegisterForm({ content }));

    await fillValidForm(result.current);
    expect(result.current.canSubmit).toBe(false);

    await act(() => result.current.handleSubmit());
    expect(alertSpy).toHaveBeenCalledWith("consent", "consent message");

    await act(() => result.current.setAgreeToPolicies(true));
    expect(result.current.canSubmit).toBe(true);
  });

  it("rejects mismatched passwords", async () => {
    const { result } = await renderHook(() => useRegisterForm({ content }));

    await fillValidForm(result.current);
    await act(() => result.current.setFieldValue("confirmPassword", "different1"));
    await act(() => result.current.setAgreeToPolicies(true));

    expect(result.current.canSubmit).toBe(false);
    await act(() => result.current.handleSubmit());
    expect(alertSpy).toHaveBeenCalledWith("mismatch", "mismatch message");
  });

  it("resets the form and consent after a successful submit", async () => {
    const { result } = await renderHook(() => useRegisterForm({ content }));

    await fillValidForm(result.current);
    await act(() => result.current.setAgreeToPolicies(true));
    await act(() => result.current.handleSubmit());

    expect(alertSpy).toHaveBeenCalledWith("success", "success message");
    expect(result.current.values.email).toBe("");
    expect(result.current.agreeToPolicies).toBe(false);
  });
});
