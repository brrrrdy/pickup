import { useEffect, useState } from "react";
import { fetchStartGameOptions } from "../lib/start-game/api";
import type { StartGameOptions } from "../types/find-game";

export function useStartGameOptions() {
  const [data, setData] = useState<StartGameOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchStartGameOptions()
      .then((options) => {
        if (isMounted) setData(options);
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : String(err));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error, isLoading: data === null && error === null };
}
