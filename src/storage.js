const TOKEN_KEY = "commentsAppToken";
const USER_KEY = "commentsAppUser";

export const saveAuth = ({ token, user }) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
};

export const loadAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || "";
    const userRaw = localStorage.getItem(USER_KEY) || "";
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: "", user: null };
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
};


