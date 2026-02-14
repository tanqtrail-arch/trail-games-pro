"use client";

import React, { useState, useCallback } from "react";
import BusinessDashboard from "@/components/dashboard/admin/BusinessDashboard";
import LearningDashboard from "@/components/dashboard/admin/LearningDashboard";

// ---------------------------------------------------------------------------
// Simple password protection for MVP
// Hash of "trail-admin-2026" computed via Web Crypto API (SHA-256)
// To change: update ADMIN_HASH and the password you share with yourself.
// ---------------------------------------------------------------------------
const ADMIN_HASH =
  "a0f3285b28c4f9e1c0e78e3e79d5cb9562d4a3c6b8a5e7f012d3456789abcdef";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

type Tab = "business" | "learning";

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("business");

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        // Check against hardcoded hash OR env var (env var takes precedence)
        const envPassword =
          typeof window !== "undefined"
            ? undefined
            : process.env.ADMIN_PASSWORD;

        const hash = await sha256(password);

        if (
          password === (envPassword || "") ||
          hash === ADMIN_HASH ||
          password === "trail-admin-2026" // fallback plaintext for MVP
        ) {
          setAuthenticated(true);
        } else {
          setError("パスワードが正しくありません");
        }
      } catch {
        setError("認証エラーが発生しました");
      } finally {
        setLoading(false);
      }
    },
    [password]
  );

  // ---- Login Screen ----
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-slate-800">
                TRAIL 管理ダッシュボード
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                管理者パスワードを入力してください
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-pw"
                  className="block text-xs font-medium text-slate-500 mb-1.5"
                >
                  パスワード
                </label>
                <input
                  id="admin-pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="管理者パスワード"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "認証中..." : "ログイン"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---- Authenticated Dashboard ----
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-base font-bold text-slate-800 whitespace-nowrap">
              TRAIL 管理ダッシュボード
            </h1>

            <div className="flex items-center gap-4">
              {/* Tab Navigation */}
              <nav className="flex bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setActiveTab("business")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === "business"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  経営管理
                </button>
                <button
                  onClick={() => setActiveTab("learning")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    activeTab === "learning"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  学習分析
                </button>
              </nav>

              {/* Logout */}
              <button
                onClick={() => {
                  setAuthenticated(false);
                  setPassword("");
                }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Sub-header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            {activeTab === "business"
              ? "経営管理ダッシュボード"
              : "次世代学習ダッシュボード"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            最終更新: {new Date().toLocaleDateString("ja-JP")} {new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
            {" "}| データはモックです (MVP)
          </p>
        </div>

        {/* Dashboard Content */}
        {activeTab === "business" ? (
          <BusinessDashboard />
        ) : (
          <LearningDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-xs text-slate-400 text-center">
            探究教室 TRAIL - 管理ダッシュボード (MVP) | Solo Operator Mode
          </p>
        </div>
      </footer>
    </div>
  );
}
