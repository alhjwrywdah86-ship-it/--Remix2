/**
 * A robust fetch wrapper that implements Exponential Backoff retries
 * for temporary connection issues, 429 (Rate Limit), and 503 (Service Unavailable) status codes.
 */
export async function fetchWithRetry<T = Response>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  initialDelay = 1500,
  backoffFactor = 2,
  onRetry?: (attempt: number, delayMs: number, errorMsg: string) => void
): Promise<T> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Treat rate limiting (429) or service unavailable (503) as transient failures that we should retry
      if (response.status === 429 || response.status === 503) {
        let errMsg = `Server busy with status ${response.status}`;
        try {
          const clone = response.clone();
          const data = await clone.json();
          if (data && data.error) {
            errMsg = data.error;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      // If the response is not ok for other reasons, don't retry, just throw
      if (!response.ok) {
        let serverErrorMsg = `HTTP Error ${response.status}`;
        try {
          const clone = response.clone();
          const text = await clone.text();
          serverErrorMsg = text.substring(0, 300) || serverErrorMsg;
        } catch (_) {}
        throw new Error(serverErrorMsg);
      }

      // Success case: if application/json, automatically parse JSON if requested or return response
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const json = await response.json();
          return json as T;
        } catch (_) {
          return response as unknown as T;
        }
      }

      return response as unknown as T;
    } catch (err: any) {
      lastError = err;
      if (attempt === retries) {
        break;
      }

      // Calculate exponential backoff delay with slight jitter
      const delay = initialDelay * Math.pow(backoffFactor, attempt - 1) + Math.random() * 200;

      if (onRetry) {
        onRetry(attempt, delay, err.message || "Unknown error");
      }

      // Wait before next attempt
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}
