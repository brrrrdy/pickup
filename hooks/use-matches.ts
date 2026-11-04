import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../lib/auth/AuthProvider";
import { fetchMatches, type MatchTiming } from "../lib/matches/api";
import type { MatchSummary } from "../types/find-game";

/** Loads scheduled matches; `reload` refetches after a join, leave or cancel. */
export function useMatches(timing: MatchTiming) {
  const { user } = useAuth();
  const userId = user?.id ?? "";
  const [matches, setMatches] = useState<MatchSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isMounted = true;

    fetchMatches(timing, userId)
      .then((rows) => {
        if (isMounted) {
          setMatches(rows);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [timing, userId, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return {
    matches,
    error,
    isLoading: matches === null && error === null,
    reload,
  };
}
