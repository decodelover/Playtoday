export interface HttpClientConfig {
  baseUrl: string;
  apiKey?: string;
  headerName?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class SportsProviderHttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly headerName: string;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.headerName = config.headerName ?? "x-apisports-key";
    this.timeoutMs = config.timeoutMs ?? 10000;
    this.maxRetries = config.maxRetries ?? 3;
  }

  public async get<T>(
    path: string,
    params?: Record<string, string>,
  ): Promise<{ data: T; status: number; headers: Headers }> {
    const url = new URL(`${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "User-Agent": "PlayToday-Ingestion-Engine/1.0",
    };

    if (this.apiKey) {
      headers[this.headerName] = this.apiKey;
    }

    let attempt = 0;
    let delay = 500;

    while (attempt < this.maxRetries) {
      attempt++;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(url.toString(), {
          method: "GET",
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = (await response.json()) as T;
          return { data, status: response.status, headers: response.headers };
        }

        // Non-retryable status codes (401, 403, 404, 422)
        if ([401, 403, 404, 422].includes(response.status)) {
          throw new Error(
            `Provider HTTP Error ${response.status}: Permanent client error`,
          );
        }

        // Retryable server errors (500, 502, 503, 504, 429)
        if (
          attempt < this.maxRetries &&
          (response.status >= 500 || response.status === 429)
        ) {
          const retryAfter = response.headers.get("retry-after");
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
          await new Promise((r) => setTimeout(r, waitTime));
          delay *= 2;
          continue;
        }

        throw new Error(
          `Provider HTTP Error ${response.status}: ${await response.text()}`,
        );
      } catch (error) {
        clearTimeout(timeoutId);
        if (attempt >= this.maxRetries) {
          const message = error instanceof Error ? error.message : "Network error";
          throw new Error(
            `Provider request failed after ${attempt} attempts: ${message}`,
          );
        }
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }

    throw new Error("Provider HTTP client request unhandled failure");
  }
}
