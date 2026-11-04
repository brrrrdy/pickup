import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "../../lib/auth/AuthProvider";

type AuthListener = (event: string, session: unknown) => void;

const mockAuth = {
  listener: null as AuthListener | null,
  getSession: jest.fn(),
  signInWithPassword: jest.fn(),
  signOut: jest.fn(),
  unsubscribe: jest.fn(),
};
const mockMaybeSingle = jest.fn();

jest.mock("../../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockAuth.getSession(...args),
      signInWithPassword: (...args: unknown[]) =>
        mockAuth.signInWithPassword(...args),
      signOut: (...args: unknown[]) => mockAuth.signOut(...args),
      onAuthStateChange: (listener: AuthListener) => {
        mockAuth.listener = listener;
        return {
          data: { subscription: { unsubscribe: mockAuth.unsubscribe } },
        };
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: () => mockMaybeSingle() }),
      }),
    }),
  },
}));

const session = { user: { id: "user-1", email: "maria@x.com" } };

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.listener = null;
    mockAuth.getSession.mockResolvedValue({ data: { session: null } });
    mockMaybeSingle.mockResolvedValue({ data: { display_name: "María" } });
  });

  it("starts loading, then reports no session when signed out", async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it("restores a stored session and loads the profile", async () => {
    mockAuth.getSession.mockResolvedValue({ data: { session } });
    const { result } = await renderHook(() => useAuth(), { wrapper });

    await waitFor(() =>
      expect(result.current.profile).toEqual({ display_name: "María" }),
    );
    expect(result.current.user?.id).toBe("user-1");
  });

  it("follows auth state changes (sign in, then sign out)", async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => mockAuth.listener?.("SIGNED_IN", session));
    await waitFor(() => expect(result.current.profile).not.toBeNull());
    expect(result.current.session).toBe(session);

    await act(() => mockAuth.listener?.("SIGNED_OUT", null));
    expect(result.current.session).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it("signIn normalises the email and returns the error message", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });
    const { result } = await renderHook(() => useAuth(), { wrapper });

    let outcome: { error: string | null } | undefined;
    await act(async () => {
      outcome = await result.current.signIn(" Maria@X.com ", "longenough");
    });

    expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
      email: "maria@x.com",
      password: "longenough",
    });
    expect(outcome).toEqual({ error: "Invalid login credentials" });
  });

  it("signIn returns no error on success", async () => {
    mockAuth.signInWithPassword.mockResolvedValue({ error: null });
    const { result } = await renderHook(() => useAuth(), { wrapper });

    let outcome: { error: string | null } | undefined;
    await act(async () => {
      outcome = await result.current.signIn("maria@x.com", "longenough");
    });
    expect(outcome).toEqual({ error: null });
  });

  it("signOut calls supabase", async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper });
    await act(() => result.current.signOut());
    expect(mockAuth.signOut).toHaveBeenCalled();
  });

  it("unsubscribes on unmount", async () => {
    const { unmount } = await renderHook(() => useAuth(), { wrapper });
    await act(() => unmount());
    expect(mockAuth.unsubscribe).toHaveBeenCalled();
  });

  it("useAuth throws outside the provider", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    await expect(renderHook(() => useAuth())).rejects.toThrow(/AuthProvider/);
    consoleError.mockRestore();
  });
});
