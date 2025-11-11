const API_BASE_URL = "https://wedev-api.sky.pro/api/v2/ivan-petrov/comments";
const AUTH_BASE_URL = "https://wedev-api.sky.pro/api/user";

// Auth endpoints of this API must NOT receive Content-Type; just send raw JSON string
// Browser will set text/plain; сервер это принимает


export const getComments = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error("Failed to load comments:", error);
    // Return empty array as fallback
    return [];
  }
};

export const addComment = async (comment, token) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify({
        text: comment.text,
        name: comment.name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
};

export const login = async ({ login, password }) => {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `HTTP ${response.status}`);
  }
  return await response.json();
};

export const register = async ({ login, password, name }) => {
  const response = await fetch(AUTH_BASE_URL, {
    method: "POST",
    body: JSON.stringify({ login, password, name }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err || `HTTP ${response.status}`);
  }
  return await response.json();
};
