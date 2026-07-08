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

// ── Helper: set client-side cookie (DEPRECATED — kept for logout only) ──────
// SECURITY: access token is now set as httpOnly by the server on login/refresh.
// We no longer write the access token to a JS-readable cookie. The only client-
// side cookie operation we still need is DELETE on logout.
function deleteClientCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; sameSite=strict`;
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

      // Access token is now set as httpOnly cookie by server — keep only in-memory copy for UI state.
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

      // Access token is now set as httpOnly cookie by server — keep only in-memory copy for UI state.
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

    // Clear client state
    deleteClientCookie("admin_access_token");
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
        // Refresh failed — clear everything
        get().logout();
        return;
      }

      // Update in-memory access token (server already set the httpOnly cookie)
      set({ accessToken: data.accessToken, isAuthenticated: true });
    } catch {
      get().logout();
    }
  },

  initialize: () => {
    // Try to refresh on mount — if there's a refresh cookie the server will renew
    const state = get();
    if (!state.isAuthenticated) {
      get().refreshTokenFn();
    }
  },
}));
