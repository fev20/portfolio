const API_URL =
  import.meta.env.VITE_API_URL || "https://portfolio-8ihh.onrender.com";

export type UserRole = "admin" | "sekurity" | "whs";
export type FileProtection = "sekurity" | "whs" | "admin" | false;

const ROLES: UserRole[] = ["admin", "sekurity", "whs"];

export const buildApiUrl = (path: string) => {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const isUserRole = (role: unknown): role is UserRole => {
  return typeof role === "string" && ROLES.includes(role as UserRole);
};

export const login = async (
  username: string,
  password: string
): Promise<{ role: UserRole } | null> => {
  try {
    const res = await fetch(buildApiUrl("/api/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!isUserRole(data.role)) return null;
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
  try {
    const res = await fetch(buildApiUrl("/api/verify"), {
      credentials: "include",
    });
    if (!res.ok) return { valid: false };
    const data = await res.json();
    return {
      valid: data.valid === true,
      role: isUserRole(data.role) ? data.role : undefined,
      username: typeof data.username === "string" ? data.username : undefined,
    };
  } catch {
    return { valid: false };
  }
};

export const logout = async () => {
  try {
    await fetch(buildApiUrl("/api/logout"), {
      credentials: "include",
      method: "POST",
    });
  } catch {
    /* ignore logout network errors */
  }
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
