import { Redirect, usePathname } from "expo-router";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

// Wrap a page that needs a signed-in user. Signed-out visitors go to /login,
// which sends them back here after they sign in.
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return (
      <Redirect
        href={{ pathname: "/login", params: { redirectTo: pathname } }}
      />
    );
  }

  return <>{children}</>;
}
