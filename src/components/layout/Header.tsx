"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/games", label: "ゲーム一覧", icon: "🎮" },
  { href: "/rankings", label: "ランキング", icon: "🏆" },
  { href: "/profile", label: "マイページ", icon: "👤" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-trail-primary to-trail-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-black text-lg leading-none">
                  T
                </span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-trail-accent rounded-full animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-trail-primary to-trail-secondary bg-clip-text text-transparent leading-tight">
                TRAIL
              </span>
              <span className="text-[10px] font-medium text-gray-500 leading-tight tracking-wider">
                探究教室
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-trail-primary hover:bg-trail-primary/5 transition-all"
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-trail-primary transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-trail-primary to-trail-secondary rounded-full hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              無料で始める
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="メニューを開く"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-5 bg-trail-dark rounded-full transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-[7px]"
                    : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-trail-dark rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-trail-dark rounded-full transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "-rotate-45 -translate-y-[7px]"
                    : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-trail-primary/5 hover:text-trail-primary transition-all font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="w-full text-center px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-trail-primary to-trail-secondary rounded-xl hover:opacity-90 transition-all shadow-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              無料で始める
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
