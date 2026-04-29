import { type HealthCheckOptions } from "./types"

const DEFAULT_RETRIES = 30
const DEFAULT_INTERVAL_MS = 1000
const DEFAULT_TIMEOUT_MS = 30_000
const DEFAULT_METHOD = "GET"

/**
 * Polls an HTTP endpoint until it returns a 2xx status code, or the
 * timeout / retry limit is exceeded.
 *
 * Designed for use inside container start functions to block until
 * the containerised service is ready to accept traffic.
 *
 * @param url - The URL to poll
 * @param options - Retry, interval, timeout, and HTTP method overrides
 * @returns Resolves when a 2xx response is received
 * @throws {Error} If the health check does not succeed within the
 *   configured retries / timeout
 *
 * @example
 * ```typescript
 * await waitForHttp("http://localhost:1080/mockserver/status", {
 *   method: "PUT",
 *   timeoutMs: 15_000,
 * })
 * ```
 */
export async function waitForHttp(
  url: string,
  {
    retries = DEFAULT_RETRIES,
    intervalMs = DEFAULT_INTERVAL_MS,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    method = DEFAULT_METHOD,
  }: HealthCheckOptions = {
    retries: DEFAULT_RETRIES,
    intervalMs: DEFAULT_INTERVAL_MS,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    method: DEFAULT_METHOD,
  },
): Promise<void> {
  const deadline = Date.now() + timeoutMs

  for (let attempt = 0; attempt < retries; attempt++) {
    if (Date.now() >= deadline) {
      break
    }

    try {
      const response = await fetch(url, { method })
      if (response.ok) {
        return
      }
    } catch {
      // Connection refused or network error — keep retrying
    }

    if (attempt < retries - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  throw new Error(
    `Health check failed: ${method} ${url} did not return 2xx within ${timeoutMs}ms / ${retries} retries`,
  )
}
