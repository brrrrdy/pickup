import { act, renderHook } from "@testing-library/react-native";
import { useForm } from "../../hooks/use-form";

describe("useForm", () => {
  it("updates a single field and resets to the initial values", async () => {
    const { result } = await renderHook(() => useForm({ name: "", email: "" }));

    await act(() => result.current.setFieldValue("name", "Ana"));
    expect(result.current.values).toEqual({ name: "Ana", email: "" });

    await act(() => result.current.resetForm());
    expect(result.current.values).toEqual({ name: "", email: "" });
  });
});
