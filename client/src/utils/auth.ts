const API_URL = "https://portfolio-8ihh.onrender.com";

export type UserRole = "admin" | "sekurity" | "whs";
export type FileProtection = "sekurity" | "whs" | "admin" | false;

const TOKEN_KEY = "portfolio_token";

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const login = async (
  username: string,
  password: string
): Promise<{ role: UserRole } | null> => {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    saveToken(data.token);
    return { role: data.role };
  } catch {
    return null;
  }
};

export const verifyAuth = async (): Promise<{
  valid: boolean;
  role?: UserRole;
  username?: string;
} | null> => {
  const token = getToken();
  if (!token) return { valid: false };
  try {
    const res = await fetch(`${API_URL}/api/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { valid: false };
  }
};

export const logout = () => {
  removeToken();
  setCachedRole(null);
};

export const canAccess = (
  userRole: UserRole | null,
  protection: FileProtection
): boolean => {
  if (!protection) return true;
  if (!userRole) return false;
  if (userRole === "admin") return true;
  if (protection === "admin") return false;
  return userRole === protection;
};

export const getCachedRole = (): UserRole | null => {
  return sessionStorage.getItem("cached_role") as UserRole | null;
};

export const setCachedRole = (role: UserRole | null) => {
  if (role) sessionStorage.setItem("cached_role", role);
  else sessionStorage.removeItem("cached_role");
};