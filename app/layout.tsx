import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "落とし物管理",
  description: "落とし物管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen" style={{backgroundColor: "#f8fafc", color: "#1e293b"}}>
        <header style={{backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0"}} className="shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-lg font-bold" style={{color: "#1e293b"}}>🔍 落とし物管理</h1>
            <a href="/admin" className="text-sm" style={{color: "#64748b"}}>管理者</a>
          </div>
        </header>
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}