"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { GRADE_OPTIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

type Tab = "login" | "register";

export default function AuthPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regGrade, setRegGrade] = useState("小4");
  const [regRole, setRegRole] = useState<"child" | "parent">("child");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (result.success) {
      router.push("/games");
    } else {
      setError(result.error || "ログインに失敗しました");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (regPassword.length < 6) {
      setError("パスワードは6文字以上で設定してください");
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      email: regEmail,
      password: regPassword,
      name: regName,
      grade: regGrade,
      role: regRole,
    });
    setIsSubmitting(false);

    if (result.success) {
      router.push("/games");
    } else {
      setError(result.error || "登録に失敗しました");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-trail-primary to-trail-secondary shadow-lg mb-4">
            <span className="text-white font-black text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-black text-trail-dark">探究教室 TRAIL</h1>
          <p className="text-sm text-gray-500 mt-1">自分で考える習慣を作る場所</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              tab === "login"
                ? "bg-white text-trail-dark shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ログイン
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              tab === "register"
                ? "bg-white text-trail-dark shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            新規登録
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="demo@trail.jp"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                パスワード
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="demo1234"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-trail-primary to-trail-secondary rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "ログイン中..." : "ログイン"}
            </button>

            {/* Demo hint */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-xs font-bold text-emerald-700 mb-2">デモアカウント</p>
              <div className="space-y-1 text-xs text-emerald-600">
                <p>
                  <span className="font-bold">子ども:</span> demo@trail.jp / demo1234
                </p>
                <p>
                  <span className="font-bold">保護者:</span> parent@trail.jp / parent1234
                </p>
              </div>
            </div>
          </form>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                アカウントの種類
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "child" as const, label: "子ども", icon: "G", desc: "ゲームで学ぶ" },
                  { value: "parent" as const, label: "保護者", icon: "P", desc: "学習を見守る" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRegRole(r.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      regRole === r.value
                        ? "border-trail-primary bg-trail-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-sm font-bold text-trail-dark">{r.label}</p>
                    <p className="text-xs text-gray-500">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                名前
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                placeholder={regRole === "child" ? "ゆうた" : "田中 花子"}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                メールアドレス
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1.5">
                パスワード（6文字以上）
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary transition-all"
              />
            </div>

            {regRole === "child" && (
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1.5">
                  学年
                </label>
                <select
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-trail-primary/30 focus:border-trail-primary transition-all bg-white"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-trail-primary to-trail-secondary rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "登録中..." : "無料で始める"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
