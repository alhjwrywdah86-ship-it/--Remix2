/**
 * API Base URL resolution and global fetch interception for Web and Capacitor Android builds.
 */

export function getBaseApiUrl(): string {
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim()) {
    return envApiUrl.trim().replace(/\/+$/, '');
  }

  // Check if running inside Capacitor native app
  const isCapacitor =
    typeof window !== 'undefined' &&
    (Boolean((window as any).Capacitor) ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:');

  if (isCapacitor) {
    const railwayUrl = import.meta.env.VITE_RAILWAY_URL || '';
    return railwayUrl ? railwayUrl.trim().replace(/\/+$/, '') : '';
  }

  return '';
}

export function getApiUrl(url: string): string {
  if (!url) return url;

  // If already an absolute URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const baseUrl = getBaseApiUrl();
  if (baseUrl) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }

  return url;
}

/**
 * Automatically intercept standard window.fetch calls so relative /api routes
 * correctly target external production backend when VITE_API_URL or Capacitor is active.
 */
export function setupGlobalFetchInterceptor(): void {
  if (typeof window === 'undefined') return;

  const windowWithFetch = window as any;
  if (windowWithFetch.__fetchInterceptorSet) return;

  try {
    const originalFetch = window.fetch ? window.fetch.bind(window) : null;
    if (!originalFetch) return;

    const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      let targetUrl: string | Request = input as any;

      if (typeof input === 'string') {
        targetUrl = getApiUrl(input);
      } else if (input instanceof URL) {
        targetUrl = getApiUrl(input.toString());
      } else if (typeof Request !== 'undefined' && input instanceof Request) {
        const resolvedUrl = getApiUrl(input.url);
        if (resolvedUrl !== input.url) {
          targetUrl = new Request(resolvedUrl, input);
        }
      }

      return originalFetch(targetUrl, init);
    };

    windowWithFetch.__fetchInterceptorSet = true;

    try {
      window.fetch = customFetch;
    } catch {
      Object.defineProperty(window, 'fetch', {
        value: customFetch,
        writable: true,
        configurable: true,
      });
    }
  } catch (err) {
    console.warn('Could not set global fetch interceptor:', err);
  }
}

// Automatically setup interceptor upon module import
setupGlobalFetchInterceptor();
