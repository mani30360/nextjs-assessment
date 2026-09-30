export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
      return body.message;
    }
  } catch {
    // Body was not JSON; fall through to the status text.
  }
  return response.statusText || `Request failed with status ${response.status}`;
}

function createApiClient(baseUrl: string) {
  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(await readErrorMessage(response), response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(path: string, options?: RequestInit) =>
      request<T>(path, { ...options, method: "GET" }),

    post: <T>(path: string, body?: unknown, options?: RequestInit) =>
      request<T>(path, {
        ...options,
        method: "POST",
        body: body === undefined ? undefined : JSON.stringify(body),
      }),

    put: <T>(path: string, body: unknown, options?: RequestInit) =>
      request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),

    delete: <T>(path: string, options?: RequestInit) =>
      request<T>(path, { ...options, method: "DELETE" }),
  };
}

/** External product REST API (DummyJSON). */
export const productApi = createApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

/** This app's own route handlers (same origin). */
export const appApi = createApiClient("");
