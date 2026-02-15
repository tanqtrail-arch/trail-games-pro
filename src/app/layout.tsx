import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "探究教室 TRAIL | 自分で考える習慣を作る場所",
  description:
    "探究教室 TRAIL は、子どもたちが「なぜ？」を楽しみながら、自分で考える力を育てるオンライン学習プラットフォームです。思考力・探究力を伸ばすゲーム型教材で、学ぶ喜びを体験しよう。",
  keywords: ["探究学習", "思考力", "子ども", "教育", "ゲーム学習", "TRAIL"],
  openGraph: {
    title: "探究教室 TRAIL | 自分で考える習慣を作る場所",
    description:
      "子どもたちが「なぜ？」を楽しみながら、自分で考える力を育てるオンライン学習プラットフォーム",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
