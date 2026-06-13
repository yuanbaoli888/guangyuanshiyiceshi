const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || `Request failed: ${response.status}`);
  }

  return data;
}

// 调用后端虚拟试穿接口，payload 里图片为 data URI
export async function generateTryon(payload) {
  return apiRequest("/tryon/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
