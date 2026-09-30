import { useCallback, useEffect, useState } from "react";

export type FetchState<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: string };

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

interface Settled<T> {
  fetcher: Fetcher<T>;
  attempt: number;
  state: Exclude<FetchState<T>, { status: "loading" }>;
}

const LOADING = { status: "loading", data: null, error: null } as const;

/**
 * Runs `fetcher` whenever it changes (memoise it with useCallback) and exposes a
 * discriminated loading/success/error state. Stale requests are aborted.
 */
export function useFetch<T>(fetcher: Fetcher<T>): FetchState<T> & { retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((data) =>
        setSettled({ fetcher, attempt, state: { status: "success", data, error: null } }),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : "Something went wrong.";
        setSettled({ fetcher, attempt, state: { status: "error", data: null, error: message } });
      });

    return () => controller.abort();
  }, [fetcher, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Loading is derived: the last settled result belongs to an older request.
  const isCurrent = settled?.fetcher === fetcher && settled.attempt === attempt;
  return { ...(isCurrent ? settled.state : LOADING), retry };
}
