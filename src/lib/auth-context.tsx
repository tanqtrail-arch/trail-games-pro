"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "child" | "parent";
  grade: string;
  level: number;
  xp: number;
  plan_type: "free" | "monitor" | "paid";
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  grade: string;
  role: "child" | "parent";
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const STORAGE_KEY = "trail_auth_user";

// ---------------------------------------------------------------------------
// Demo users (MVP - Supabase未接続時のモックユーザー)
// ---------------------------------------------------------------------------

const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  "demo@trail.jp": {
    password: "demo1234",
    user: {
      id: "demo-child-001",
      email: "demo@trail.jp",
      name: "ゆうた",
      role: "child",
      grade: "小4",
      level: 12,
      xp: 2450,
      plan_type: "free",
    },
  },
  "parent@trail.jp": {
    password: "parent1234",
    user: {
      id: "demo-parent-001",
      email: "parent@trail.jp",
      name: "田中 花子",
      role: "parent",
      grade: "小4",
      level: 1,
      xp: 0,
      plan_type: "free",
    },
  },
};

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  // Persist to localStorage
  const persistUser = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      // MVP: デモユーザーでログイン
      // TODO: Supabase接続時に実際のAPI呼び出しに置き換え
      const demo = DEMO_USERS[email.toLowerCase()];
      if (demo && demo.password === password) {
        persistUser(demo.user);
        return { success: true };
      }

      // 登録済みユーザー（localStorage内）をチェック
      try {
        const registeredRaw = localStorage.getItem("trail_registered_users");
        if (registeredRaw) {
          const registered = JSON.parse(registeredRaw) as Array<{ email: string; password: string; user: AuthUser }>;
          const found = registered.find(
            (r) => r.email === email.toLowerCase() && r.password === password
          );
          if (found) {
            persistUser(found.user);
            return { success: true };
          }
        }
      } catch {
        // ignore
      }

      return { success: false, error: "メールアドレスまたはパスワードが正しくありません" };
    },
    [persistUser]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      // MVP: localStorageに保存
      // TODO: Supabase接続時に /api/auth/register へPOST
      if (DEMO_USERS[data.email.toLowerCase()]) {
        return { success: false, error: "このメールアドレスは既に登録されています" };
      }

      const newUser: AuthUser = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: data.role,
        grade: data.grade,
        level: 1,
        xp: 0,
        plan_type: "free",
      };

      // Save to registered users list
      try {
        const registeredRaw = localStorage.getItem("trail_registered_users");
        const registered = registeredRaw ? JSON.parse(registeredRaw) : [];
        if (registered.some((r: { email: string }) => r.email === data.email.toLowerCase())) {
          return { success: false, error: "このメールアドレスは既に登録されています" };
        }
        registered.push({ email: data.email.toLowerCase(), password: data.password, user: newUser });
        localStorage.setItem("trail_registered_users", JSON.stringify(registered));
      } catch {
        // ignore
      }

      persistUser(newUser);
      return { success: true };
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
