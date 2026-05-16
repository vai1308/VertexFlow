const apiUrl = import.meta.env.VITE_API_URL || "/api";

export function getToken() {
  return localStorage.getItem("projectDeskToken");
}

export function saveSession(session) {
  localStorage.setItem("projectDeskToken", session.token);
  localStorage.setItem("projectDeskUser", JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem("projectDeskToken");
  localStorage.removeItem("projectDeskUser");
}

export function getSavedUser() {
  const savedUser = localStorage.getItem("projectDeskUser");
  return savedUser ? JSON.parse(savedUser) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function post(path, body) {
  return api(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function patch(path, body) {
  return api(path, {
    method: "PATCH",
    body: JSON.stringify(body)
  });
}

export function remove(path) {
  return api(path, { method: "DELETE" });
}
