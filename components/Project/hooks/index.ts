const isDev = process.env.NODE_ENV !== "production";

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (networkError) {
    if (isDev) {
      console.error(`[request] ${method} ${url} network error:`, networkError);
    } else {
      console.error("[request] Network error");
    }
    throw new Error("Network error. Check your connection and try again.");
  }

  let responseBody: { errors?: string[]; error?: string } = {};
  try {
    responseBody = await response.json();
  } catch (parseError) {
    // Empty or non-JSON body (e.g. an HTML error page from a proxy)
    if (isDev) {
      console.warn(
        `[request] ${method} ${url} returned ${response.status} with a non-JSON body:`,
        parseError,
      );
    }
  }

  if (!response.ok) {
    const message =
      responseBody.errors?.join(", ") ??
      responseBody.error ??
      `Request failed (${response.status})`;
    if (isDev) {
      console.error(`[request] ${method} ${url} failed with ${response.status}:`, message);
    } else {
      console.error(`[request] Request failed (${response.status})`);
    }
    throw new Error(message);
  }

  return responseBody as T;
}