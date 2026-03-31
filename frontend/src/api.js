const BASE = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("skillos_token");
}

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  login:           (email, password) => req("/auth/login", {
    method: "POST",
    // FastAPI OAuth2 expects form data for the login endpoint
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  }),
  register:        (name, email, password) => req("/auth/register", {
    method: "POST", body: JSON.stringify({ name, email, password }),
  }),
  me:              ()        => req("/users/me"),
  resources:       ()        => req("/resources"),
  createResource:  (data)    => req("/resources", { method: "POST", body: JSON.stringify(data) }),
  updateResource:  (id, data)=> req(`/resources/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  decks:           ()        => req("/decks"),
  cards:           (deckId)  => req(`/decks/${deckId}/cards?due_only=true`),
  reviewCard:      (id, rating) => req(`/cards/${id}/review`, {
    method: "POST", body: JSON.stringify({ rating }),
  }),
  heatmap:         ()        => req("/activity/heatmap"),
  recommendations: ()        => req("/recommendations"),
  buddyMatches:    ()        => req("/buddies/matches"),
  sendBuddyRequest:(toId)    => req("/buddies/request", {
    method: "POST", body: JSON.stringify({ to_user_id: toId }),
  }),
};