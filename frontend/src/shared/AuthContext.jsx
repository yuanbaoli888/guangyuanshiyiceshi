import { useCallback, useEffect, useMemo, useState } from "react";

import { apiRequest } from "./api.js";
import { AuthContext, TOKEN_KEY } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshMe = useCallback(
    async (activeToken = token) => {
      if (!activeToken) {
        setLoading(false);
        return null;
      }
      setLoading(true);
      try {
        const profile = await apiRequest("/auth/me", { token: activeToken });
        setUser(profile);
        return profile;
      } catch {
        clearSession();
        return null;
      } finally {
        setLoading(false);
      }
    },
    [clearSession, token],
  );

  useEffect(() => {
    refreshMe(token);
  }, [refreshMe, token]);

  const login = useCallback(
    async (credentials) => {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      localStorage.setItem(TOKEN_KEY, data.access_token);
      setToken(data.access_token);
      await refreshMe(data.access_token);
    },
    [refreshMe],
  );

  const register = useCallback(async (payload) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiRequest("/auth/logout", { method: "POST", token });
      } catch {
        // Local logout should still succeed if the token is already invalid.
      }
    }
    clearSession();
  }, [clearSession, token]);

  const value = useMemo(
    () => ({ token, user, loading, login, logout, register, refreshMe }),
    [token, user, loading, login, logout, register, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
