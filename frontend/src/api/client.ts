import { getAccessToken } from "../auth/tokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

type ApiFetchOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: Record<string, string>;
  auth?: boolean; // true면 access token 붙임
};

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: ApiFetchOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", body, headers, auth = false } = options;

  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeJsonParse(text) : null;

  if (!res.ok) {
    const apiError =
      data && typeof data === "object"
        ? (data as { message?: unknown; error?: unknown })
        : null;

    const message =
      (apiError ? String(apiError.message ?? apiError.error ?? "") : text) || `요청 실패 (${res.status})`;
    throw new Error(message);
  }

  return data as TResponse;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
