/**
 * A robust fetch wrapper that implements Exponential Backoff retries
 * for temporary connection issues, 429 (Rate Limit), and 503 (Service Unavailable) status codes.
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  initialDelay = 1500,
  backoffFactor = 2,
  onRetry?: (attempt: number, delayMs: number, errorMsg: string) => void
): Promise<Response> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Treat rate limiting (429) or service unavailable (503) as transient failures that we should retry
      if (response.status === 429 || response.status === 503) {
        let errMsg = `Server busy with status ${response.status}`;
        try {
          // Attempt to extract error message if available in JSON
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
          
          const data = JSON.parse(text);
          if (data && data.error) {
            serverErrorMsg = data.error;
          }
        } catch (_) {}
        const err = new Error(serverErrorMsg);
        (err as any).status = response.status;
        throw err;
      }

      return response;
    } catch (error: any) {
      lastError = error;
      
      console.warn(`[Network Attempt ${attempt}/${retries} Failed]:`, error.message);

      if (attempt < retries) {
        const currentDelay = initialDelay * Math.pow(backoffFactor, attempt - 1);
        
        if (onRetry) {
          onRetry(attempt, currentDelay, error.message || "Unknown error");
        }
        
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
      }
    }
  }

  throw lastError || new Error("Failed to communicate with the service after maximum retries.");
}
