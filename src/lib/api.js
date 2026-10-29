/**
 * Central API client — base URL from VITE_API_URL, JWT attached by default.
 */

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

export function getApiBaseUrl() {
  return API_BASE;
}

export function getAuthToken() {
  return localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
}

/**
 * @param {string} path - Path beginning with /api/...
 * @param {RequestInit & { auth?: boolean }} options - auth: false for login/signup
 */
export async function apiFetch(path, options = {}) {
  const { auth = true, headers: initHeaders, ...rest } = options;

  const headers = new Headers(initHeaders);

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (
    rest.body != null &&
    !(rest.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  return fetch(url, { ...rest, headers });
}
