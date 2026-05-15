import { create } from "zustand";

// ── Types ───────────────────────────────────────────────────────────────────
interface AuthUser {
  userId: string;
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mfaRequired: boolean;
  mfaToken: string | null;
  mfaUser: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  verifyMfa: (totpCode: string) => Promise<void>;
  logout: () => void;
  refreshTokenFn: () => Promise<void>;
  initialize: () => void;
}

// ── localStorage helpers (more reliable than cookies in proxy env) ──────────
const STORAGE_KEY = "paliwal_admin_auth";

function saveToStorage(token: string, user: AuthUser) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  } catch {
    // localStorage not available
  }
}

function loadFromStorage(): { token: string; user: AuthUser } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // localStorage not available or invalid data
  }
  return null;
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

// ── Helper: set client-side cookie ──────────────────────────────────────────
function setClientCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; sameSite=lax`;
}

function deleteClientCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

// ── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  mfaRequired: false,
  mfaToken: null,
  mfaUser: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      // Check if MFA is required
      if (data.mfaRequired) {
        set({
          mfaRequired: true,
          mfaToken: data.mfaToken,
          mfaUser: data.user,
          isLoading: false,
        });
        return;
      }

      // Store in cookie (for middleware) + localStorage (for persistence)
      setClientCookie("admin_access_token", data.accessToken, 15 * 60);
      saveToStorage(data.accessToken, data.user);

      set({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        mfaRequired: false,
        mfaToken: null,
        mfaUser: null,
      });
    } catch (error) {
      set({ isLoading: false, mfaRequired: false, mfaToken: null, mfaUser: null });
      throw error;
    }
  },

  verifyMfa: async (totpCode: string) => {
    const { mfaToken } = get();
    if (!mfaToken) {
      throw new Error("MFA token not found. Please log in again.");
    }

    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/auth/mfa/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mfaToken, totpCode }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "MFA verification failed");
      }

      // Store in cookie + localStorage
      setClientCookie("admin_access_token", data.accessToken, 15 * 60);
      saveToStorage(data.accessToken, data.user);

      set({
        accessToken: data.accessToken,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        mfaRequired: false,
        mfaToken: null,
        mfaUser: null,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    // Call logout API (fire and forget)
    fetch("/api/admin/auth/logout", { method: "POST" }).catch(() => {});

    // Clear everything
    deleteClientCookie("admin_access_token");
    clearStorage();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      mfaRequired: false,
      mfaToken: null,
      mfaUser: null,
    });
  },

  refreshTokenFn: async () => {
    try {
      const res = await fetch("/api/admin/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return;
      }

      // Update access token in cookie + localStorage
      setClientCookie("admin_access_token", data.accessToken, 15 * 60);
      saveToStorage(data.accessToken, data.user);
      set({ accessToken: data.accessToken, user: data.user, isAuthenticated: true });
    } catch {
      // Silently fail
    }
  },

  initialize: () => {
    // First try to restore from localStorage
    const stored = loadFromStorage();
    if (stored?.token && stored?.user) {
      set({
        accessToken: stored.token,
        user: stored.user,
        isAuthenticated: true,
      });
      // Also set the cookie for middleware/API
      setClientCookie("admin_access_token", stored.token, 15 * 60);
      return;
    }

    // If no localStorage data, try refresh token
    const state = get();
    if (!state.isAuthenticated) {
      get().refreshTokenFn();
    }
  },
}));
