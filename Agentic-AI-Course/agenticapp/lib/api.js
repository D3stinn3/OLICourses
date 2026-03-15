const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

let _refreshPromise = null;

async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_BASE}/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("access_token", data.access);
      return true;
    }
  } catch {
    // Refresh failed
  }
  // Refresh token is also expired — clear everything
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  return false;
}

async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Auto-refresh on 401
  if (response.status === 401 && typeof window !== "undefined") {
    // Deduplicate concurrent refresh attempts
    if (!_refreshPromise) {
      _refreshPromise = refreshAccessToken().finally(() => {
        _refreshPromise = null;
      });
    }
    const refreshed = await _refreshPromise;
    if (refreshed) {
      // Retry with new token
      const newToken = localStorage.getItem("access_token");
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
}

export async function login(username, password) {
  const res = await apiFetch("/token/pair", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Invalid username or password");
  }
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
}

export async function register(username, email, password) {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Registration failed");
  }
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function getMe() {
  const res = await apiFetch("/auth/me");
  const data = await res.json();
  return data;
}

export async function getCourses() {
  const res = await apiFetch("/courses/");
  const data = await res.json();
  return data;
}

export async function getCourse(slug) {
  const res = await apiFetch(`/courses/${slug}`);
  const data = await res.json();
  return data;
}

export async function getSlides(slug) {
  const res = await apiFetch(`/courses/${slug}/slides`);
  const data = await res.json();
  return data;
}

export async function enrollCourse(slug) {
  const res = await apiFetch(`/courses/${slug}/enroll`, {
    method: "POST",
  });
  const data = await res.json();
  return data;
}

export async function getEnrollments() {
  const res = await apiFetch("/courses/enrollments/me");
  const data = await res.json();
  return data;
}

export async function getQuiz(moduleId) {
  const res = await apiFetch(`/quizzes/module/${moduleId}`);
  const data = await res.json();
  return data;
}

export async function submitQuiz(quizId, answers) {
  const res = await apiFetch(`/quizzes/${quizId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();
  return data;
}

export async function streamChat(courseSlug, messages, slideContext) {
  const res = await apiFetch("/chat/stream", {
    method: "POST",
    body: JSON.stringify({ course_slug: courseSlug, messages, slide_context: slideContext }),
  });
  return res;
}

export async function getChatHistory(courseSlug) {
  const res = await apiFetch(`/chat/history/${courseSlug}`);
  const data = await res.json();
  return data;
}

export async function slideComplete(slug) {
  const res = await apiFetch(`/courses/${slug}/slide-complete`, {
    method: "POST",
  });
  const data = await res.json();
  return data;
}

// --- Gamification ---

export async function getXPProfile() {
  const res = await apiFetch("/gamification/profile");
  const data = await res.json();
  return data;
}

export async function getGamificationDashboard() {
  const res = await apiFetch("/gamification/dashboard");
  const data = await res.json();
  return data;
}

export async function getLeaderboard() {
  const res = await apiFetch("/gamification/leaderboard");
  const data = await res.json();
  return data;
}

export async function getQuests() {
  const res = await apiFetch("/gamification/quests");
  const data = await res.json();
  return data;
}

export async function awardXP(source, amount, description = "") {
  const res = await apiFetch("/gamification/xp", {
    method: "POST",
    body: JSON.stringify({ source, amount, description }),
  });
  const data = await res.json();
  return data;
}

export async function getMyAgent() {
  const res = await apiFetch("/gamification/agent");
  const data = await res.json();
  return data;
}

export async function getAgentCapabilities() {
  const res = await apiFetch("/gamification/capabilities");
  const data = await res.json();
  return data;
}

// --- Engagement ---

export async function getEngagementConsent() {
  const res = await apiFetch("/engagement/consent");
  const data = await res.json();
  return data;
}

export async function updateEngagementConsent(enabled) {
  const res = await apiFetch("/engagement/consent", {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
  const data = await res.json();
  return data;
}

export async function analyzeEngagement(image, courseSlug) {
  const res = await apiFetch("/engagement/analyze", {
    method: "POST",
    body: JSON.stringify({ image, course_slug: courseSlug }),
  });
  const data = await res.json();
  return data;
}

export async function getEngagementSummary(courseSlug) {
  const res = await apiFetch(`/engagement/summary/${courseSlug}`);
  const data = await res.json();
  return data;
}

export async function getEngagementLive(courseSlug) {
  const res = await apiFetch(`/engagement/live/${courseSlug}`);
  const data = await res.json();
  return data;
}
