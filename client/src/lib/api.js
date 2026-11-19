const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getApiToken() {
  return JSON.parse(sessionStorage.getItem("hostel_session") || "null")?.token || "";
}

export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const token = auth ? getApiToken() : null;

  if (auth && !token) {
    throw new Error("This action requires a server login. Sign out of demo mode and sign in with your registered account.");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(`Could not connect to the API at ${API_BASE_URL}. Check that the backend is running.`);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`The API returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (HTTP ${response.status}).`);
  }

  return result;
}
